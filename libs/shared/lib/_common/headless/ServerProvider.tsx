import { ClientProvider } from "./ClientProvider";
import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { client, logger } from "@util/client";
import Gtag from "./Gtag";
type ServerProviderProps = {
  uri?: string;
  ws?: string;
  networkType?: "mainnet" | "testnet" | "debugnet";
  environment: string;
  children: ReactNode | ReactNode[];
  cookies: any;
  headers: any;
  gaTrackingId?: string;
};

export const ServerProvider = ({
  uri,
  ws,
  networkType,
  environment,
  cookies,
  headers,
  gaTrackingId,
  children,
}: ServerProviderProps) => {
  logger.setLevel(environment === "main" ? "warn" : "trace");
  client.init({ side: "server", uri, ws, networkType, getJwt: () => cookies().get("jwt")?.value });
  return (
    <div className="frameRoot">
      <ThemeProvider>{children}</ThemeProvider>
      <Suspense fallback={null}>
        <ClientProvider uri={uri} ws={ws} networkType={networkType} environment={environment} />
      </Suspense>
      {gaTrackingId && <Gtag trackingId={gaTrackingId} />}
    </div>
  );
};
