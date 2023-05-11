import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { promisify } from "util";
import { Id, DataLoader, createLoader, LoadService } from "@shared/util-server";
import { LocalFile, FileStream, OpenSeaMeta } from "../gql";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageSize = require("image-size");
const sizeOf = promisify(imageSize);
import * as sharp from "sharp";
import * as fs from "fs";
import * as File from "./file.model";
import * as gql from "../gql";
import { srv as external } from "@external/module";
import axios, { AxiosRequestConfig } from "axios";
import { Utils } from "@shared/util";

@Injectable()
export class FileService extends LoadService<File.Mdl, File.Doc, File.Input> {
  localDir = `./data`;
  constructor(
    @InjectModel(File.name) private readonly File: File.Mdl,
    private readonly s3Service: external.S3Service,
    private readonly ipfsService: external.IpfsService
  ) {
    super(FileService.name, File);
  }
  async generate(): Promise<File.Doc> {
    const fileStream = (): gql.FileStream => ({
      filename: "sample.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      createReadStream: () => fs.createReadStream(`./libs/shared/module/src/file/sample.jpg`),
    });
    return (
      (await this.File.findOne({ filename: "sample.jpg" })) ??
      (await this.#addFile(fileStream(), "generate", "generate"))
    );
  }
  async addFiles(fileStreams: FileStream[], purpose: string, group = "default"): Promise<File.Doc[]> {
    const files = await Promise.all(
      fileStreams.map(async (fileStream) => await this.#addFile(fileStream, purpose, group))
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
      const response = (await fetch(this.ipfsService.getHttpsUri(uri))).json();
      return response;
    } catch (err) {
      this.logger.warn(`Failed to get json from URI - ${uri}`);
      return null;
    }
  }
  async sliceImage(fileId: Id, tileSize: number, purpose: string, group: string) {
    const file = await this.File.pickById(fileId);
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
  async #addFile(fileStream: FileStream, purpose: string, group: string | null) {
    const localFile = await this.#saveLocalStorage(fileStream);
    return await this.addFileFromLocal(
      localFile,
      purpose?.length ? purpose : "default",
      group?.length ? group : "default"
    );
  }
  async addFileFromLocal(localFile: LocalFile, purpose: string, group = "default", origin?: string): Promise<File.Doc> {
    const url = await this.s3Service.uploadFile({
      path: `${purpose}/${group}/${localFile.filename}`,
      localPath: localFile.localPath,
    });
    const { width, height } = localFile.mimetype.includes("image")
      ? await sizeOf(localFile.localPath)
      : { width: 0, height: 0 };
    return await this.File.create({ ...localFile, imageSize: [width, height], url, origin });
  }
  async saveImageFromUri(
    uri: string,

    { cache, rename, header }: { cache?: boolean; rename?: string; header?: AxiosRequestConfig } = {}
  ): Promise<LocalFile> {
    if (uri.indexOf("data:") === 0) return this.#saveEncodedData(uri);
    const response = await axios.get(this.ipfsService.getHttpsUri(uri), { ...header, responseType: "stream" });
    const filename = rename ?? this.#convertFileName(`${uri.split("/").at(-1)?.split("?")[0]}`);
    const dirname = `${this.localDir}/uriDownload`;
    const localPath = `${dirname}/${filename}`;
    if (cache && fs.existsSync(localPath)) return { filename, localPath, mimetype: "image/png", encoding: "7bit" };
    !fs.existsSync(dirname) && fs.mkdirSync(dirname, { recursive: true });
    const w: fs.ReadStream = response.data.pipe(fs.createWriteStream(localPath));
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject("File Download Timeout"), 60000);
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
    const filename = this.#convertFileName(`${data.slice(-15, 0)}.${extension}`);
    const localPath = `${this.localDir}/uriDownload/${filename}`;
    fs.writeFileSync(localPath, Buffer.from(encoded, encoding).toString());
    return { filename, encoding: "7bit", mimetype, localPath };
  }
  async #saveLocalStorage(file: FileStream): Promise<LocalFile> {
    const { filename, mimetype, encoding, createReadStream } = await file;
    fs.mkdirSync(this.localDir, { recursive: true });
    const localPath = `${this.localDir}/${filename}`;
    const rename = this.#convertFileName(filename);
    const renamePath = `${this.localDir}/${rename}`;
    const stream = createReadStream();
    stream.pipe(fs.createWriteStream(localPath));
    return new Promise((resolve, reject) => {
      stream.on("end", () => {
        fs.existsSync(localPath) && fs.renameSync(localPath, renamePath);
        resolve({ filename: rename, mimetype, encoding, localPath: renamePath });
        stream.destroy();
      });
      stream.on("error", (error) => reject(error));
    });
  }
  #convertFileName(filename: string) {
    return `file-${new Date().getTime()}-${filename.slice(filename.length - 15)}`;
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
    const root = this.s3Service.root;
    const localFile = await this.saveImageFromUri(file.url);
    await Utils.sleep(100);
    const cloudPath = file.url.split("/").slice(3).join("/").split("?")[0];
    const path = root ? cloudPath.replace(`${root}/`, "") : cloudPath;
    const url = await this.s3Service.uploadFile({ path, localPath: localFile.localPath });
    return await file.merge({ url }).save();
  }
  async summarize(): Promise<gql.FileSummary> {
    return {
      totalFile: await this.File.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
