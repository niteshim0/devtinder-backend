const express = require('express');
const requestRouter = express.Router();
const { userAuth } =  require('../middlewares/auth');

requestRouter.post('/sendConnectionRequest',userAuth,async(req,res)=>{
  try {
    const user = req.user;
    return res.status(200).json({
      success : "true",
      message : `I ${user.name} is sending connection request to someone which is present in my feed.`,
    })
  } catch (error) {
    return res.status(500).json({
      success : "false",
      message : "Internal Server Erorr"
    })
  }
})

module.exports = requestRouter;