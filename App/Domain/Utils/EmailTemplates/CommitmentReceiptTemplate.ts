export default `
<!DOCTYPE html>
<html>
  <head>
    <meta charset=UTF-8 " />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Honeycomb</title>
    <style type="text/css">
      .container {
        background-color: #f8f6ed;
        font-size: 1rem;
        max-width: 700px;
        margin: auto;
        overflow: hidden;
      }

      @media (max-width: 425px) {
        .container {
          font-size: 1rem;
          max-width: 100%;
          margin: auto;
        }
      }

      .content-center-space-between {
        display: flex;
        justify-content: space-between;
      }
      .left-circular-lines {
        left: 0;
        width: 8%;
        height: 130px;
        border-right: 15px solid #ffd33b;
        border-bottom: 13px solid #ffd33b;
        border-bottom-right-radius: 150px;
        padding: 0 10px 10px 0;
      }
      .left-circular-line-1 {
        height: 83%;
        border-right: 15px solid #3f296b;
        border-bottom: 13px solid #3f296b;
        border-bottom-right-radius: 130px;
        padding: 0 10px 10px 0;
      }
      .left-circular-line-2 {
        height: 85%;
        border-right: 15px solid #59b16b;
        border-bottom: 15px solid #59b16b;
        border-bottom-right-radius: 150px;
      }
      @media (max-width: 570px) {
        .left-circular-line-2 {
          padding: 0 10px 0 0;
        }
        .left-circular-line-1 {
          padding: 0 32px 8px 0;
        }
        .left-circular-lines {
          padding: 0 18px 8px 0;
        }
      }
      @media (max-width: 426px) {
        .left-circular-lines {
          padding: 0 24px 8px 0;
        }
      }
      @media (max-width: 321px) {
        .left-circular-lines {
          padding: 0 30px 8px 0;
        }
      }
      .logo-image {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: auto;
        margin-bottom: auto;
        width: 200px;
      }
      @media (max-width: 425px) {
        .logo-image {
          width: 150px;
        }
      }
      @media (max-width: 321px) {
        .logo-image {
          width: 125px;
        }
      }
      .right-circular-lines {
        right: 0;
        width: 8%;
        height: 130px;
        border-left: 15px solid #ffd33b;
        border-bottom: 13px solid #ffd33b;
        border-bottom-left-radius: 150px;
        padding: 0 0 10px 10px;
      }
      .right-circular-line-1 {
        height: 83%;
        border-left: 15px solid #3f296b;
        border-bottom: 13px solid #3f296b;
        border-bottom-left-radius: 130px;
        padding: 0 0 10px 10px;
      }
      .right-circular-line-2 {
        height: 85%;
        border-left: 15px solid #59b16b;
        border-bottom: 13px solid #59b16b;
        border-bottom-left-radius: 150px;
      }
      @media (max-width: 570px) {
        .right-circular-line-2 {
          padding: 0 10px 6px 0; /* Adjusted padding */
          margin-left: 8px;
        }
        .right-circular-line-1 {
          padding: 0 32px 10px 0; /* Adjusted padding */
          margin-left: 10px;
        }
        .right-circular-lines {
          padding: 0 18px 10px 0; /* Adjusted padding */
        }
      }

      @media (max-width: 426px) {
        .right-circular-lines {
          padding: 0 25px 10px 0; /* Adjusted padding */
        }
        .right-circular-line-2 {
          margin-left: 8px;
        }
        .right-circular-line-1 {
          margin-left: 8px;
        }
      }

      @media (max-width: 321px) {
        .right-circular-lines {
          padding: 0 32px 10px 0; /* Adjusted padding */
        }
        .right-circular-line-1 {
          padding: 0 32px 10px 0; /* Adjusted padding */
        }
        .right-circular-line-2 {
          padding: 0 16px 6px 0; /* Adjusted padding */
        }
      }

      .thanks-investment-text {
        font-size: 25px;
        font-weight: bolder;
        text-align: center;
      }
      @media (max-width: 425px) {
        .thanks-investment-text {
          font-size: 16px;
        }
      }
      .invoice-box-container {
        max-width: 80%;
        margin-left: auto;
        margin-right: auto;
        border: 1px solid #fff;
        border-radius: 20px;
        box-shadow: 0 0 5px #f8f6ed;
        font-size: 12px;
        line-height: 24px;
        color: #555;
        background-color: white;
      }
      .invoice-receipt-text {
        text-align: center;
        font-family: sans-serif;
        font-size: 20px;
        font-weight: bolder;
        color: black;
      }
      .invoice-detail-text-container {
        width: 100%;
      }
      .invoice-investor-detail-text {
        width: 50%;
        padding-left: 2%;
        float: left;
      }
      .invoice-investor-detail-value-text {
        font-size: 12px;
        font-weight: bold;
      }
      .invoice-date-head {
        height: 100%;
        text-align: center;
        padding-right: 2%;
        float: right;
        margin-top: 1%;
      }
      .invoice-date-value-text {
        font-weight: bold;
      }
      .invoice-payment-details {
        width: 100%;
      }
      .invoice-payment-details-head {
        padding-left: 5%;
        font-size: 12px;
        font-weight: bold;
        float: left;
      }
      .invoice-payment-details-head-text {
        display: flex;
        padding-right: 5%;
        font-size: 12px;
        font-weight: bold;
        float: right;
      }
      .invoice-payment-details-value-text {
        width: 100%;
      }
      .invoice-payment-detail-bank-details {
        float: left;
        padding-left: 5%;
      }
      .invoice-payment-detail-bank-details-amount {
        display: flex;
        padding-right: 6%;
        float: right;
      }
      .invoice-payment-detail-wallet-details-div {
        width: 100%;
      }
      .invoice-payment-detail-wallet-details {
        float: left;
        padding-left: 5%;
      }
      .invoice-payment-detail-wallet-details-amount {
        float: right;
        display: flex;
        padding-right: 6%;
      }
      .invoice-sub-total-div {
        width: 40%;
        float: right;
        padding-right: 6%;
      }
      .invoice-sub-total-head {
        float: left;
      }
      .invoice-sub-total-text {
        float: right;
        display: flex;
      }
      .invoice-transaction-fee-div {
        width: 40%;
        float: right;
        padding-right: 6%;
      }
      .invoice-transaction-fee-head {
        float: left;
      }
      .invoice-transaction-fee-text {
        float: right;
        display: flex;
      }
      .invoice-total-div {
        width: 40%;
        float: right;
        padding-right: 6%;
      }
      .invoice-total-head {
        float: left;
        font-size: 12px;
        font-weight: bold;
      }
      .invoice-total-text {
        float: right;
        font-size: 12px;
        font-weight: bold;
      }
      .question-email {
        padding-left: 20px;
      }
      .cancel-investment-text {
        padding: 2%;
        font-size: 14px;
      }
      .image-container {
        width: 60%;
        margin-top: 4%;
        background-color: #59b16b;
        color: #fcf6f0;
        border-radius: 25px;
        font-weight: bold;
        border: none;
        margin-left: auto;
        margin-right: auto;
        display: flow-root;
      }
      .image-container-box {
        width: 100%;
        object-fit: fill;
        border-top-right-radius: 25px;
        border-top-left-radius: 25px;
      }
      .image-container-text {
        text-align: center;
      }
      .image-button-link-div {
        margin-bottom: 4%;
      }
      .image-button-link {
        margin-left: 34%;
      }
      .image-button {
        background-color: #ffde17;
        color: rgb(0, 0, 0);
        padding: 10px;
        border-radius: 25px;
        cursor: pointer;
        border: none;
      }
      @media (max-width: 280px) {
        .image-button {
          padding: 4px;
          font-size: 10px; /* further reduce font size for clarity */
          border-radius: 15px; /* even more reduced for tiny screens */
        }
        .image-button-link-div {
          margin-bottom: 4%;
          margin-right: 90px;
        }
        .invoice-transaction-fee-div {
          width: 130%;
          float: right;
          padding-right: 12%;
        }
        .invoice-transaction-fee-head {
          margin-left: 200px;
        }
      }
      @media (max-width: 390px) {
        .image-button {
          padding-left: 5px;
          padding-right: 5px;
          justify-content: center;
          font-size: 12px; /* further reduce font size for clarity */
          border-radius: 15px; /* even more reduced for tiny screens */
        }
        .image-button-link-div {
          margin-bottom: 4%;
          margin-right: 90px;
        }
        .invoice-transaction-fee-div {
          width: 130%;
          float: right;
          padding-right: 12%;
        }
        .invoice-transaction-fee-head {
          margin-left: 190px;
        }
        .invoice-transaction-fee-text {
          margin-left: 7px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content-center-space-between">
        <div class="left-circular-lines">
          <div class="left-circular-line-1">
            <div class="left-circular-line-2"></div>
          </div>
        </div>
        <img
          src="https://storage.googleapis.com/honeycomb-public-uploads/uploads/Honeycomb_Credit_Logo_Admin_Panel.png "
          alt="honeycomb-logo "
          class="logo-image"
        />
        <div class="right-circular-lines">
          <div class="right-circular-line-1">
            <div class="right-circular-line-2"></div>
          </div>
        </div>
      </div>
      <div>
        <p class="thanks-investment-text">
          Thanks for your investment in<br />{@INVESTED_CAMPAIGN_NAME}
        </p>
      </div>
      <div style="display: flex; justify-content: center">
        <div class="invoice-box-container">
          <p class="invoice-receipt-text">Investment Receipt</p>
          <hr class="solid" />
          <div class="invoice-detail-text-container">
            <div class="invoice-investor-detail-text">
              <span>Investor Details</span>
              <br />
              <span class="invoice-investor-detail-value-text"
                >{@FULL_NAME}</span
              >
              <br />
              <span class="invoice-investor-detail-value-text">{@EMAIL}</span>
            </div>
            <div class="invoice-date-head">
              <span>Date</span><br />
              <span class="invoice-date-value-text">{@DATE}</span>
            </div>
          </div>
          <div style="clear: both"></div>
          <hr class="solid" />
          <div class="invoice-payment-details">
            <div class="invoice-payment-details-head">PAYMENT TYPE</div>
            <div class="invoice-payment-details-head-text">AMOUNT</div>
          </div>
          <div style="clear: both"></div>
          <hr class="solid" />
          <div class="invoice-payment-details-value-text">
            <div class="invoice-payment-detail-bank-details">
              {@TRANSACTION_TYPE_1} {@ACCOUNT}
            </div>
            <div class="invoice-payment-detail-bank-details-amount">
              {@AMOUNT1}
            </div>
          </div>
          <div style="clear: both"></div>
          <hr class="solid" />
          <div class="invoice-sub-total-div">
            <div class="invoice-sub-total-head">Subtotal:</div>
            <div class="invoice-sub-total-text">{@SUBTOTAL}</div>
          </div>
          <br />
          <div class="invoice-transaction-fee-div">
            <div class="invoice-transaction-fee-head">
              Transaction Fee ({@FEE_PERCENTAGE_1}%):
            </div>
            <div class="invoice-transaction-fee-text">{@FEE_1}</div>
          </div>
          <div style="clear: both"></div>
          <hr class="solid" />
          <div class="invoice-total-div">
            <div class="invoice-total-head">Total:</div>
            <div class="invoice-total-text">{@TOTAL}</div>
          </div>
          <div style="clear: both"></div>
          <div class="question-email">
            Questions? <br />
            support@honeycombcredit.com
          </div>
          <div style="clear: both"></div>
          <hr class="solid" />
          <div class="cancel-investment-text">
            <p>
              You may cancel your investment up to 48 hours before the campaign
              is closed or by {@TWO_DAYS_BEFORE_CAMPAIGN_CLOSE_DATE}. To cancel
              your investment, reach us at
              <a href="mailto:support@honeycombcredit.com"
                >support@honeycombcredit.com</a
              >
              with a request for cancellation.
            </p>
            <p>{@INTEREST_RATE}</p>
          </div>
        </div>
      </div>
      <div class="image-container">
        <img src="{@LINK}" alt="Card Background" class="image-container-box" />

        <h3 class="image-container-text">Want to keep investing local?</h3>
        <div class="image-button-link-div">
          <a href="{@LIVE_LINK}" class="image-button-link" target="_blank">
            <button class="image-button">Explore live offerings</button>
          </a>
        </div>
      </div>
      <br />
      <br />
    </div>
  </body>
</html>
`;
