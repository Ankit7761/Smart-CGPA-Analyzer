const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetCGPA: user.targetCGPA,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetCGPA: user.targetCGPA,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

const updateTargetCGPA = async (req, res) => {
  const { targetCGPA } = req.body;
  if (targetCGPA < 0 || targetCGPA > 10) {
    res.status(400);
    throw new Error("Target CGPA must be between 0 and 10");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { targetCGPA },
    { new: true, runValidators: true }
  ).select("-password");
  res.json(user);
};

module.exports = { registerUser, loginUser, getMe, updateTargetCGPA };
