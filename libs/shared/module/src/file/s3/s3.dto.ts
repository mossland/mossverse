export interface GetObjectRequest {
  path: string;
}
export interface DownloadRequest extends GetObjectRequest {
  localPath: string;
  renamePath?: string;
}
export interface LocalFilePath {
  localPath: string;
}
export interface LocalTokenPath {
  metaPath: LocalFilePath;
  assetPath: LocalFilePath;
}
export interface S3UploadRequest {
  path: string;
  localPath: string;
  meta?: { [key: string]: string };
  rename?: string;
  host?: string;
  root?: string;
}
export interface CopyRequest {
  bucket: string;
  copyPath: string;
  pastePath: string;
  filename: string;
  host?: string;
}
export interface Bucket {
  name: string;
  host: string;
  root: string;
}
