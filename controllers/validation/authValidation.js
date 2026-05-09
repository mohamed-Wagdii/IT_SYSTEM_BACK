const joi = require("joi");

const registerSchema = joi.object({
  username: joi.string().min(6).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(255).required(),
  role: joi.string().valid("admin", "user").default("user"),
  department: joi.string().required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const validate = (schema) => {
  return (req, res, next) => {
    // console.log("Hello from validation");

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    next();
  };
};

module.exports = { registerSchema, loginSchema, validate };
