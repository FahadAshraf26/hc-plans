export default `
<div>
<p>
The following user’s KYC check has returned a failure status.
<table style="width:100%;border: 1px solid black">
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">User Id</th>
    <td style="border: 1px solid black">{@USER_ID}</td>
  </tr>
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">First Name</th>
    <td style="border: 1px solid black">{@FIRST_NAME}</td>
  </tr>
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">Last Name</th>
    <td style="border: 1px solid black">{@LAST_NAME}</td>
  </tr>
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">Email</th>
    <td style="border: 1px solid black">{@EMAIL}</td>
  </tr>
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">DOB</th>
    <td style="border: 1px solid black">{@DOB}</td>
  </tr>
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">SSN</th>
    <td style="border: 1px solid black">{@SSN}</td>
  </tr>
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">City</th>
    <td style="border: 1px solid black">{@CITY}</td>
  </tr>
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">State</th>
    <td style="border: 1px solid black">{@STATE}</td>
  </tr>
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">Zip Code</th>
    <td style="border: 1px solid black">{@ZIP_CODE}</td>
  </tr>
</table>
<p>
Please perform a manual check and update the status in the Admin panel and in the transactional system of record.
</p> 
<br />
 Thank you</p>
</div>`;
