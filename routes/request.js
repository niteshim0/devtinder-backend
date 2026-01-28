requestRouter.post(
  "/request/send/:status/:receiverId",
  userAuth,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const senderId = req.user._id;
      const receiverId = req.params.receiverId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      // 1. Validate status
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      // 2. Self request check
      if (senderId.toString() === receiverId) {
        return res.status(400).json({ success: false, message: "Cannot request yourself" });
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
        return res.status(404).json({ success: false, message: "Receiver not found" });
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
        await reverseRequest.save({ session });

        await Match.create(
          [{ users: [senderId, receiverId] }],
          { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
          success: true,
          message: "It's a match! 🎉"
        });
      }

      // 8. Ignored case
      if (reverseRequest && status === "ignored") {
        reverseRequest.status = "rejected";
        await reverseRequest.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
          success: false,
          message: "Request ignored"
        });
      }

      // 9. Save new request
      await ConnectionRequest.create(
        [{ senderId, receiverId, status }],
        { session }
      );

      await session.commitTransaction();

      return res.status(201).json({
        success: true,
        message: "Request sent successfully"
      });

    } catch (err) {
      await session.abortTransaction();
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    } finally {
      session.endSession();
    }
  }
);
