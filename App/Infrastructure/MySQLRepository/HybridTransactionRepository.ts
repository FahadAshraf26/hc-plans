import { IHybridTransactionRepoistory } from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { injectable } from 'inversify';
import BaseRepository from './BaseRepository';
import models from '../Model';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
const {
  HybridTransactionModel,
  CampaignFundModel,
  InvestorModel,
  InvestorPaymentOptionModel,
  UserModel,
  InvestorBankModel,
  ChargeModel,
} = models;
import { Op } from 'sequelize';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';

@injectable()
class HybridTransactionRepository extends BaseRepository
  implements IHybridTransactionRepoistory {
  constructor() {
    super(HybridTransactionModel, 'hybridTransactionId', HybridTransaction);
  }

  async fetchAllByCampaignFundId(campaignFundId: string, allowedStatuses = null) {
    const { Op } = require('sequelize');

    const whereClause: any = { campaignFundId };

    // Add status filtering if allowedStatuses is provided
    if (allowedStatuses && allowedStatuses.length > 0) {
      whereClause.status = {
        [Op.in]: allowedStatuses,
      };
    }

    const hybridTransactions = await HybridTransactionModel.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return hybridTransactions.map((hybridTransaction) => {
      return HybridTransaction.createFromObject(hybridTransaction);
    });
  }

  async fetchAllWalletTransactions() {
    const hybridTransactions = await HybridTransactionModel.findAll({
      where: {
        transactionType: {
          [Op.or]: ['Wallet', 'HYBRID', 'WALLET', 'Hybrid'],
        },
        individualACHId: {
          [Op.eq]: null,
        },
      },
    });
    return hybridTransactions.map((hybridTransaction) => {
      return HybridTransaction.createFromObject(hybridTransaction);
    });
  }

  async fetchByTradeId(tradeId) {
    const hybridTransaction = await HybridTransactionModel.findOne({
      where: {
        tradeId,
      },
    });

    return HybridTransaction.createFromObject(hybridTransaction);
  }

  async fetchAllWalletThreadBankPendingRefundTransactions() {
    const hybridTransactions = await HybridTransactionModel.findAll({
      where: {
        status: {
          [Op.or]: [ChargeStatus.PENDING_REFUND, ChargeStatus.REFUND_PROCESSING],
        },
        debitAuthorizationId: {
          [Op.eq]: null,
        },
        source: CampaignEscrow.THREAD_BANK,
        transactionType: {
          [Op.or]: ['Wallet', 'HYBRID', 'WALLET', 'Hybrid'],
        },
      },
    });
    return hybridTransactions.map((hybridTransaction) => {
      return HybridTransaction.createFromObject(hybridTransaction);
    });
  }

  async updateStatusAndDebitAuthorizationId(
    hybridTransactionId: string,
    status: string,
    debitAuthorizationId: string,
  ): Promise<boolean> {
    return HybridTransactionModel.update(
      {
        status,
        debitAuthorizationId,
      },
      {
        where: { hybridTransactionId },
      },
    );
  }

  async updateStatusAndNachaFileName(
    hybridTransactionId: string,
    status: string,
    nachaFileName: string,
  ): Promise<boolean> {
    return HybridTransactionModel.update(
      {
        status,
        nachaFileName,
      },
      {
        where: { hybridTransactionId },
      },
    );
  }

  async fetchAllByDebitAuthorizationId(debitAuthorizationId: string) {
    const hybridTransactions = await HybridTransactionModel.findAll({
      where: {
        debitAuthorizationId,
      },
    });
    return hybridTransactions.map((hybridTransaction) => {
      return HybridTransaction.createFromObject(hybridTransaction);
    });
  }

  async fetchAllByNachaFileName(nachaFileName: string) {
    const hybridTransactions = await HybridTransactionModel.findAll({
      where: {
        nachaFileName,
      },
    });
    return hybridTransactions.map((hybridTransaction) => {
      return HybridTransaction.createFromObject(hybridTransaction);
    });
  }

  async fetchAllByNachaFileNameForAchRefundStatus(nachaFileNames: string[]) {
    const hybridTransactions = await HybridTransactionModel.findAll({
      where: {
        nachaFileName: {
          [Op.in]: nachaFileNames,
        },
        status: {
          [Op.not]: ChargeStatus.REFUNDED,
        },
      },
      include: [
        {
          model: CampaignFundModel,
          as: 'campaignFund',
          required: true,
          include: [
            {
              model: InvestorModel,
              as: 'campaignInvestor',
              required: true,
              include: [
                {
                  model: UserModel,
                  as: 'user',
                  required: true,
                  attributes: ['firstName', 'lastName'],
                },
                {
                  model: InvestorPaymentOptionModel,
                  as: 'investorBank',
                  required: true,
                  include: [
                    {
                      model: InvestorBankModel,
                      as: 'bank',
                      required: true,
                      attributes: ['accountNumber', 'routingNumber'],
                    },
                  ],
                },
              ],
            },
            {
              model: ChargeModel,
              as: 'charge',
              required: true,
            },
          ],
        },
      ],
    });

    return hybridTransactions;
  }

  async fetchAllWalletThreadBankRefundApprovedTransactions() {
    const hybridTransactions = await HybridTransactionModel.findAll({
      where: {
        status: ChargeStatus.REFUND_APPROVED,
        source: CampaignEscrow.THREAD_BANK,
        transactionType: {
          [Op.or]: ['Wallet', 'HYBRID', 'WALLET', 'Hybrid'],
        },
      },
    });
    return hybridTransactions.map((hybridTransaction) => {
      return HybridTransaction.createFromObject(hybridTransaction);
    });
  }

  async fetchAllAchThreadBankPendingRefundTransactions() {
    const whereCondition = {
      status: {
        [Op.or]: [ChargeStatus.PENDING_REFUND, ChargeStatus.REFUND_PROCESSING],
      },
      source: CampaignEscrow.THREAD_BANK,
      transactionType: {
        [Op.or]: ['ACH', 'HYBRID', 'Hybrid'],
      },
      debitAuthorizationId: { [Op.eq]: null },
      nachaFileName: { [Op.eq]: null },
    };
    const include = [
      {
        model: CampaignFundModel,
        as: 'campaignFund',
        required: true,
        include: {
          model: InvestorModel,
          as: 'campaignInvestor',
          paranoid: false,
          required: true,
          order: [[{ model: InvestorPaymentOptionModel }, 'createdAt', 'desc']],
          include: [
            {
              model: UserModel,
              as: 'user',
              required: true,
              attributes: ['firstName', 'lastName', 'email'],
              paranoid: false,
            },
            {
              model: InvestorPaymentOptionModel,
              as: 'investorBank',
              include: [
                {
                  model: InvestorBankModel,
                  as: 'bank',
                  required: true,
                  paranoid: true,
                  where: {
                    accountType: {
                      [Op.ne]: 'Bank',
                    },
                  },
                  attributes: [
                    'accountType',
                    'accountName',
                    'routingNumber',
                    'accountNumber',
                    'investorBankId',
                  ],
                },
              ],
            },
          ],
        },
      },
    ];
    return HybridTransactionModel.findAll({
      where: whereCondition,
      include: include,
    });
  }

  async getAchRefundStatusUpdate() {
    const hybridTransactions = await HybridTransactionModel.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { status: ChargeStatus.REFUNDED },
              { status: ChargeStatus.REFUND_FAILED },
            ],
          },
          { transactionType: 'ACH' },
          { source: CampaignEscrow.THREAD_BANK },
        ],
      },
      include: [
        {
          model: CampaignFundModel,
          as: 'campaignFund',
          required: true,
          include: [
            {
              model: InvestorModel,
              as: 'campaignInvestor',
              required: true,
              include: [
                {
                  model: UserModel,
                  as: 'user',
                  required: true,
                  attributes: ['firstName', 'lastName'],
                },
              ],
            },
          ],
        },
      ],
      limit: 20,
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    return hybridTransactions;
  }
}

export default HybridTransactionRepository;
