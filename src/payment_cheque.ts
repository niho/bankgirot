import { Payment } from "./payment";
import * as posts from "./posts";

interface IAddress {
  street: string;
  postalCode: string;
  city: string;
}

export type Address = IAddress;

export class PaymentCheque extends Payment {
  public readonly name: string;
  public readonly address: Address;

  constructor(
    id: number,
    name: string,
    address: Address,
    ocrRef: string,
    amount: number,
    paymentDate?: Date,
    message?: string,
    infoToSender?: string
  ) {
    super(id, ocrRef, amount, paymentDate, infoToSender, message);
    this.name = name;
    this.address = address;
  }

  public toPosts() {
    return [
      posts.name(this.id, this.name),
      posts.address(
        this.id,
        this.address.street,
        this.address.postalCode,
        this.address.city
      ),
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
