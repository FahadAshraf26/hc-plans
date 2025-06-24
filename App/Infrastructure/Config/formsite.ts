import * as dotenv from 'dotenv';
dotenv.config();

export default {
  formSite: {
    accreditationForm: process.env.ACCREDITATION_FORM_URL,
  },
};
