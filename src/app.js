const express = require('express');
const app = express();
const { connectDB } = require('../config/database');
const validator = require('validator');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middlewares/auth');

app.use(express.json()) // middleware to convert JSON(text-format) -> JS Object(native data structure)(operations or function can be performed on data structure not on certain text format)
app.use(cookieParser())

app.post('/signup', async (req, res) => {
  try {
    // validate input
    validateSignUpData(req);

    const {
      name,
      email,
      password,
      profilePhoto,
      bio,
      skills,
      experienceLevel,
      location,
      githubUrl,
      linkedinUrl,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePhoto,
      bio,
      skills,
      experienceLevel,
      location,
      githubUrl,
      linkedinUrl
    });


    await user.save();

    return res.status(201).json({
      success: true,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    
    
    const isValid = await bcrypt.compare(password, user.password);


    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = user.generateJWT();

    res.cookie('token',token,{ expires: new Date(Date.now() + 90000)});
  
    return res.status(200).json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.get('/profile',userAuth, async (req,res)=>{
  try {
    const user = req.user;
    const {name,profilePhoto,bio,skills,location} = user;
    return res.status(200).json({
     name,
     profilePhoto,
     bio,
     skills,
     location
    })

  } catch (error) {
    return res.status(404).json({
      success : "false",
      message : "Profile don't exist"
    })
  }
})

app.post('/sendConnectionRequest',userAuth,async(req,res)=>{
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


// get api (finding the details of one person (finding one document in a collection))
app.get('/user',async (req,res) =>{
  try {
  
    const user = await User.find({email : req.body.email})
    /*if no user found an empty array = [] gets returned so managing that don't use (!user) for checking that fails in javascript*/
    if(user.length === 0){
      res.status(404).send("User Not Found");
    }else{
      res.send(user); // it could be out of else such that execute this if block not executes then next line will execute
    }
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
})


app.get('/feed',async (req,res) =>{

  try {
    const users = await User.find(); // no any filtering condition everyone qualifies so gives all the documents in User collection
    if(!users){
      res.status(404).send("Users Not Found");
    }
    res.send(users);
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
})

app.delete('/user', async (req,res) => {

  try {
     console.log(req.body.userId);
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    
    // user will contain deleted document(if found) , otherwise null

    if(!user){
      return res.status(404).json({ message : "User Not Found"});
    }
    
    res.status(200).
    json({ message : "User Deleted Sucessfull",
        name : user.name                  
    });
    

  } catch (error) {
     // only consoling the error won't do in production otherwise   
     // client will be stuck forever
    // make sure to handle it gracefully and give a brief idea to the 
    // client why he can't do certain things
    console.error("Something went wrong:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})


app.patch('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const allowedFields = [
      "name",
      "password",
      "skills",
      "experienceLevel",
      "location"
    ];

    const isUpdateAllowed = (data, allowedFields) =>
      Object.keys(data).every(key => allowedFields.includes(key));

    if (!isUpdateAllowed(data, allowedFields)) {
      throw new Error("Update contains invalid fields");
    }

    if (data.skills && data.skills.length === 0) {
      throw new Error("Without skills, people are not allowed");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


connectDB()
.then(()=>{
  console.log("Database connection established");
  // now server should start
  app.listen(3000,()=>{
  console.log("Server is listening at 3000")
});
})
.catch((err)=>{
  console.error('Database connection not established =>' , err.message);
})