import { File, FileSummary } from "./file.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const fileLocale = {
  ...baseLocale,
  imageSize: ["ImageSize", "이미지사이즈"],
  filename: ["Filename", "파일명"],
  url: ["Url", "Url"],
  totalFile: ["Total File", "총 파일수"],
} as const;

export type FileLocale = Locale<"file", File & FileSummary, typeof fileLocale>;
