import { Client } from "@googlemaps/google-maps-services-js";
import container from '@infrastructure/DIContainer/container';
import { ICampaignRepository, ICampaignRepositoryId } from '@domain/Core/Campaign/ICampaignRepository';
import async from 'async';
import { IIssuerRepository, IIssuerRepositoryId } from "@domain/Core/Issuer/IIssuerRepository";
import { ICampaignAddressRepository, ICampaignAddressRepositoryId } from "@domain/Core/CampaignAddress/ICampaignAddressRepository";
import PaginationOptions from "@domain/Utils/PaginationOptions";

const campaignRepository = container.get<ICampaignRepository>(ICampaignRepositoryId);
const issuerRepository = container.get<IIssuerRepository>(IIssuerRepositoryId);
const campaignAddressRepository = container.get<ICampaignAddressRepository>(ICampaignAddressRepositoryId);

export const CampaignAddressLatLong = async () => {
	try {
		const client = new Client({})
		const apiKey = "AIzaSyBxxRxMRoOxMcrFMyoYPV3-8EIqzPh0PGk";

		const allCampaigns = await campaignRepository.fetchAllCampaigns();
		let counter = 1;
		const total = allCampaigns.length;

		await async.eachSeries(allCampaigns, async (campaign) => {
			try {
				console.log("count: ", counter, '/', total)
				counter = counter + 1;

				if (campaign.issuer.latitude == null && campaign.issuer.longitude == null && campaign.issuer.physicalAddress !== null) {
					const issuer = campaign.issuer
					const issuerAddress = `${issuer.physicalAddress}, ${issuer.city}, ${issuer.state} ${issuer.zipCode}`;
					console.log("issuerAddress: ", issuerAddress);

					const response = await client.textSearch({
						params: {
							query: issuerAddress,
							key: apiKey,
						}
					});

					const status = response.data.status;
					if (status === "OK") {
						const { lat, lng } = response.data.results[0].geometry.location;
						issuer.latitude = `${lat}`;
						issuer.longitude = `${lng}`;

						console.log("status of google maps api: ", status);
						console.log(issuer.issuerName);
						console.log(issuer.latitude, issuer.longitude);

						console.log("issuer: ", issuer.issuerId);

						const savedStatus = await issuerRepository.updateIssuer(issuer);

						console.log("save status: ", savedStatus, "\n\n");
					} else {
						console.log("issuer ID: ", issuer.issuerId)
						console.log("Error status: ", status, "\n\n");
					}
				}
			} catch (error) {
				console.log("lat and long error: ", campaign.issuer.issuerId, error.message);
			}
		});

		//get all the campaignAddresses...
		let counterForCampaignAddress = 1;
		const paginationOptions = new PaginationOptions(1, Number.MAX_SAFE_INTEGER);
		const campaignAddresses = await campaignAddressRepository.fetchAll({ paginationOptions });
		const totalCampaignAddreses = campaignAddresses.items.length;

		await async.eachSeries(campaignAddresses.items, async (campaignAddress) => {
			console.log("counter: ", counterForCampaignAddress, " / ", totalCampaignAddreses);
			counterForCampaignAddress = counterForCampaignAddress + 1;

			if (campaignAddress.address !== null) {
				const address = `${campaignAddress.address}, ${campaignAddress.city}, ${campaignAddress.state} ${campaignAddress.zipCode}`;
				console.log("campaignAddress: ", address);

				const response = await client.textSearch({
					params: {
						query: address,
						key: apiKey,
					}
				});

				const status = response.data.status;
				if (status === "OK") {
					const { lat, lng } = response.data.results[0].geometry.location;
					campaignAddress.latitude = `${lat}`;
					campaignAddress.longitude = `${lng}`;

					console.log("status of google maps api: ", status);
					console.log(campaignAddress.campaignAddressId);
					console.log(campaignAddress.latitude, campaignAddress.longitude);

					const savedStatus = await campaignAddressRepository.update(campaignAddress);

					console.log("save status: ", savedStatus, "\n\n");
				} else {
					console.log("issuer ID: ", campaignAddress.campaignAddressId)
					console.log("Error status: ", status, "\n\n");
				}
			} else {
				console.log("address does not exist: ", campaignAddress.campaignAddressId, '\n\n');
			}
		});
	} catch (error) {
		console.error(error);
	}
};
