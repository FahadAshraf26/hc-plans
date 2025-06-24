import nodePath from 'path';
const ralewayFont = nodePath.resolve(__dirname, './fonts/Raleway-Bold.ttf');
const openSans = nodePath.resolve(__dirname, './fonts/OpenSans.ttf');
export default `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap" rel="stylesheet" />
  <link href="https://fonts.cdnfonts.com/css/open-sans" rel="stylesheet" />
  <title>Honeycomb | Email Verification</title>
  <style>
    * {
      padding: 0px;
      margin: 0px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
        Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    body {
      background-color: #fafafa;
    }

    .container {
      padding: 1rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
    }

    .inner-container {
      background-color: white;
      color: black;
      max-width: 600px;
      height: 280px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid lightgrey;
      border-radius: 10px;
      flex-direction: column;
      box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
        0 15px 40px rgba(166, 173, 201, 0.2);
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="inner-container">
      <a href="{@LOGIN_LINK}">
        <img src="https://storage.googleapis.com/honeycomb-public-uploads/uploads/Honeycomb_Credit_Logo_Admin_Panel.png"
          alt="honeycomb-logo" width="130px" height="50px" style="
              display: block;
              margin-left: auto;
              margin-right: auto;
              background-size: cover;
            " />
      </a>
      <h1 style="font-family: Raleway !important;">Congratulations!</h1>
      <br />
      <span style="padding: 10px; text-align: center; font-family: 'Open Sans', sans-serif;">
        Your email has been verified successfully!
      </span>
      <br />
      <span style="padding: 10px; text-align: center; font-family: 'Open Sans', sans-serif;">
        Redirecting in <span id="time">5</span> seconds
      </span>
      <br />
      <span style="padding: 10px; text-align: center; font-family: 'Open Sans', sans-serif;">
        <a href="{@VERIFY_LINK}">Click here if you are not redirected</a>
      </span>
    </div>
  </div>
  <script>
    function startTimer(duration, display) {
      var timer = duration,
        minutes,
        seconds;
      var interval = setInterval(function () {
        seconds = parseInt(timer % 60, 10);

        display.textContent = seconds < 0 ? 0 : seconds;
        --timer
        if (timer < 0) {
          clearInterval(interval);
          window.location.href = "{@VERIFY_LINK_1}";
        }
      }, 1000);
    }

    window.onload = function () {
      var fiveSeconds = 5,
        display = document.querySelector('#time');
      startTimer(fiveSeconds, display);
    };
  </script>
</body>

</html>
`;
