import * as chai from "chai";
import * as utils from "../src/utils";

chai.should();

describe("bankgirot", () => {
  describe("utils", () => {
    describe("dateStr()", () => {
      it("should format the date in the YYMMDD format", () =>
        utils.dateStr(new Date("2019-02-15")).should.equal("190215"));
    });

    describe("timeStr()", () => {
      it("should format the time in the HHMMSS format", () =>
        utils.timeStr(new Date("2019-02-15T10:43:12Z")).should.equal("104312"));
    });

    describe("bankgiroNumber()", () => {
      describe("with a '-' separator character", () => {
        it("should return the Bankgiro number", () =>
          utils.bankgiroNumber("991-2346").should.equal(9912346));
      });

      describe("without a '-' separator character", () => {
        it("should return the Bankgiro number", () =>
          utils.bankgiroNumber("9912346").should.equal(9912346));
      });

      describe("with non-numeric characters (beside the '-')", () => {
        it("should throw exception", () => {
          chai.should().throw(() => {
            utils.bankgiroNumber("A91-2346");
          });
          chai.should().throw(() => {
            utils.bankgiroNumber("#91-2346");
          });
        });
      });

      describe("longer than 8 characters (minus the '-')", () => {
        it("should throw exception", () => {
          chai.should().throw(() => {
            utils.bankgiroNumber("5555-55510");
          });
        });
      });

      describe("shorter than 7 characters (minus the '-')", () => {
        it("should throw exception", () => {
          chai.should().throw(() => {
            utils.bankgiroNumber("991-234");
          });
        });
      });

      describe("with a check digit", () => {
        describe("that is correct", () => {
          it("should return the Bankgiro number", () => {
            utils.bankgiroNumber("991-2346").should.equal(9912346);
            utils.bankgiroNumber("5555-5551").should.equal(55555551);
          });
        });

        describe("that is wrong", () => {
          it("should throw exception", () => {
            chai.should().throw(() => {
              utils.bankgiroNumber("991-2340");
            });
            chai.should().throw(() => {
              utils.bankgiroNumber("5555-5550");
            });
          });
        });
      });
    });
  });
});
