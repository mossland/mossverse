import * as crypto from "./crypto";

describe("Crypto Utils Test", () => {
  it("centerEllipsis", () => {
    expect(crypto.centerEllipsis("0123456789")).toEqual("012345...456789");
  });
  it("etherToWei", () => {
    expect(crypto.etherToWei(1)).toEqual("1000000000000000000");
  });
});
