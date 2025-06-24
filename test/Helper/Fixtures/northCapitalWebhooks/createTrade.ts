const createTradeDTO = {
    webhookType: 'Create Trade',
    payload: {
        tradeId: '2176591',
        transactionId: '977270',
        transactionAmount: '100.000000',
        transactionDate: '2021-03-25 13:38:48',
        transactionStatus: 'CREATED',
        RRApprovalStatus: 'Pending',
        RRName: '',
        RRApprovalDate: '',
        PrincipalApprovalStatus: 'Pending',
        PrincipalName: '',
        PrincipalDate: '',
        closeId: ''
    },
    status: ''
}

module.exports = {
    createTradeDTO,
}