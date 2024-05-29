const jwt = require("jsonwebtoken");
const Audiobook = require("../models/audiobook");
const User = require('../models/user')
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');


exports.requireSignin = async (req, res, next) => {
 
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);


    req.user = user;
    
  } else {
    return res.status(400).json({ message: "Authorization required" });
  }
  next();

};

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "User access denied" });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    if (req.user.role !== "super-admin") {
      return res.status(400).json({ message: "Admin access denied" });
    }
  }
  next();
};





// audiobook-------------------------------------------
exports.getAudiobook = async (req, res, next) => {
  try {
    const audiobook = await Audiobook.findById(req.params.id);

    if (!audiobook) {
      return res.status(404).json({ message: 'Audiobook not found' });
    }
    req.audiobook = audiobook;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};