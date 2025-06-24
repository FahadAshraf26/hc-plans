export default `
<div>
    <p>Hi {@FIRST_NAME},</p>
    <p>
        {@CAMPAIGN_NAME}  has recently made changes to the terms of the offering
    </p>
    <p>
        You can view the detailed changes in the campaign in the
        Honeycomb app under Offering documents.
    </p>
    <p>
        You have commited \${@AMOUNT} in {@CAMPAIGN_NAME}. If you do not reconfirm your commitment within five (5) business days of this notice, your previously submitted commitment will be canceled.
    </p>
    <p>
        <a href="{@OFFER_RECONFIRM_LINK}" style="color: #048af7; font-weight: bold;">RECONFIRM BY CLICKING HERE.</a>
    </p>
    <p>
        If you have any questions, you can always reach out to us via the Honeycomb Platform or at <a href="mailto:support@honeycombcredit.com">support@honeycombcredit.com</a>.
    </p>
    <p>
        From, <br />
        The Honeycomb Team
    </p>
</div>
`;
