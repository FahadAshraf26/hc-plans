export default `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Honeycomb  | InvestorAccredition</title>
    <style>
      * {
        padding: 0px;
        margin: 0px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
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
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid lightgrey;
        border-radius: 10px;
        flex-direction: column;
         box-shadow: 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="inner-container">
        <img
        src="https://storage.googleapis.com/honeycomb-public-uploads/uploads/Honeycomb_Credit_Logo_Admin_Panel.png"
        alt="honeycomb-logo"
        width="50px"
        height="50px"
        style="display: block; margin-left: auto; margin-right: auto;"
        />
        <h1>Congratulations!</h1>
        <br />
        <span style="padding: 10px; text-align: center;">
          Your accreditation check request is being processed. We will update
          your accreditation status in our app as soon as it is processed.
        </span>
      </div>
    </div>
  </body>
</html>
`;
