import * as format from "./format";

describe("Format Utils Test", () => {
  it("discordHashTagForm", () => {
    expect(format.discordHashTagForm({ username: "bassman", discriminator: "1324" })).toEqual("@bassman#1324");
  });
  it("capitalize", () => {
    expect(format.capitalize("hello")).toEqual("Hello");
  });
  it("numberWithCommas", () => {
    expect(format.numberWithCommas(100000)).toEqual("100,000");
  });
  it("toIsoString", () => {
    expect(format.toIsoString(new Date("1999-01-01"), true)).toEqual("1999-01-01");
  });
});
