export default (schema) => async (req, res, next) => {
  try {
    const result = await schema.validateAsync(req.body);
    if (!result.error) {
      next();
    }
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      errorCause: error.name,
      missingParams: error.details[0].path,
      message: error.details[0].message,
    });
  }
};
