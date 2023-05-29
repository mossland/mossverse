import { Network, NetworkSummary } from "./network.fetch";
import { Translate, baseTrans } from "@util/client";

export const networkTrans = {
  ...baseTrans,
  name: ["Name", "이름"],
  endPoint: ["EndPoint", "엔드포인트"],
  type: ["Type", "타입"],
  provider: ["Provider", "프로바이더"],
  networkId: ["NetworkId", "네트워크아이디"],
  totalNetwork: ["Total Network", "네트워크 총합"],
} satisfies Translate<Network & NetworkSummary>;
