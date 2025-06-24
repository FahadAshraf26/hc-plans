export const ISlackServiceId = Symbol.for('ISlackService');

export interface ISlackService {
  getChannelsList();
  publishMessage({
    message,
    slackChannelId,
    url,
    btnText,
    attachments,
  }: {
    message?: string;
    slackChannelId?: string;
    url?: string;
    btnText?: string;
    attachments?: any;
  });
}
