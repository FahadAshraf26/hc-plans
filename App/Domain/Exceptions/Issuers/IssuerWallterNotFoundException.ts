class IssuerWallterNotFoundException extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, IssuerWallterNotFoundException);
    this.name = 'IssuerWallterNotFoundException';
    this.message = message || this.name;
  }
}

export default IssuerWallterNotFoundException;
