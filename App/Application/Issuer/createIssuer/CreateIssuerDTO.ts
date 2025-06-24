import Issuer from '@domain/Core/Issuer/Issuer';

type IssuerPropsType = {
    issuerName: string;
    physicalAddress: string;
    website: string;
    businessType: string;
    legalEntityType: string;
    email: string;
    facebook: string;
    linkedIn: string;
    instagram: string;
    twitter: string;
    pinterest: string;
    reddit: string;
    EIN: any;
    city: string;
    state: string;
    zipCode: string;
    latitude: string;
    longitude: string;
    phoneNumber: string;
    previousName: string;
    country: string;
};

class CreateIssuerDTO {
    private issuerProps: {};
    private ip: string;
    private ownerIds: [];

    constructor(
        {
            issuerName,
            physicalAddress,
            website,
            businessType,
            legalEntityType,
            email,
            facebook = '',
            linkedIn = '',
            instagram = '',
            twitter = '',
            pinterest = '',
            reddit = '',
            EIN = null,
            city,
            state,
            zipCode,
            latitude,
            longitude,
            phoneNumber,
            previousName,
            country,
        }: IssuerPropsType,
        ownerIds: [],
        ip: string,
    ) {
        this.issuerProps = {
            email,
            issuerName,
            previousName,
            EIN,
            businessType,
            legalEntityType,
            physicalAddress,
            city,
            state,
            zipCode,
            latitude,
            longitude,
            phoneNumber,
            website,
            facebook,
            linkedIn,
            instagram,
            twitter,
            pinterest,
            reddit,
            country,
        };
        this.ip = ip;
        this.ownerIds = ownerIds;
    }

    Issuer() {
        const issuer: any = this.issuerProps;
        return Issuer.createFromDetail(issuer);
    }

    OwnerIds() {
        return this.ownerIds;
    }

    Ip() {
        return this.ip;
    }
}

export default CreateIssuerDTO;
