import * as chai from "chai";
import { File, TransferMethod } from "../src/file";
import { Order } from "../src/order";
import { Payment } from "../src/payment";
import { HashType, Seal } from "../src/seal";

chai.should();

describe("bankgirot", () => {
  describe("file", () => {
    const customerNumber = "123456";
    const seal = new Seal(HashType.HMAC_SHA_256, new Date(), "");

    describe("without orders", () => {
      it("should throw an exception", () => {
        chai.should().throw(() => {
          new File(customerNumber, seal, []); // tslint:disable-line
        });
      });
    });

    describe("with orders", () => {
      const payments = [
        new Payment("123-4567", "99991234567890001", 1000),
        new Payment("123-8901", "99991234567890002", 1230)
      ];
      const file = new File(customerNumber, seal, [
        new Order("490-2201", payments),
        new Order("490-22012", payments)
      ]);

      describe("stream", () => {
        it("should be ASCII");
        it("should use ISO8859-1");
        it("should use <CRLF> between posts");

        it("should write to a stream", done => {
          // const writable = new stream.Writable({
          //   write(chunk, encoding, callback) {
          //     chunk.length.should.equal(80);
          //     encoding.should.equal("latin1");
          //     callback();
          //   }
          // });
          // writable.on("end", done);
          file.on("end", done).pipe(process.stdout);
        });
      });
    });

    describe("filename", () => {
      const date = new Date("2019-02-15T12:00:00Z");
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
