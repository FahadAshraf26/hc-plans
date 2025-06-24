import async from 'async';
import fs from 'fs';
import container from '@infrastructure/DIContainer/container';
import EncryptionService from '@infrastructure/Service/EncryptionService/EncryptionService';
import { usaepayService } from '@infrastructure/Service/PaymentProcessor';
import models from '@infrastructure/Model';
import UserRepository from '@infrastructure/MySQLRepository/UserRepository';

const {
  UserModel,
  InvestorModel,
  Sequelize,
  InvestorPaymentOptionModel,
  InvestorBankModel,
} = models;
const { Op } = Sequelize;
const userRepository = container.get<UserRepository>(UserRepository);

export const sendDetailsToThreadBank = async () => {
  const users = await fetchAllUsersHavingVcCustomerId();
  let counter = 0;
  const totlalRecords = users.length;
  console.log('Total Records', totlalRecords);
  await async.eachSeries(users, async (user: any) => {
    counter++;
    console.log(
      `Percentage -> ${Math.round(
        (counter / users.length) * 100,
      )}% completed and pushing ${counter} of total ${totlalRecords} records`,
    );
    console.log('EMAIL->', user.email);
    await sendInvestorDetailsToThreadBank(user);
  });
};

export const sendInvestorDetailsToThreadBank = async (user) => {
  try {
    if (user.investor) {
      const threadBankResult = await usaepayService.createThreadBankCustomer(user);

      user.vcThreadBankCustomerId = threadBankResult.customerId;
      const investor = user.investor;
      investor.vcThreadBankCustomerKey = threadBankResult.customerKey;

      await updateUserWithVcThreadBankCustomerId(
        user.userId,
        threadBankResult.customerId,
      );
      await updateInvestorWithVcThreadBankCustomerKey(
        investor.dataValues.investorId,
        threadBankResult.customerKey,
      );
      if (user.investor.investorBank) {
        const investorBanks = user.investor.investorBank;
        for (let investorBank of investorBanks) {
          if (investorBank.bank) {
            const routingNumber = EncryptionService.decryptBankDetails(
              investorBank.bank.dataValues.routingNumber,
            );
            const accountNumber = EncryptionService.decryptBankDetails(
              investorBank.bank.dataValues.accountNumber,
            );
            const accountType = investorBank.bank.dataValues.accountType;
            const bankInfo = {
              accountNumber: accountNumber,
              routingNumber: routingNumber,
              accountType: accountType,
            };
            await usaepayService.attachCustomerThreadBankAccount(
              user.firstName,
              user.lastName,
              bankInfo,
              user.investor.vcThreadBankCustomerKey,
            );
          }
        }
      }
      fs.appendFile(
        'thread-bank-success.csv',
        `${user.userId},${user.email},${threadBankResult.customerKey}\n`,
        function (err) {
          if (err) {
            console.log('user has issue while pushing info', err);
          }
        },
      );
    }
  } catch (e) {
    console.log(`Unable to send info`, e);
    fs.appendFile('thread-bank-errors.csv', `${user.email},${e.message}\n`, function (
      err,
    ) {
      if (err) {
        console.log('There is an issue in user info', err);
      }
    });
  }
};

const fetchAllUsersHavingVcCustomerId = async () => {
  const where = {
    [Op.and]: {
      vcCustomerId: { [Op.ne]: null },
      vcThreadBankCustomerId: { [Op.eq]: null },
      deletedAt: { [Op.eq]: null },
    },
  };
  const include = [
    {
      model: InvestorModel,
      as: 'investor',
      include: [
        {
          model: InvestorPaymentOptionModel,
          as: 'investorBank',
          include: [
            {
              model: InvestorBankModel,
              as: 'bank',
              where: { deletedAt: { [Op.eq]: null } },
            },
          ],
        },
      ],
    },
  ];
  return await UserModel.findAll({
    where,
    include,
    order: [['createdAt', 'desc']],
    limit: 1000,
  });
};

const updateUserWithVcThreadBankCustomerId = async (
  userId: string,
  vcThreadBankCustomerId: string,
) => {
  await UserModel.update({ vcThreadBankCustomerId }, { where: { userId } });
  return true;
};

const updateInvestorWithVcThreadBankCustomerKey = async (
  investorId,
  vcThreadBankCustomerKey,
) => {
  await InvestorModel.update({ vcThreadBankCustomerKey }, { where: { investorId } });
  return true;
};

const deleteCustomersFromUSAePay = async () => {
  const customersListResponse = await usaepayService.fetchCustomersList();
  const total = customersListResponse.data.length;
  let counter = 0;
  for (let customer of customersListResponse.data) {
    counter++;
    console.log(`Percentage -> ${Math.round((counter / total) * 100)}%`);
    const user = await UserModel.findOne({
      include: [
        {
          model: InvestorModel,
          as: 'investor',
          where: {
            vcThreadBankCustomerKey: customer.key,
          },
          required: true,
        },
      ],
      paranoid: false,
    });
    if (!user) {
      console.log(customer.key);
      await usaepayService.deleteCustomer(customer.key);
    }
  }
};

(async () => {
  sendDetailsToThreadBank();
  //deleteCustomersFromUSAePay();
})();
