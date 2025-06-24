export const IRecaptchaServiceId = Symbol.for('IRecaptchaService');
export interface IRecaptchaService {
  createAssessment(token: string, platform: string, actionName: string): Promise<number>;
}
