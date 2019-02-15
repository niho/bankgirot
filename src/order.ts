import { Payment } from "./payment";
import * as posts from "./posts";

export interface IInfo {
  readonly text: string;
  readonly endDate?: Date;
}

export interface IHeaders {
  readonly specHeader: string;
  readonly amountHeader: string;
}

export class Order {
  public readonly bankgiroNr: string;
  public readonly payments: Payment[];
  public readonly date: Date;
  public readonly paymentDate?: Date;
  public readonly info?: IInfo;
  public readonly headers?: IHeaders;

  constructor(
    bankgiroNr: string,
    payments: Payment[],
    paymentDate?: Date,
    info?: IInfo,
    headers?: IHeaders
  ) {
    if (payments.length === 0) {
      throw new Error("Empty orders with no payments is not allowed.");
    }
    this.bankgiroNr = bankgiroNr;
    this.payments = payments;
    this.date = new Date();
    this.paymentDate = paymentDate;
    this.info = info;
    this.headers = headers;
  }

  public toPosts() {
    return this.payments.length === 0
      ? []
      : [
          posts.opening(this.bankgiroNr, this.date, this.paymentDate),
          this.info
            ? posts.fixedInformation(this.info.text, this.info.endDate)
            : "",
          this.headers
            ? posts.headings(this.headers.specHeader, this.headers.amountHeader)
            : ""
        ]
          .filter(post => (post === "" ? false : true))
          .concat(this.payments.map(payment => payment.toPosts()))
          .concat([
            posts.summary(
              this.bankgiroNr,
              this.payments.length,
              this.payments.reduce((acc, payment) => acc + payment.amount, 0)
            )
          ]);
  }
}
