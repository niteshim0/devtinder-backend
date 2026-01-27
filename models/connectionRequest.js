const mongoose = require('mongoose');
const {Schema} = mongoose;

const connectionRequestSchema = new Schema({
  senderId : {
    type : mongoose.Types.ObjectId,
  },
  receiverId : {
    type : mongoose.Types.ObjectId,
  },
  status : {
    type : String,
    endum : {
      values : ["pending","accepted","rejected"],
      message : `${VALUE} is not suitable status type.`
    }
  }
  },
{
  timestamps : true,
})

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = {ConnectionRequest};