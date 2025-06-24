import { injectable } from 'inversify';
import { IAsanaService } from './IAsanaService';
import * as Asana from 'asana';
import Config from '@infrastructure/Config';
import logger from '@infrastructure/Logger/logger';
import PreAuthFormService from './CreatePreAuthForm';
import fs from 'fs';
import path from 'path';
const { asanaConfig } = Config;

@injectable()
class AsanaService implements IAsanaService {
  private client: any;
  private token: any;
  private tasksApiInstance: any;
  private attachmentsApiInstance: any;

  constructor(private preAuthFormService: PreAuthFormService) {
    this.client = Asana.ApiClient.instance;
    this.token = this.client.authentications['token'];
    this.token.accessToken = asanaConfig.ASANA_PERSONAL_ACCESS_TOKEN;
    this.tasksApiInstance = new Asana.TasksApi();
    this.attachmentsApiInstance = new Asana.AttachmentsApi();
  }

  async fetchAllTasks(projectId: string) {
    let opts = {
      project: projectId,
    };
    try {
      const result = await this.tasksApiInstance.getTasks(opts);
      return JSON.stringify(result.data, null, 2);
    } catch (error) {
      throw error;
    }
  }

  async fetchTaskByGid(taskGid: string) {
    return await this.tasksApiInstance.getTask(taskGid);
  }

  async createTaskForDwollaRefunds(
    amount: number,
    debitAuthorizationId: string,
    investorDetails: any,
  ) {
    let body = {
      data: {
        name: 'Dwolla Refunds',
        projects: asanaConfig.PROJECT_GID,
        custom_fields: {
          [asanaConfig.DESTINATION_GID]: asanaConfig.DWOLLA_OPTION_GID,
          [asanaConfig.REFUND_AMOUNT_GID]: amount,
          [asanaConfig.DEBIT_AUTHORIZATION_ID]: debitAuthorizationId,
          [asanaConfig.PRE_AUTH_FORM_ATTACHMENT_GID]:
            asanaConfig.PRE_AUTH_ATTACHMENT_OPTION_GID,
        },
      },
    };
    logger.debug(body);
    const task = await this.tasksApiInstance.createTask(body);
    const fileName = `preAuthForm_${new Date().toISOString().split('T')[0]}.pdf`;
    logger.info("About to call PreAuthService...")
    await this.preAuthFormService.createPreAuthForm(fileName, amount, investorDetails);
    
    logger.info("outside the preAuthForService.")
    await new Promise(resolve => setTimeout(resolve, 6000));

    const preAuthFormBuffer = fs.createReadStream(path.join(process.cwd(), 'static', `${fileName}`));
    let opts = {
      'resource_subtype': "asana",
      'file': preAuthFormBuffer,
      'parent': task.data.gid,
      'name': fileName,
      'connect_to_app': true,
    };
    await this.attachmentsApiInstance.createAttachmentForObject(opts);
    logger.debug("Task created with attachment in dwolla.");
    return { taskGid: task.data.gid };
  }
}


export default AsanaService;
