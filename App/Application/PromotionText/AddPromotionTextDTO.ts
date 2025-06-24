import PromotionText from "@domain/Core/PromotionText/PromotionText";
import { PromotionTextConfig } from "@domain/Types/PromotionText";

class AddPromotionTextDTO {
  private readonly promotionText: PromotionText;
  private readonly email: string;

  constructor(email: string, configuration: PromotionTextConfig) {
    this.promotionText = PromotionText.createFromDetail(
      configuration,
    );
    this.email = email;
  }

  getEmail() {
    return this.email;
  }

  getPromotionText() {
    return this.promotionText;
  }
}

export default AddPromotionTextDTO;
