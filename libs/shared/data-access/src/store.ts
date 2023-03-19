import { NotificationState, addNotificationToStore } from "./notification/notification.store";
import { AdminState, addAdminToStore } from "./admin/admin.store";
import { KeyringState, addKeyringToStore } from "./keyring/keyring.store";
import { NetworkState, addNetworkToStore } from "./network/network.store";
import { ProductState, addProductToStore } from "./product/product.store";
import { ThingState, addThingToStore } from "./thing/thing.store";
import { TokenState, addTokenToStore } from "./token/token.store";
import { ContractState, addContractToStore } from "./contract/contract.store";
import { CurrencyState, addCurrencyToStore } from "./currency/currency.store";
import { WalletState, addWalletToStore } from "./wallet/wallet.store";
import { FileState, addFileToStore } from "./file/file.store";
import { UiState, addUiToStore } from "./ui/ui.store";
import { OwnershipState, addOwnershipToStore } from "./ownership/ownership.store";
import { SetGet } from "@shared/util-client";

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
  ...addNotificationToStore({ set, get, pick }),
  ...addAdminToStore({ set, get, pick }),
  ...addContractToStore({ set, get, pick }),
  ...addCurrencyToStore({ set, get, pick }),
  ...addKeyringToStore({ set, get, pick }),
  ...addNetworkToStore({ set, get, pick }),
  ...addOwnershipToStore({ set, get, pick }),
  ...addProductToStore({ set, get, pick }),
  ...addThingToStore({ set, get, pick }),
  ...addTokenToStore({ set, get, pick }),
  ...addUiToStore({ set, get, pick }),
  ...addWalletToStore({ set, get, pick }),
  ...addFileToStore({ set, get, pick }),
});
