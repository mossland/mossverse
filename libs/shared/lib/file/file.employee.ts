import * as File from "./file.document";
import * as cnst from "../cnst";
import * as fs from "fs";
import { FileStream, LocalFile, OpenSeaMeta } from "../cnst";
import { Id, LoadService, Utils } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { emp as external } from "@external/server";
import axios, { AxiosRequestConfig } from "axios";
import sharp from "sharp";
import sizeOf from "image-size";

@Injectable()
export class FileEmployee extends LoadService<File.Mdl, File.Doc, File.Input> {
  localDir = `./data`;
  constructor(
    @InjectModel(File.name) private readonly File: File.Mdl,
    private readonly s3Employee: external.S3Employee,
    private readonly ipfsEmployee: external.IpfsEmployee
  ) {
    super(FileEmployee.name, File);
  }
  async generate(): Promise<File.Doc> {
    return (
      (await this.File.findOne({ filename: "sample.jpg" })) ??
      (await this.addFileFromLocal(
        {
          filename: "sample.jpg",
          mimetype: "image/jpeg",
          encoding: "7bit",
          localPath: `./libs/shared/module/src/file/sample.jpg`,
        },
        "generate",
        "generate"
      ))
    );
  }
  async addFiles(
    fileStreams: FileStream[],
    fileMetas: cnst.FileMeta[],
    purpose: string,
    group = "default"
  ): Promise<File.Doc[]> {
    const files = await Promise.all(
      fileStreams.map(
        async (fileStream, idx) => await this.#addFileFromStream(fileStream, fileMetas[idx], purpose, group)
      )
    );
    return files;
  }
  async addFileFromUri(
    uri: string,
    purpose: string,
    group: string,
    header: AxiosRequestConfig = {},
    forceUpdate = false
  ): Promise<File.Doc | null> {
    try {
      const file = forceUpdate && (await this.File.findOne({ origin: uri }));
      if (file) return file;
      const localFile = await this.saveImageFromUri(uri, { header });
      return await this.addFileFromLocal(localFile, purpose, group, uri);
    } catch (err) {
      this.logger.warn(`Failed to add file from URI - ${uri}`);
      return null;
    }
  }
  async getJsonFromUri(uri: string): Promise<OpenSeaMeta | null> {
    try {
      if (uri.includes("data:application/json;base64,"))
        return JSON.parse(Buffer.from(uri.replace("data:application/json;base64,", ""), "base64").toString());
      const response = (await fetch(this.ipfsEmployee.getHttpsUri(uri))).json();
      return response;
    } catch (err) {
      this.logger.warn(`Failed to get json from URI - ${uri}`);
      return null;
    }
  }
  async sliceImage(fileId: Id, tileSize: number, purpose: string, group: string) {
    const file = await this.File.pickById(fileId);
    if (!file.url) return [];
    const [xNum, yNum] = [Math.floor(file.imageSize[0] / tileSize), Math.floor(file.imageSize[1] / tileSize)];
    if (!file.imageSize[0] || !file.imageSize[1] || !xNum || !yNum) throw new Error("Image Size is Not Detected");
    else if (xNum * yNum > 100) throw new Error("Too many tiles");
    const localFile = await this.saveImageFromUri(file.url);
    const extension = `.${localFile.localPath.split(".").at(-1)}`;
    const files: File.Doc[][] = await Promise.all(
      Array.from(Array(yNum).keys()).map(async (y) => {
        return await Promise.all(
          Array.from(Array(xNum).keys()).map(async (x) => {
            const filename = localFile.filename.replace(extension, `-${x}-${y}${extension}`);
            const localPath = localFile.localPath.replace(extension, `-${x}-${y}${extension}`);
            await sharp(localFile.localPath)
              .extract({ left: x * tileSize, top: y * tileSize, width: tileSize, height: tileSize })
              .toFile(localPath);
            const file: File.Doc = await this.addFileFromLocal({ ...localFile, filename, localPath }, purpose, group);
            return file;
          })
        );
      })
    );
    return files;
  }
  async #addFileFromStream(fileStream: FileStream, fileMeta: cnst.FileMeta, purpose: string, group: string | null) {
    const { filename, mimetype, encoding, createReadStream } = await fileStream;
    const file = await new this.File({ progress: 0, filename, mimetype, encoding, ...fileMeta }).save();
    const rename = this.#convertFileName(file);
    const path = `${purpose?.length ? purpose : "default"}/${group?.length ? group : "default"}/${rename}`;
    this.s3Employee.uploadFileFromStream({
      path: path,
      body: createReadStream(),
      mimetype,
      updateProgress: async (progress) => {
        await this.File.updateOne(
          { _id: file._id },
          { $set: { progress: Math.floor((progress.loaded / fileMeta.size) * 100) } }
        );
      },
      uploadSuccess: async (url) => {
        let imageSize = [0, 0];
        if (mimetype.startsWith("image/")) {
          const response = await axios({ url, method: "GET", responseType: "arraybuffer" });
          const buffer = Buffer.from(response.data, "binary");
          const { width, height } = sizeOf(buffer);
          imageSize = [width || 0, height || 0];
        }
        await this.File.updateOne({ _id: file._id }, { $set: { status: "active", progress: 100, url, imageSize } });
      },
    });
    return file;
  }
  async addFileFromLocal(localFile: LocalFile, purpose: string, group = "default", origin?: string): Promise<File.Doc> {
    const url = await this.s3Employee.uploadFile({
      path: `${purpose}/${group}/${localFile.filename}`,
      localPath: localFile.localPath,
    });
    const { width, height } = localFile.mimetype.includes("image")
      ? sizeOf(localFile.localPath)
      : { width: 0, height: 0 };
    return await this.File.create({ ...localFile, imageSize: [width, height], url, origin });
  }
  async saveImageFromUri(
    uri: string,
    { cache, rename, header }: { cache?: boolean; rename?: string; header?: AxiosRequestConfig } = {}
  ): Promise<LocalFile> {
    if (uri.indexOf("data:") === 0) return this.#saveEncodedData(uri);
    const response = await axios.get(this.ipfsEmployee.getHttpsUri(uri), { ...header, responseType: "stream" });
    const filename = rename ?? `${new Id()}-${uri.split("/").at(-1)?.split("?")[0]}`;
    const dirname = `${this.localDir}/uriDownload`;
    const localPath = `${dirname}/${filename}`;
    if (cache && fs.existsSync(localPath)) return { filename, localPath, mimetype: "image/png", encoding: "7bit" };
    !fs.existsSync(dirname) && fs.mkdirSync(dirname, { recursive: true });
    const w: fs.ReadStream = response.data.pipe(fs.createWriteStream(localPath));
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject("File Download Timeout"), 6000000);
      w.on("finish", () => {
        clearTimeout(timeout);
        resolve({ filename, encoding: "7bit", mimetype: this.#getMimetype(filename), localPath });
        w.destroy();
      });
    });
  }
  #saveEncodedData(data: string): LocalFile {
    const mimetype = data.split(";")[0].replace("data:", "");
    const encoding = data.split(",")[0].split(";")[1] as "base64" | "utf-8";
    const encoded = data.split(",")[1];
    const extension = mimetype.split("/")[1].split("+")[0];
    const filename = `${new Id()}.${extension}`;
    const localPath = `${this.localDir}/uriDownload/${filename}`;
    fs.writeFileSync(localPath, Buffer.from(encoded, encoding).toString());
    return { filename, encoding: "7bit", mimetype, localPath };
  }
  #convertFileName(file: File.Doc) {
    const split = file.filename.split(".");
    const ext = split.length > 1 ? `.${split.at(-1)}` : "";
    return `${file._id.toString()}${ext}`;
  }
  #getMimetype(filename: string) {
    return filename.includes(".png")
      ? "image/png"
      : filename.includes(".jpg")
      ? "image/jpeg"
      : filename.includes(".jpeg")
      ? "image/jpeg"
      : filename.includes(".jfif")
      ? "image/jfif"
      : filename.includes(".gif")
      ? "image/gif"
      : "unknown";
  }
  async migrate(file: File.Doc) {
    if (!file.url) return;
    const root = this.s3Employee.root;
    const localFile = await this.saveImageFromUri(file.url);
    await Utils.sleep(100);
    const cloudPath = file.url.split("/").slice(3).join("/").split("?")[0];
    const path = root ? cloudPath.replace(`${root}/`, "") : cloudPath;
    const url = await this.s3Employee.uploadFile({ path, localPath: localFile.localPath });
    return await file.merge({ url }).save();
  }
  async summarize(): Promise<cnst.FileSummary> {
    return { totalFile: await this.File.countDocuments({ status: { $ne: "inactive" } }) };
  }
}
