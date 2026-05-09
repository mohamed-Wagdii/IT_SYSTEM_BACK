const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerSchema, loginSchema } = require("./validation/authValidation");

const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: error.details.map((err) => err.message) });
    }
    const { username, email, password, role, department } = value;

    const userExit = await User.findOne({ email });

    if (userExit) return res.status(400).json({ msg: "user already exist" });

    // const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      role,
      department,
    });
    res.status(201).json({
      msg: "Done Created Account",
    });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: error.details.map((err) => err.message),
      });
    }
    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "please create your account first" });

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(400).json({ msg: "invalid password" });

    const token = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  register,
  login,
};
