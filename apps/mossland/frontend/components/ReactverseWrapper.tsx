import { Reactverse } from "@decentverse/ui-web";
import { gql } from "../stores";
import { env } from "../env";
//
const ReactVerseWrapper = () => {
  const config: gql.decentverse.Configuration = {
    network: "mainnet",
    login: {
      logoImage: "./logo/platform_logo.png",
      backgroundImage: "./logo/platform_bg.png",
    },
  };
  return <Reactverse uri={env.endpoint} ws={env.ws} config={config} networkType={env.networkType} />;
};
export default ReactVerseWrapper;
