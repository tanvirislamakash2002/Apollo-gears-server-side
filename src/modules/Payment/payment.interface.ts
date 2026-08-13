export type CreatePaymentPayload = {
  rentId: string;
  amount: number;
  currency?: string;
};

export type PaymentStatusType = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
