export default class PlaidIDVWebhookDTO {
  constructor(
    public readonly webhookType: string,
    public readonly webhookCode: string,
    public readonly verificationId: string,
    public readonly userId: string,
    public readonly requestOrigin: string,
    public readonly ip: string
  ) {}
} 