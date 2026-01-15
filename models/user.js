const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const userSchema = new Schema(
  {
   name : {
    type : String,
    required : true,
    trim : true,
    minLength : 2
   },
   email: {
    type : String,
    required : true,
    lowercase : true,
    trim : true,
    unique : true
   },
   password : {
    type : String,
    required : true,
    minLength : 10,
    select : false,
   },

   profilePhoto : {
    type : String,
    default : ""
   },

   bio : {
    type : String,
    maxLength : 300
   },

   skills: [   // here we have taken array ,skills can be many and schema is decided upon the element of the array
      {
        type: String,
        trim: true,
      },
    ],

  experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid", "Senior"], // choice to select
      default: "Fresher",
    },

    location: {
      type: String,
    },

    githubUrl: {
      type: String,
    },

    linkedinUrl: {
      type: String,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);


const User = mongoose.model('User',userSchema);
module.exports = {User};