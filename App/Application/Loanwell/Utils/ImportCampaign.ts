import { QueryTypes } from 'sequelize';
import { v4 } from 'uuid';
import moment from 'moment';
import slugify from 'slugify';
import sequelize from '@infrastructure/Database/mysqlConnection';

class ImportCampaign {
  execute = async (transformedObject) => {
    const campaignName =
      transformedObject['Company Dba'] != null
        ? transformedObject['Company Dba']
        : transformedObject['Borrower Company Name'];
    const [
      campaign,
    ] = await sequelize.query(
      `select * from campaigns where campaignName = "${campaignName}"`,
      { type: QueryTypes.SELECT },
    );
    if (!campaign) {
      const campaignId = v4();
      const [
        { issuerId },
      ] = await sequelize.query(
        `select issuerId from issuers where issuerName = "${transformedObject['Borrower Company Name']}"`,
        { type: QueryTypes.SELECT },
      );
      const query = `INSERT INTO campaigns(campaignId, campaignName, campaignStartDate, campaignDuration, campaignExpirationDate, campaignStage, 
              campaignTargetAmount,
              campaignMinimumAmount, typeOfSecurityOffered, investmentType, isLocked, annualInterestRate,loanDuration,
              isChargeFee, createdAt, updatedAt, issuerId, slug, escrowType, collateral,repaymentStartDate,summary, repaymentSchedule, useOfProceeds,howHoneycombIsCompensated,campaignEndTime,campaignTimezone, earningProcess) VALUES `;
      await sequelize.query(
        query + this.createCampaignQuery(transformedObject, issuerId, campaignId),
        { type: QueryTypes.INSERT },
      );
      transformedObject['Use Of Funds'] = JSON.parse(
        transformedObject['Use Of Funds'].replace(/""/gm, '"'),
      );

      let useOfFunds = [];
      const totalAmount = transformedObject['Use Of Funds'].reduce((a, b) => {
        return a + b.amount;
      }, 0);
      transformedObject['Use Of Funds'].forEach((item) => {
        useOfFunds.push({
          name: `${item.item}`,
          color: '#377BF5',
          maxValue: Math.round((item.amount / totalAmount) * 100),
          minValue: Math.round((item.amount / totalAmount) * 100),
        });
      });
      let roughBudget = { roughBudget: useOfFunds };
      const roughBudgetquery = `INSERT INTO roughBudgets (roughBudgetId, roughBudget, createdAt, updatedAt, campaignId)
          VALUES `;
      await sequelize.query(
        roughBudgetquery + this.createRoughBudget(roughBudget, campaignId),
        {
          type: QueryTypes.INSERT,
        },
      );
      const campaignInfoquery = `INSERT INTO campaignInfos (campaignInfoId, investorPitch,createdAt,updatedAt,campaignId,financialHistory,competitors,milestones,risks) VALUES `;
      await sequelize.query(
        campaignInfoquery + this.createCampaignInfo(transformedObject, campaignId),
        { type: QueryTypes.INSERT },
      );
      const campaignOwnerStoryquery = `INSERT INTO campaignOwnerStories (campaignOwnerStoryId, title, description,mediaUri,createdAt, updatedAt,campaignId) VALUE `;
      const ownerStory = `<h2><u><b>History</b></u></h2><p>${transformedObject['Company History']}</p><br /><h2><u><b>Future</b></u></h2><p>${transformedObject['4e0cb480aa5f4441a428888ea83027cc']}</p>`;
      await sequelize.query(
        campaignOwnerStoryquery +
          this.createOwnerStory(ownerStory, campaignId, transformedObject),
        { type: QueryTypes.INSERT },
      );
      let pl = [];
      for (let i = 0; i < 5; i++) {
        pl.push({
          year: moment().add(i, 'year').format('YYYY'),
          expense: '1',
          revenue: '1',
        });
      }
      const plQuery = `INSERT INTO PLs (plId, pl, createdAt, updatedAt, campaignId) VALUES `;
      await sequelize.query(plQuery + this.createPLs(campaignId, pl), {
        type: QueryTypes.INSERT,
      });
    }
  };

