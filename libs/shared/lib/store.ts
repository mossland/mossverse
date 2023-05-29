"use client";
import { AdminState, makeAdminSlice } from "./admin/admin.store";
import { ContractState, makeContractSlice } from "./contract/contract.store";
import { CurrencyState, makeCurrencySlice } from "./currency/currency.store";
import { FileState, makeFileSlice } from "./file/file.store";
import { KeyringState, makeKeyringSlice } from "./keyring/keyring.store";
import { NetworkState, makeNetworkSlice } from "./network/network.store";
import { NotificationState, makeNotificationSlice } from "./notification/notification.store";
import { OwnershipState, makeOwnershipSlice } from "./ownership/ownership.store";
import { ProductState, makeProductSlice } from "./product/product.store";
import { SetGet } from "@util/client";
import { ThingState, makeThingSlice } from "./thing/thing.store";
import { TokenState, makeTokenSlice } from "./token/token.store";
import { UiState, makeUiSlice } from "./ui/ui.store";
import { WalletState, makeWalletSlice } from "./wallet/wallet.store";

export interface State
  extends AdminState,
    ContractState,
    CurrencyState,
    KeyringState,
    NetworkState,
    OwnershipState,
    ProductState,
    ThingState,
    TokenState,
    UiState,
    WalletState,
    NotificationState,
    FileState {}
export type RootState = State;
export const addToStore = ({ set, get, pick }: SetGet<RootState>) => ({
  ...makeNotificationSlice({ set, get, pick }),
  ...makeAdminSlice({ set, get, pick }),
  ...makeContractSlice({ set, get, pick }),
  ...makeCurrencySlice({ set, get, pick }),
  ...makeKeyringSlice({ set, get, pick }),
  ...makeNetworkSlice({ set, get, pick }),
  ...makeOwnershipSlice({ set, get, pick }),
  ...makeProductSlice({ set, get, pick }),
  ...makeThingSlice({ set, get, pick }),
  ...makeTokenSlice({ set, get, pick }),
  ...makeUiSlice({ set, get, pick }),
  ...makeWalletSlice({ set, get, pick }),
  ...makeFileSlice({ set, get, pick }),
});
