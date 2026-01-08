// Server creation using express web framework
const express = require("express");

const app = express();


app.get("/user/:userId/:name/:password",(req,res)=>{
  console.log(req.params);
  res.send({name : "Nitesh" , lastName : "Kushwaha"});
})
                                            
app.get("/user",(req,res)=>{
  console.log(req.query);
  res.send({name : "Nitesh" , lastName : "Kushwaha"});
})

app.use("/hello",(req,res)=>{
  res.send("Hello Client!, hum server bol rahe hai");
});

// Different httpRequest methods
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})


app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})


app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})

app.all('/secret',(req,res)=>{
  console.log("Mai hu sabka baap : middleware koi bhi httpReqquest Method if its prefix Match with /secret , then I get applied to everyone");
 // I did get applied , if any other one middleware waiting in line to be executed
})

// String Patterns
app.get('/ab\\?cd', (req, res) => {
  res.send('ab?cd')
})


app.get('/ab*cd', (req, res) => {
  res.send("This route path will match abcd, abxcd, abRANDOMcd, ab123cd, and so on.")
})

app.get(['/abcd', '/abbcd'], (req, res) => {
  res.send('matched')
})



// regex pattern endpoints

app.get(/a/, (req, res) => {
  res.send('matched with anything containing a');
})


app.get(/.*fly$/, (req, res) => {
  res.send('This route path will match butterfly and dragonfly, but not butterflyman, dragonflyman, and so on.')
})



// handling the incoming request
// that is handling all the request coming from clients
// this callback function is known as request handler
// use works for every type of HTTP Methods , it simply a middleware
// it can change the app working if its position gets changed in script
app.use("/test",(req,res)=>{
  res.send("Hello re clientwa : kaisa hai! this is a test route")
});

// app.use("/",(req,res)=>{
//   res.send("Expected Result at Root as well as other headers also works because now the prefix Match happens at this position");
// })

// Server is listening
app.listen(3000,()=>{
  console.log("Server is listening on port : 3000");
});