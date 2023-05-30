import { File, FileSummary } from "./file.fetch";
import { Translate, baseTrans } from "@util/client";

export const fileTrans = {
  ...baseTrans,
  imageSize: ["ImageSize", "이미지사이즈"],
  filename: ["Filename", "파일명"],
  url: ["Url", "Url"],
  progress: ["Progress", "진행률"],
  size: ["Size", "용량"],
  totalFile: ["Total File", "총 파일수"],
} satisfies Translate<File & FileSummary>;
