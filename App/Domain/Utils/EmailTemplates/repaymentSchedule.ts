export default `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{@ISSUER_NAME}'s Payment Schedule</title>
    <style>
      * {
        padding: 0px;
        margin: 0px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      }
      body {
        background-color: #f0f2f5;
      }
      .container {
        padding: 1rem;
        height: 100vh;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
      }
      title {
        text-align:center;
        font-size: 32px;
        color: black;
        width:100%;
        display: inline-block;
        margin: 0 auto;
        justify-content: center;
        margin-bottom: 20px;
      }

      content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 80vw;
        min-width: 80vw;
        margin: 0 auto;
        margin-bottom:20px
      }

      #payments {
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      #payments td,
      #payments th {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
      }

      #payments tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      #payments tr:hover {
        background-color: #ddd;
      }

      #payments th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        background-color: #157dfc;
        color: white;
      }

      .mb-20 {
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <img
      src="https://storage.googleapis.com/honeycomb-public-uploads/uploads/Honeycomb_Credit_Logo_Admin_Panel.png"
      alt="honeycomb-logo"
      width="100px"
      height="100px"
      style="display: block; margin-left: auto; margin-right: auto;"
    />
    <br />
    <title>
      {@ISSUER_NAME}'s Payment Schedule
    </title>
    <content>
      <table id="payments" class="mb-20">
        <tr>
          <th>Campaign Name</th>
          <th>Amount Raised</th>
          <th>Target Return (%)</th>
          <th>Total Owed</th>
          <th>First Payment Date</th>
        </tr>
        <tr>
          <td>{@CAMPAING_NAME}</td>
          <td>{@AMOUNT_RAISED}</td>
          <td>{@TARGET_RETURN}</td>
          <td>{@TOTAL_OWED}</td>
          <td>{@REPAYMENT_START_DATE}</td>
        </tr>
      </table>

      <table id="payments">
        <tr>
          <th>Date</th>
          <th>Total Payment ($)</th>
          <th>Principal ($)</th>
          <th>Interest ($)</th>
          <th>Unpaid Balance ($)</th>
        </tr>
       {@TABLE_DATA}
      </table>
    </content>
  </body>
</html>
`;
