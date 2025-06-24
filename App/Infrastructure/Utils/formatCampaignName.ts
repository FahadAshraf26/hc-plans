export default function formatCampaignNameWithQuotes(campaignName: string): string {
    const escapedInput = campaignName.includes("'")
        ? campaignName.replace(/'/g, "''")
        : campaignName;
    return `'${escapedInput}'`;
}