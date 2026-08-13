export type CreateBidPayload = {
  rentId: string;
  bidAmount: number;
  driverLocation: string;
};

export type UpdateBidStatusPayload = {
  bidStatus: 'ACCEPTED' | 'REJECTED';
};
