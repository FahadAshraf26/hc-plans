import { injectable } from 'inversify';
import config from '../../Config';
import { ISlackService } from './ISlackService';
import { WebClient } from '@slack/web-api';
import server from '@infrastructure/Config/server';
const { slackConfig } = config;
import fs from 'fs';
import logger from '@infrastructure/Logger/logger';

type publishMessage = {
  message?: string;
  slackChannelId?;
  url?: string | boolean;
  btnText?: string;
  attachments?: any;
};

type messageReq = {
  channel: string;
  text: string;
  attachments?: any;
};

@injectable()
class SlackService implements ISlackService {
  private client: WebClient;
  constructor() {
    this.client = new WebClient(slackConfig.SLACK_TOKEN);
  }

  async getChannelsList() {
    try {
      const res = await this.client.conversations.list();

      return res;
    } catch (err) {
      throw err;
    }
  }

  async publishMessage({
    message,
    slackChannelId,
    url = false,
    btnText = 'View on North Capital',
    attachments,
  }: publishMessage) {
    try {
      let req: messageReq = {
        channel: server.IS_PRODUCTION ? slackChannelId : slackConfig.DEVELOPMENT.ID,
        text: message,
      };
      if (attachments) {
        req.attachments = [attachments];
      }
      if (url) {
        req.attachments = [
          {
            fallback: 'Test link button to https://slack.com/',
            actions: [
              {
                type: 'button',
                name: 'nc_link',
                text: btnText,
                url: url,
                style: 'primary',
              },
            ],
          },
        ];
      }
      
      return this.client.chat.postMessage(req);
    } catch (err) {
        logger.error('Failed to publish message to Slack:', {
        error: err,
        channel: slackChannelId,
        message
      });
    }
  }
}

export default SlackService;
