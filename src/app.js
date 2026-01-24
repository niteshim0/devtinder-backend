const express = require('express');
const app = express();
const { connectDB } = require('../config/database');
const cookieParser = require('cookie-parser')

const authRouter = require('../routes/auth');
const crudRouter = require('../routes/crud');
const profileRouter = require('../routes/profile');
const requestRouter = require('../routes/request');


app.use(express.json()) // middleware to convert JSON(text-format) -> JS Object(native data structure)(operations or function can be performed on data structure not on certain text format)
app.use(cookieParser())

// middlewares to offloads the path to routes
// even its very dangerous way because every router will run for "/"
// which is not much feasible one
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',crudRouter);

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