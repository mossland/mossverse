/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface AKATransferInterface extends utils.Interface {
  functions: {
    "donationERC1155(address,address,uint256,uint256)": FunctionFragment;
    "donationERC20(address,address,uint256)": FunctionFragment;
    "donationERC721(address,address,uint256)": FunctionFragment;
    "donationKIP17(address,address,uint256)": FunctionFragment;
    "donationKIP37(address,address,uint256,uint256)": FunctionFragment;
    "donationKIP7(address,address,uint256)": FunctionFragment;
    "goldenbellERC1155(address,address,uint256,address[],uint256[])": FunctionFragment;
    "goldenbellERC20(address,address,uint256,address[],uint256[])": FunctionFragment;
    "goldenbellERC721(address,address,address[],uint256[])": FunctionFragment;
    "goldenbellKIP17(address,address,address[],uint256[])": FunctionFragment;
    "goldenbellKIP37(address,address,uint256,address[],uint256[])": FunctionFragment;
    "goldenbellKIP7(address,address,uint256,address[],uint256[])": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setGetter(address)": FunctionFragment;
    "showGetter()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "donationERC1155"
      | "donationERC20"
      | "donationERC721"
      | "donationKIP17"
      | "donationKIP37"
      | "donationKIP7"
      | "goldenbellERC1155"
      | "goldenbellERC20"
      | "goldenbellERC721"
      | "goldenbellKIP17"
      | "goldenbellKIP37"
      | "goldenbellKIP7"
      | "owner"
      | "renounceOwnership"
      | "setGetter"
      | "showGetter"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "donationERC1155",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "donationERC20",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "donationERC721",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "donationKIP17",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "donationKIP37",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "donationKIP7",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "goldenbellERC1155",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "goldenbellERC20",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "goldenbellERC721",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "goldenbellKIP17",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "goldenbellKIP37",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "goldenbellKIP7",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setGetter",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "showGetter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "donationERC1155",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "donationERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "donationERC721",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "donationKIP17",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "donationKIP37",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "donationKIP7",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "goldenbellERC1155",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "goldenbellERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "goldenbellERC721",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "goldenbellKIP17",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "goldenbellKIP37",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "goldenbellKIP7",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setGetter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "showGetter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface AKATransfer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AKATransferInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    donationERC1155(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    donationERC20(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    donationERC721(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    donationKIP17(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    donationKIP37(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    donationKIP7(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    goldenbellERC1155(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    goldenbellERC20(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      totalAmount: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    goldenbellERC721(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      addresslist: PromiseOrValue<string>[],
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    goldenbellKIP17(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      addresslist: PromiseOrValue<string>[],
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    goldenbellKIP37(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    goldenbellKIP7(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      totalAmount: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setGetter(
      addr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    showGetter(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  donationERC1155(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  donationERC20(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  donationERC721(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  donationKIP17(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  donationKIP37(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  donationKIP7(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  goldenbellERC1155(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    addresslist: PromiseOrValue<string>[],
    amounts: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  goldenbellERC20(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    totalAmount: PromiseOrValue<BigNumberish>,
    addresslist: PromiseOrValue<string>[],
    amounts: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  goldenbellERC721(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    addresslist: PromiseOrValue<string>[],
    tokenIds: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  goldenbellKIP17(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    addresslist: PromiseOrValue<string>[],
    tokenIds: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  goldenbellKIP37(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    addresslist: PromiseOrValue<string>[],
    amounts: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  goldenbellKIP7(
    contractAddr: PromiseOrValue<string>,
    tokenOwner: PromiseOrValue<string>,
    totalAmount: PromiseOrValue<BigNumberish>,
    addresslist: PromiseOrValue<string>[],
    amounts: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setGetter(
    addr: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  showGetter(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    donationERC1155(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    donationERC20(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    donationERC721(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    donationKIP17(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    donationKIP37(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    donationKIP7(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    goldenbellERC1155(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    goldenbellERC20(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      totalAmount: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    goldenbellERC721(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      addresslist: PromiseOrValue<string>[],
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    goldenbellKIP17(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      addresslist: PromiseOrValue<string>[],
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    goldenbellKIP37(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    goldenbellKIP7(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      totalAmount: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setGetter(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    showGetter(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    donationERC1155(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    donationERC20(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    donationERC721(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    donationKIP17(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    donationKIP37(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    donationKIP7(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    goldenbellERC1155(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    goldenbellERC20(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      totalAmount: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    goldenbellERC721(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      addresslist: PromiseOrValue<string>[],
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    goldenbellKIP17(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      addresslist: PromiseOrValue<string>[],
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    goldenbellKIP37(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    goldenbellKIP7(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      totalAmount: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setGetter(
      addr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    showGetter(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    donationERC1155(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    donationERC20(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    donationERC721(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    donationKIP17(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    donationKIP37(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    donationKIP7(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    goldenbellERC1155(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    goldenbellERC20(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      totalAmount: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    goldenbellERC721(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      addresslist: PromiseOrValue<string>[],
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    goldenbellKIP17(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      addresslist: PromiseOrValue<string>[],
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    goldenbellKIP37(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    goldenbellKIP7(
      contractAddr: PromiseOrValue<string>,
      tokenOwner: PromiseOrValue<string>,
      totalAmount: PromiseOrValue<BigNumberish>,
      addresslist: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setGetter(
      addr: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    showGetter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
