export default `
    <div>
        <p> An unxpected error occured </p>
        <p> email of user that faced the error: {@EMAIL} </p>
        <p> exception Id: {@EXCEPTION_ID} </p>
        <p> error origin: {@ERROR_ORIGIN} </p>
        <p>
            <span>Error Message:</span>
            <br />
            <span style="padding:1rem"> {@ERROR_MESSAGE} </span>
        </p>
    </div>
`;
