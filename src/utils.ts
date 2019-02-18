export const dateStr = (d: Date) =>
  ("" + d.getUTCFullYear()).slice(2) +
  ("0" + (d.getUTCMonth() + 1)).slice(-2) +
  ("0" + d.getUTCDate()).slice(-2);

export const timeStr = (d: Date) =>
  ("0" + d.getUTCHours()).slice(-2) +
  ("0" + d.getUTCMinutes()).slice(-2) +
  ("0" + d.getUTCSeconds()).slice(-2);

export const bankgiroNumber = (accountNumber: string): number => {
  if (/^([0-9])?[0-9]{3}(-)?[0-9]{4}$/.test(accountNumber)) {
    if (verifyChecksum(accountNumber)) {
      return parseInt(accountNumber.replace("-", ""), 10);
    } else {
      throw new Error(`Invalid checksum (${accountNumber})`);
    }
  } else {
    throw new Error(`Invalid Bankgiro number (${accountNumber})`);
  }
};

const verifyChecksum = (str: string) => {
  const digits = str
    .replace(/\D/g, "")
    .split("")
    .reverse()
    .slice(0, 10);
  const sum = digits
    .map(n => Number(n))
    .reduce((previous, current, index) => {
      if (index % 2) {
        current *= 2;
      }
      if (current > 9) {
        current -= 9;
      }
      return previous + current;
    });
  return 0 === sum % 10;
};
