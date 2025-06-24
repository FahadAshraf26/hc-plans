class AddStripeCardDTO {
  paymentMethodId: string;
  lastFour: string;
  brand: string;
  userId: string;
  nameOnCard: string

  constructor({
    paymentMethodId,
    lastFour,
    brand,
    userId,
    nameOnCard
  }: {
    paymentMethodId: string;
    lastFour: string;
    brand: string;
    userId: string;
    nameOnCard: string
  }) {
    this.paymentMethodId = paymentMethodId;
    this.lastFour = lastFour;
    this.brand = brand;
    this.userId = userId;
    this.nameOnCard = nameOnCard
  }
}

export default AddStripeCardDTO;
