import CreateLoanwellDTO from '@application/Loanwell/CreateLoanwellDTO';
import FetchLoanwellDTO from '@application/Loanwell/FetchLoanwellDTO';
import {
  ILoanwellSerivce,
  ILoanwellSerivceId,
} from '@application/Loanwell/ILoanwellService';
import ImportApiLoanwellDataDTO from '@application/Loanwell/ImportApiLoanwellDataDTO';
import { inject, injectable } from 'inversify';

@injectable()
class LoanwellController {
  constructor(@inject(ILoanwellSerivceId) private loanwellService: ILoanwellSerivce) { }

  addLoanwellImport = async (httpRequest) => {
    const input = new CreateLoanwellDTO(httpRequest.files, httpRequest.adminUser.name);
    await this.loanwellService.addLoanwellImport(input);
    return {
      body: {
        status: 'success',
        message: 'Loanwell Data will be imported shortly!',
      },
    };
  };

  importLoanwellData = async (httpRequest) => {
    const { campaignName } = httpRequest.body;
    const input = new ImportApiLoanwellDataDTO(campaignName);
    const logs = await this.loanwellService.importApiLoanwellData(input);

    return {
      body: {
        status: 'success',
        message: logs,
      },
    };
  };

  fetchLoanwellBusinessNames = async (httpRequest) => {
    const filterImported = httpRequest.query.filterImported;
    const result = await this.loanwellService.fetchLoanwellBusinessNames(filterImported);
    return {
      body: result,
    };
  };

  fetchLoanwellData = async (httpRequest) => {
    const { page, perPage } = httpRequest.query;
    const input = new FetchLoanwellDTO(page, perPage);
    const result = await this.loanwellService.fetchLoanwellData(input);
    return {
      body: result,
    };
  };
}

export default LoanwellController;
