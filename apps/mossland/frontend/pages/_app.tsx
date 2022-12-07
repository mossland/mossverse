import { AppProps } from "next/app";
import Head from "next/head";
import "antd/dist/antd.css";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { store } from "../stores";
import GlobalStyle from "../styles/GlobalStyle";
import { useEffect, useState } from "react";
import "../styles.css";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../env/env";
import { PageMap } from "@shared/util-client";

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />

        <title>Welcome to Mossland!</title>
      </Head>
      <main className="app">
        <GqlProvider
          pageMap={
            new PageMap({
              public: {
                paths: ["/market", "/survey"],
                home: "/",
                unauthorized: "/",
              },
              admin: {
                paths: ["/admin"],
                home: "/admin",
                unauthorized: "/admin",
              },
              user: {
                paths: ["/", "/market", "/survey", "/exchange"],
                home: "/",
                unauthorized: "/",
              },
            })
          }
          uri={env.endpoint}
          ws={env.ws}
          networkType={env.networkType}
          whoAmI={store.platform.user.do.whoAmI}
          useSelf={store.platform.user.use.self}
          init={async () => {
            store.shared.network.do.initNetwork({ query: { type: env.networkType } });
          }}
        >
          <GlobalStyle />
          <Component {...pageProps} />
        </GqlProvider>
      </main>
    </>
  );
}

export default CustomApp;
