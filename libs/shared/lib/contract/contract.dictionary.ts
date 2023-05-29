import { Contract, ContractSummary } from "./contract.fetch";
import { Translate, baseTrans } from "@util/client";

export const contractTrans = {
  ...baseTrans,
  network: ["Network", "네트워크"],
  address: ["Address", "주소"],
  displayName: ["DisplayName", "디스플레이명"],
  interface: ["Interface", "인터페이스"],
  name: ["Name", "이름"],
  symbol: ["Symbol", "심볼"],
  totalSupply: ["TotalSupply", "총공급량"],
  bn: ["Bn", "Bn"],
  totalContract: ["Total Contract", "총 컨트랙트수"],
} satisfies Translate<Contract & ContractSummary>;
