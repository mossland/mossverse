"use client";
import { Messages } from "../daisyui";
import { client, logger } from "@util/client";
import { st } from "@shared/client";
import { themeChange } from "theme-change";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
type ClientProviderProps = {
  uri?: string;
  ws?: string;
  networkType?: "mainnet" | "testnet" | "debugnet";
  environment: string;
};

export const ClientProvider = ({ uri, ws, networkType, environment }: ClientProviderProps) => {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies<"jwt", { jwt?: string }>(["jwt"]);
  const lang = params?.lang ?? "en";
  const path = pathname?.split("/").slice(2).join("/");
  useEffect(() => {
    dayjs.locale(lang as string);
    themeChange(false);
    logger.setLevel(environment === "main" ? "warn" : "trace");
    const jwt = searchParams?.get("jwt") ?? cookie.jwt;
    client.init({ uri, ws, networkType, router, jwt, setCookie, removeCookie });
    if (jwt) st.do.login({ auth: path?.startsWith("/admin") ? "admin" : "user", jwt });
  }, []);
  useEffect(() => {
    const handleResize = () => st.do.setWindowSize();
    handleResize();
    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, []);
  // useEffect(() => {
  //   client.lang = lang;
  // }, [params]);
  // useEffect(() => {
  //   client.path = path;
  // }, [pathname]);
  return <Messages />;
};
