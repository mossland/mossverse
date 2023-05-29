import { advertiseTrans } from "./advertise/advertise.dictionary";
import { buildingTrans } from "./building/building.dictionary";
import { dictionary as decentverseTrans } from "@decentverse/client";
import { makePageProto } from "@util/client";
import { mocSurveyTrans } from "./mocSurvey/mocSurvey.dictionary";
import { mocWalletTrans } from "./mocWallet/mocWallet.dictionary";
import { mosslandTrans } from "./mossland/mossland.dictionary";
import { dictionary as platformTrans } from "@platform/client";
import { dictionary as sharedTrans } from "@shared/client";
import { dictionary as socialTrans } from "@social/client";
import { stakePoolTrans } from "./stakePool/stakePool.dictionary";
import { userTrans } from "./user/user.dictionary";

export const trans = {
  mossland: mosslandTrans,
  advertise: advertiseTrans,
  building: buildingTrans,
  mocSurvey: mocSurveyTrans,
  mocWallet: mocWalletTrans,
  stakePool: stakePoolTrans,
  user: userTrans,
} as const;
export const usePage = makePageProto([sharedTrans, socialTrans, platformTrans, decentverseTrans, trans]);
