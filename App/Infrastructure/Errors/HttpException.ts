class HttpError extends Error {
  public status: number;

  constructor(statusCode, message) {
    super(message);
    Error.captureStackTrace(this, HttpError);
    this.status = statusCode;
  }
}

export default HttpError;
