import { isMobile } from "react-device-detect";
import {
  ERC1155,
  ERC721,
  erc1155,
  erc20,
  erc721,
  ERC721A,
  ERC20,
  supportInterface,
  multicall,
  Multicall as MulticallContract,
  market,
  AkaMarket,
} from "@shared/contract";
import { ethers } from "ethers";

//

export const setApprvalForAll = async (contractAddress: string, owner: string, operator: string) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const contract = new ethers.Contract(contractAddress, erc721.abi, provider.getSigner(0)) as ERC721;
  if (!(await contract.isApprovedForAll(owner, operator, {}))) await contract.setApprovalForAll(operator, true, {});
};

const redirectMetaMaskDownload = () => {
  let link: string;
  if (isMobile) {
    link = `https://metamask.app.link/dapp/${window.location.href.slice(
      window.location.protocol === "http:" ? 7 : 8,
      window.location.href.length
    )}`;
    // setLink(link);
    window.location.assign(link);
  } else {
    link = "https://metamask.io/download/";
    const win = window.open(link, "_blank");
    win?.focus();
  }
};

export { redirectMetaMaskDownload };
