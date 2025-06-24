export default `
<div>
<p>Identity Check for {@EMAIL} requires manual review</p>
  <p style="text-align: left;">
    Discrepancies:
    <ul>
    {@QUALIFIERS}
    </ul>
    <br />
    Matched User data:
    <ul>
    {@USER_DATA}
    </ul>
    <br />
    <span>
      If you have any questions, just email us at
      <a href="mailto:info@honeycomb.com">info@honeycomb.com.</a>
    </span>
  </p>
</div>
`;
