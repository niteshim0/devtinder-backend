const express = require('express');
const userRouter = express.Router();
const { ConnectionRequest } = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');
const USER_SAFE_DATA = "name bio skills experienceLevel location githubUrl linkedinUrl";

userRouter.get(
  "/user/requests/pending",
  userAuth,
  async(req,res)=>{
    try {

      const loggedInUser = req.user;
        
      const pendingRequests = await ConnectionRequest.find({
        receiverId: loggedInUser._id,
        status : "interested"
      })
      .populate("senderId",USER_SAFE_DATA)


      return res.status(200).json({
        success : true,
        message : "Pending Requests fetched",
        pendingRequests
      })

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
)
.get(
  "/user/connections/accepted",
  userAuth,
  async(req,res) => {
    try {
      
      const loggedInUser = req.user;
      const connectionRequest = await ConnectionRequest.find({
        $or : [
          {senderId : loggedInUser._id , status : "accepted"},
          {receiverId : loggedInUser._id , status : "accepted"}
        ]
      })
      .populate("senderId",USER_SAFE_DATA)
      .populate("receiverId",USER_SAFE_DATA)

      console.log(connectionRequest);

      const refinedData = connectionRequest.map((connection) => {
         if(connection.senderId.equals(loggedInUser._id)){
            return connection.receiverId;
         }
         return connection.senderId;
      })

      return res.status(200).json({
        success : true,
        message : "Connection Requests Fetched Successfully!",
        refinedData
      })

      
    } catch (error) {
      return res.status(500).json({
        success : false,
        message : "Internal Server Error"
      })
    }
  }
)


module.exports = userRouter;