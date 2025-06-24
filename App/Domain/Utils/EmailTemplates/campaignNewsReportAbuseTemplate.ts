export default `
<div>
<p> {@EMAIL} reported abuse on a business update!</p>
<p style="margin-bottom: 0px;">
Details: 
<br>
<p style="padding: 0 1rem; margin-top: 5px;">
    CampaignName: {@CAMPAIGN_NAME}
    <br>
    total reports: {@REPORT_COUNT}
    <br>
    update Title: {@TITLE}
</p>
</p>
<p style="margin-bottom: 0px;">
 Feedback: 
<br>
<p style="padding: 0 1rem; margin-top: 5px;">{@FEEDBACK}</p>
</p>
</div>
`;
