import * as crypto from "crypto";
import * as posts from "./posts";

export enum HashType {
  NexusElectronicSeal = "SAK1",
  HMAC_SHA_256 = "HMAC"
}

export class Seal {
  private static normalize(
    chunk: string | Buffer | DataView,
    encoding: crypto.Utf8AsciiLatin1Encoding
  ) {
    return chunk
      .toString(encoding)
      .replace("\xC9", "\x40")
      .replace("\xC4", "\x5B")
      .replace("\xD6", "\x5C")
      .replace("\xC5", "\x5D")
      .replace("\xDC", "\x5E")
      .replace("\xE9", "\x60")
      .replace("\xE4", "\x7B")
      .replace("\xF6", "\x7C")
      .replace("\xE5", "\x7D")
      .replace("\xFC", "\x7E");
  }

  private readonly hashType: HashType;
  private readonly keyDate: Date;
  private readonly kvv: string;
  private readonly hmac: crypto.Hmac;

  constructor(hashType: HashType, keyDate: Date, key: string) {
    this.hashType = hashType;
    this.keyDate = keyDate;
    this.kvv = crypto
      .createHmac("sha256", key)
      .update("00000000")
      .digest("hex");
    this.hmac = crypto.createHmac("sha256", key);
  }

  public startPost() {
    return posts.sealStart(this.keyDate, this.hashType);
  }

  public endPost() {
    switch (this.hashType) {
      case HashType.NexusElectronicSeal:
        return posts.sealNexus(this.keyDate, "", "");

      case HashType.HMAC_SHA_256:
        const signature = this.hmac.digest("hex");
        return posts.sealHMAC(this.keyDate, this.kvv, signature);
    }
  }

  public update(
    chunk: string | Buffer | DataView,
    encoding: crypto.Utf8AsciiLatin1Encoding
  ) {
    this.hmac.update(Seal.normalize(chunk, encoding), encoding);
  }
}
