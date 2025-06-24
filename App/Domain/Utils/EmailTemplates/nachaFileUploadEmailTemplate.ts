export default `
<div style="font-family: Arial, sans-serif; color: #000000;">
  <p style="color: #000000;">
    Folder Location on SFTP: {$folderPath}<br />
    Total amount for ACH: {$totalAmount}
  </p>
  
  <p style="color: #000000;">Details of each investor:</p>
  
  <table style="border-collapse: collapse; width: 70%; max-width: 600px; margin-bottom: 20px;">
    <tr>
      <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2; text-align: center;">Investor Name</th>
      <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2; text-align: center;">Refund Amount</th>
    </tr>
    {$tableContent}
  </table>
  
  <p style="color: #000000;">Thanks!</p>
</div>`;
