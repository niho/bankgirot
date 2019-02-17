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
  AccountNumberPayroll = 41,
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
  bankgiroNr: string,
  ocrRef: string,
  amount: number,
  paymentDate?: Date,
  infoText?: string
) =>
  sprintf(
    "%02d%010d%-25s%012d%-6s     %-20s",
    TransactionCode.Payment,
    bankgiroNumber(bankgiroNr),
    ocrRef,
    amount * 100,
    paymentDate ? dateStr(paymentDate) : "GENAST",
    infoText ? infoText : ""
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
