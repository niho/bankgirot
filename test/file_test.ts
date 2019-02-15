import * as chai from "chai";
import { File, TransferMethod } from "../src/file";
import { Order } from "../src/order";
import { Payment } from "../src/payment";

chai.should();

describe("bankgirot", () => {
  describe("file", () => {
    const date = new Date("2019-02-15T12:00:00Z");
    const customerNumber = "123456";

    describe("write stream", () => {
      it("should be ASCII");
      it("should use ISO8859-1");
      it("should use <CRLF> between posts");

      describe("without orders", () => {
        it("should throw an exception", () => {
          chai.should().throw(() => {
            const file = new File(customerNumber, []);
            file.write();
          });
        });
      });

      describe("with orders", () => {
        const payments = [
          new Payment("123-4567", "99991234567890001", 1000),
          new Payment("123-8901", "99991234567890002", 1230)
        ];
        const file = new File(customerNumber, [
          new Order("490-2201", payments),
          new Order("490-22012", payments)
        ]);

        it("should write to a path", () => {
          file.write("./");
        });
      });
    });

    describe("filename", () => {
      const filename = File.filename(
        TransferMethod.FileTransfer,
        customerNumber,
        date
      );
      const parts = filename.split(".");

      it("should have 5 parts separated by '.'", () =>
        parts.length.should.equal(5));

      describe("part 1", () => {
        it("should always be 'BFEP'", () => parts[0].should.equal("BFEP"));
      });

      describe("part 2", () => {
        describe("transfer method", () => {
          describe("BankgiroLink", () => {
            it("should be 'IBGLK'", () =>
              File.filename(TransferMethod.BankgiroLink, customerNumber, date)
                .split(".")[1]
                .should.equal("IBGLK"));
          });
          describe("FileTransfer", () => {
            it("should be 'ILBLB'", () =>
              File.filename(TransferMethod.FileTransfer, customerNumber, date)
                .split(".")[1]
                .should.equal("ILBLB"));
          });
        });
      });

      describe("part 3", () => {
        it("should start with 'K0'", () => parts[2].should.match(/^K0/));
        it("should contain the customer number", () =>
          parts[2].should.match(/123456$/));
        it("should be 8 characters long", () =>
          parts[2].length.should.equal(8));
      });

      describe("part 4", () => {
        it("should start with 'D'", () => parts[3].should.match(/^D/));
        it("should contain the current date", () =>
          parts[3].should.match(/190215$/));
        it("should be 7 characters long", () =>
          parts[3].length.should.equal(7));
      });

      describe("part 5", () => {
        it("should start with 'T'", () => parts[4].should.match(/^T/));
        it("should contain the current time", () =>
          parts[4].should.match(/120000$/));
        it("should be 7 characters long", () =>
          parts[4].length.should.equal(7));
      });
    });
  });
});
