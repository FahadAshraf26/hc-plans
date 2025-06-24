import CustomMessageTemaplate from '../CustomMessageTemaplate';
import Config from '@infrastructure/Config';
const { server } = Config;
export default CustomMessageTemaplate.replace(
  '{@MESSAGE}',
  `<span style='min-width:50vw;display:block;'>Link Expired For security purposes, your email verification link has expired.<a href='${
    server.ENVIRONMENT === 'production'
      ? 'https://invest.honeycombcredit.com/login'
      : 'https://application.honeycombcredit.com/login'
  }'> Send me a new link.</a></span>`,
).replace('{@TITLE}', 'Oops');
