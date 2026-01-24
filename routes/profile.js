const express = require('express');
const profileRouter = express.Router();
const { userAuth } =  require('../middlewares/auth');

profileRouter.get('/profile',userAuth, async (req,res)=>{
  try {
    const user = req.user;
    const {name,profilePhoto,bio,skills,location} = user;
    return res.status(200).json({
     name,
     profilePhoto,
     bio,
     skills,
     location
    })

  } catch (error) {
    return res.status(404).json({
      success : "false",
      message : "Profile don't exist"
    })
  }
})

module.exports = profileRouter;