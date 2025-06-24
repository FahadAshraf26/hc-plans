import UserDocument from '@domain/Core/UserDocument/UserDocument';

class CreateUserDocumentDTO {
    document: UserDocument;

    constructor(
        userId: string,
        documentType: string,
        name: string,
        path: string,
        mimeType: string,
        ext: string,
    ) {
        this.document = UserDocument.createFromDetail(
            userId,
            documentType,
            name,
            path,
            mimeType,
            ext,
        );
    }

    getUserDocument() {
        return this.document;
    }
}

export default CreateUserDocumentDTO;
