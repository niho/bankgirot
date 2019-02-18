import * as chai from "chai";
import { Order } from "../src/order";
import { Payment } from "../src/payment";

chai.should();

describe("bankgirot", () => {
  describe("order without payments", () => {
    it("should throw an exception", () => {
      chai.should().throw(() => {
        new Order("490-2201", []); // tslint:disable-line
      });
    });
  });

  describe("order with payments", () => {
    const payments = [new Payment("991-2346", "99991234567890001", 1000)];
    const order = new Order("490-2201", payments);

    describe("toPosts()", () => {
      it("should return posts", () => order.toPosts().length.should.equal(3));
    });
  });

  describe.skip("order with multiple payments to the same account", () => {
    it("should throw an exception", () => {
      chai.should().throw(() => {
        new Order("490-2201", [
          new Payment("991-2346", "99991234567890001", 1000),
          new Payment("991-2346", "99991234567890002", 1230)
        ]); // tslint:disable-line
      });
    });
  });
});
