import User from '@domain/Core/User/User';
import AddBankAccountDTO from './AddBankAccountDTO';
import AddManualBankAccountDTO from './AddManualBankDTO';

export const IAddInvestorBankUseCaseId = Symbol.for('IAddInvestorBankUseCase');

export interface IAddInvestorBankUseCase {
  saveBankAccount(user: User, addInvestorBankDTO: AddBankAccountDTO): Promise<void>;
  getBankAccountInfoFromPlaid(addInvestorBankDTO: AddBankAccountDTO);
  deleteBankAccountIfAlreadyExists(dto, user): Promise<void>;
  execute(
    addInvestorBankDTO: AddBankAccountDTO | AddManualBankAccountDTO,
  ): Promise<boolean>;
}
