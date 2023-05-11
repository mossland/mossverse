import { AppProps } from "next/app";
import Head from "next/head";
import { st, gql, locale as appLocale } from "../stores";
import GlobalStyle from "../styles/GlobalStyle";
import { ConfigProvider } from "antd";
import locale from "antd/lib/locale/ko_KR";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../env/env";
import { PageMap } from "@shared/util-client";
import { useI18n } from "@shared/util-client";
import { locale as sharedLocale } from "@shared/data-access";
import { locale as decentverseLocale } from "@decentverse/data-access";
import { locale as platformLocale } from "@platform/data-access";
import dayjs from "dayjs";
import "../styles.css";
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";
import "dayjs/locale/ko";
import { Layout, Scene } from "@decentverse/ui-web";
import { useRef } from "react";
import { useRouter } from "next/router";
dayjs.locale("ko");

function CustomApp({ Component, pageProps }: AppProps) {
  const self = st.use.self();
  useI18n({ Component, locales: [sharedLocale, platformLocale, decentverseLocale, appLocale], defaultLng: "ko" });
  const ref = useRef();
  const router = useRouter();
  const Canvas = (Component as any).canvas ? (Component as any).canvas : null;
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
                paths: ["/", "/listing", "character", "/survey", "/exchange"],
                home: "/",
                unauthorized: "/",
              },
              admin: {
                paths: ["/admin"],
                home: "/admin",
                unauthorized: "/admin",
              },
              user: {
                paths: ["/", "/listing", "character", "/survey", "/exchange"],
                home: "/",
                unauthorized: "/",
              },
            })
          }
          environment={env.environment}
          uri={env.endpoint}
          ws={env.ws}
          networkType={env.networkType}
          whoAmI={st.do.whoAmI}
          useSelf={st.use.self}
          init={async () => {
            st.do.initNetwork({ query: { type: env.networkType } });
          }}
          userInit={async () => {
            const thingList = await gql.shared.listThing({ name: { $in: ["MMOC", "Point"] } });
            st.do.setThingList(thingList.listThing);
            if (thingList.thingCount === 0) return;
            st.do.initOwnershipInMoney({
              query: {
                thing: { $in: thingList.listThing.map((thing) => thing.id) },
                ...(self.id ? { user: self.id } : {}),
              },
            });
            st.do.initOwnershipInItem({
              query: {
                thing: { $nin: thingList.listThing.map((thing) => thing.id) },
                ...(self.id ? { user: self.id } : {}),
              },
            });
          }}
        >
          <ConfigProvider
            theme={{
              token: {
                // colorPrimary: "blue",
              },
            }}
            locale={locale}
          >
            <GlobalStyle />
            <Layout className={router.pathname.startsWith("/map") ? "overflow-hidden" : "overflow-y-auto"} ref={ref}>
              {Canvas && (
                <Scene className="pointer-events-none -z-50" eventSource={ref} eventPrefix="client">
                  <Canvas {...pageProps} />
                </Scene>
              )}
              <Component {...pageProps} />
            </Layout>
          </ConfigProvider>
        </GqlProvider>
      </main>
    </>
  );
}

export default CustomApp;
