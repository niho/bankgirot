import { Payment } from "./payment";
import * as posts from "./posts";

export class PaymentDeposit extends Payment {
  public readonly clearingNumber: string;
  public readonly accountNumber: string;
  public readonly payroll: boolean;

  constructor(
    id: number,
    clearingNumber: string,
    accountNumber: string,
    ocrRef: string,
    amount: number,
    message: string,
    paymentDate?: Date,
    infoToSender?: string,
    payroll?: boolean
  ) {
    super(id, ocrRef, amount, paymentDate, infoToSender, message);
    this.clearingNumber = clearingNumber;
    this.accountNumber = accountNumber;
    this.payroll = payroll ? true : false;
  }

  public toPosts() {
    return [
      posts.accountNumber(
        this.id,
        this.clearingNumber,
        this.accountNumber,
        this.message ? this.message : "",
        this.payroll
      ),
      posts.payment(
        this.id,
        this.ocrRef,
        this.amount,
        this.paymentDate,
        this.infoToSender
      ),
      posts.credit(
        this.id,
        this.ocrRef,
        this.amount,
        this.paymentDate,
        this.infoToSender
      )
    ];
  }
}
