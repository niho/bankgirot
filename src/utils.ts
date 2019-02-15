export const dateStr = (d: Date) =>
  ("" + d.getUTCFullYear()).slice(2) +
  ("0" + (d.getUTCMonth() + 1)).slice(-2) +
  ("0" + d.getUTCDate()).slice(-2);

export const timeStr = (d: Date) =>
  ("0" + d.getUTCHours()).slice(-2) +
  ("0" + d.getUTCMinutes()).slice(-2) +
  ("0" + d.getUTCSeconds()).slice(-2);

export const bankgiroNumber = (accountNumber: string): number =>
  parseInt(accountNumber.replace("-", "").slice(0, 10), 10);
