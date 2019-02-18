import * as chai from "chai";
import * as bankgirot from "../src/posts";

chai.should();

describe("bankgirot", () => {
  describe("transaction posts", () => {
    describe("seal start (TK00)", () => {
      const date = new Date("2019-02-15T12:00:00Z");
      describe("position 1-2", () => {
        it("should equal '00'", () =>
          bankgirot
            .sealStart(date)
            .slice(0, 2)
            .should.equal("00"));
      });

      describe("position 3-8", () => {
        it("should equal the key date", () =>
          bankgirot
            .sealStart(date)
            .slice(2, 8)
            .should.equal("190215"));
      });

      describe("position 9-12", () => {
        describe("with hash type HMAC SHA256", () => {
          it("should equal 'HMAC'", () =>
            bankgirot
              .sealStart(date, bankgirot.HashType.HMAC_SHA_256)
              .slice(8, 12)
              .should.equal("HMAC"));
        });

        describe("with hash type Nexus Electronic Sigill", () => {
          it("should equal 'SAK1'", () =>
            bankgirot
              .sealStart(date, bankgirot.HashType.NexusElectronicSeal)
              .slice(8, 12)
              .should.equal("SAK1"));
        });
      });

      describe("position 13-80", () => {
        it("should be blank spaces", () =>
          bankgirot
            .sealStart(date)
            .slice(12, 80)
            .should.match(/^[ ]{68}$/));
      });

      it("should be exactly 80 characters long", () =>
        bankgirot.sealStart(date).length.should.equal(80));
    });

    describe("seal end (TK99)", () => {
      const date = new Date("2019-02-15T12:00:00Z");

      describe("Nexus Electronic Seal", () => {
        describe("position 1-2", () => {
          it("should equal '99'", () =>
            bankgirot
              .sealNexus(date, "", "")
              .slice(0, 2)
              .should.equal("99"));
        });

        describe("position 3-8", () => {
          it("should equal the key date", () =>
            bankgirot
              .sealNexus(date, "", "")
              .slice(2, 8)
              .should.equal("190215"));
        });

        describe("position 9-26", () => {
          it("should equal the hash", () =>
            bankgirot
              .sealNexus(date, "123456789012345678", "")
              .slice(8, 26)
              .should.equal("123456789012345678"));
        });

        describe("position 27-33", () => {
          it("should equal the seal info", () =>
            bankgirot
              .sealNexus(date, "", "abcdefg")
              .slice(26, 33)
              .should.equal("abcdefg"));
        });

        describe("position 34-80", () => {
          it("should be blank spaces", () =>
            bankgirot
              .sealNexus(date, "", "")
              .slice(33, 80)
              .should.match(/^[ ]{47}$/));
        });

        it("should be exactly 80 characters long", () =>
          bankgirot.sealNexus(date, "", "").length.should.equal(80));
      });

      describe("HMAC SHA256", () => {
        describe("position 1-2", () => {
          it("should equal '99'", () =>
            bankgirot
              .sealHMAC(date, "", "")
              .slice(0, 2)
              .should.equal("99"));
        });

        describe("position 3-8", () => {
          it("should equal the key date", () =>
            bankgirot
              .sealHMAC(date, "", "")
              .slice(2, 8)
              .should.equal("190215"));
        });

        describe("position 9-40", () => {
          it("should equal the KVV", () =>
            bankgirot
              .sealHMAC(date, "12345678901234567890123456789012", "")
              .slice(8, 40)
              .should.equal("12345678901234567890123456789012"));
        });

        describe("position 41-72", () => {
          it("should equal the hash", () =>
            bankgirot
              .sealHMAC(date, "", "12345678901234567890123456789012")
              .slice(40, 72)
              .should.equal("12345678901234567890123456789012"));
        });

        describe("position 73-80", () => {
          it("should be blank spaces", () =>
            bankgirot
              .sealHMAC(date, "", "")
              .slice(72, 80)
              .should.equal("        "));
        });

        it("should be exactly 80 characters long", () =>
          bankgirot
            .sealHMAC(
              date,
              "123456789012345678901234567890121234567890123456789012345678901",
              "123456789012345678901234567890121234567890123456789012345678901"
            )
            .length.should.equal(80));
      });
    });

    describe("opening (TK11)", () => {
      const bankgiroNr = "490-2201";
      const date = new Date("2019-02-15T12:00:00Z");
      describe("position 1-2", () => {
        it("should equal '11'", () =>
          bankgirot
            .opening(bankgiroNr)
            .slice(0, 2)
            .should.equal("11"));
      });
      describe("position 3-12", () => {
        it("should include the senders Bankgiro number", () =>
          bankgirot
            .opening(bankgiroNr)
            .slice(2, 12)
            .should.include("4902201"));
        it("should be zero padded and right aligned", () =>
          bankgirot
            .opening(bankgiroNr)
            .slice(2, 12)
            .should.equal("0004902201"));
        it("should not include the '-' character", () =>
          bankgirot
            .opening(bankgiroNr)
            .slice(2, 12)
            .should.not.include("-"));
      });
      describe("position 13-18", () => {
        it("should equal the current date in ÅÅMMDD format", () =>
          bankgirot
            .opening(bankgiroNr, date)
            .slice(12, 18)
            .should.equal("190215"));
      });
      describe("position 19-40", () => {
        it("should equal the product identifier 'LEVERANTÖRSBETALNINGAR'", () =>
          bankgirot
            .opening(bankgiroNr)
            .slice(18, 40)
            .should.equal("LEVERANTÖRSBETALNINGAR"));
      });
      describe("position 41-46", () => {
        describe("with a payment date", () => {
          const tomorrow = new Date(date);
          tomorrow.setDate(date.getDate() + 1);

          it("should equal the payment date in ÅÅMMDD format", () =>
            bankgirot
              .opening(bankgiroNr, date, tomorrow)
              .slice(40, 46)
              .should.equal("190216"));
        });
        describe("immidate payment", () => {
          it("should equal the string 'GENAST'", () =>
            bankgirot
              .opening(bankgiroNr, date, date)
              .slice(40, 46)
              .should.equal("GENAST"));
        });
        describe("no payment date", () => {
          it("should be blank spaces", () =>
            bankgirot
              .opening(bankgiroNr)
              .slice(40, 46)
              .should.equal("      "));
        });
      });
      describe("position 47-59", () => {
        it("should be blank spaces", () =>
          bankgirot
            .opening(bankgiroNr)
            .slice(46, 59)
            .should.equal("             "));
      });
      describe("position 60-62", () => {
        it("should equal the currency code 'SEK'", () =>
          bankgirot
            .opening(bankgiroNr)
            .slice(59, 62)
            .should.equal("SEK"));
      });
      describe("position 63-80", () => {
        it("should be blank spaces", () =>
          bankgirot
            .opening(bankgiroNr)
            .slice(62, 80)
            .should.equal("                  "));
      });

      it("should be exactly 80 characters long", () =>
        bankgirot.opening(bankgiroNr).length.should.equal(80));
    });

    describe("fixed information (TK12)", () => {
      describe("position 1-2", () => {
        it("should equal '12'", () =>
          bankgirot
            .fixedInformation("")
            .slice(0, 2)
            .should.equal("12"));
      });
      describe("position 3-52", () => {
        it("should include the provided information text", () =>
          bankgirot
            .fixedInformation("Lorem ipsum.")
            .slice(2, 52)
            .should.include("Lorem ipsum."));
        it("should be right padded with spaces", () =>
          bankgirot
            .fixedInformation("test")
            .slice(2, 52)
            .should.match(/^test[ ]+$/));
      });
      describe("position 53-58", () => {
        describe("with an end date", () => {
          const endDate = new Date("2019-02-15T12:00:00Z");

          it("should equal the end date in ÅÅMMDD format", () =>
            bankgirot
              .fixedInformation("", endDate)
              .slice(52, 58)
              .should.equal("190215"));
        });
        describe("no end date", () => {
          it("should be blank spaces", () =>
            bankgirot
              .fixedInformation("")
              .slice(52, 58)
              .should.equal("      "));
        });
      });
      describe("position 59-80", () => {
        it("should be blank spaces", () =>
          bankgirot
            .fixedInformation("")
            .slice(58, 80)
            .should.equal("                      "));
      });

      it("should be exactly 80 characters long", () =>
        bankgirot
          .fixedInformation(
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." // tslint:disable-line
          )
          .length.should.equal(80));
    });

    describe("headings (TK13)", () => {
      describe("position 1-2", () => {
        it("should equal '13'", () =>
          bankgirot
            .headings("Fakturanummer", "Belopp")
            .slice(0, 2)
            .should.equal("12"));
      });
      describe("position 3-27", () => {
        it("should equal the specification header", () =>
          bankgirot
            .headings("Fakturanummer", "Belopp")
            .slice(2, 27)
            .should.equal("Fakturanummer            "));
      });
      describe("position 28-39", () => {
        it("should equal the amount header", () =>
          bankgirot
            .headings("Fakturanummer", "Belopp")
            .slice(27, 39)
            .should.equal("Belopp      "));
      });
      describe("position 40-80", () => {
        it("should be blank spaces", () =>
          bankgirot
            .headings("", "")
            .slice(39, 80)
            .should.equal("                                         "));
      });

      it("should be exactly 80 characters long", () =>
        bankgirot
          .headings(
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", // tslint:disable-line
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." // tslint:disable-line
          )
          .length.should.equal(80));
    });

    describe("payment (TK14)", () => {
      describe("position 1-2", () => {
        it("should equal '14'", () =>
          bankgirot
            .payment(4902201, "123456", 100)
            .slice(0, 2)
            .should.equal("14"));
      });
      describe("position 3-12", () => {
        it("should equal the account number", () =>
          bankgirot
            .payment(4902201, "123456", 100)
            .slice(2, 12)
            .should.equal("0004902201"));
      });
      describe("position 13-37", () => {
        it("should equal the OCR reference", () =>
          bankgirot
            .payment(4902201, "123456", 100)
            .slice(12, 37)
            .should.equal("123456                   "));
      });
      describe("position 38-49", () => {
        it("should equal the amount", () =>
          bankgirot
            .payment(4902201, "123456", 100)
            .slice(37, 49)
            .should.equal("000000010000"));

        it("should include two decimals", () =>
          bankgirot
            .payment(4902201, "123456", 3.1415)
            .slice(37, 49)
            .should.equal("000000000314"));
      });

      describe("position 50-55", () => {
        describe("with a payment date", () => {
          const paymentDate = new Date("2019-02-15T12:00:00Z");

          it("should equal the payment date in ÅÅMMDD format", () =>
            bankgirot
              .payment(4902201, "123456", 100, paymentDate)
              .slice(49, 55)
              .should.equal("190215"));
        });
        describe("immidate payment", () => {
          it("should equal the string 'GENAST'", () =>
            bankgirot
              .payment(4902201, "123456", 100)
              .slice(49, 55)
              .should.equal("GENAST"));
        });
      });

      describe("position 56-60", () => {
        it("should be blank spaces", () =>
          bankgirot
            .payment(4902201, "123456", 100)
            .slice(55, 60)
            .should.equal("     "));
      });

      describe("position 61-80", () => {
        it("should include the information text", () =>
          bankgirot
            .payment(4902201, "123456", 100, undefined, "Lorem ipsum.")
            .slice(60, 80)
            .should.include("Lorem ipsum."));
      });

      it("should be exactly 80 characters long", () =>
        bankgirot.payment(4902201, "123456", 100).length.should.equal(80));
    });

    describe("summary (TK29)", () => {
      describe("position 1-2", () => {
        it("should equal '29'", () =>
          bankgirot
            .summary("490-2201", 42, 123456.99)
            .slice(0, 2)
            .should.equal("29"));
      });

      describe("position 3-12", () => {
        it("should equal the account number", () =>
          bankgirot
            .summary("490-2201", 42, 123456.99)
            .slice(2, 12)
            .should.equal("0004902201"));
      });

      describe("position 13-20", () => {
        it("should equal the payments count", () =>
          bankgirot
            .summary("490-2201", 42, 123456.99)
            .slice(12, 20)
            .should.equal("00000042"));
      });

      describe("position 21-32", () => {
        it("should equal the total amount", () =>
          bankgirot
            .summary("490-2201", 42, 123456.99)
            .slice(20, 32)
            .should.equal("000012345699"));
      });

      describe("position 33", () => {
        describe("if the total amount is negative", () => {
          it("should equal '-'", () =>
            bankgirot
              .summary("490-2201", 42, -123456.99)
              .slice(32, 33)
              .should.equal("-"));
        });
        describe("if the total amount is positive", () => {
          it("should be blank space", () =>
            bankgirot
              .summary("490-2201", 42, 123456.99)
              .slice(32, 33)
              .should.equal(" "));
        });
      });

      describe("position 34-80", () => {
        it("should be blank spaces", () =>
          bankgirot
            .summary("490-2201", 42, 123456.99)
            .slice(33, 80)
            .should.equal("                                               "));
      });

      it("should be exactly 80 characters long", () =>
        bankgirot.summary("490-2201", 42, 123456.99).length.should.equal(80));
    });
  });
});
