import { StakePool, StakePoolSummary } from "./stakePool.fetch";
import { Translate, baseTrans } from "@util/client";

export const stakePoolTrans = {
  ...baseTrans,
  type: ["Type", "타입"],
  thing: ["Thing", "Thing"],
  map: ["Map", "맵"],
  center: ["Center", "중심"],
  wh: ["WH", "WH"],
  url: ["URL", "URL"],
  size: ["Size", "크기"],
  status: ["Status", "상태"],
  stakings: ["Stakings", "Stakings"],
  totalStakePool: ["Total StakePool", "StakePool 총합"],
  totalValue: ["Total Value", "총 가치"],
  name: ["Name", "이름"],
} satisfies Translate<StakePool & StakePoolSummary>;
