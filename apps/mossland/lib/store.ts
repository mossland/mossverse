"use client";
import { AdvertiseState, makeAdvertiseSlice } from "./advertise/advertise.store";
import { BuildingState, makeBuildingSlice } from "./building/building.store";
import { MocSurveyState, makeMocSurveySlice } from "./mocSurvey/mocSurvey.store";
import { MocWalletState, makeMocWalletSlice } from "./mocWallet/mocWallet.store";
import { MosslandState, makeMosslandSlice } from "./mossland/mossland.store";
import { SetGet, makeStore } from "@util/client";
import { StakePoolState, makeStakePoolSlice } from "./stakePool/stakePool.store";
import { SummaryState, makeSummarySlice } from "./summary/summary.store";
import { UserState, makeUserSlice } from "./user/user.store";
import { store as decentverse, st as decentverseSt } from "@decentverse/client";
import { store as platform, st as platformSt } from "@platform/client";
import { store as shared, st as sharedSt } from "@shared/client";
import { store as social, st as socialSt } from "@social/client";

export interface State
  extends BuildingState,
    MosslandState,
    UserState,
    SummaryState,
    MocSurveyState,
    StakePoolState,
    AdvertiseState,
    MocWalletState {}
export interface RootState extends shared.State, platform.State, decentverse.State, social.State, State {}

export const addToStore = ({ set, get, pick }: SetGet<RootState>) => ({
  ...shared.addToStore({ set, get, pick }),
  ...social.addToStore({ set, get, pick }),
  ...platform.addToStore({ set, get, pick }),
  ...decentverse.addToStore({ set, get, pick }),
  ...makeMosslandSlice({ set, get, pick }),
  ...makeUserSlice({ set, get, pick }),
  ...makeBuildingSlice({ set, get, pick }),
  ...makeMocSurveySlice({ set, get, pick }),
  ...makeMocWalletSlice({ set, get, pick }),
  ...makeStakePoolSlice({ set, get, pick }),
  ...makeAdvertiseSlice({ set, get, pick }),
  ...makeSummarySlice({ set, get, pick }),
});
export const st = makeStore(addToStore);
Object.assign(sharedSt, st);
Object.assign(platformSt, st);
Object.assign(socialSt, st);
Object.assign(decentverseSt, st);
