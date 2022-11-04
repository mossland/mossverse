import { MerkleTree } from "merkletreejs";
import { utils } from "ethers";
import { keccak256 } from "ethers/lib/utils";
export const centerEllipsis = (text: string) => {
  return `${text.slice(0, 6)}...${text.slice(-6)}`;
};

export const etherToWei = (number: number) => {
  return utils.parseEther(`${number}`).toString();
};

export const weiToEther = (amount: string) => {
  return parseInt(amount) / Math.pow(10, 18);
};

export const getMerkleTree = (addresses: string[]) => {
  const leaves = addresses.sort().map((address) => keccak256(address));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  return { root: tree.getHexRoot(), tree };
};
export const getMerkleProof = (addresses: string[], address: string) => {
  const tree = getMerkleTree(addresses).tree;
  const leaf = keccak256(address);
  const proof = tree.getHexProof(leaf);
  return proof;
};
export const getProof = (tree: MerkleTree, address: string) => {
  const leaf = keccak256(address);
  const proof = tree.getHexProof(leaf);
  return proof;
};
export const isMerkleVerified = (tree: MerkleTree, address: string) => {
  const leaf = keccak256(address);
  const proof = tree.getHexProof(leaf);
  return tree.verify(proof, leaf, tree.getRoot());
};
