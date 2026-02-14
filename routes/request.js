const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');
const { User } = require('../models/user');
const { Match } = require('../models/match');

requestRouter.post(
  "/request/send/:status/:receiverId",
  userAuth,
  async (req, res) => {
    try {
      const senderId = req.user._id;
      const { receiverId, status } = req.params;

      const allowedStatus = ["interested", "ignored"];

      // 1. Validate status
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status"
        });
      }

      // 2. Self request check
      if (senderId.toString() === receiverId) {
        return res.status(400).json({
          success: false,
          message: "Cannot request yourself"
        });
      }

      // 3. Rate limit
      const todayCount = await ConnectionRequest.countDocuments({
        senderId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      if (todayCount >= 100) {
        return res.status(429).json({
          success: false,
          message: "Daily request limit reached"
        });
      }

      // 4. Receiver existence
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({
          success: false,
          message: "Receiver not found"
        });
      }

      // 5. Duplicate request check
      const existingRequest = await ConnectionRequest.findOne({
        senderId,
        receiverId
      });

      if (existingRequest) {
        return res.status(409).json({
          success: false,
          message: "Request already sent"
        });
      }

      // 6. Reverse request check
      const reverseRequest = await ConnectionRequest.findOne({
        senderId: receiverId,
        receiverId: senderId
      });

      // 7. Mutual interested → MATCH
      if (
        reverseRequest &&
        reverseRequest.status === "interested" &&
        status === "interested"
      ) {
        reverseRequest.status = "accepted";
        await reverseRequest.save();

        await Match.create({
          users: [senderId, receiverId]
        });

        return res.status(201).json({
          success: true,
          message: "It's a match! 🎉"
        });
      }

      // 8. Ignored case
      if (reverseRequest && status === "ignored") {
        reverseRequest.status = "rejected";
        await reverseRequest.save();

        return res.status(200).json({
          success: true,
          message: "Request ignored"
        });
      }

      // 9. Save new request
      await ConnectionRequest.create({
        senderId,
        receiverId,
        status
      });

      return res.status(201).json({
        success: true,
        message: "Request sent successfully"
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
);


requestRouter.patch(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const allowedStatus = ["accepted", "ignored"];
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const connectionReq = await ConnectionRequest.findOne({
        senderId: requestId,
        receiverId: loggedInUser._id,
        status : "interested"
      });

      if (!connectionReq) {
        return res.status(404).json({
          success: false,
          message: "Connection request not found",
        });
      }

      if (!connectionReq.receiverId.equals(loggedInUser._id)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to review this request",
        });
      }

      if (connectionReq.status !== "interested") {
        return res.status(409).json({
          success: false,
          message: `Request already ${connectionReq.status}`,
        });
      }

      connectionReq.status = status;
      const updatedConnection = await connectionReq.save();

      return res.status(200).json({
        success: true,
        message: `Connection request ${status}`,
        updatedConnection,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);


module.exports = { requestRouter };
