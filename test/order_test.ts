import * as chai from "chai";
import { Order } from "../src/order";
import { Payment } from "../src/payment";

chai.should();

describe("bankgirot", () => {
  describe("order without payments", () => {
    const order = new Order("490-2201", []);

    describe("toPosts()", () => {
      it("should have", () => order.toPosts().should.deep.equal([]));
    });
  });

  describe("order with payments", () => {
    const payments = [
      new Payment("123-4567", "99991234567890001", 1000),
      new Payment("123-8901", "99991234567890002", 1230)
    ];
    const order = new Order("490-2201", payments);

    describe("toPosts()", () => {
      it("should have", () => order.toPosts().should.deep.equal([]));
    });
  });
});
