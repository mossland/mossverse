export interface NftContractInfo {
  name: string;
  symbol: string;
  alias: string;
  address: string;
}
export interface WalletInfo {
  address: string;
  privateKey: string;
}
export interface NetworkInfo {
  chainId: string;
  accessKeyId: string;
  secretAccessKey: string;
  preset: number;
}
export interface ContractExecutionTransactionRequest {
  from: string;
  to: string;
  value: number;
  input: string;
  gas: number;
  submit: boolean;
}
export interface ContractExeutionRequest {
  from?: string;
  contractAddr: string;
  functionName: string;
  value?: number;
  inputs: ContractInputField[];
  gas?: number;
  submit?: boolean;
}
export interface ContractFunctionCall {
  name: string;
  type: "function";
  inputs: {
    type: ArgType;
    name: ValueType;
  }[];
}
export interface ContractInputField {
  type: ArgType;
  name: string;
  value: ValueType;
}
export type ArgType = "uint256" | "uint256[]" | "address" | "address[]" | "String";
export type ValueType = string | string[] | number | number[];
