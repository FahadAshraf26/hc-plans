export default function parseAddressDetails(completeAddress: string[]) {
    let addressCounter = 0;
    const address = completeAddress[addressCounter++];
    const apartment = completeAddress.length > 3 ? completeAddress[addressCounter++] : null;
    const city = completeAddress[addressCounter++];
    const stateAndZipCode = completeAddress[addressCounter].split(' ');
    const state = stateAndZipCode[1];
    const zipCode = stateAndZipCode[2];

    return {
        address,
        apartment,
        city,
        state,
        zipCode
    };
}