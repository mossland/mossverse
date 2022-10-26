import * as data from "./data";

describe("Data Utils Test", () => {
  it("groupByFields", () => {
    expect(
      data.groupByFields(
        [
          { address: "a", num: 1 },
          { address: "b", num: 1 },
          { address: "a", num: 2 },
        ],
        "address"
      )["a"].length
    ).toEqual(2);
  });
});
