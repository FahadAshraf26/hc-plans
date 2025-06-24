import { QueryTypes } from 'sequelize';
import { v4 } from 'uuid';
import moment from 'moment';
import sequelize from '@infrastructure/Database/mysqlConnection';

class ImportIssuer {
  execute = async (transformedObject) => {
    let ownerEmails = [];
    const issuerId = v4();
    const [
      issuer,
    ] = await sequelize.query(
      `select * from issuers where issuerName = "${transformedObject['Borrower Company Name']}"`,
      { type: QueryTypes.SELECT },
    );
    if (issuer) {
      return true;
    } else {
      for (const [key] of Object.entries(transformedObject.Owners)) {
        ownerEmails.push(key);
      }
      const query = `INSERT INTO issuers(issuerId, issuerName, physicalAddress, legalEntityType, email, EIN,
                        city, state, zipCode, country, phoneNumber,website, employeeCount, createdAt, updatedAt, businessType) VALUES`;

      await sequelize.query(
        query + this.createIssuerQuery(issuerId, transformedObject, ownerEmails),
        { type: QueryTypes.INSERT },
      );
      for (const [key] of Object.entries(transformedObject.Owners)) {
        const [
          { ownerId },
        ] = await sequelize.query(
          `select o.ownerId from users u join owners o on o.userId = u.userId where u.email = '${key}'`,
          { type: QueryTypes.SELECT },
        );
        await sequelize.query(
          'INSERT INTO issuerOwners(issuerOwnerId, issuerId, ownerId, createdAt, updatedAt) VALUES' +
            this.createIssuerOwnersQuery(issuerId, ownerId),
          { type: QueryTypes.INSERT },
        );
      }
      const employeeCountQuery = `INSERT INTO employeeLogs (employeeLogId, employeeCount, updatedEmployeeCount, createdAt,updatedAt, issuerId) VALUES`;
      await sequelize.query(
        employeeCountQuery + this.createEmployeeCount(issuerId, transformedObject),
      );
      return true;
    }
  };

  createIssuerQuery = (issuerId, issuer, ownerEmails) => {
    const atIndex = issuer['Company Email Address'].indexOf('@');
    const legalEntityType =
      issuer['Legal Structure'] === 'Limited Liability Co'
        ? 'llc'
        : issuer['Legal Structure'];
    const issuerEmail = ownerEmails.includes(issuer['Company Email Address'])
      ? `${
          issuer['Company Email Address'].slice(0, atIndex) +
          '+1' +
          issuer['Company Email Address'].slice(atIndex)
        }`
      : `${issuer['Company Email Address']}`;
    const website =
      issuer['Company Website'] === 'N/A'
        ? ''
        : issuer['Company Website'].indexOf('http://') == 0 ||
          issuer['Company Website'].indexOf('https://') == 0
        ? issuer['Company Website']
        : `https://${issuer['Company Website']}`;
    return `(
            '${issuerId}',
            "${issuer['Borrower Company Name']}",
            "${issuer['Company Mailing Street']}",
            '${legalEntityType}',
            '${issuerEmail}',
            '${issuer.Tin}',
            '${issuer['Company Mailing City']}',
            '${issuer['Company Mailing State']}',
            '${issuer['Company Mailing Zip']}',
            'United States',
            '${issuer['Business Phone Number']}',
            '${website}',
            0,
            '${moment().format('YYYY-MM-DD HH:mm:ss')}',
            '${moment().format('YYYY-MM-DD HH:mm:ss')}',
            "${issuer['Industry Category']}"
        );`;
  };

  createIssuerOwnersQuery = (issuerId, ownerId) => {
    return `(
        '${v4()}',
        '${issuerId}',
        '${ownerId}',
        '${moment().format('YYYY-MM-DD HH:mm:ss')}',
        '${moment().format('YYYY-MM-DD HH:mm:ss')}'
    )`;
  };

  createEmployeeCount = (issuerId, employeeCount) => {
    return `(
      '${v4()}',
       ${employeeCount['Number Of Employees']},
       ${employeeCount['Number Of Employees']},
       '${moment().format('YYYY-MM-DD HH:mm:ss')}',
       '${moment().format('YYYY-MM-DD HH:mm:ss')}',
       '${issuerId}'
    )`;
  };
}

export default new ImportIssuer();
