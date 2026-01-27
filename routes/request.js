const express = require('express');
const requestRouter = express.Router();
const { userAuth } =  require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');


requestRouter.post('/request/send/:status/:senderId',userAuth,async(req,res)=>{
  try {
    const senderId = req.user._id;
    const receiverId = req.params.senderId;
    const status = req.params.status;

    const allowedStatus = ["interested","ignored"];

    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        success : false,
        message : "Bad Request"
      })
    }
    
    const connection = new ConnectionRequest({
      senderId,
      receiverId,
      status
    });

    await connection.save();
    

    return res.status(201).json({
      success : true,
      message : "Request Sent Successfully.",
      connection
    });
    
  } catch (error) {
    return res.status(500).json({
      success : "false",
      message : "Internal Server Erorr"
    })
  }
})

module.exports = requestRouter;