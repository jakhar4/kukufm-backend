const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, email, firstName, lastName) => {
  return jwt.sign({ _id, email, firstName, lastName }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};


exports.signup = async (req, res) => {
  console.log('got at signup request')
  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ error: "User already registered" });
    }

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);

    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
    });

    const user = await _user.save();

    if (user) {
      const token = generateJwtToken(user._id, user.email, user.firstName, user.lastName);
      const { _id, firstName, lastName, email, role, fullName } = user;

      return res.status(201).json({
        ok:true,
        token,
        user: { _id, firstName, lastName, email, role, fullName },
      });
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


exports.signin = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPassword = await user.authenticate(req.body.password);

    if (!isPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateJwtToken(user._id, user.email, user.firstName, user.lastName);
    const { _id, firstName, lastName, email, role, fullName } = user;

    res.status(200).json({
      ok:true,
      token,
      user: { _id, firstName, lastName, email, role, fullName },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};



exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};


exports.getuser = async (req, res) => {
  try {
    // res.status(200).json('user caught')
    const userData = req.user;
    // console.log(userData)

    return res.status(200).json(userData)
  } catch (error) {
    res.json({message : error.message})
  }
}