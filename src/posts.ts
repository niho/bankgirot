import { sprintf } from "sprintf-js";
import { bankgiroNumber, dateStr } from "./utils";

enum TransactionCode {
  SealStart = 0,
  SealEnd = 99,
  Opening = 11,
  FixedInformation = 12,
  Headings = 12,
  Payment = 14,
  Debit = 15,
  Credit = 16,
  Credit2 = 17,
  Information = 25,
  Name = 26,
  Address = 27,
  Summary = 29,
  AccountNumber = 40,
  PlusgiroPayment = 54,
  PlusgiroInformation = 65
}

export enum HashType {
  NexusElectronicSeal = "SAK1",
  HMAC_SHA_256 = "HMAC"
}

export const sealStart = (
  keyDate: Date,
  hashType: HashType = HashType.HMAC_SHA_256
) =>
  sprintf(
    "%02d%-6s%-4s%-68s",
    TransactionCode.SealStart,
    dateStr(keyDate),
    hashType,
    ""
  );

export const sealNexus = (keyDate: Date, hash: string, sealInfo: string) =>
  sprintf(
    "%02d%-6s%-18s%-7s%-47s",
    TransactionCode.SealEnd,
    dateStr(keyDate),
    hash.slice(0, 18),
    sealInfo.slice(0, 7),
    ""
  );

export const sealHMAC = (keyDate: Date, kvv: string, hash: string) =>
  sprintf(
    "%02d%-6s%-32s%-32s        ",
    TransactionCode.SealEnd,
    dateStr(keyDate),
    kvv.slice(0, 32),
    hash.slice(0, 32)
  );

export const opening = (
  bankgiroNr: string,
  date: Date = new Date(),
  paymentDate?: Date
) =>
  sprintf(
    "%02d%010d%-6s%-22s%-6s             SEK                  ",
    TransactionCode.Opening,
    bankgiroNumber(bankgiroNr),
    dateStr(date),
    "LEVERANTÖRSBETALNINGAR",
    paymentDate
      ? paymentDate.getTime() > date.getTime()
        ? dateStr(paymentDate)
        : "GENAST"
      : ""
  );

export const fixedInformation = (infoText: string, endDate?: Date) =>
  sprintf(
    "%02d%-50s%-6s                      ",
    TransactionCode.FixedInformation,
    infoText.slice(0, 50),
    endDate ? dateStr(endDate) : ""
  );

export const headings = (specHeader: string, amountHeader: string) =>
  sprintf(
    "%02d%-25s%-12s                                         ",
    TransactionCode.Headings,
    specHeader.slice(0, 25),
    amountHeader.slice(0, 12)
  );

export const payment = (
  accountNr: number,
  ocrRef: string,
  amount: number,
  paymentDate?: Date,
  infoToSender?: string
) =>
  sprintf(
    "%02d%010d%-25s%012d%-6s     %-20s",
    TransactionCode.Payment,
    accountNr,
    ocrRef.slice(0, 25),
    amount * 100,
    paymentDate ? dateStr(paymentDate) : "GENAST",
    infoToSender ? infoToSender.slice(0, 20) : ""
  );

export const debit = (
  id: number,
  ocrRef: string,
  amount: number,
  debitDate?: Date,
  infoToSender?: string
) =>
  sprintf(
    "%02d%010d%-25s%012d%-6s     %-20s",
    TransactionCode.Debit,
    id,
    ocrRef.slice(0, 25),
    Math.abs(amount * 100),
    debitDate ? dateStr(debitDate) : "GENAST",
    infoToSender ? infoToSender.slice(0, 20) : ""
  );

export const credit = (
  id: number,
  ocrRef: string,
  amount: number,
  creditDate?: Date,
  infoToSender?: string
) =>
  sprintf(
    "%02d%010d%-25s%012d%-6s     %-20s",
    amount < 0 ? TransactionCode.Credit : TransactionCode.Credit2,
    id,
    ocrRef.slice(0, 25),
    Math.abs(amount * 100),
    creditDate ? dateStr(creditDate) : "GENAST",
    infoToSender ? infoToSender.slice(0, 20) : ""
  );

export const information = (id: number, infoText: string) =>
  sprintf(
    "%02d%010d%-50s                  ",
    TransactionCode.Information,
    id,
    infoText.slice(0, 50)
  );

export const name = (id: number, nameStr: string, extraText?: string) =>
  sprintf(
    "%02d0000%06d%-35s%-33s",
    TransactionCode.Name,
    id,
    nameStr.toUpperCase().slice(0, 35),
    extraText ? extraText.slice(0, 33) : ""
  );

export const address = (
  id: number,
  street: string,
  postalCode: string,
  city: string
) =>
  sprintf(
    "%02d0000%06d%-35s%05d%-20s        ",
    TransactionCode.Address,
    id,
    street.toUpperCase().slice(0, 35),
    parseInt(postalCode.replace(" ", "").slice(0, 5), 10),
    city.toUpperCase().slice(0, 20)
  );

export const accountNumber = (
  id: number,
  clearingNr: string,
  accountNr: string,
  message: string,
  payroll: boolean
) =>
  sprintf(
    "%02d0000%06d%04d%012d%-12s%-1s                                       ",
    TransactionCode.Address,
    id,
    parseInt(clearingNr.replace(" ", "").slice(0, 4), 10),
    parseInt(accountNr.replace(" ", "").slice(0, 12), 10),
    message.slice(0, 12),
    payroll ? "L" : " "
  );

export const summary = (
  bankgiroNr: string,
  paymentsCount: number,
  totalAmount: number
) =>
  sprintf(
    "%02d%010d%08d%012d%-1s                                               ",
    TransactionCode.Summary,
    bankgiroNumber(bankgiroNr),
    paymentsCount,
    totalAmount * 100,
    totalAmount < 0 ? "-" : ""
  );
