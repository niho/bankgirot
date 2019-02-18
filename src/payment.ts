import * as posts from "./posts";
import { bankgiroNumber } from "./utils";

export class Payment {
  public readonly id: number;
  public readonly ocrRef: string;
  public readonly amount: number;
  public readonly paymentDate?: Date;
  public readonly infoToSender?: string;
  public readonly message?: string;

  constructor(
    accountNr: string | number,
    ocrRef: string,
    amount: number,
    paymentDate?: Date,
    infoToSender?: string,
    message?: string
  ) {
    this.id =
      typeof accountNr === "string" ? bankgiroNumber(accountNr) : accountNr;
    this.ocrRef = ocrRef;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.infoToSender = infoToSender;
    this.message = message;
  }

  public toPosts() {
    return [
      posts.payment(
        this.id,
        this.ocrRef,
        this.amount,
        this.paymentDate,
        this.infoToSender
      )
    ].concat(this.message ? posts.information(this.id, this.message) : []);
  }
}
