import footerHtml from '../UsersWithNoInvestmentsDripCampaign/Footer';

export default `
<div>
    <p>
        Hi {@USERNAME},
    </p>
    <br />
   <p>
        We noticed you signed up to Honeycomb, but haven’t made an investment yet.
   <p>
        In the time it takes to make a cup of coffee you can browse unique business opportunities. You can watch videos, read about the founders' journey to build their company and even ask them questions directly.
   </p>
   <p>
        Investing is easy:
        <br>
        <ul>
            <li>Browse business opportunities</li>
            <li>Invest in a business you love</li>
            <li>Relax and track your returns</li>
        </ul>
   </p>
   <p>
        If there’s anything blocking you from moving forward, please let me know, we love feedback.   </p>
   <p>
        Enjoy the rest of your day!   
    </p>
    <br />
   <p>
        Best,
   </p>
    ${footerHtml}
</div>
`;
