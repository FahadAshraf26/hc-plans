import nodePath from 'path';
const ralewayFont = nodePath.resolve(__dirname, './fonts/Raleway-Bold.ttf');
const openSans = nodePath.resolve(__dirname, './fonts/OpenSans.ttf');

export default `
<div>
  <p style="text-align: center;font-size: 38px; margin-top:0;font-weight: ${ralewayFont}">
    Welcome to Honeycomb!
  </p>
  <p style="text-align: left;font-weight: ${openSans}">
    You are on your way to investing in small businesses. Simply
    click the link below to complete the sign-up process.
    <p style="font-weight: ${openSans}">
    <a href="{@EMAIL_LINK}" style="color: #048af7; font-weight: bold;"
      >CLICK ME TO VERIFY EMAIL</a
    >
    </p>
    <p style="font-weight: ${openSans}">
    If you have any questions, just email us at <a href="mailto:support@honeycombcredit.com">support@honeycombcredit.com</a>.
    </p>
     From,
     <p style="font-weight: ${openSans}">The Honeycomb Team</p>
  </p>
</div>
`;
