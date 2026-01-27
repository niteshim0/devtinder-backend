const express = require('express');
const authRouter = express.Router();
const {User} = require('../models/user');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const { generateOtp, hashOtp } = require('../utils/otp');
const { verify } = require('jsonwebtoken');


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

    res.cookie('token',token,{ expires: new Date(Date.now() + 900000000)});
  
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

authRouter.post('/logout', (req, res) => {
  // cleanup task(I don't know for now)
  res.clearCookie("token"); // clear the cookie or expire the token now
  //res.cookie("token",null,{expires : Date.now()});
  return res.status(200).json({
    success : true,
    message : "Direct to signup or login page."
  })
});

authRouter.post('/forgotPassword',async (req,res) => {
   const {email} = req.body;

   const user = await User.findOne({email});

   if(!user){
    return res.status(200).json({
      success : true,
      message : "If account exists,otp sent to mail!"
    })
   }

   const otp = generateOtp();

  user.resetOtp = hashOtp(otp);
  user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
  user.otpVerified = false;

  await user.save({ validateBeforeSave: false });

  console.log(otp);

  // next(verify-otp);
  // next(reset-password);

})

module.exports = authRouter;