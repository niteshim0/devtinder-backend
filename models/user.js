const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const validator  = require('validator');
const jwt = require('jsonwebtoken')

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
    unique : true,
    /* validate : {
       validator(value){
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
       },
       message : props => `${props.value} is not a valid email`
     }  validator function provided my mongoose to custom validate certain 
        fields in our document 
     industry standard is to use npm validator package*/
      validate : [validator.isEmail,"Invalid Email"] 
      // industry standard use npm package

   },
   password : {
    type : String,
    required : true,
    select : false,
   },

   profilePhoto : {
    type : String,
    default : "https://www.shutterstock.com/shutterstock/photos/2470054311/display_1500/stock-vector-avatar-gender-neutral-silhouette-vector-illustration-profile-picture-no-image-for-social-media-2470054311.jpg",
    validate : [validator.isURL,"Invalid Photo URL"]
   },

   bio : {
    type : String,
    maxLength : 300
   },

  skills: {
      type: [String],
      trim: true,
      validate: {
        validator: function (value) {
            return value.length >= 2;
        },
      message: "At least 2 skills are required"
    }
  },

  experienceLevel: {
      type: String,
      enum: {
        values : ["Fresher", "Junior", "Mid", "Senior"],
        message: `{VALUE} is not a valid experience level`
       },
      default: "Fresher",
      // validate(value) {
      //    if(!["Fresher", "Junior", "Mid", "Senior"].includes(value)){
      //     throw new Error(`${value} is not valid experienceLevel option`)
      //    }
      // } not a good approach use enum
    },

    location: {
      type: String,
    },

    githubUrl: {
      type: String,
      validate : [validator.isURL,"Invalid github URL"]
    },

    linkedinUrl: {
      type: String,
      validate : [validator.isURL,"Invalid LinkedIn URL"]
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

// Query Helpers
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { _id: this._id },
    "SecretJWTKEY",
    { expiresIn: "1d" }
  );
};


userSchema.methods.passwordValidator = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};



const User = mongoose.model('User',userSchema);
module.exports = {User};