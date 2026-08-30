export const MIN_BID_INCREMENT = 1;

export function getMinimumBid(currentBid: number): number {
  return currentBid + MIN_BID_INCREMENT;
}

export function isValidBid(amount: number, currentBid: number): boolean {
  return amount >= getMinimumBid(currentBid);
}
