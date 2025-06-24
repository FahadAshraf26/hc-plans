import CampaignMedia from '../../Domain/Core/CamapignMedia/CampaignMedia';

type fileType = {
    path: string;
    mimetype: string;
    filename: string;
    originalPath: string;
};

class CreateCampaignMediaDTO {
    private media: CampaignMedia[];
    private campaignId: string;

    constructor(campaignId: string) {
        this.media = [];
        this.campaignId = campaignId;
    }

    setMedia(file: fileType) {
        const {path, mimetype: mimeType, filename: name, originalPath} = file;
        const media = CampaignMedia.createFromDetail(
            this.campaignId,
            name,
            path,
            mimeType,
            originalPath,
        );
        this.media.push(media);
    }

    setVideoLink(videoLink) {
        const media = CampaignMedia.createFromDetail(
            this.campaignId,
            "video",
            videoLink,
            "video/youtube",
            videoLink
        );
        this.media.push(media)
    }

    getCampaignId(): string {
        return this.campaignId;
    }

    getCampaignMedia(): CampaignMedia[] {
        return this.media;
    }
}

export default CreateCampaignMediaDTO;
