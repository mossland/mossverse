import { AppProps } from "next/app";
import Head from "next/head";
import "antd/dist/antd.css";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "../styles/GlobalStyle";

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/manifest" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />

        <title>Welcome to Mossland!</title>
      </Head>
      <main className="app">
        <GlobalStyle />
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