  createCampaignQuery = (campaign, issuerId, campaignId) => {
    const campaignName =
      campaign['Company Dba'] != null
        ? campaign['Company Dba']
        : campaign['Borrower Company Name'];
    const startDate = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;
    const endDate = `${moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss')}`;
    const diff =
      startDate && endDate ? moment(endDate).diff(moment(startDate), 'days') : 0;
    const repaymentStartDate = `'${moment()
      .add(60, 'days')
      .format('YYYY-MM-DD HH:mm:ss')}'`;
    return `(
            '${campaignId}',
            "${campaignName}",   
            '${startDate}',
            ${diff},
            "${endDate}",
            "Onboarding",
            ${campaign['Max Amount']},
            ${campaign['Min Amount']},
            'RegCF',
            'Debt',
            0,
            ${campaign['Annual Interest Rate']},
            ${campaign['Amortization Term'] ? campaign['Amortization Term'] / 12 : 0},
            1,
            '${startDate}',
            '${startDate}',
            '${issuerId}',
            "${slugify(campaignName)}",
            'FirstCitizenBank',
            "${campaign['Collateral Description']}",
            ${repaymentStartDate},
            "<p>${campaign['Company Overview']}</p>",
            'Business makes monthly repayments, disbursed to investors quarterly',
            "${campaign['Use Of Funds Description']}",
            "Honeycomb charges ${campaignName} a $449 posting fee and an 8.5% loan origination fee. Additionally, to cover expenses associated with each investment, Honeycomb charges a one-time fee on each transaction, by type: ACH: 3% investment fee capped at $50; Credit card: 4.50% (no cap); Hybrid ACH + Honeycomb Wallet: 2.00%, capped at $30, Honeycomb Wallet only: 0.00% fee.",
            "23:59:59",
            "America/New_York",
            "A $1,000 investment earns $XXX ($1,000 in principal + $XXX in interest) after fees by the end of the investment term, if the business pays as agreed"
        );`;
  };

  createRoughBudget = (roughBudget, campaignId) => {
    return `(
        '${v4()}',
         '${JSON.stringify(roughBudget)}',
        '${moment().format('YYYY-MM-DD HH:mm:ss')}',
        '${moment().format('YYYY-MM-DD HH:mm:ss')}',
        '${campaignId}'
    )`;
  };

  createCampaignInfo = (campaignInfo, campaignId) => {
    return `(
      '${v4()}',
      "<p>${campaignInfo['85c1b4c5f3204002a015e86cb431f39a']}</p>",
      '${moment().format('YYYY-MM-DD HH:mm:ss')}',
      '${moment().format('YYYY-MM-DD HH:mm:ss')}',
      '${campaignId}',
       '${JSON.stringify(['N/A'])}',
      'N/A',
      '${JSON.stringify(['N/A'])}',
      'N/A'
    )`;
  };

  createOwnerStory = (campaignOwnerStory, campaignId, campaign) => {
    const campaignName =
      campaign['Company Dba'] != null
        ? campaign['Company Dba']
        : campaign['Borrower Company Name'];
    return `(
      '${v4()}',
      "${campaignName}",
      "<p>${campaignOwnerStory}</p>",
      'NULL',
      '${moment().format('YYYY-MM-DD HH:mm:ss')}',
      '${moment().format('YYYY-MM-DD HH:mm:ss')}',
      '${campaignId}'

    )`;
  };

  createPLs = (campaignId, pl) => {
    return `('${v4()}','${JSON.stringify(pl)}','${moment().format(
      'YYYY-MM-DD HH:mm:ss',
    )}',
    '${moment().format('YYYY-MM-DD HH:mm:ss')}', '${campaignId}')`;
  };
}
export default new ImportCampaign();
