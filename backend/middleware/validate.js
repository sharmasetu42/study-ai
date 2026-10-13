// ============================================================
//  middleware/validate.js
//  Reads express-validator errors and returns a clean 400.
// ============================================================

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // first error message
      errors:  errors.array(),
    });
  }
  next();
};

module.exports = { validate };
