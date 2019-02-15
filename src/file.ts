import * as stream from "stream";
import { Order } from "./order";
import { dateStr, timeStr } from "./utils";

export enum TransferMethod {
  BankgiroLink = "IBGLK",
  FileTransfer = "ILBLB",
  BankgiroLinkTest = "IBGZK",
  FileTransferTest = "ILBZZ",
  Test = "IZZZZ"
}

export class File {
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
  public readonly orders: Order[];
  public readonly filename: string;

  constructor(
    customerNumber: string,
    orders: Order[],
    transferMethod: TransferMethod = TransferMethod.FileTransfer
  ) {
    if (orders.length === 0) {
      throw new Error("Empty files with no orders is not allowed.");
    }
    this.date = new Date();
    this.transferMethod = transferMethod;
    this.customerNumber = customerNumber;
    this.orders = orders;
    this.filename = File.filename(
      this.transferMethod,
      this.customerNumber,
      this.date
    );
  }

  public write(file: stream.Writable) {
    this.orders.forEach(order => {
      order.toPosts().forEach(post => {
        file.write(post, "latin1");
        file.write("\r\n", "latin1");
      });
    });
    file.end();
  }
}
