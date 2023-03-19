import { Webview, WebviewSummary } from "./webview.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const webviewLocale = {
  ...baseLocale,
  map: ["Map", "지도"],
  message: ["Message", "메시지"],
  errorMessage: ["Error Message", "에러 메시지"],
  center: ["Center", "중심"],
  wh: ["Width & Height", "너비 & 높이"],
  url: ["URL", "URL"],
  size: ["Size", "크기"],
  purpose: ["Purpose", "목적"],
  isEmbed: ["Embed", "임베드"],
  totalWebview: ["Total Webview", "총 웹뷰"],
} as const;

export type WebviewLocale = Locale<"webview", Webview & WebviewSummary, typeof webviewLocale>;
