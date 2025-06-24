import ParseBoolean from '@infrastructure/Utils/ParseBoolean';

const PDFDocument = require('pdfkit');
const fs = require('fs');
const axios = require('axios');
const nodePath = require('path');
// const campaignObject = {
//   status: 'success',
//   data: {
//     domainEvents: [],
//     slug: 'Compostable-LA',
//     campaignId: 'c9e1c4d9-3319-4c16-a101-b0c7942fd076',
//     campaignName: 'Compostable LA ',
//     issuerId: '7404637b-45ba-4556-bc64-1259b24549ee',
//     campaignExpirationDate: '03-27-2022',
//     campaignStage: 'Fundraising',
//     campaignTargetAmount: 60000,
//     campaignMinimumAmount: 40000,
//     investmentType: 'Debt',
//     overSubscriptionAccepted: null,
//     typeOfSecurityOffered: 'Reg CF',
//     useOfProceeds: 'Temp',
//     salesLead: null,
//     summary:
//       '<p>Surprisingly, our subtle personal habits can have the largest ecological impacts</p>',
//     demoLink: 'https://www.youtube.com',
//     isLocked: null,
//     campaignStartDate: '2022-02-01',
//     campaignDuration: 55,
//     financialProjectionsDescription: 'temp',
//     howHoneycombIsCompensated:
//       'Honeycomb charges Lemonade a $250 posting fee and a 6.0 - 8.0% loan origination fee based on the total amount funded. Additionally, to cover expenses associated with each investment, Honeycomb charges a 2.85% investment fee capped at $37.25 per investor.',
//     campaignDocumentUrl: 'https://stackoverflow.com/',
//     earningProcess: 'temp',
//     interestedInvestors: [],
//     campaignMedia: [],
//     campaignFunds: [],
//     repaymentSchedule: 'Monthly',
//     collateral: 'All Business Assets',
//     annualInterestRate: 8,
//     maturityDate: '2024-10-11T07:57:29.000Z',
//     repaymentStartDate: '2021-10-28T07:57:34.000Z',
//     loanDuration: 4.5,
//     isChargeFee: true,
//     interestOnlyLoanDuration: null,
//     campaignEndTime: 'Invalid date',
//     campaigntimezone: null,
//     blanketLien: true,
//     equipmentLien: false,
//     issuer: {
//       domainevents: [],
//       issuerid: '7404637b-45ba-4556-bc64-1259b24549ee',
//       email: 'paintplayparty@gmail.com',
//       issuerName: 'Studio IPlay Inc',
//       previousName: null,
//       EIN: '833-26-2456',
//       businessType: 'Human Services',
//       legalEntityType: 'LLC',
//       physicalAddress: '21310 Coolidge Hwy ',
//       city: 'Venice',
//       state: 'CA',
//       zipCode: 48237,
//       phoneNumber: '(313) 801-4848',
//       website: null,
//       owners: [
//         {
//           domainevents: [],
//           ownerid: '1768ae1f-92a8-4ab2-bc9c-3cb8db34a0fc',
//           userid: 'e7642f05-35f4-4ee6-ae82-da3b469ba11a',
//           title: 'jhon',
//           subtitle: 'owner',
//           description: 'testing',
//           primaryowner: true,
//           beneficialowner: false,
//           issuers: [],
//           businessowner: null,
//           createdat: '2021-10-08t13:28:17.000z',
//           updatedat: '2021-10-30t14:39:28.000z',
//           user: {
//             domainevents: [],
//             userid: 'e7642f05-35f4-4ee6-ae82-da3b469ba11a',
//             firstname: 'john',
//             lastname: 'smith',
//             username: null,
//             email: 'fahad.ashraf+owner@carbonteq.com',
//             address: null,
//             apartment: null,
//             city: null,
//             state: null,
//             zipCode: null,
//             dob: null,
//             phoneNumber: null,
//             website: null,
//             prefix: '0',
//             isVerified: 'Pass',
//             detailSubmittedDate: '2021-10-08T13:28:17.000Z',
//             isEmailVerified: 'Verified',
//             optOutOfEmail: '2021-10-30T14:39:28.000Z',
//             shouldVerifySsn: true,
//             isSsnVerified: true,
//             country: null,
//             hasSsn: false,
//             isIntermediary: false,
//             facebook: null,
//             linkedIn: null,
//             instagram: null,
//             twitter: null,
//             portfolioVisited: null,
//             idVerifiedPrompt: null,
//             ncPartyId: 'P105743',
//             createdAt: '2021-10-08T13:28:17.000Z',
//             updatedAt: '2021-11-01T16:28:03.000Z',
//           },
//         },
//       ],
//       employees: [],
//       country: 'United States',
//       facebook: null,
//       linkedIn: null,
//       instagram: null,
//       twitter: null,
//       pinterest: null,
//       reddit: null,
//       ncIssuerId: '476519',
//       createdAt: '2020-06-26T10:40:00.000Z',
//       updatedAt: '2022-02-11T19:11:46.000Z',
//     },
//     ncOfferingId: '5762',
//     createdAt: '2021-09-22T14:06:15.000Z',
//     updatedAt: '2022-03-21T19:24:09.000Z',
//     applicationReviewResult: 'Fail',
//     noOfInvestorWithdrawn: 0,
//     campaignLikesCount: 1,
//     amountInvested: 33910,
//     investmentCount: 12,
//     numInvestors: 3,
//     numRefundRequested: 0,
//     businessUpdateCount: 0,
//     campaignQACount: 11,
//     regCFFunds: 1660,
//     regDFunds: 32250,
//     badActorScreeningResult: 'Pass',
//   },
// };
// const signature =
// 'https://storage.googleapis.com/honeycomb-public-uploads/uploads/signImage-1651056281998-905140520_tiny.png?GoogleAccessId=honeycomb-storage%40honeycomb-321717.iam.gserviceaccount.com&Expires=1651057193&Signature=W8Aw5UXQb1thHwMYi052bi%2FIANhvLoQWTxdxzaZLC3BeM7U%2FsGz1n4BBm80TSAvDR2sNGteNHfXhwwrENMyv1SCYzg96txXJuH85C0CToUg0Q%2BgtXHRge5eQ7e5VLKq4mPu5QM7QXLnL8xqWguUb%2Fa5GSdLCmbStlFP0ntg0fpn57tAAbwtefRk67Be36YpUrp18wFQUza7QGLADtABn6072v45dXO63MNj8RGWqCBS4p0F%2BGnIW4%2FKOhxPhVhESmpq48p8ckqMVOIucEnIzrC7hqN0CHIRQjb%2B08CROw2fhl8Ssa6qxABZuqrEeuIkhFDvN8iKkQ5OHcf%2FYuIltdw%3D%3D';
const fontPath = nodePath.resolve(__dirname, './fonts/investorSignature.ttf');
const NPAPdf = async (
  campaign,
  issuer,
  signaturePath,
  investedAmount,
  path,
  user,
  isEquity,
  isRevenueShare,
  isConvertibleNote,
) => {
  campaign.blanketLien = ParseBoolean(campaign.blanketLien);
  campaign.equipmentLien = ParseBoolean(campaign.equipmentLien);
  campaign.isPersonalGuarantyFilled = ParseBoolean(campaign.isPersonalGuarantyFilled);
  // campaign.blanketLien = blanketLien
  // campaign.blanketLien === 'true'
  //   ? true
  //   : campaign.blanketLien === 'false'
  //   ? false
  //   : campaign.blanketLien;
  // campaign.equipmentLien =equipmentLien
  // campaign.equipmentLien === 'true'
  //   ? true
  //   : campaign.equipmentLien === 'false'
  //   ? false
  //   : campaign.equipmentLien;
  // campaign.isPersonalGuarantyFilled =
  //   campaign.isPersonalGuarantyFilled === 'true'
  //     ? true
  //     : campaign.isPersonalGuarantyFilled === 'false'
  //     ? false
  //     : campaign.isPersonalGuarantyFilled;
  const doc = new PDFDocument({ size: 'letter', bufferPages: true });

  // CONDITIONS
  const defaultFontSize = 12;
  const gap = '        ';
  const category = 35;
  const subCategory = 70;
  const align = { left: 'left', center: 'center', right: 'right', justify: 'justify' };
  const underlineOnly = { underline: true };
  const notUnderline = { underline: false };
  const continuedOnly = { continued: true };
  const notContinued = { continued: false };
  const underlineAndContinued = { underline: true, continued: true };
  const ContinuedAndNotunderline = { underline: false, continued: true };

  doc.fontSize(defaultFontSize);

  const fetchImage = async (src, current = 0) => {
    try {
      const image = await axios.get(src, {
        responseType: 'arraybuffer',
      });
      return image.data;
    } catch (_) {
      current += 1;
      if (current < 3) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        return fetchImage(src);
      }
    }
  };
  const addFooter = (fontSize = 8, options = {}) => {
    doc
      .fontSize(fontSize)
      .text(
        'INTENDED FOR REVIEW BY POTENTIAL INVESTORS ON HONEYCOMB CREDIT ONLY. DO NOT COPY OR DISTRIBUTE',
        80,
        doc.page.height - 50,
        {
          lineBreak: false,
          align: align.center,
          ...options,
        },
      );
    doc.fontSize(defaultFontSize);
  };
  const addHeading = (heading, headingOptions) => {
    doc.fontSize(defaultFontSize).text(heading, {
      align: align.center,
      paragraphGap: 5,
      ...headingOptions,
    });
  };
  const addParagraph = (
    headingNumber = null,
    heading = null,
    paragraph = null,
    indent = category,
    paragraphGap,
    headingOptions = {},
    paragraphOptions = {},
  ) => {
    const paragraphToAdd = [];
    headingNumber
      ? paragraphToAdd.push([
          `${headingNumber}${gap}`,
          paragraphGap,
          ,
          { ...continuedOnly, indent },
        ])
      : null;
    heading
      ? paragraphToAdd.push([
          heading,
          paragraphGap,
          ,
          { ...underlineAndContinued, ...headingOptions },
        ])
      : null;
    paragraph
      ? paragraphToAdd.push([
          paragraph,
          paragraphGap,
          ,
          { ...notUnderline, align: align.justify, ...paragraphOptions },
        ])
      : null;
    paragraphToAdd.map((key) => addText(key[0], key[1], key[2], key[3]));
  };

  const addText = (text, bottomGap, align, other = {}, bold = false) => {
    return !bold
      ? doc.font('Helvetica').text(text, {
          align: align,
          paragraphGap: bottomGap,
          lineGap: 1.2,
          ...other,
        })
      : doc.font('Helvetica-Bold').text(text, {
          align: align,
          paragraphGap: bottomGap,
          ...other,
        });
  };
  const addLine = (xPosition = 72, yPosition = 0, isLast) => {
    const options = {};
    if (isLast) {
      options.paragraphGap = 20;
    }
    let y;
    let x;
    doc
      .fontSize(defaultFontSize)
      .text(
        '______________________________________________________________________',
        (x = xPosition),
        (y = yPosition),
        options,
      );
  };
  const addTable = (businessKeyMatrices) => {
    businessKeyMatrices.map((keyMatrix) => {
      let yPos = doc.y;
      let x;
      let y;
      doc
        .fontSize(10)
        .text(keyMatrix.title, (x = 72), (y = yPos))
        .text(keyMatrix.value, (x = 200), (y = yPos));
      addLine(72, yPos, keyMatrix.last);
    });
  };

  const issuerName = issuer !== null ? issuer.issuerName : ' ';
  const ownerName = `${issuer.owners[0].title}`;
  const investingAmount = investedAmount !== null ? `$${investedAmount}` : ' ';
  const investorName = user !== null ? user.firstName : ' ';
  const securityInterest =
    campaign.blanketLien && campaign.equipmentLien
      ? 'Blanket lien on assets & Purchase money lien in equipment to be purchased'
      : campaign.blanketLien && !campaign.equipmentLien
      ? 'Blanket lien on assets of the company'
      : campaign.equipmentLien && !campaign.blanketLien
      ? 'Purchase money lien in equipment to be purchased'
      : 'None';
  const personalGuaranty = campaign.isPersonalGuarantyFilled
    ? campaign.personalGuaranty
    : 'None';
  const loanDuration = Number(campaign.loanDuration || 0) * 12
  const interestRate =
    campaign.investmentType === 'Debt' ? campaign.annualInterestRate : 0.0;
  doc.pipe(fs.createWriteStream(`${path}`));
  // first page starts

  const firstPage = [
    ['NOTE PURCHASE AGREEMENT', 28, align.center],
    [`${issuerName}`, 18, align.center],
    ['as the issuer,', 18, align.center],
    ['AND', 30, align.center],
    [investorName, 2, align.center],
    ['_________________________', 4, align.center],
    ['as the Holder', 18, align.center],
    ['AND', 18, align.center],
    [
      'HONEYCOMB COLLATERAL LLC, solely in its capacity as Administrative Agent',
      18,
      align.center,
    ],
    [
      '______________________________________________________________________',
      50,
      align.center,
    ],
    ['NOTE PURCHASE AGREEMENT', 18, align.left],
    [
      `This NOTE PURCHASE AGREEMENT (including all exhibits and schedules hereto, as the same may be amended, modified and/or restated from time to time, this "Agreement"), by and among ${issuerName} (the "Issuer"), each person purchasing a promissory note referencing this Agreement (each a “Holder” and collectively the, "Holders"), and HONEYCOMB COLLATERAL LLC, solely in its capacity as Administrative Agent (the “Administrative Agent”).`,
      22,
      align.justify,
    ],
    ['W I T N E S S E T H:', 4, align.center],
    [
      'WHEREAS, the Issuer desires to sell certain of its promissory notes to the Holders, and the Holders desire to purchase such notes, to fund certain commercial aspects of the Issuer’s business as more particularly described herein(the "Purpose")',
      22,
      align.justify,
    ],
    [
      'WHEREAS, Holders wish to purchase such promissory notes of the Company pursuant to an offering exempt from registration under section 4(a)(6) of the Securities Act of 1933 (the “Title III Offering”), conducted on www.HoneycombCredit.com (the “Site”) maintained by Honeycomb Credit, Inc. (the “Portal”)',
      4,
      align.justify,
    ],
  ];
  firstPage.map((con) => addText(con[0], con[1], con[2], con[3]));
  addFooter();
  doc.addPage();

  const secondPagePart1 = [
    [
      'NOW, THEREFORE, in consideration of the mutual agreements, provisions and covenants contained herein, and intending to be legally bound, the parties hereto agree as follows:',
      18,
      align.justify,
    ],
    ['ARTICLE I', 4, align.center],
    ['DEFINITIONS', 18, align.center, underlineOnly],

    [`1.1${gap}`, , , { ...continuedOnly, indent: category }],
    ['Recitals', , , underlineAndContinued],
    [
      '. The Recitals are incorporated herein as if set forth at length.',
      18,
      ,
      notUnderline,
    ],

    [`1.2${gap}`, , , { ...continuedOnly, indent: category }],
    ['Defined Terms', , , underlineAndContinued],
    [
      `. Capitalized terms not otherwise defined in this Agreement have the meanings given to them in the Form C filed by the Issuer with the Securities and Exchange Commission and available on the Site, which we refer to as the “Disclosure Document.”   The Disclosure Document, together with this Agreement, the Notes, any security instruments (if applicable), and any other document or instrument executed in connection with any of the foregoing are collectively referred to as the “Loan Documents.”`,
      18,
      ,
      notUnderline,
    ],

    ['ARTICLE II', 4, align.center],
    ['NOTE PURCHASE TERMS', 25, align.center, underlineOnly],

    [`2.1${gap}`, , , { ...continuedOnly, indent: category }],
    ['Purchase of Notes.', , , { ...underlineOnly, ...notContinued }],
    [
      'The Issuer will issue and sell to certain of the Holders, and such Holders will purchase from the Issuer, promissory notes of the Borrower in substantially the form of ',
      ,
      ,
      ContinuedAndNotunderline,
    ],
    ['Schedule 2.1', , , underlineAndContinued],
    [` (each a "`, , , ContinuedAndNotunderline],
    [`Note`, , , continuedOnly, true],
    [`" and collectively, the "`, , , ContinuedAndNotunderline],
    [`Notes`, , , continuedOnly, true],
    [
      `) in the aggregate principal amount not to exceed $${campaign.campaignTargetAmount} (the "`,
      ,
      ,
      ContinuedAndNotunderline,
    ],
    [`Borrowing Limit`, , , continuedOnly, true],
    [
      `").  The date on which the Issuer will issue and sell the Notes and the Holder shall purchase the Note, shall be the "`,
      ,
      ,
      ContinuedAndNotunderline,
    ],
    [`Closing Date`, , , continuedOnly, true],
    [
      `. The Issuer may sell Notes pursuant to this Agreement for a duration consistent with the Disclosure Document.  Issuer shall keep a schedule of Notes purchased by each Holder, and the purchase price therefore.  Holder will not receive a paper document representing Holder’s Note.`,
      25,
      ,
      notContinued,
    ],

    [`2.2${gap}`, , , { ...continuedOnly, indent: category }],
    ['Payment Terms.', 18, , { ...underlineOnly, ...notContinued }],
    [`(a)${gap}`, , , { ...continuedOnly, indent: subCategory }],
    [`Repayment`, , , underlineAndContinued],
    [
      `.  Each Note shall be repaid by the Issuer under the terms and conditions set forth below with payments to Holders commencing on or before the last business day 45 days after the Offering Period has ended and continuing each month thereafter through the Maturity Date with interest payable as set forth in the chart below.`,
      ,
      ,
      { ...notUnderline, align: align.justify },
    ],
  ];

  secondPagePart1.map((con) => addText(con[0], con[1], con[2], con[3], con[4]));
  addFooter();

  doc.addPage();
  doc.text('______________________________________________________________________');
  addTable([
    {
      title: 'Issuer Name',
      value: `${issuerName}`,
    },
    {
      title: 'Doing Business As',
      value: `${campaign.campaignName}`,
    },
    {
      title: 'Offering Amount',
      value: `$${campaign.campaignMinimumAmount} – $${campaign.campaignTargetAmount}`,
    },
    {
      title: 'Security Type',
      value: 'Secured Loan',
    },
    {
      title: 'Interest Rate',
      value: `${interestRate}%`,
    },
    {
      title: 'Maturity',
      value: `${loanDuration} months`,
    },
    {
      title: 'Payments',
      value: 'Monthly, disbursed to investors quarterly',
    },
    {
      title: 'Security Interest',
      value: `${securityInterest}`,
    },
    {
      title: 'Personal Guaranty',
      value: `${personalGuaranty}`,
      last: true,
    },
  ]);
  let pageContent;
  const securityBlanketContent = `As security for repayment of the Note, the Issuer hereby grants to the Holders a blanket lien in the assets of the company (“Collateral”) described in the chart above to be evidenced by the appropriate security agreement, mortgage, or other security instrument(s) and included as a Loan Document contemplated by this Agreement.`;
  const securityPurchaseContent = `As security for repayment of the Note, the Issuer hereby grants to the Holders a purchase money security interest in and lien upon the collateral (“Collateral”) described in the chart above to be evidenced by the appropriate security agreement, mortgage, or other security instrument(s) and included as a Loan Document contemplated by this Agreement.`;
  if (campaign.blanketLien && campaign.equipmentLien) {
    addParagraph('(b)', 'Security', `. ${securityBlanketContent}`, subCategory, 2);
    addParagraph(null, null, `${securityPurchaseContent}`);
  } else {
    if (campaign.blanketLien) {
      addParagraph('(b)', 'Security', `. ${securityBlanketContent}`, subCategory, 10);
    }
    if (campaign.equipmentLien) {
      addParagraph('(b)', 'Security', `. ${securityPurchaseContent}`, subCategory, 10);
    }
  }
  pageContent = [
    [`2.3${gap}`, 1, , { ...continuedOnly, indent: category }],
    [`Payments`, , , underlineOnly],
    [`.`, , , notUnderline],
    [`(a)${gap}`, 1, , { ...continuedOnly, indent: subCategory }],
    [`ACH Deposit`, , , underlineAndContinued],
    [
      `. All payments of principal and interest on the Notes will be made in U.S. dollars as Automated Clearing House (ACH) deposits into an account designated (the “Designated Account”) by each Holder at the Site. Each Holder acknowledges and agrees that any payment made timely to the Designated Account shall be deemed delivered even if the payment is rejected, or otherwise unable to be transferred because the Holder’s Designated Account is no longer valid for any reason.  Whenever any payment is due on a day that is not a business day, such payment will be due on the next following business day.  Each payment will be applied first to any fees charges and expenses authorized under the Loan Documents, including the reasonable fees and expenses of the Administrative Agent, then to accrued but unpaid interest on the Notes, and then to the outstanding principal balances of the Notes.`,
      ,
      ,
      { ...notUnderline, align: align.justify },
    ],
  ];
  pageContent.map((con) => addText(con[0], con[1], con[2], con[3], con[4]));
  if (!campaign.blanketLien || !campaign.equipmentLien) {
    addParagraph(
      '(b)',
      'Non-ACH Payments Processing Fee',
      `. To the extent a Holder does not authorize the Issuer to make ACH distributions into its Designated Account, payments to such Holder will be made by check and mailed to such Holder at the address provided by Holder on the Site after deduction by the Issuer from each such check of a Fifty Dollar ($50) processing fee (the “Processing Fee”).  All Processing Fees shall be credited against the outstanding amounts due under such Holder’s Note.  In the event the monthly amount payable to such Holder is less than the Processing Fee, the balance of the Processing Fee shall accumulate and be payable out of the Issuer’s next payment installment to the Holder. In the event the total amount that outstanding under such Holder’s Note is less than the amount of the accumulated Processing Fee, the obligations due and owing to the Holder under its Note shall be deemed satisfied and paid in full.`,
      subCategory,
      1,
    );
  } else {
    addParagraph(
      '(b)',
      'Non-ACH Payments Processing Fee',
      `. To the extent a Holder does not authorize the Issuer to make ACH distributions into its Designated Account, payments to such Holder will be made by check and mailed to such Holder at the address provided by Holder on the Site after deduction by the Issuer from each such check of a Fifty Dollar ($50) processing fee (the “Processing Fee”).  All Processing Fees shall be credited against the outstanding amounts due under such Holder’s Note.  In the event the monthly amount payable to such Holder is less than the Processing Fee, the balance of the Processing Fee shall accumulate and be payable out of the Issuer’s next payment installment to the Holder. In the event the total amount that  `,
      subCategory,
      1,
    );
  }
  addFooter();
  pageContent = [];

  if (campaign.blanketLien && campaign.equipmentLien) {
    pageContent = [
      [
        `outstanding under such Holder’s Note is less than the amount of the accumulated Processing Fee, the obligations due and owing to the Holder under its Note shall be deemed satisfied and paid in full.`,
        15,
        ,
        { ...notUnderline, align: align.justify },
      ],
    ];
  }
  pageContent = [
    ...pageContent,
    [`2.4${gap}`, 15, , { ...continuedOnly, indent: category }],
    [`Equalization Among Holders.`, 15, , underlineOnly],
    [
      `Each Note is on parity with all Notes issued pursuant to this Agreement and rank equally, without preference among themselves.  Any amounts to be distributed pursuant to this Agreement and the Notes to the Holders shall be made pro rata in proportion to the amount then outstanding under each Holder’s respective Note.`,
      15,
      ,
      { ...notUnderline, align: align.justify },
    ],
    [`2.5${gap}`, 20, , { ...continuedOnly, indent: category }],
    [`Maximum Lawful Rate.`, , , underlineOnly],
    [
      `In no event shall Issuer be obligated to pay interest on the Note to the extent it exceeds the highest rate of interest that may be lawfully contracted for, charged or received by such Holder, and in such event the Issuer shall pay such Holder interest at the highest rate permitted by applicable law.`,
      15,
      ,
      { ...notUnderline, align: align.justify },
    ],
    [`2.6${gap}`, 20, , { ...continuedOnly, indent: category }],
    [
      `No Right to Cancel. Each Holder acknowledges and agrees that this is a commercial transaction and that the Holder has no right to cancel its subscription or rescind this Agreement. Once the Holder signs this Agreement, electronically or otherwise, the Holder is obligated to purchase the Note on the terms and conditions set forth in this Agreement and as described in the Disclosure Document, including, but not limited to, instances where the principal amount of the Note is reduced consistent with the Disclosure Document.`,
      15,
      ,
      { align: align.justify },
    ],
    [`2.7${gap}`, 20, , { ...continuedOnly, indent: category }],
    [
      ` Issuer’s Right to Reject Subscription. Each Holder acknowledges and agrees that Issuer has the right to reject the Holder’s subscription for any reason or for no reason by returning the money provided to the Issuer to the applicable Holder’s Designated Account whose subscription has been rejected.`,
      20,
      ,
      { ...notUnderline, align: align.justify },
    ],
    [`ARTICLE III`, 10, , { align: align.center }],
    [`REPRESENTATIONS AND WARRANTIES`, 15, , { ...underlineOnly, align: align.center }],
    [`3.1${gap}`, 10, , { ...continuedOnly, indent: category }],
    [`Issuer’s Representations and Warranties`, , , underlineAndContinued],
    [
      `.  The Issuer represents and warrants to each Holder that the following are, and immediately after giving effect to the transactions contemplated hereby will be, true, correct and complete:`,
      10,
      ,
      { ...notUnderline, align: align.justify },
    ],
    [`(a)${gap}`, 10, , { ...continuedOnly, indent: subCategory }],
    [`Power and Authorization`, , , underlineAndContinued],
    [
      `.  The Issuer has the power and authority and all authorizations, consents and approvals to execute, deliver, and perform its obligations under this Agreement and the Notes.`,
      10,
      ,
      { ...notUnderline, align: align.justify },
    ],
  ];

  doc.addPage();
  pageContent.map((con) => addText(con[0], con[1], con[2], con[3], con[4]));
  addFooter();

  /**
   * Start Page 5
   */
  pageContent = [];
  pageContent = [
    [`(b)${gap}`, 15, , { ...continuedOnly, indent: subCategory }],
    [`Binding Effect`, 15, , underlineAndContinued],
    [
      `.  This Agreement and the Notes constitute a legal, valid and binding obligations of the Issuer, enforceable against the Issuer in accordance with their respective terms, except as enforceability may be limited by applicable bankruptcy, insolvency, or similar laws affecting the enforcement of creditors' rights generally or by equitable principles relating to enforceability.`,
      15,
      ,
      { ...notUnderline, align: align.justify },
    ],
    [`3.2${gap}`, 10, , { ...continuedOnly, indent: category }],
    [`Holder’s Representations and Warranties`, 10, , underlineAndContinued],
    [
      `. Each Holder hereby severally, but not jointly, represents and warrants to the Issuer as follows as of the date hereof and as of the Closing Date:`,
      10,
      ,
      { ...notUnderline, align: align.justify },
    ],
    [`(a)${gap}`, 10, , { ...continuedOnly, indent: subCategory }],
    [`Accuracy of Information`, , , underlineAndContinued],
    [
      `. All of the information the Holder has given to the Issuer (whether in this Agreement, at the Site, or otherwise) is accurate and the Issuer and may rely on it.  If any of the information Holder has given to Issuer changes before the Issuer accepts Holder’s subscription, Holder will notify the Issuer immediately.  Holder agrees to indemnify and hold Issuer, and each of their respective directors, officers, employees and representative harmless for any damages, losses, or claims (including reasonable attorney fees and costs) incurred by Issuer that result from or arise out of inaccurate information provided by Holder.`,
      10,
      ,
      { ...notUnderline, align: align.justify },
    ],
  ];
  doc.addPage();
  pageContent.map((con) => addText(con[0], con[1], con[2], con[3], con[4]));
  addParagraph(
    `(b)`,
    `Risks`,
    `. Holder understands all the risks of investing, including the risk that Holder could lose its entire investment in the Issuer evidenced by the Note and this Agreement. Without limiting that statement, Holder acknowledges and agrees that it has reviewed and understands each of the risks listed under “Risk Factors” in the Disclosure Document.`,
    subCategory,
    10,
  );

  addParagraph(
    '(c)',
    'No Representations',
    `. No person (i) has made any promises or representations to Holder, except for the information contained in the Disclosure Document; or (ii) has guaranteed any financial outcome for Holder’s investment.`,
    subCategory,
    10,
  );

  addParagraph(
    '(d)',
    'Escrow Account',
    `. Each Holder understands that its money will be held in an escrow account in one or more banks prior to funding the loan to the Issuer for the stated Purpose. If any of these banks became insolvent, such money could be lost.`,
    subCategory,
    10,
  );

  addParagraph(
    '(e)',
    'Opportunity to Ask Questions',
    `. Each Holder has had the opportunity to ask questions about the Issuer and the investment, which questions have been answered to the Holder’s satisfaction.`,
    subCategory,
    10,
  );

  addParagraph(
    '(f)',
    'Legal Power to Sign and Invest',
    `. Holder has the legal power to sign this Agreement and purchase the Note. Holder’s investment does not violate any contract Holder has entered into with any other individual or entity.`,
    subCategory,
    10,
  );

  addParagraph(
    '(g)',
    'Acting On Holder’s Behalf',
    `. Each Holder acknowledges and agrees that it is acting on its own behalf in purchasing the Note, not on behalf of any other individual or entity.`,
    subCategory,
    10,
  );
  addFooter();
  /**
   * End Page 5
   */

  /**
   * Start Page 6
   * */
  doc.addPage();
  addParagraph(
    '(h)',
    'Investment Purpose',
    `. Holder is purchasing the Note solely as an investment, not with an intent to re-sell or “distribute” any part of the Note.`,
    subCategory,
    10,
  );

  addParagraph(
    '(i)',
    'Knowledge',
    ` Holder has enough knowledge, skill, and experience in business, financial, and investment matters to evaluate the merits and risks of the investment.`,
    subCategory,
    10,
  );

  addParagraph(
    '(j)',
    'Financial Forecasts',
    `. Holder understands that any financial forecasts or projections are based on estimates and assumptions the Issuer believes to be reasonable but are highly speculative. Given the industry, any forecasts or projections will probably prove to be incorrect.`,
    subCategory,
    10,
  );

  addParagraph(
    '(k)',
    'Financial Wherewithal',
    `. Holder can afford this investment, even if Holder loses the entirety of its investment. Holder does not rely on its cash or other property used in this investment to pay for any of Holder’s current living necessities, including but not limited to, Holder’s food, housing, and utilities.`,
    subCategory,
    10,
  );

  addParagraph(
    '(l)',
    'No Government Approval',
    `.  Holder understands that no state or federal authority has reviewed this Agreement or the Note or made any finding relating to the value or fairness of the investment.`,
    subCategory,
    10,
  );

  addParagraph(
    '(m)',
    'No Advice',
    `. Each Holder acknowledges and agrees that the Issuer has not provided the Holder with any investment, financial, or tax advice.  Each Holder has been advised to consult with its own legal and financial advisors and tax experts prior to entering into this Agreement.`,
    subCategory,
    10,
  );

  addParagraph(
    '(n)',
    'Tax Treatment',
    `. If any withholding tax is imposed on any payment made by Issuer to a Holder pursuant to a Note, such tax shall reduce the amount otherwise payable with respect to such payment. Upon request of Issuer, the Holder shall provide the Issuer with an Internal Revenue Service Form W-9 or other similar withholding certificate of a State, local or foreign governmental authority such that the Issuer may make payments under the Note without deduction for, or at a reduced rate of deduction for, any tax.  Any taxes owed on the payments to Holder shall be the responsibility of such Holder.`,
    subCategory,
    10,
  );

  addParagraph(
    '(o)',
    'Anti-Terrorism and Money Laundering (Natural Persons)',
    `. If Holder is a natural person (not an entity), such Holder represents and warrants as follows:`,
    subCategory,
    2,
  );

  addParagraph(
    `(i)`,
    `Source of Funds`,
    `. None of the money Holder has paid or will pay or contribute to the Issuer is derived from or related to any activity that is illegal under United States law.`,
    category + subCategory,
    2,
  );

  addParagraph(
    `(ii)`,
    `Anti-Terrorism Laws`,
    `. Holder is not on any list of “Specially Designated Nationals” or known or suspected terrorists that has been generated by the Office of Foreign Assets Control of the United States Department of Treasury (“OFAC”), nor a citizen or resident of any country that is subject to embargo or trade sanctions enforced by OFAC.`,
    category + subCategory,
    2,
  );

  addFooter();
  /**
   * End Page 6
   */

  /**
   * Start Page 7
   */
  doc.addPage();

  addParagraph(
    '(iii)',
    `Anti-Money Laundering Laws`,
    `.  Holder’s purchase of a Note will not, by itself, cause the Issuer to be in violation of any “anti-money laundering” laws, including, without limitation, the United States Bank Secrecy Act, the United States Money Laundering Control Act of 1986, and the United States International Money Laundering Abatement and Anti-Terrorist Financing Act of 2001.`,
    category + subCategory,
    2,
  );

  addParagraph(
    `(iv)`,
    `Additional Information`,
    `. Holder will provide such documentation as may be reasonably requested by the Issuer to verify further the source of funds used to purchase the Note.`,
    category + subCategory,
    10,
  );

  addParagraph(
    '(p)',
    'Entity Holders',
    `. Each Holder that is a legal entity, such as a corporation, partnership, or limited liability company, represents and warrants as follows:`,
    subCategory,
    2,
  );

  addParagraph(
    `(i)`,
    `Good Standing`,
    `. Holder is validly existing and in good standing under the laws of the jurisdiction where it was organized and has full corporate power and authority to conduct its business as presently conducted and as proposed to be conducted.`,
    category + subCategory,
    10,
  );
  addParagraph(
    `(ii)`,
    `Other Jurisdictions`,
    `. Holder is qualified to do business in every other jurisdiction where the failure to qualify would have a material adverse effect on Holder.`,
    category + subCategory,
    10,
  );
  addParagraph(
    `(iii)`,
    `Authorization`,
    `. The execution, delivery, and performance by Holder of this Agreement and any related Loan Documents have been duly authorized by all necessary corporate action.`,
    category + subCategory,
    10,
  );
  addParagraph(
    `(iv)`,
    `Investment Company`,
    `. Holder is not an “investment company” within the meaning of the Investment Company Act of 1940`,
    category + subCategory,
    10,
  );
  addParagraph(
    `(v)`,
    `Anti-Terrorism and Money Laundering`,
    `.`,
    category + subCategory,
    5,
  );
  addParagraph(
    `(A)`,
    `Source of Funds`,
    `. No funds used or contributed to the Issuer derives from or relates to any activity that is illegal under United States law.`,
    category * 2 + subCategory,
    2,
  );
  addParagraph(
    `(B)`,
    `Anti-Terrorism Laws`,
    `. None of the ultimate owners of Holder is on any list of “Specially Designated Nationals” or known or suspected terrorists that has been generated by OFAC, nor is a citizen or resident of any country that is subject to embargo or trade sanctions enforced by OFAC.`,
    category * 2 + subCategory,
    2,
  );
  addParagraph(
    `(C)`,
    `Notice of Violations`,
    `. If at any time the Issuer determines that any of the representations in contained in this subsection are untrue or inaccurate, or if otherwise required by applicable law or regulation related to terrorism, money laundering, and similar activities, the Issuer may undertake appropriate actions to ensure compliance with applicable law or regulation, including, but not limited to segregation or redemption of such Holder’s Note.`,
    category * 2 + subCategory,
    20,
  );
  addFooter();
  /**
   * End Page 7
   */
  /**
   * Start Page 8
   */
  doc.addPage();
  addHeading(`ARTICLE IV`, { paragraphGap: 10 });

  addHeading(`COVENANTS`, {
    ...underlineOnly,
  });
  addParagraph(
    `4.1`,
    `Issuer Covenants`,
    `.  Issuer covenants and agrees that, so long as any of the obligations evidenced by the Loan Documents remain unpaid or unsatisfied:`,
    category,
    10,
  );
  addParagraph(
    `(a)`,
    `Maintenance of Property`,
    `. Issuer shall maintain and preserve all its real and tangible property in good working order and condition, ordinary wear and tear and casualty excepted.`,
    subCategory,
    10,
  );
  addParagraph(
    `(b)`,
    `Insurance`,
    `. Issuer shall maintain or cause to be maintained in full force and effect all policies of insurance of any kind (including policies of fire, theft, public liability, property damage, other casualty insurance) with respect to the property of the Issuer, including any Collateral, with reputable insurance companies or associations of a nature and providing such coverage as is sufficient and as is customarily.`,
    subCategory,
    10,
  );
  addParagraph(
    `(c)`,
    `Use of Proceeds`,
    `. Issuer shall use the proceeds of the sale of the Notes solely for the Purposes stated herein and in the Disclosure Document.`,
    subCategory,
    10,
  );
  addParagraph(
    `4.2`,
    `Holder Covenants`,
    `. Each Holder covenants and agrees that, so long as any of the obligations evidenced by its Note remains unpaid or unsatisfied: `,
    category,
    5,
  );
  addParagraph(
    `(a)`,
    `Restrictions on Holders`,
    `. No Holder may, under any circumstances (i) take any individual action to collect a Note; or (ii) record, or try to record, a Note or any other instrument relating to a Note.`,
    subCategory,
    5,
  );
  addParagraph(
    `(b)`,
    `Disclosure`,
    `. Holder agrees that Issuer may release confidential information about Holder to government authorities if Issuer, in its sole discretion, determines after consultation with counsel that releasing such information is in the best interest of the Issuer in light of any applicable law or regulation.`,
    subCategory,
    5,
  );
  addParagraph(
    `(c)`,
    `Additional Documents`,
    `. Holder agrees to execute any additional documents the Issuer requests if the Issuer reasonably believe those documents are necessary or appropriate and explain that Holder is able to bear the economic risk of its investment in the Notes for an indefinite duration and is able to afford a complete loss of such investment.`,
    subCategory,
    5,
  );
  addParagraph(
    `(d)`,
    `No Transfer of Notes`,
    `. Holder may not transfer, pledge, encumber, or otherwise dispose of Holder’s interest in its Note at any time.  Any attempt to transfer, pledge, encumber or other dispose of Holder’s interest in its Note shall be void.`,
    subCategory,
    5,
  );
  addParagraph(
    `(e)`,
    `Re-Purchase of Holder’s Note`,
    `. If Issuer decide that Holder has provided inaccurate information or has otherwise violated its obligations, Issuer may (but shall not be required to) repurchase or rescind Holder’s Note.`,
    subCategory,
    5,
  );

  addFooter();
  /**
   * End Page 8
   */
  doc.addPage();
  addHeading(`ARTICLE V`, 10);
  addHeading(`ADMINISTRATIVE AGENT`, {
    ...underlineOnly,
  });
  addParagraph(
    `5.1`,
    `Appointment`,
    `. Each Holder hereby irrevocably designates, appoints and authorizes Honeycomb Collateral LLC to act as the initial Administrative Agent for such Holder under this Agreement and to execute and deliver or accept on behalf of each of the Holder any Loan Documents, including this Agreement, and any security agreement or mortgage or other document or instrument reasonably necessary to give effect to the transactions contemplated by this Agreement and the Disclosure Document.  Each Holder hereby irrevocably authorizes the Administrative Agent to take such action on its behalf under the provisions of this Agreement and the Loan Documents, and to exercise such powers and to perform such duties hereunder as are specifically delegated to or required of the Administrative Agent by the terms hereof, together with such powers as are reasonably incidental thereto.  Administrative Agent agrees to act as the Administrative Agent on behalf of the Holders to the extent provided in this Agreement.`,
    category,
    10,
  );
  addParagraph(`5.2`, `Nature of Duties`, `.`, category, 5, { ...underlineOnly });
  addParagraph(
    `(a)`,
    null,
    `The Administrative Agent shall have no duties or responsibilities except those expressly set forth in this Agreement and no implied covenants, functions, responsibilities, duties, obligations or liabilities shall be read into this Agreement or otherwise exist.  The duties of the Administrative Agent shall be mechanical and administrative in nature and shall not create any fiduciary or trust relationship in respect of any Holder.`,
    subCategory,
    10,
  );
  addParagraph(
    `(b)`,
    null,
    `The function and duty of the Administrative Agent shall be: (i) to execute any security agreement, mortgage or other Loan Document on behalf of the Holders providing for the grant of a security interest in favor of the Holders in property of the Issuer as contemplated in the Disclosure Document and in this Agreement; (ii) to enforce the rights and remedies of the Holders under any applicable Loan Document, including this Agreement, upon written direction from the Required Holders (as defined below) (an “Enforcement Proceeding”); and (iii) to hold proceeds collected by Administrative Agent following an Event of Default by the Issuer, including, but not limited to, from the sale of any Collateral, and to distribute such proceeds to the Holders in an amount consistent with the terms and conditions of this Agreement and the Holder’s respective Note; provided however, that in connection with this subsection (b)(iii), only, each Holder acknowledges and agrees that a successor Administrative Agent to Honeycomb Collateral LLC must be appointed pursuant to Section 5.7, below, and that in no event can Honeycomb Collateral LLC hold or distribute proceeds on behalf of the Holders.`,
    subCategory,
    10,
  );
  addFooter();
  /**
   * Start Page 9
   */
  doc.addPage();
  addParagraph(
    `(c)`,
    null,
    `In connection with any Enforcement Proceeding, the Administrative Agent shall have the power, on behalf of each Holder, to pursue such remedies as may be available by law and pursuant to this Agreement, for the purpose of maximizing the return to the Holders as a group, and to settle the claims of each Holder on such terms as the Administrative Agent may determine in its sole and unlimited discretion, subject to the other provisions of this Agreement. The Administrative Agent may pursue such remedies notwithstanding that the Administrative Agent does not have physical possession of the Notes and without naming the Holders as parties.`,
    subCategory,
    10,
  );
  addParagraph(
    `(d)`,
    null,
    `The Administrative Agent takes no responsibility and makes no statement regarding the validity, extent or enforceability of the Loan Documents or the lien priority or position that the Holders will have as a result of the Loan Documents.`,
    subCategory,
    10,
  );
  addParagraph(
    `5.3`,
    `Instructions from the Holders`,
    `. The Administrative Agent agrees, upon the written request of the Holders holding at least a majority of the then outstanding amount of the obligations evidenced by the Notes on an aggregate basis (the “Required Holders”), to take or refrain from taking any action of the type specified as being within the Administrative Agent's rights, powers or discretion herein, provided that the Administrative Agent shall not be required to take any action which exposes the Administrative Agent to personal liability or which is contrary to this Agreement, any loan agreements with third parties (if applicable), or any of the other Loan Documents or applicable Law.  Additionally, Administrative Agent shall have no obligation to comply with instructions from the Required Holders to initiate or continue an Enforcement Proceeding without sufficient funds being made available in advance to Administrative Agent to cover the Administrative Agent’s out-pocket-expenses, including, but not limited to, filing fees and costs, required to initiate or continue such Enforcement Proceeding.  Any action taken or failure to act pursuant to such instructions shall be binding on the Holders.  No Holder shall have any right of action whatsoever against the Administrative Agent as a result of the Administrative Agent acting or refraining from acting hereunder in accordance with the instructions of the Required Holders, or in the absence of such instructions, in the absolute discretion of the Administrative Agent.  Holders acknowledge and agree to electronic communications by and between the Holders and the Administrative Agent and any Holder’s failure to affirmatively instruct the Administrative Agent within the time prescribed by Administrative Agent shall be deemed as the Holder’s consent to the action or inaction taken by the Administrative Agent.`,
    category,
    20,
  );
  addParagraph(
    `5.4`,
    `Nonrecourse Liability`,
    `. The Administrative Agent shall not be liable to any Holder for any action taken or omitted to be taken by it or them hereunder, or in connection herewith including pursuant to this Agreement or any other Loan Document, unless caused by Administrative Agent’s own gross negligence or willful misconduct.`,
    category,
    5,
  );

  addFooter();
  /**
   * End Page 9
   */
  /**
   * Start Page 10
   */
  doc.addPage();
  addParagraph(
    `5.5`,
    `Reimbursement and Indemnification of Administrative Agent by Issuer`,
    `. Issuer agrees to reimburse, indemnify defend and save the Administrative Agent harmless from and against all liabilities, costs, expenses or disbursements, including attorneys' fees and disbursements, of any kind or nature whatsoever which may be imposed on, incurred by or asserted against the Administrative Agent, in its capacity as such, in any way relating to or arising out of this Agreement or any other Loan Document; provided that Issuer shall not be liable for any portion of such liabilities, costs, expenses or disbursements if the same results from the Administrative Agent's gross negligence or willful misconduct.`,
    category,
    20,
  );
  addParagraph(
    `5.6`,
    `Compensation`,
    `Administrative Agent shall be entitled to compensation and reimbursement of expenses as set forth below which amounts shall be the obligation of the Company and shall be added to the amounts otherwise payable under the Notes:`,
    category,
    20,
  );
  addParagraph(
    `(a)`,
    `Flat Fee`,
    `. As compensation to the Administrative Agent for the services provided by the Administrative Agent to the Holders in the execution and documentation of any Collateral securing the obligations evidenced by the Notes, Holders acknowledge and agree that Administrative Agent may be paid a flat fee.`,
    subCategory,
    20,
  );
  addParagraph(
    `(b)`,
    `Hourly Rate`,
    `. As compensation to the Administrative Agent for the services provided by the Administrative Agent in connection with any Enforcement Proceeding, Administrative Agent shall be entitled to receive reasonable compensation at the hourly rate plus reimbursement of all out of pocket expenses reasonably incurred by the Administrative Agent.`,
    subCategory,
    20,
  );
  addParagraph(
    `(c)`,
    `Surcharge`,
    `. Upon the occurrence of an Event of Default that is continuing, all payments under the Notes shall be directed to and held in escrow until the Event of Default is cured or otherwise resolved.  Each Holder acknowledges and agrees that the Administrative Agent may surcharge (i) the Collateral, if any, and (ii) the funds maintained in escrow in an amount equal to the outstanding and unpaid portion of the compensation due and payable to the Administrative Agent under the terms of this Agreement, prior to causing the balance of said proceeds or funds to be distributed to the Holders on a pro rata basis.`,
    subCategory,
    20,
  );
  addFooter();
  /**
   * End page 10
   */

  /** Start Page 11 */

  doc.addPage();
  addParagraph(
    `5.7`,
    `Successor Administrative Agent`,
    `The Administrative Agent (i) may resign as Administrative Agent by providing Notice (“Notice of Resignation”) or (ii) shall resign if such resignation is requested by the Required Holders, by giving not less than thirty (30) days' prior written notice to the Holders and the Issuer.  Upon the occurrence of an Event of Default, each Holder hereby acknowledges and agrees that Honeycomb Collateral LLC shall resign as the Administrative Agent and that the Holders must appoint a successor Administrative Agent on or before the date specified in the Notice of Resignation.  Each Holder further acknowledges that Honeycomb Collateral LLC cannot hold or distribute funds on behalf of any Holder and that a successor Administrative Agent must be appointed prior to the receipt of any funds on behalf of any Holder in any Enforcement Proceeding or otherwise.  If the Administrative Agent resigns under this Agreement, then either (a) the Required Holders shall appoint from among the Holders a successor agent for the Holders or (b) if a successor agent shall not be so appointed and approved within the earlier of:  (i) the thirty (30) day period immediately following the Administrative Agent's Notice of Resignation; or (ii) the need to appoint a successor Administrative Agent to receive and distribute funds on behalf of Holders, as reasonably determined by Honeycomb Collateral LLC in its sole discretion, then the Administrative Agent shall appoint a successor agent who shall serve as Administrative Agent until such time as the Required Holders appoint a successor agent.  For purposes of appointing a successor Administrative Agent, only, the Required Holders shall be determined by reference to Holders holding at least a majority of the then outstanding amount of the obligations evidenced by the Notes on an aggregate basis that have cast a vote timely.  Upon its appointment pursuant to either clause (a) or (b) above, such successor agent shall succeed to the rights, powers and duties of the Administrative Agent, and the term "Administrative Agent" shall mean such successor agent, effective upon its appointment, and the former Administrative Agent's rights, powers and duties as Administrative Agent shall be terminated without any other or further act or deed on the part of such former Administrative Agent or any of the parties to this Agreement.  After the resignation of any Administrative Agent hereunder, the provisions of this Agreement shall inure to the benefit of such former Administrative Agent and such former Administrative Agent shall not by reason of such resignation be deemed to be released from liability for any actions taken or not taken by it while it was an Administrative Agent under this Agreement.`,
    category,
    20,
  );
  addParagraph(
    `5.8`,
    `Calculations`,
    `In the absence of gross negligence or willful misconduct, Holder acknowledges and agrees that there will be no liability for any error in computing the amount payable to any Holder whether in respect of the Notes, fees or any other amounts due to the Holder under this Agreement.  In the event an error in computing any amount payable to any Holder is made, the Administrative Agent, the Issuer and each affected Holder shall, forthwith upon discovery of such error, make such adjustments as shall be required to correct such error.`,
    category,
    20,
  );
  addFooter();

  /**
   * End Page 11
   */

  /**
   * Start Page 12
   */
  doc.addPage();
  addHeading(`ARTICLE VI`);
  addHeading(`EVENTS OF DEFAULT`, { ...underlineOnly, paragraphGap: 20 });
  addParagraph(
    `6.1`,
    `Event of Default`,
    `. Any of the following shall constitute an "Event of Default":`,
    category,
    5,
  );
  addParagraph(
    `(a)`,
    `Non-Payment`,
    `. The Issuer fails to pay to a Holder any amount due and such failure continues for thirty (30) days following written notice to the Issuer; or`,
    subCategory,
    5,
  );
  addParagraph(
    `(b)`,
    `Representation or Warranty`,
    `. Any representation, warranty or certification by or on behalf of the Issuer shall prove to have been incorrect in any material respect on or as of the date made or deemed made; or`,
    subCategory,
    5,
  );
  addParagraph(
    `(c)`,
    `Insolvency`,
    `.  Issuer ceases or fails to be solvent or admits in writing its general inability to pay, its debts as they become due, subject to applicable grace periods, if any;`,
    subCategory,
    5,
  );
  addParagraph(
    `(d)`,
    `Breach of Other Obligations`,
    `. Issuer breaches a material obligation owed to a third party, including breach of any loan documents with another lender; or`,
    subCategory,
    5,
  );
  addParagraph(
    `(e)`,
    `Involuntary Proceeding`,
    `. The Issuer becomes subject to an involuntary proceeding of bankruptcy, insolvency, or otherwise subject to receivership and remains so for a period of ninety (90) days; or`,
    subCategory,
    5,
  );
  addParagraph(
    `(f)`,
    `Change of Control`,
    `. All outstanding principal and accrued interest shall be immediately due and payable upon a Change of Control of the Issuer. For these purposes, the term “Change of Control” means (i) the sale or other disposition of all or any substantial portion of the assets or equity securities of the Issuer; (ii) a change in more than fifty percent (50%) of the effective voting power of the Issuer; or (iii) any merger or reorganization of the Issuer, except a merger in which those in control of the Issuer retain more than fifty percent (50%) of the combined voting power of the resulting entity; or`,
    subCategory,
    10,
  );
  addParagraph(
    `(g)`,
    `Bankruptcy`,
    `. Issuer files a voluntary bankruptcy proceeding.`,
    subCategory,
    10,
  );
  addParagraph(
    `6.2`,
    `Remedies`,
    `. Upon the occurrence and during the continuance of an Event of Default in Section 6.1(a)-(f), then the Required Holders may instruct the Administrative Agent to  declare all amounts owed under the Notes to be immediately due and payable.  Upon the occurrence of an Event of Default in Section 6.1(g), all amounts owed under the Notes shall automatically be accelerated and become immediately due and payable without prior written notice or demand.  Upon the occurrence of any Event of Default that is continuing, Holders shall have the right to exercise all rights and remedies available to them under this Agreement, any Loan Document, at law or in equity, consistent with the procedures set forth in this Agreement.`,
    category,
    15,
  );

  addFooter();
  /**
   * End Page 12
   */

  /**
   * Start Page 13
   */

  doc.addPage();
  addParagraph(
    `6.3`,
    `No Individual Right of Action`,
    `. Each Holder acknowledges and agrees that no Holder has an individual right of action to enforce its Note or any of the Loan Documents against the Issuer and is bound by the decision and instructions provided to the Administrative Agent by the Required Holders consistent with the terms of this Agreement.`,
    category,
    15,
  );
  addParagraph(
    `6.4`,
    `Force Majeure`,
    `. An Event of Default shall not be deemed to have occurred if a breach or failure by the Issuer is caused by Acts of God, government restrictions (including the denial or cancellation of any export, close of business or other extraordinary measures), wars, insurrections and/or any other cause beyond the reasonable control of the Issuer; provided that the Administrative Agent shall give Holders written notice describing the force majeure in reasonable detail given the information presently available.  Performance under the Notes is suspended for the period of time in which the force majeure is in effect, plus thirty (30) days thereafter (the “Force Majeure Period”).  The Force Majeure Period may be extended further in the discretion of the Administrative Agent with the consent of the Required Holders pursuant to the procedures outlined in Section 5.3 of this Agreement.  Any payments made by any Issuer during the Force Majeure Period are not subject to refund.  The term length of the Note shall not be adjusted if the Force Majeure is put into effect.`,
    category,
    25,
  );
  addHeading('ARTICLE VII');
  addHeading(`MISCELLANEOUS`, { ...underlineOnly, paragraphGap: 20 });
  addParagraph(
    `7.1`,
    null,
    `LIMITATIONS ON DAMAGES. NEITHER ISSUER NOR ADMINISTRATIVE AGENT WILL BE LIABLE TO ANY HOLDER FOR ANY LOST PROFITS OR SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, EVEN IF HOLDER DISCLOSES IT MIGHT INCUR THOSE DAMAGES.  The maximum liability the Issuer or Administrative Agent may have to any Holder is the amount of such Holder’s investment as evidenced by the Note.`,
    category,
    15,
  );
  addParagraph(
    `7.2`,
    null,
    `NO CLASS ACTION CLAIMS. NO LAWSUIT SHALL PROCEED ON A CLASS, REPRESENTATIVE, OR COLLECTIVE BASIS. No party may join, consolidate, or otherwise bring claims for or on behalf of two or more individuals or unrelated corporate entities in the same lawsuit unless those persons are parties to a single transaction. An award shall determine the rights and obligations of the named parties only, and only with respect to the claims in the lawsuit, and shall not (i) determine the rights, obligations, or interests of anyone other than a named party, or resolve any claim of anyone other than a named party, or (ii) make an award for the benefit of, or against, anyone other than a named party. No administrator or arbitrator shall have the power or authority to waive, modify, or fail to enforce this paragraph, and any attempt to do so, whether by rule, policy, arbitration decision or otherwise, shall be invalid and`,
    category,
    15,
  );
  addFooter();
  /**
   * End Page 13
   */
  /**
   * Start Page 14
   */

  doc.addPage();
  addParagraph(
    null,
    null,
    ` unenforceable. Any challenge to the validity of this paragraph shall be determined exclusively by a court and not by the administrator or any arbitrator. If this paragraph shall be deemed unenforceable, then any proceeding in the nature of a class action shall be handled in court, not in arbitration`,
    category,
    15,
  );
  addParagraph(
    `7.3`,
    null,
    `Consent to Jurisdiction and Service of Process; Waiver of Jury Trial.`,
    category,
    15,
  );
  addParagraph(
    `(a)`,
    null,
    `Issuer and each Holder hereby:  (i) irrevocably submits to the jurisdiction of the Court of Common Pleas of Allegheny County, Pennsylvania and to the jurisdiction of the United States District Court for the Western District of Pennsylvania for the purposes of any action or proceeding arising out of or relating to any of this Agreement or the Notes or the subject matter thereof and brought by the Administrative Agent on behalf of the Holder; (ii) waives and agrees not to assert, by way of motion, as a defense or otherwise, in any such action or proceeding, any claim that (A) it is not personally subject to the jurisdiction of such courts, (B) the action or proceeding is brought in an inconvenient forum or (C) the venue of the action or proceeding is improper; and (iii) agrees that, notwithstanding any right or privilege it may possess at any time, such party and its assets are subject to suit on account of the obligations assumed by it hereunder.`,
    subCategory,
    10,
  );
  addParagraph(
    `(b)`,
    null,
    `THE PARTIES WAIVE THE RIGHT TO A TRIAL BY JURY IN ANY ACTION OR PROCEEDING ARISING OUT OF OR RELATING TO ANY OF THE TRANSACTION DOCUMENTS OR THE SUBJECT MATTER THEREOF AND BROUGHT BY ANY OTHER PARTY.`,
    subCategory,
    10,
  );
  addParagraph(
    `(c)`,
    null,
    ` The Holders acknowledge that this is a commercial transaction, that the foregoing provisions for consent to jurisdiction, service of process and waiver of jury trial have been read, understood and voluntarily agreed to by them and that by agreeing to such provisions they are waiving important legal rights.  The obligations of the parties under this Section will survive any termination of this Agreement.`,
    subCategory,
    15,
  );
  addParagraph(
    `7.4`,
    `Creditor-Debtor Relationship`,
    `. The relationship between each Holder, on the one hand, and the Issuer, on the other hand, is solely that of creditor and debtor.`,
    category,
    15,
  );
  addParagraph(
    `7.5`,
    `Expenses`,
    `. Each party shall be responsible for its own expenses, including without limitation all attorney's fees which arise out of or relate to the documentation of this Agreement or the Notes.  Upon the occurrence of an Event of Default or commencement of an Enforcement Proceeding, the costs and expenses incurred by the Administrative Agent on behalf of the Holders, including reasonable attorneys’ fees and costs, shall be added to and become a part of the obligations owed by the Issuer under this Agreement.`,
    category,
    15,
  );
  addParagraph(
    `7.6`,
    `Notices`,
    `. All notices, consents, requests, demands and other`,
    category,
    15,
  );

  // const page14 = [
  //   [
  //     'Holder; (ii) waives and agrees not to assert, by way of motion, as a defense or otherwise, in any such action or proceeding, any claim that (A) it is not personally subject to the jurisdiction of such courts, (B) the action or proceeding is brought in an inconvenient forum or (C) the venue of the action or proceeding is improper; and (iii) agrees that, notwithstanding any right or privilege it may possess at any time, such party and its assets are subject to suit on account of the obligations assumed by it hereunder.',
  //   ],
  //   // ['(b)        ', , , { ...continuedOnly, indent: 35 }],
  // ];
  // page14.map((con) => addText(con[0], con[1], con[2], con[3], con[4]));
  addFooter();

  /**
   * End Page 14
   */

  /** Start Page */
  doc.addPage();
  addParagraph(
    null,
    null,
    `communications required or permitted hereunder:  (a) will be in writing; (b) will be sent by electronic delivery, including all tax forms, to the email address provided by the Holder on the Site and shall be deemed transmitted when sent.  Notices to the Administrative Agent and the Issuer may be sent electronically to the email addresses provided in their respective signature blocks.`,
    category,
    15,
  );
  addParagraph(
    `7.7`,
    `Amendments`,
    `. This Agreement and the Notes may be amended only by a writing signed by the Issuer on the one hand and by the Administrative Agent on behalf of the Holders on the other hand, and any such amendment will be effective only to the extent specifically set forth in such writing.`,
    category,
    15,
  );
  addParagraph(
    `7.8`,
    `Confidentiality`,
    `. Each of the Holders shall maintain in confidence in accordance with its customary procedures for handling confidential information, all written information that the Issuer, furnishes to Holders ("Confidential Information"), other than any such Confidential Information that become generally available to the public other than as a result of a breach by the Holders of its obligations hereunder or that is or becomes available to the Holders from a source other than the Issuer, and that is not, to the actual knowledge of the recipient thereof, subject to obligations of confidentiality with respect thereto.`,
    category,
    15,
  );
  addParagraph(
    `7.9`,
    `Miscellaneous`,
    `. This Agreement and the Notes:  (a) may not be assigned, pledged or otherwise transferred, whether by operation of law or otherwise, without the prior consent of the Issuer; (b) may be executed in electronically and in counterparts by the parties, which shall be deemed effective as an original and will constitute one and the same instrument; (c) contain the entire agreement of the parties with respect to the transactions contemplated hereby and thereby and supersede all prior written and oral agreements, and all contemporaneous oral agreements, relating to such transactions; (d) are governed by, and will be construed and enforced in accordance with, the laws of the Commonwealth of Pennsylvania without giving effect to any conflict of laws rules; and (e) are binding upon, and will inure to the benefit of, the parties and their respective successors and permitted assigns.  The waiver by a party of any breach or violation of any provision of this Agreement will not operate or be construed a waiver of any subsequent breach or violation hereof.  Any provision of this Agreement which is prohibited or unenforceable in any jurisdiction will, as to such jurisdiction, be ineffective to the extent of such prohibition or unenforceability without invalidating the remaining portions hereof or affecting the validity or enforceability of such provision in any other jurisdiction.`,
    category,
    15,
  );

  addFooter();
  /** End Page */

  /**
   * Start Page 15
   */

  /**
   * End Page 15
   */

  /** Start Last Page */
  doc.addPage();
  addParagraph(
    null,
    null,
    `IN WITNESS WHEREOF, the parties hereto have caused this Agreement to be duly executed and delivered by their duly authorized officers as of the day and year first above written.`,
    category,
    50,
  );
  addParagraph(null, null, `By${gap}____________________________________`, category, 0);
  if (signaturePath === null || signaturePath === undefined) {
    doc.font(fontPath, null, 23).text(`${ownerName}`, 140, 155, {
      ...notContinued,
      paragraphGap: 4,
    });
  } else {
    const sign = await fetchImage(signaturePath);
    doc.image(sign, 140, 100, { fit: [100, 100] });
  }
  doc.font('Helvetica', null, 12).text(`Name: ${ownerName}`, 72, 200, {
    align: align.left,
    paragraphGap: 4,
  });

  addParagraph(
    null,
    null,
    `ADMINISTRATIVE AGENT, solely in its capacity as Administrative Agent, on behalf of the Holders,`,
    category,
    20,
  );
  addParagraph(null, null, `HONEYCOMB COLLATERAL LLC`, category, 15);
  addParagraph(null, null, `By: /s/ Christian Bilger`, category, 15);
  addParagraph(null, null, `Title: Chief Operating Officer`, category, 15);
  addParagraph(null, null, `Email: christian@honeycombcredit.com`, category, 30);
  addParagraph(
    null,
    null,
    `HOLDERS – See attached electronic record(s) of Holder execution`,
    category,
    15,
  );
  addParagraph(null, null, `Holder Information`, category, 15);
  addParagraph(
    null,
    null,
    `Investing Amount${gap}${gap} ${investingAmount}`,
    category,
    50,
  );
  if (isEquity || isRevenueShare || isConvertibleNote) {
    doc.text('');
  } else {
    doc.font(fontPath, null, 25).text(`${investorName}`, 140, doc.y, {
      ...notContinued,
      align: align.left,
      paragraphGap: 4,
    });

    doc
      .font('Helvetica', null, 12)
      .text(`____________________________________`, 72, doc.y);
  }

  addFooter();
  /** End Last Page */

  doc.end();
};

// NPAPdf();
export default NPAPdf;
