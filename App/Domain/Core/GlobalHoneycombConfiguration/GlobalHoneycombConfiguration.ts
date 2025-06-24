import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import TransactionType from '../CampaignFunds/TransactionType';

class GlobalHoneycombConfiguration extends BaseEntity {
    globalHoneycombConfigurationId: string;
    private configuration: any;

    constructor({ globalHoneycombConfigurationId, configuration }) {
        super();
        this.globalHoneycombConfigurationId = globalHoneycombConfigurationId;
        this.configuration = configuration;
    }

    static createFromObj(globalHoneycombFeeObj) {
        const globalHoneycombFee = new GlobalHoneycombConfiguration(globalHoneycombFeeObj);
        if (globalHoneycombFeeObj.createdAt) {
            globalHoneycombFee.setCreatedAt(globalHoneycombFeeObj.createdAt);
        }
        if (globalHoneycombFeeObj.updatedAt) {
            globalHoneycombFee.setUpdatedAt(globalHoneycombFeeObj.updatedAt);
        }
        if (globalHoneycombFeeObj.deletedAt) {
            globalHoneycombFee.setDeletedAT(globalHoneycombFeeObj.deletedAt);
        }

        return globalHoneycombFee
    }

    static createFromDetail(configuration) {
        return new GlobalHoneycombConfiguration({ globalHoneycombConfigurationId: uuid(), configuration })
    }

    CalculateFee(amount: number, transactionType: string, isMobilePlatform?: boolean): number {
        if (isMobilePlatform) {
            return 0;
        }
        const percentage = this.configuration[transactionType].transactionFeeVarriable / 100;
        const feeCap = this.configuration[transactionType].feeCap;
        const fee = amount * percentage > feeCap ? feeCap : amount * percentage;
        if (transactionType === TransactionType.ACH().getValue() ||
            transactionType === TransactionType.CreditCard().getValue() ||
            transactionType === TransactionType.GooglePay().getValue() ||
            transactionType === TransactionType.ApplePay().getValue()
        ) {
            return fee + this.configuration[transactionType].transcationFeeFixed;
        }
        return fee;
    }
}

export default GlobalHoneycombConfiguration
