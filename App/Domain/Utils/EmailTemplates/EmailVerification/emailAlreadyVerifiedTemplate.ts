import CustomMessageTemaplate from '../CustomMessageTemaplate';
export default CustomMessageTemaplate.replace(
  '{@MESSAGE}',
  "<span style='min-width:50vw;display:block;'>Looks like your email has already been verified. <br/> Try logging in! &#128519</span>",
).replace('{@TITLE}', 'Oops');
