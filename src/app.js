// Server creation using express web framework
const express = require("express");

const app = express();

// just handling the port
app.use("/",(req,res)=>{
  res.send("Hello re clientwa : kaisa hai!")
});

// handling the incoming request
// that is handling all the request coming from clients
// this callback function is known as request handler
app.use("/test",(req,res)=>{
  res.send("Hello re clientwa : kaisa hai! this is a test route")
});

// Server is listening
app.listen(3000,()=>{
  console.log("Server is listening on port : 3000");
});