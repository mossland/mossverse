import * as aws from "aws-sdk";
import * as fs from "fs";
import { Inject, Injectable } from "@nestjs/common";
import * as dto from "./s3.dto";
import { ObjectStorageOptions } from "../../options";
import { LogService } from "@shared/util-server";

@Injectable()
export class S3Service extends LogService {
  s3: aws.S3;
  cloudFront: aws.CloudFront;
  constructor(@Inject("OBJECT_STORAGE_OPTIONS") private options: ObjectStorageOptions) {
    super(S3Service.name);
    if (options.service === "s3") {
      aws.config.update({
        region: this.options.region,
        accessKeyId: this.options.accessKey,
        secretAccessKey: this.options.secretAccessKey,
      });
      this.s3 = new aws.S3({ apiVersion: "2006-03-01" });
    } else if (options.service == "r2") {
      this.s3 = new aws.S3({
        endpoint: this.options.region,
        accessKeyId: this.options.accessKey,
        secretAccessKey: this.options.secretAccessKey,
        signatureVersion: "v4",
      });
    }
    this.cloudFront = new aws.CloudFront();
  }
  async getObject({ path }: dto.GetObjectRequest) {
    const Key = `${this.options.root}/${path}`;
    return await this.s3.getObject({ Bucket: this.options.bucket, Key }).promise();
  }
  async getJsonObject({ path }: dto.GetObjectRequest) {
    const Key = `${this.options.root}/${path}`;
    const data = await this.s3.getObject({ Bucket: this.options.bucket, Key }).promise();
    return JSON.parse(data.Body?.toString("utf-8") ?? "");
  }
  async getObjectList() {
    return await this.s3.listObjects({ Bucket: this.options.bucket, Prefix: this.options.root }).promise();
  }
  async getFileList(prefix: string | undefined = undefined) {
    const filenames: string[] = [];
    return await this.getAllKeys(
      { Bucket: this.options.bucket, Prefix: `${this.options.root}${prefix ? `/${prefix}` : ""}` },
      filenames
    );
  }
  async getAllKeys(params: aws.S3.ListObjectsV2Request, allKeys: string[] = []) {
    const response = await this.s3.listObjectsV2(params).promise();
    response.Contents?.forEach((obj) => allKeys.push(obj.Key as string));
    if (response.NextContinuationToken) {
      params.ContinuationToken = response.NextContinuationToken;
      await this.getAllKeys(params, allKeys); // RECURSIVE CALL
    }
    return allKeys;
  }
  async uploadFile({ path, localPath, meta, root }: dto.S3UploadRequest) {
    const Key = `${root ?? this.options.root}/${path}`;
    await this.s3
      .putObject({
        Bucket: this.options.bucket,
        Key,
        Metadata: meta,
        ACL: this.options.service === "s3" ? "public-read" : undefined,
        Body: fs.createReadStream(localPath),
        ContentType: this.#getContentType(path),
      })
      .promise();
    return this.options.host ? this.#getServiceUrl(this.options.host, Key) : this.#getObjectUrl(Key);
  }

  async saveFile({ path, localPath, renamePath }: dto.DownloadRequest): Promise<dto.LocalFilePath> {
    const Key = `${this.options.root}/${path}`;
    if (!fs.existsSync(localPath)) fs.mkdirSync(localPath, { recursive: true });
    const stream = this.s3.getObject({ Bucket: this.options.bucket, Key }).createReadStream();
    stream.pipe(fs.createWriteStream(localPath));
    return new Promise((resolve, reject) => {
      stream.on("end", () => {
        renamePath && fs.renameSync(localPath, renamePath);
        setTimeout(() => resolve({ localPath: renamePath ?? localPath }), 100);
      });
      stream.on("error", (error) => {
        reject("File Download Error");
      });
    });
  }
  async copyObject({ copyPath, pastePath, host }: dto.CopyRequest) {
    const Key = `${this.options.root}/${pastePath}`;
    await this.s3
      .copyObject({
        CopySource: `${this.options.bucket}/${this.options.root}/${copyPath}`,
        Bucket: this.options.bucket,
        Key,
        ACL: this.options.service === "s3" ? "public-read" : undefined,
      })
      .promise();
    return host ? this.#getServiceUrl(host, Key) : this.#getObjectUrl(Key);
  }
  async invalidateObjects(keys: string[]) {
    this.cloudFront.createInvalidation({
      DistributionId: this.options.distributionId,
      InvalidationBatch: {
        Paths: {
          Quantity: keys.length,
          Items: keys.map((key) => `${this.options.root}/${key}`),
        },
        CallerReference: new Date().getTime().toString(),
      },
    });
  }
  async makePublic(path: string) {
    const Key = `${this.options.root}/${path}`;
    await this.s3.putObjectAcl({ ACL: "public-read", Bucket: this.options.bucket, Key }).promise();
    return true;
  }
  async makePrivate(path: string) {
    const Key = `${this.options.root}/${path}`;
    await this.s3.putObjectAcl({ ACL: "private", Bucket: this.options.bucket, Key }).promise();
    return true;
  }

  #getObjectUrl(object: string) {
    return `https://${this.options.bucket}.s3.${aws.config.region}.amazonaws.com/${object}`;
  }
  #getServiceUrl(host: string, object: string) {
    return `https://${host}/${object}`;
  }
  #getContentType(path: string) {
    const dirs = path.split("/");
    const filename = dirs.at(-1) ?? "";
    return filename.includes(".png")
      ? "image/png"
      : filename.includes(".jpg")
      ? "image/jpeg"
      : filename.includes(".json")
      ? "application/json"
      : undefined;
  }
}
