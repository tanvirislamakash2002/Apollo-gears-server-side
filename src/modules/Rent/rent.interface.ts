export type CreateRentPayload = {
  startingPoint: string;
  destination: string;
  carId: string;
};

export type UpdateRentPayload = {
  rentStatus?: 'PENDING' | 'ONGOING' | 'COMPLETED';
};
