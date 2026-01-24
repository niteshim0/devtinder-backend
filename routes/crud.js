const express = require('express');
const crudRouter = express.Router();
const {User} = require('../models/user');

// get api (finding the details of one person (finding one document in a collection))
crudRouter.get('/user',async (req,res) =>{
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


crudRouter.get('/feed',async (req,res) =>{

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

crudRouter.delete('/user', async (req,res) => {

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


crudRouter.patch('/user/:userId', async (req, res) => {
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

module.exports = crudRouter;