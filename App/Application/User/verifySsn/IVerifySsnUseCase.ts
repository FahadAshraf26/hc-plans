import {UseCase} from "@application/BaseInterface/UseCase";

type verifySsnType = {
    userId: string,
    ssn: number
}

export const IVerifySsnUseCaseId = Symbol.for("IVerifySsnUseCase")

export interface IVerifySsnUseCase extends UseCase<verifySsnType, any> {

}
