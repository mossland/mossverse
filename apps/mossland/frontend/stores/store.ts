import { store as shared } from "@shared/data-access";
import { store as social } from "@social/data-access";
import { store as platform } from "@platform/data-access";
import { store as decentverse } from "@decentverse/data-access";
import { MainState, addMainToStore } from "./main/main.store";
import { MocSurveyState, addMocSurveyToStore } from "./mocSurvey/mocSurvey.store";
import { StakePoolState, addStakePoolToStore } from "./stakePool/stakePool.store";
import { AdvertiseState, addAdvertiseToStore } from "./advertise/advertise.store";
import { UserState, addUserToStore } from "./user/user.store";
import { MocWalletState, addMocWalletToStore } from "./mocWallet/mocWallet.store";
import { BuildingState, addBuildingToStore } from "./building/building.store";
import { SetGet } from "@shared/util-client";

export interface State
  extends BuildingState,
    MainState,
    UserState,
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
  ...addMainToStore({ set, get, pick }),
  ...addUserToStore({ set, get, pick }),
  ...addBuildingToStore({ set, get, pick }),
  ...addMocSurveyToStore({ set, get, pick }),
  ...addMocWalletToStore({ set, get, pick }),
  ...addStakePoolToStore({ set, get, pick }),
  ...addAdvertiseToStore({ set, get, pick }),
});
