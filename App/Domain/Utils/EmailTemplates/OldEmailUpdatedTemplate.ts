import customEmailTemplate from "./CustomMessageTemaplate"
export default customEmailTemplate
    .replace(
        '{@MESSAGE}',
        "<span style='display:block;'>This is an expired link. Please verify with the most recent verify email sent to your inbox. Contact us at <a href='mailto:info@honeycomb.com'>info@honeycomb.com</a> with any issues.</span>",
    )
    .replace('{@TITLE}', 'Oops');
