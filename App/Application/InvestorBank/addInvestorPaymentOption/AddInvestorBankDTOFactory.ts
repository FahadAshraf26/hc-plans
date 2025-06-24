import AddBankAccountDTO from './AddBankAccountDTO';
import AddManualBankAccountDTO from './AddManualBankDTO';

class AddInvestorBankDTOFactory {
    static createDTO(httpRequest) {
        const {
            isBank = true,
            ip,
            publicToken,
        }: { isBank: boolean; ip: string; publicToken: string } = httpRequest.body;
        const clientIp: string = ip || httpRequest.clientIp;
        const {
            userId,
           
        }: { userId: string } = httpRequest.params;
        switch (isBank) {
            case true:
                if (!publicToken) {
                    return new AddManualBankAccountDTO(
                        httpRequest.body,
                        userId,
                        clientIp,
                    );
                }
                return new AddBankAccountDTO(httpRequest.body, userId, clientIp);
            case false:
                return;
        }
    }
}

export default AddInvestorBankDTOFactory;
