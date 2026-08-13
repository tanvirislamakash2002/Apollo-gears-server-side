export type CreateCarPayload = {
  name: string;
  brand: string;
  model: string;
  image?: string;
  fuelType: 'OCTANE' | 'HYBRID' | 'ELECTRIC' | 'DIESEL' | 'PETROL';
  passengerCapacity: number;
  color: string;
  condition: 'NEW' | 'USED';
  rating?: number;
};

export type UpdateCarPayload = Partial<CreateCarPayload>;
