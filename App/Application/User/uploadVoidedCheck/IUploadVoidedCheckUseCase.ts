import CreateUserDocumentDTO from "@application/UserDocument/CreateUserDocumentDTO";

export const IUploadVoidedCheckUseCaseId = Symbol.for("IUploadVoidedCheckUseCase")

export interface IUploadVoidedCheckUseCase {
  execute(dto: CreateUserDocumentDTO): Promise<any>;
}