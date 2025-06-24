type LoanwellTags = {
  'Woman-owned': string;
  'Male-Female co-owned business': string;
  'Non-binary-owned business': string;
  'Veteran-owned business': string;
  'Immigrant-owned business': string;
  'Family-owned business': string;
  'LGBTQIA-owned business': string;
};

const LOANWELL_TAGS_PROD: LoanwellTags = {
  'Woman-owned': 'f95cac54-4065-4027-815a-4e063818e872',
  'Male-Female co-owned business': '35c48089-156e-40c8-ad08-cc32f002faef',
  'Non-binary-owned business': '94aaba72-338b-4c22-9503-ae2196a394a5',
  'Veteran-owned business': '92deb7da-d04e-4081-8c11-b1c76dee827b',
  'Immigrant-owned business': '05bfa72f-be1d-4d61-9835-3e61891e3a4e',
  'Family-owned business': 'e985fc9c-301c-43af-89f9-f7b7599f89b5',
  'LGBTQIA-owned business': '0d74ff70-4d6f-4d63-b65a-f0baface9c53',
} as const;

const LOANWELL_TAGS_STAGING: LoanwellTags = {
  'Woman-owned': 'f6bd9159-0e39-4927-ab04-da23d37ecef4',
  'Male-Female co-owned business': 'dd54cf00-ccb2-44c8-b337-abf1988131c4',
  'Non-binary-owned business': 'a32aae38-2f32-4ef4-85db-d89eda8d2a43',
  'Veteran-owned business': '01f7443c-9e16-42f8-ad5b-69b85738fe3c',
  'Immigrant-owned business': '01f7443c-9e16-42f8-ad5b-69b85738abcd',
  'Family-owned business': '0ad07870-fc94-4ccf-bd61-7356bdfa65d3',
  'LGBTQIA-owned business': '0ad07870-fc94-4ccf-bd61-7356bdfa0147',
} as const;

const ENVIRONMENT = process.env.NODE_ENV;

export const LOANWELL_TAGS =
  ENVIRONMENT === 'production' ? LOANWELL_TAGS_PROD : LOANWELL_TAGS_STAGING;
