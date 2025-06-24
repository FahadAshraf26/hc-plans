import * as nodemailer from 'nodemailer';
import logger from '../Logger/logger';
import config from '../Config';
import MailGun from 'mailgun-js';
const { emailConfig, server } = config;
const email = emailConfig;

const decideTransport = () => {
  return server.IS_LOCAL
    ? nodemailer.createTransport({
        service: email.GOOGLE_TRANSPORT,
        auth: {
          user: email.GOOGLE_EMAIL,
          pass: email.GOOGLE_PASSWORD,
        },
      })
    : MailGun({
        apiKey: email.mailGun.apiKey,
        domain: email.mailGun.domain,
      });
};

type MailMessage = {
  to?: string | string[];
  from?: string;
  subject?: string;
  html?: string;
  cc?: string | string[];
  text?: string;
  bcc?: string | string[];
  attachment?: any;
  attachments?: any;
};

/**
 * @typedef {{filename: string,content: string | Buffer | any,contentType?:string}} Attachment
 * @param {!string} recipient
 * @param {!string} subject
 * @param {!string} html
 * @param {Attachment[]} attachments
 */
async function SendHtmlEmail(
  recipient?: string,
  subject?: string,
  html?: string,
  attachments?: any,
  isText: boolean = false,
  cc?: string | string[],
  text?: string,
  bcc?: string | string[],
  // {
  //   emailFrom,
  // } = { emailFrom: false },
  { emailFrom } = { emailFrom: '' },
) {
  try {
    const transport = decideTransport();
    const mailMessage: MailMessage = {
      to: recipient,
      from: `"Honeycomb Credit" <${email.MAIL_FROM}>`,
      subject,
      html,
    };

    if (emailFrom) {
      mailMessage.from = emailFrom;
    }

    if (cc) {
      mailMessage.cc = cc;
    } 

    if (isText) {
      delete mailMessage.html;
      mailMessage.text = html;
    }

    if (attachments && attachments.length > 0) {
      if (transport.sendMail) {
        mailMessage.attachments = attachments;
      } else {
        mailMessage.attachment = attachments.map((attachment) => {
          return new transport.Attachment({
            data: attachment.content,
            filename: attachment.filename,
          });
        });
      }
    }

    if (server.IS_LOCAL) {
      return transport.sendMail(mailMessage);
    }

    if (bcc) {
      mailMessage.bcc = [`${email.MAIL_TO_BCC},${bcc}`];
    } else {
      if (server.IS_PRODUCTION) {
        mailMessage.bcc = email.MAIL_TO_BCC;
      }
    }
    return transport.messages().send(mailMessage);
  } catch (error) {
    logger.error(error);
    throw new Error(`Email to ${recipient} failed!`);
  }
}

const getPlaceHolderName = (placeHolder) => {
  placeHolder = placeHolder.replace('{@', '');
  return placeHolder.replace('}', '');
};

const BakeEmail = (bakeEmailDTO, template) => {
  for (const placeHolder of email.PLACEHOLDERS) {
    if (template.indexOf(placeHolder) !== -1) {
      template = template.replace(
        placeHolder,
        bakeEmailDTO[getPlaceHolderName(placeHolder)],
      );
    }
  }

  return template;
};

export default { SendHtmlEmail, BakeEmail };
