import { sharedTestClient } from "./shared-test-client";

describe("sharedTestClient", () => {
  it("should work", () => {
    expect(sharedTestClient()).toEqual("shared-test-client");
  });
});
