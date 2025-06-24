export default `
<div>
    <p>
      {@USERNAME} requested capital for their business {@BUSINESSNAME} 
    </p>
    <p>
      Business Details:
      <ul>
        <li>BusinessName: {@BUSINESSNAME}</li>
        <li>State: {@STATE}</li>
        <li>Description: {@DESCRIPTION}</li>
        <li>CapitalRequired(USD): {@CAPITALREQUIRED}</li>
        <li>Purpose: {@CAPITALREASON}</li>
      </ul>
    </p>
    <p>
      User Details:
      <ul>
          <li>Email: {@EMAIL}</li>
      </ul>
    </p>
</div>`;
