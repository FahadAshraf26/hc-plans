export default './CustomMessageTemaplate'
  .replace(
    '{@MESSAGE}',
    "<span style='min-width:50vw;display:block;'>Something went wrong!<br/> Contact support at <a href='mailto:support@honeycombcredit.com'>support@honeycombcredit.com</a>.</span>",
  )
  .replace('{@TITLE}', 'Oops');
