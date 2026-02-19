const express = require('express');
const userRouter = express.Router();
const { ConnectionRequest } = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');
const { User } = require('../models/user');
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
.get("/user/display/feed",
 userAuth,
 async(req,res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser)
  // read about comparison and logical operators in mongodb
  // set data structure in JS
  const connectionRequest = await ConnectionRequest.find({
        $or : [
          {senderId : loggedInUser._id },
          {receiverId : loggedInUser._id}
        ]
  }).select("senderId receiverId");


  const hideUsersFromFeed = new Set();

  connectionRequest.forEach((req)=>{
    hideUsersFromFeed.add(req.senderId.toString());
    hideUsersFromFeed.add(req.receiverId.toString());
  });
  
  // read about nesting of comparison and logical operators from Operators
  // in MongoDB Docs --> logic similar to SQL but its easy than SQL

  // displays only those people , who are not interested , ignored , accepted , rejected 
  // either by me or them
  const displayUsers = await User.find({
    $and : [
      {_id : {$nin : Array.from(hideUsersFromFeed)}},
      {_id : {$ne : loggedInUser._id}}
    ]
  });
  
  return res.status(200).send({
    success : true,
    message : "Feed of loggedInUser",
    displayUsers
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