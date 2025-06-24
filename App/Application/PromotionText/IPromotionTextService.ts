import AddPromotionTextDTO from "@application/PromotionText/AddPromotionTextDTO";
import PromotionText from "@domain/Core/PromotionText/PromotionText";
export const IPromotionTextServiceId = Symbol.for('IPromotionTextService'); 


export interface IPromotionTextService {
  addPromotionText(addPromtionTextDTO: AddPromotionTextDTO): Promise<boolean>;
  fetchLatestPromotionText(): Promise<PromotionText | null>;
}