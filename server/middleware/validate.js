const { z } = require('zod');

/**
 * Higher-order middleware to validate Express requests using Zod schemas.
 * Pass in an object like { body: myZodSchema } or { query: myZodSchema }.
 */
const validate = (schema) => async (req, res, next) => {
  try {
    if (schema.params) {
      await schema.params.parseAsync(req.params);
    }
    if (schema.query) {
      await schema.query.parseAsync(req.query);
    }
    if (schema.body) {
      const validatedBody = await schema.body.parseAsync(req.body);
      // Express 5 allows mutating req.body but often blocks re-assignment of req.query/params
      // Here we only update body's fields to preserve defaults/transforms
      Object.assign(req.body, validatedBody);
    }
    return next();
  } catch (error) {
    if (error && (error.errors || error.issues)) {
      const errsArray = error.errors || error.issues;
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errsArray.map(err => ({
          field: err.path ? err.path.join('.') : 'unknown',
          message: err.message
        }))
      });
    }
    console.error("Validation error:", error);
    return res.status(400).json({ success: false, message: 'Validation failed', error: error.message || error });
  }
};

module.exports = validate;
