const express = require('express');
const profileRouter = express.Router();
const { userAuth } =  require('../middlewares/auth');
const { validateEditData } = require('../utils/validation');


profileRouter.get('/view',userAuth, async (req,res)=>{
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

profileRouter.patch('/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      return res.status(422).json({
        success: false,
        message: "Invalid fields in request"
      });
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    return res.status(200).json({
      success: true,
      data: loggedInUser
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


module.exports = profileRouter;