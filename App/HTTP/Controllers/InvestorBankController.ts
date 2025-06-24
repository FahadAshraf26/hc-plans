import AddInvestorBankDTOFactory from '@application/InvestorBank/addInvestorPaymentOption/AddInvestorBankDTOFactory';
import GetInvestorBanksDTO from '@application/InvestorBank/GeInvestorPaymentOptions/GetInvestorPaymentOptionsDTO';
import PaymentOptionsMap from '@domain/InvestorPaymentOptions/Mappers/PaymentOptionsMap';
import DeleteInvestorPaymentOptionDTO from '@application/InvestorBank/deleteInvestorPaymentOption/DeleteInvestorPaymentPaymentDTO';
import { inject, injectable } from 'inversify';
import {
  IAddInvestorBankUseCaseId,
  IAddInvestorBankUseCase,
} from '@application/InvestorBank/addInvestorPaymentOption/IAddInvestorBankUseCase';
import {
  IDeleteInvestorPaymentOptionUseCase,
  IDeleteInvestorPaymentOptionUseCaseId,
} from '@application/InvestorBank/deleteInvestorPaymentOption/IDeleteInvestorPaymentOptionUseCase';
import {
  IGetInvestorPaymentOptionsUseCaseId,
  IGetInvestorPaymentOptionsUseCase,
} from '@application/InvestorBank/GeInvestorPaymentOptions/IGetInvestorPaymentOptionsUseCase';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class InvestorBankController {
  constructor(
    @inject(IAddInvestorBankUseCaseId)
    private addInvestorBankUseCase: IAddInvestorBankUseCase,
    @inject(IDeleteInvestorPaymentOptionUseCaseId)
    private deleteInvestorBankUseCase: IDeleteInvestorPaymentOptionUseCase,
    @inject(IGetInvestorPaymentOptionsUseCaseId)
    private getInvestorPaymentOptionsUseCase: IGetInvestorPaymentOptionsUseCase,
  ) {}

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  addBank = async (httpRequest) => {
    const input = AddInvestorBankDTOFactory.createDTO(httpRequest);
    await this.addInvestorBankUseCase.execute(input);

    return {
      body: {
        status: 'success',
        message: 'account added successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getBanks = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;

    const input = new GetInvestorBanksDTO(userId, page, perPage, showTrashed);
    const result = await this.getInvestorPaymentOptionsUseCase.execute(input);

    result.data = result.data.map((item) => PaymentOptionsMap.toDTO(item));

    return { body: result };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeBank = async (httpRequest) => {
    const { investorBankId: investorPaymentOptionId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;
    const { investorId } = httpRequest.decoded;
    const { ip } = httpRequest.body;
    const clientIp = ip || httpRequest.clientIp;

    const dto = DeleteInvestorPaymentOptionDTO.create({
      investorPaymentOptionId,
      investorId,
      hardDelete: hardDelete || 'false',
      ip: clientIp,
    });

    await this.deleteInvestorBankUseCase.execute(dto);

    return {
      body: {
        status: 'success',
        message: 'investor bank deleted successfully',
      },
    };
  };
}

export default InvestorBankController;
