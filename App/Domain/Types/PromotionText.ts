export type PromotionPage = 'campaign_page' | 'confirmation_page' | 'select_payment_amount' | 'select_payment_option';

export interface PagePromotionConfig {
  text: string;
  is_active: number;
}

export interface PromotionTextConfig {
  campaign_page: PagePromotionConfig;
  confirmation_page: PagePromotionConfig;
  select_payment_amount: PagePromotionConfig;
  select_payment_option: PagePromotionConfig;
} 