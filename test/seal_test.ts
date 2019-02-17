import * as chai from "chai";
import { HashType, Seal } from "../src/seal";

chai.should();

describe("bankgirot", () => {
  describe("seal", () => {
    const date = new Date("2019-02-15T12:00:00Z");
    const seal = new Seal(
      HashType.HMAC_SHA_256,
      date,
      "1234567890ABCDEF1234567890ABCDEF"
    );

    seal.update("abc123åäö", "latin1");

    describe("start post", () => {
      it("should include key date", () =>
        seal.startPost().should.include("190215"));

      it("should include hash type", () =>
        seal.startPost().should.include("HMAC"));
    });

    describe("end post", () => {
      const endPost = seal.endPost();

      it("should include key date", () => endPost.should.include("190215"));

      it("should include KVV", () =>
        endPost.slice(8, 40).should.equal("05cd81829e26f44089fd91a9cfbc75db"));

      it("should include hash", () =>
        endPost.slice(40, 72).should.equal("f0ab4a5ce76b1ba93fac6fe5b2a35d17"));
    });
  });
});
