const mongoose = require('mongoose');
const {Schema} = mongoose;

const matchSchema = new Schema({
  users : [
    {
      type : Schema.Types.ObjectId,
      ref : "User",
      required : true
    }
  ],
  isActive : {
    type : Boolean,
    default : true
  }

},{
  timestamps : true
})


const Match = mongoose.model("Match",matchSchema);

module.exports = {Match};

