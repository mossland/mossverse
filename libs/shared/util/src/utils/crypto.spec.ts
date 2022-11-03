import * as crypto from "./crypto";

describe("Crypto Utils Test", () => {
  it("centerEllipsis", () => {
    expect(crypto.centerEllipsis("0123456789")).toEqual("012345...456789");
  });
  it("etherToWei", () => {
    expect(crypto.etherToWei(1)).toEqual("1000000000000000000");
  });
  it("Merkle Tree", () => {
    const addresses = [
      "0x1234567890123456789012345678901234567890",
      "0x1234567890123456789012345678901234567891",
      "0x1234567890123456789012345678901234567892",
    ];
    const { tree } = crypto.getMerkleTree(addresses.slice(1));
    // 1. Bad Leaves
    expect(crypto.isMerkleVerified(tree, addresses[0])).toBeFalsy();
    expect(crypto.isMerkleVerified(tree, addresses[1])).toBeTruthy();
  });
});
