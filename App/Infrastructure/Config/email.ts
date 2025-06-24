import * as dotenv from 'dotenv';

dotenv.config();
export default {
    mailGun: {
        transportName: 'mailgun',
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    },
    emailVerificationLinkExpiration: 3 * 24 * 60 * 60, //72hours
    GOOGLE_TRANSPORT: 'Gmail',
    GOOGLE_EMAIL: process.env.GOOGLE_EMAIL,
    GOOGLE_PASSWORD: process.env.GOOGLE_PASSWORD,
    HONEYCOMB_EMAIL: process.env.HONEYCOMB_EMAIL,
    FORGOT_PASSWORD_URL: `${process.env.SERVER_URL}/api/v1/resetPassword?token={token}`,
    SET_NEW_PASSWORD_URL: `${process.env.FRONT_END_URL}`,
    VERIFY_TOKEN_URL: `${process.env.SERVER_URL}/api/v1/users/verifyPasswordToken`,
    UPDATE_PASSWORD_URL: `${process.env.SERVER_URL}/api/v1/users/resetPassword`,
    EMAIL_VERIFICATION_URL: `${process.env.SERVER_URL}/api/v1/users/verify/email`,
    RECONFIRM_OFFERING_CHANGE_URL: `${process.env.SERVER_URL}/api/v1/offerings/:campaignOfferingChangeId/reconfirm`,
    MIVENTURE_SUPPORT_EMAIL: process.env.MIVENTURE_SUPPORT_EMAIL || 'support@honeycombcredit.com',
    EDUCATIONAL_MATERIAL_LINK: 'https://www.honeycombcredit.com/education-materials',
    MAIL_FROM: process.env.MAIL_FROM,
    MAIL_TO: process.env.MAIL_TO,
    MAIL_TO_BCC: 'customercommunications@honeycombcredit.com',
    HONEYCOMB_HELLO_EMAIL: process.env.HONEYCOMB_HELLO_EMAIL,
    PLACEHOLDERS: [
        '{@FIRST_NAME}',
        '{@AMOUNT}',
        '{@CAMPAIGN_NAME}',
        '{@DATE}',
        '{@INVESTOR_BANK_ACCOUNT_NAME}',
        '{@ISSUER_BANK_ACCOUNT_NAME}',
        '{@ISSUER_NAME}',
        '{@BANK_ACCOUNT_NAME}',
        '{@TWO_DAYS_BEFORE_CAMPAIGN_CLOSE_DATE}',
    ],
    NORTH_CAPITAL_EMAIL: process.env.NORTH_CAPITAL_EMAIL
};
