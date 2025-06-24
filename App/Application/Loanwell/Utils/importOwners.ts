import { v4 } from 'uuid';
import { QueryTypes } from 'sequelize';
import moment from 'moment';
import sequelize from '@infrastructure/Database/mysqlConnection';
import EncryptionService from '@infrastructure/Service/EncryptionService/EncryptionService';

class ImportOwners {
  execute = async (transformedObject: any) => {
    const preUserQuery = `INSERT INTO users(userId, firstName, lastName, userName, email, dob,ssn, address, city, state,zipCode,country, createdAt, updatedAt,isVerified,phoneNumber) VALUES `;
    const preOwnerQuery = `INSERT INTO owners(userId, ownerId, title, subTitle, description, primaryOwner, beneficialOwner, beneficialOwnerId, createdAt, updatedAt, businessOwner) VALUES `;
    const preInvestorQuery = `INSERT INTO investors(investorId, createdAt,updatedAt,userId, incomeVerificationTriggered, investingAvailable, investmentCap, isAccredited, annualIncome, netWorth) VALUES `;
    const tranformedOwners: any = Object.entries(transformedObject.Owners);
    for (const [key, value] of tranformedOwners) {
      let userId = v4();
      let ownerId = v4();

      const [user] = await sequelize.query(`SELECT * from users where email = '${key}'`, {
        type: QueryTypes.SELECT,
      });
      if (user) {
        const encrytedSsn = value.ssn ? EncryptionService.encryptSsn(value.ssn) : null;
        const dob = value.dob
          ? `'${moment(value.dob, 'MM/DD/YYYY').format('YYYY-MM-DD')}'`
          : null;
        const beneficialOwner = value.ownershipPercentage > 25 ? 1 : 0;
        await sequelize.query(
          `UPDATE users set firstName= "${value.firstName}", lastName = "${
            value.lastName
          }", userName="${value.fullName}",email="${
            value.email
          }", dob=${dob}, ssn="${encrytedSsn}",address="${
            transformedObject['Borrower Address']
          }", city="${transformedObject['Borrower City']}",state="${
            transformedObject['Borrower State']
          }",zipCode="${transformedObject['Borrower Zip Code']}", phoneNumber="${
            transformedObject['Borrower Phone Number']
              ? transformedObject['Borrower Phone Number']
              : null
          }" where userId= "${user.userId}"`,
          {
            type: QueryTypes.UPDATE,
          },
        );
        const [owner] = await sequelize.query(
          `select * from owners where userId= "${user.userId}"`,
          {
            type: QueryTypes.SELECT,
          },
        );
        if (owner) {
          await sequelize.query(
            `update owners set title="${value.fullName}", subTitle="${transformedObject['Signer One Title']}", description="${value.bio}",primaryOwner=1,beneficialOwner=${beneficialOwner} where userId = '${user.userId}'`,
            { type: QueryTypes.UPDATE },
          );
        } else {
          const beneficialOwner = value.ownershipPercentage > 25 ? 1 : 0;
          value['Borrower Address'] = transformedObject['Borrower Address'];
          value['Borrower City'] = transformedObject['Borrower City'];
          value['Borrower State'] = transformedObject['Borrower State'];
          value['Borrower Zip Code'] = transformedObject['Borrower Zip Code'];
          value['Borrower Phone Number'] = transformedObject['Borrower Phone Number']
            ? transformedObject['Borrower Phone Number']
            : null;
          const finalOwnerQuery =
            preOwnerQuery +
            this.createOwner(
              ownerId,
              user.userId,
              value.fullName,
              transformedObject['Signer One Title'],
              beneficialOwner,
              value.bio,
            ) +
            ';';
          await sequelize.query(finalOwnerQuery, {
            type: QueryTypes.INSERT,
          });
        }
      } else {
        const beneficialOwner = value.ownershipPercentage > 25 ? 1 : 0;
        value['Borrower Address'] = transformedObject['Borrower Address'];
        value['Borrower City'] = transformedObject['Borrower City'];
        value['Borrower State'] = transformedObject['Borrower State'];
        value['Borrower Zip Code'] = transformedObject['Borrower Zip Code'];
        value['Borrower Phone Number'] = transformedObject['Borrower Phone Number']
          ? transformedObject['Borrower Phone Number']
          : null;
        const finalUserQuery = preUserQuery + this.createUser(userId, value) + ';';
        await sequelize.query(finalUserQuery, { type: QueryTypes.INSERT });
        const finalInvestorQuery = preInvestorQuery + this.createInvestor(userId) + ';';
        await sequelize.query(finalInvestorQuery, {
          type: QueryTypes.INSERT,
        });
        const finalOwnerQuery =
          preOwnerQuery +
          this.createOwner(
            ownerId,
            userId,
            value.fullName,
            transformedObject['Signer One Title'],
            beneficialOwner,
            value.bio,
          ) +
          ';';
        await sequelize.query(finalOwnerQuery, { type: QueryTypes.INSERT });
      }
    }
  };

  createOwner = (ownerId, userId, ownerName, subTitle, beneficialOwner, description) => {
    return `('${userId}','${ownerId}', "${ownerName}","${subTitle}","${description}",1,${beneficialOwner},NULL,"${moment().format(
      'YYYY-MM-DD HH:mm:ss',
    )}","${moment().format('YYYY-MM-DD HH:mm:ss')}",0)`;
  };
  createInvestor = (userId) => {
    return `('${v4()}','${moment().format('YYYY-MM-DD HH:mm:ss')}','${moment().format(
      'YYYY-MM-DD HH:mm:ss',
    )}','${userId}', 0, 2500, 2500,"Not Accredited", 0, 0)`;
  };

  createUser = (userId, user) => {
    const encrytedSsn = user.ssn ? EncryptionService.encryptSsn(user.ssn) : null;
    const dob = user.dob
      ? `'${moment(user.dob, 'MM/DD/YYYY').format('YYYY-MM-DD')}'`
      : null;
    return `('${userId}',"${user.firstName}","${user.lastName}","${user.fullName}",'${
      user.email
    }',${dob},'${encrytedSsn}','${user['Borrower Address']}','${
      user['Borrower City']
    }','${user['Borrower State']}','${
      user['Borrower Zip Code']
    }','United States','${moment().format('YYYY-MM-DD HH:mm:ss')}','${moment().format(
      'YYYY-MM-DD HH:mm:ss',
    )}', 'Pass','${
      user['Borrower Phone Number'] ? user['Borrower Phone Number'] : null
    }')`;
  };
}

export default new ImportOwners();
