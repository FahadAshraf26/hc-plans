import CreateCapitalRequestDTO from './CreateCapitalRequestDTO';
import GetCapitalRequestDTO from './GetCapitalRequestDTO';
import { inject, injectable } from 'inversify';
import {
  ICapitalRequestRepository,
  ICapitalRequestRepositoryId,
} from '../../Domain/Core/CapitalRequest/ICapitalRequestRepository';
import HttpException from '../../Infrastructure/Errors/HttpException';
import mailService from '@infrastructure/Service/MailService';
import emailTemplates from '@domain/Utils/EmailTemplates';
import config from '@infrastructure/Config';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
const { SendHtmlEmail } = mailService;
const { capitalRequestTemplate } = emailTemplates;
const { emailConfig } = config;

@injectable()
class CapitalRequestService {
  constructor(
    @inject(ICapitalRequestRepositoryId)
    private capitalRequestRepository: ICapitalRequestRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
  ) {}

  async createCapitalRequest(createCapitalRequestDTO: CreateCapitalRequestDTO) {
    const user = await this.userRepository.fetchById(createCapitalRequestDTO.getUserId());

    if (!user) {
      throw new HttpException(400, 'no user exists with the given id');
    }

    const createResult = await this.capitalRequestRepository.add(
      createCapitalRequestDTO.getCapitalRequest(),
    );

    if (!createResult) {
      throw new HttpException(400, 'create capital request failed');
    }

    // send email
    const html = capitalRequestTemplate
      .replace('{@USERNAME}', user.firstName || user.email)
      .replace('{@EMAIL}', user.email)
      .replace(
        '{@BUSINESSNAME}',
        createCapitalRequestDTO.getCapitalRequest().businessName,
      )
      .replace(
        '{@BUSINESSNAME}',
        createCapitalRequestDTO.getCapitalRequest().businessName,
      )
      .replace('{@STATE}', createCapitalRequestDTO.getCapitalRequest().state)
      .replace('{@DESCRIPTION}', createCapitalRequestDTO.getCapitalRequest().description)
      .replace(
        '{@CAPITALREQUIRED}',
        createCapitalRequestDTO.getCapitalRequest().capitalRequired,
      )
      .replace(
        '{@CAPITALREASON}',
        createCapitalRequestDTO.getCapitalRequest().capitalReason,
      );

    await SendHtmlEmail(
      emailConfig.HONEYCOMB_EMAIL,
      'New Capital Request Received',
      html,
    );

    return createResult;
  }

  async getCapitalRequests(getCapitalRequestsDTO: GetCapitalRequestDTO) {
    const result = await this.capitalRequestRepository.fetchAll({
      paginationOptions: getCapitalRequestsDTO.getPaginationOptions(),
      showTrashed: getCapitalRequestsDTO.isShowTrashed(),
    });

    return result.getPaginatedData();
  }
}

export default CapitalRequestService;
