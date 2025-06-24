class DatabaseError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, DatabaseError);
    this.name = 'DatabaseError';
    this.message =
      typeof message === 'object' &&
      message.name === 'SequelizeDatabaseError' &&
      message.original &&
      message.original.sqlMessage
        ? message.original.sqlMessage
        : this.message || this.name;
  }
}

export default DatabaseError;
