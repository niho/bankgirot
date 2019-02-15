import * as posts from "./posts";

export class Payment {
  public readonly bankgiroNr: string;
  public readonly ocrRef: string;
  public readonly amount: number;
  public readonly paymentDate?: Date;
  public readonly infoText?: string;

  constructor(
    bankgiroNr: string,
    ocrRef: string,
    amount: number,
    paymentDate?: Date,
    infoText?: string
  ) {
    this.bankgiroNr = bankgiroNr;
    this.ocrRef = ocrRef;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.infoText = infoText;
  }

  public toPosts() {
    return posts.payment(
      this.bankgiroNr,
      this.ocrRef,
      this.amount,
      this.paymentDate,
      this.infoText
    );
  }
}
