import {UseCase} from "@application/BaseInterface/UseCase";

export const IUploadUserIdUseCaseId = Symbol.for("IUploadUserIdUseCase")

export interface IUploadUserIdUseCase extends UseCase<any, any> {

}