import GetLinkedCreditCardDTO from "./GetLinkedCreditCardDTO";
import LinkCreditCardDTO from "./LinkCreditCardDTO";

export const ILinkCreditCardServiceId = Symbol.for('ILinkCreditCardService');
export interface ILinkCreditCardService {
  linkCreditCard(linkCreditCardDTO: LinkCreditCardDTO): Promise<any>;
  getLinkedCreditCard(getLinkedCreditCardDTO: GetLinkedCreditCardDTO): Promise<boolean>;
}