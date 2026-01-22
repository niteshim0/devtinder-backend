const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const adminAuth = (req,res,next) => {
  const token = "abc";
  const isTokenAuthorized = token === "abc";

  if(!isTokenAuthorized){
      res.status(401).send('Unauthorized Request');
  }else{
    next();      
  }  
}

const userAuth = async (req,res,next) => {

  try {
      const {token} = req.cookies;
  
      const decryptedObj = jwt.verify(token, 'SecretJWTKEY');
      const {_id} = decryptedObj;

      const user = await User.findById(_id);
      req.user = user;
      next();
  } catch (error) {
     return res.status(404).json({
      success : "false",
      message : "Redirect to signup page,token is now expired"
     })
  }
  
}

module.exports = {adminAuth,userAuth};