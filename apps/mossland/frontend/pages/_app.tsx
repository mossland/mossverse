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
import { env } from "../env";
import { PageMap } from "@shared/util-client";

function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const userOperation = store.platform.user.use.userOperation();
  const self = store.platform.user.use.self();
  const whoAmI = store.platform.user.use.whoAmI();
  const [adultAgreed, setAdultAgreed] = useState(false);

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
                paths: ["/signin", "/signup"],
                home: "/",
                unauthorized: "/signin",
              },
              admin: {
                paths: ["/admin"],
                home: "/admin",
                unauthorized: "/admin",
              },
              user: {
                paths: ["/", "/market", "/survey", "/exchange"],
                home: "/",
                unauthorized: "/signin",
              },
            })
          }
          uri={env.endpoint}
          ws={env.ws}
          networkType={env.networkType}
          whoAmI={whoAmI}
          useSelf={store.platform.user.use.self}
        >
          <GlobalStyle />
          <Component {...pageProps} />
        </GqlProvider>
      </main>
    </>
  );
}

export default CustomApp;
