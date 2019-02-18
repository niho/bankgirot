import { sprintf } from "sprintf-js";
import * as stream from "stream";
import { Order } from "./order";
import { Seal } from "./seal";

export enum ProductCode {
  BankgiroLink = "IBGLK",
  BankgiroLinkTest = "IBGZK",
  SupplierPayment = "ILBLB",
  SupplierPaymentTest = "ILBZZ",
  Payroll = "IKIKI",
  PayrollTest = "IKIZZ",
  Test = "IZZZZ"
}

export class File extends stream.Readable {
  public static filename(
    productCode: ProductCode,
    customerNumber: string
  ): string {
    return [
      "BFEP",
      productCode,
      sprintf("K0%06d", parseInt(customerNumber, 10))
    ].join(".");
  }

  public readonly productCode: ProductCode;
  public readonly customerNumber: string;
  public readonly seal: Seal;
  public readonly orders: Order[];
  public readonly filename: string;

  constructor(
    customerNumber: string,
    seal: Seal,
    orders: Order[],
    productCode: ProductCode = ProductCode.SupplierPayment
  ) {
    super();
    if (orders.length === 0) {
      throw new Error("Empty files with no orders is not allowed.");
    }
    this.productCode = productCode;
    this.customerNumber = customerNumber;
    this.orders = orders;
    this.seal = seal;
    this.filename = File.filename(this.productCode, this.customerNumber);
  }

  public _read(_size: number) {
    const encoding = "latin1";
    this.seal.update(this.seal.startPost(), encoding);
    this.push(this.seal.startPost(), encoding);
    this.push("\r\n", encoding);
    this.orders.forEach(order => {
      order.toPosts().forEach(post => {
        this.seal.update(post, encoding);
        this.push(post, encoding);
        this.push("\r\n", encoding);
      });
    });
    this.push(this.seal.endPost(), encoding);
    this.push(null);
  }
}
