import "../styles.css";
import "dayjs/locale/ko";
import { ServerProvider } from "@shared/client";
import { cookies, headers } from "next/headers";
import { env } from "@mossland/env/env";
import localFont from "@next/font/local";

const ubuntumono = localFont({
  src: [{ path: "../../public/fonts/UbuntuMono-Regular.ttf", weight: "500" }],
  variable: "--font-ubuntumono",
});

export default async function RootLayout({ children, params: { lang } }) {
  return (
    <html lang={lang} className={`${ubuntumono.className}`}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>Welcome to Mossland!</title>
      </head>
      <body className="app">
        <ServerProvider
          uri={env.endpoint}
          ws={env.ws}
          networkType={env.networkType}
          environment={env.environment}
          cookies={cookies}
          headers={headers}
        >
          {children}
        </ServerProvider>
      </body>
    </html>
  );
}
