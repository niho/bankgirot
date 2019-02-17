import * as stream from "stream";
import { Order } from "./order";
import { Seal } from "./seal";
import { dateStr, timeStr } from "./utils";

export enum TransferMethod {
  BankgiroLink = "IBGLK",
  FileTransfer = "ILBLB",
  BankgiroLinkTest = "IBGZK",
  FileTransferTest = "ILBZZ",
  Test = "IZZZZ"
}

export class File extends stream.Readable {
  public static filename(
    transferMethod: TransferMethod,
    customerNumber: string,
    date: Date
  ): string {
    return [
      "BFEP",
      transferMethod,
      `K0${customerNumber}`,
      `D${dateStr(date)}`,
      `T${timeStr(date)}`
    ].join(".");
  }

  public readonly transferMethod: TransferMethod;
  public readonly customerNumber: string;
  public readonly date: Date;
  public readonly seal: Seal;
  public readonly orders: Order[];
  public readonly filename: string;

  constructor(
    customerNumber: string,
    seal: Seal,
    orders: Order[],
    transferMethod: TransferMethod = TransferMethod.FileTransfer
  ) {
    super();
    if (orders.length === 0) {
      throw new Error("Empty files with no orders is not allowed.");
    }
    this.date = new Date();
    this.transferMethod = transferMethod;
    this.customerNumber = customerNumber;
    this.orders = orders;
    this.seal = seal;
    this.filename = File.filename(
      this.transferMethod,
      this.customerNumber,
      this.date
    );
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
