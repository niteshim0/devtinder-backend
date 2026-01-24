const express = require('express');
const authRouter = express.Router();
const {User} = require('../models/user');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
  try {
    // validate input
    validateSignUpData(req);

    const {
      name,
      email,
      password,
      profilePhoto,
      bio,
      skills,
      experienceLevel,
      location,
      githubUrl,
      linkedinUrl,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePhoto,
      bio,
      skills,
      experienceLevel,
      location,
      githubUrl,
      linkedinUrl
    });


    await user.save();

    return res.status(201).json({
      success: true,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    
    
    const isValid = await bcrypt.compare(password, user.password);


    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = user.generateJWT();

    res.cookie('token',token,{ expires: new Date(Date.now() + 90000)});
  
    return res.status(200).json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


module.exports = authRouter;