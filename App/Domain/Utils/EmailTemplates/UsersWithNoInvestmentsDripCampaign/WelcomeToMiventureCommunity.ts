import footerHtml from './Footer';

export default `
<div>
    <p>
        Hi {@USERNAME},
    </p>
    <br />
    <p>
        We’re happy you are here!
    </p>
    <p>
        Now you can invest in exciting early stage startups with as little as $100.
    </p>
    <p>
        We started Honeycomb because we believe innovation and entrepreneurship makes America stronger. Unfortunately, traditional methods of raising capital don’t work for everyone, especially founders outside big tech hubs. Today roughly 75% of venture capital raised annually goes to startups in California, New York and Massachusett.
    </p>
    <p>
        We believe great people and ideas exist all over the country and we’d like to help investors nationwide invest in ideas they love and founders they believe in.
    </p>
    <p>
    We look forward to delivering new opportunities with high-growth potential every month. If you have any questions or feedback, feel free to respond to this email or reach us at <a  href="mailto:info@honeycomb.com">info@honeycomb.com</a>.
    </p>
    <br />
    <p>
        Best,
    </p>
    ${footerHtml}
</div>
`;
