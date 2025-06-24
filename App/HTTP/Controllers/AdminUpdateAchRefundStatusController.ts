import { injectable } from 'inversify';
import UpdateAchRefundStatusUseCase from '@application/UpdateAchRefundStatus/UpdateAchRefundStatusUseCase';
import UpdateRefundStatusDTO from '@application/Refunds/UpdateRefundsStatusDTO';

@injectable()
class AdminUpdateAchRefundStatusController {
  constructor(
    private updateAchRefundStatusUseCase: UpdateAchRefundStatusUseCase,
  ) { }

  UpdateAchRefundStatus = async (httpRequest) => {
    const { adminUser } = httpRequest
    const input = new UpdateRefundStatusDTO(httpRequest.file, adminUser.email)
    await this.updateAchRefundStatusUseCase.execute(input);

    return {
      body: {
        status: 'success',
        message: 'ACH refunds status updated!',
      },
    };
  };

  getAchRefundStatusUpdateHistory = async () => {
    const data = await this.updateAchRefundStatusUseCase.getACHRefundStatusUpdateHistory();

    return {
      body: {
        status: "success",
        data: data
      }
    }
  }
}

export default AdminUpdateAchRefundStatusController;
