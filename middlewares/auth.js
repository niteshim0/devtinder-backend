// For the time being we will  only learn about application level middleware

const adminAuth = (req,res,next) => {
  const token = "abc";
  const isTokenAuthorized = token === "abc";

  if(!isTokenAuthorized){
      res.status(401).send('Unauthorized Request');
  }else{
    next();      
  }  
}

const userAuth = (req,res,next) => {
  const token = "a";
  const isTokenAuthorized = token === "abc";

  if(!isTokenAuthorized){
      res.status(401).send('Unauthorized Request');
  }else{
    next();      
  }  
}

module.exports = {adminAuth,userAuth};