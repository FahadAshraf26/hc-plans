import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import { PromotionTextConfig } from '@domain/Types/PromotionText';

class PromotionText extends BaseEntity {
  promotionTextId: string;
  private configuration: PromotionTextConfig;

  constructor({ promotionTextId, configuration }) {
    super();
    this.promotionTextId = promotionTextId;
    this.configuration = configuration;
  }

  static createFromObj(obj) {
    const promotionText = new PromotionText({
      promotionTextId: obj.promotionTextId,
      configuration: obj.configuration
    });
    if (obj.created_at) {
      promotionText.setCreatedAt(obj.created_at);
    }
    if (obj.updated_at) {
      promotionText.setUpdatedAt(obj.updated_at);
    }
    if (obj.deletedAt) {
      promotionText.setDeletedAT(obj.deletedAt);
    }
    return promotionText;
  }

  static createFromDetail(configuration) {
    return new PromotionText({
      promotionTextId: uuid(),
      configuration,
    });
  }

  toJSON() {
    return {
      promotionTextId: this.promotionTextId,
      configuration: this.configuration,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    };
  }
}

export default PromotionText; 