// Server creation using express web framework
const express = require("express");
const { adminAuth,  userAuth } = require("../middlewares/auth");

const app = express();

// no mattar what this middleware applied to this app , so any api endpoint you hit I will run
// app.use((req, res, next) => {
//   console.log('Time:', Date.now())
//   next()  
// })



// app.use('/users',()=>{
//   console.log("This is going to be timed out because I am listening the client request but not sending any response(connection gets timed out)");
// })

// Case II : multiple routeHandlers but request-response cycle ends at Ist only
// app.use('/users',
//   (req,res)=>{
//   console.log("Route Handler 1");
//   res.send('Response from Route Handler 1');
//   },
//   (req,res)=>{
//     console.log('Route Handler 2');
//     res.send('Response from Route Handler 2')
//   }
// )

// Case III : Two Route Handler , and second one is giving response not the first one this time , moving to next routeHandler using next() middleware
// Ans resides how the recursion works(fuction calling function works) + runtime stack

// app.use('/users',
//   (req,res,next)=>{
//   console.log("Route Handler 1");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 2');
//     res.send('Response from Route Handler 2')
//   }
// )

// Case IV : Two Route Handler , and second one is giving response not the first one this time despite first also having response, moving to next routeHandler using next() middleware , it will look like perfect code(because behaves how we have thought on client side) but on server side it gives error

// app.use('/users',
//   (req,res,next)=>{
//   console.log("Route Handler 1");
//   next();
//   res.send('Response from Route Handler 1')
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 2');
//     res.send('Response from Route Handler 2')
//   }
// )

/* Case V : Multiple level of routeHandler , but response is sent back from only last level
Ans :: Working of next() + Javascript is synchronous + request-response cycle working
*/

// app.use('/users',
//   (req,res,next)=>{
//   console.log("Route Handler 1");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 2');
//     next();
//   },
//   (req,res,next)=>{
//   console.log("Route Handler 3");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 4');
//     next();
//   },
//   (req,res,next)=>{
//   console.log("Route Handler 5");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 6');
//     res.send('Response from Route Handler 6')
//   }
// )

// Case VI :: route Handler gets stored inside arrays(works as normal case)
// app.use('/users',
//   [(req,res,next)=>{
//   console.log("Route Handler 1");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 2');
//     next();
//   },
//   (req,res,next)=>{
//   console.log("Route Handler 3");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 4');
//     next();
//   },
//   (req,res,next)=>{
//   console.log("Route Handler 5");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 6');
//     res.send('Response from Route Handler 6(array ones)')
//   }]
// )

// Case VII : Even at nth Level, no any response sent back but control gets transferred
// It thinks next() is supposed to get,post(respective http Methods) , if get -> cannot GET error , if post cannot postError (it doesn't go into infinite loop , it is very different from not sending response back)
// app.use('/users',
//   (req,res,next)=>{
//   console.log("Route Handler 1");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 2');
//     next();
//   },
//   (req,res,next)=>{
//   console.log("Route Handler 3");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 4');
//     next();
//   },
//   [
//   (req,res,next)=>{
//   console.log("Route Handler 5");
//   next();
//   },
//   (req,res,next)=>{
//     console.log('Route Handler 6');
//     // No response even from last level but control gets transfered to next
//     next();
//   }]
// )

//  Case VIII :: Different app.get for same api endpoint
//  app.get('/users',userAuth,(req,res,next)=>{
//   console.log("First app.get of routeHandler1");
//   next();
//  })

//  app.get('/users',(req,res,next)=>{
//   res.send("Now routeHandler ends in route2")
//  })


// app.get("/user/:userId/:name/:password",(req,res)=>{
//   console.log(req.params);
//   res.send({name : "Nitesh" , lastName : "Kushwaha"});
// })
                                            
// app.get("/user",(req,res)=>{
//   console.log(req.query);
//   res.send({name : "Nitesh" , lastName : "Kushwaha"});
// })

// app.use("/hello",(req,res)=>{
//   res.send("Hello Client!, hum server bol rahe hai");
// });

// Different httpRequest methods
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.post('/', (req, res) => {
//   res.send('Got a POST request')
// })


// app.put('/user', (req, res) => {
//   res.send('Got a PUT request at /user')
// })


// app.delete('/user', (req, res) => {
//   res.send('Got a DELETE request at /user')
// })

// app.all('/secret',(req,res)=>{
//   console.log("Mai hu sabka baap : middleware koi bhi httpReqquest Method if its prefix Match with /secret , then I get applied to everyone");
 // I did get applied , if any other one middleware waiting in line to be executed
//})

// String Patterns
// app.get('/ab\\?cd', (req, res) => {
//   res.send('ab?cd')
// })


// app.get('/ab*cd', (req, res) => {
//   res.send("This route path will match abcd, abxcd, abRANDOMcd, ab123cd, and so on.")
// })

// app.get(['/abcd', '/abbcd'], (req, res) => {
//   res.send('matched')
// })



// regex pattern endpoints

// app.get(/a/, (req, res) => {
//   res.send('matched with anything containing a');
// })


// app.get(/.*fly$/, (req, res) => {
//   res.send('This route path will match butterfly and dragonfly, but not butterflyman, dragonflyman, and so on.')
// })



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


// Why there is need for middleware ?
// Case I . Code Without Middleware
// Since they all are admin route(special powers)
// app.get("/admin/getAllUsers",(req,res,next)=>{
//   // authorizing admin
//   const token = "abc";
//   const isTokenAuthorized = token === "abc";

//   if(isTokenAuthorized){
//      res.send('All Data Sent');
//   }else{
//     res.status(401).send('Unauthorized Request'); 
//   }
   
// })


// app.delete("/admin/deleteUsers",(req,res,next)=>{
//   // authorizing admin
//   const token = "abc";
//   const isTokenAuthorized = token === "bc";

//   if(isTokenAuthorized){
//      res.send('Deleted Data of a User');
//   }else{
//     res.status(401).send('Unauthorized Request'); 
//   }
   
// }
// );  

// We are authorizing the admin again and again for every admin route which is against the very principle of DRY (so thats middleware comes into the action(it is basically a function,definded once,used multiple times))   
// Case II :: Code with using middlewares

// app.use("/admin",(req,res,next)=>{
//     const token = "abc";
//   const isTokenAuthorized = token === "abc";

//   if(!isTokenAuthorized){
//       res.status(401).send('Unauthorized Request');
//   }else{
//     next();      
//   }  
// })



// app.get("/admin/getAllUsers",(req,res,next)=>{
//   // admin already authorized by middleware
//   res.send('All Data Sent');
// })


// app.delete("/admin/deleteUsers",(req,res,next)=>{
//   // admin already authorized by middleware
//   res.send('Delete Data of a User');
// }
// );  


// Case III ::All the middlewares at the same place


app.use("/admin",adminAuth);



app.get("/admin/getAllUsers",(req,res,next)=>{
  // admin already authorized by middleware
  res.send('All Data Sent');
})


app.delete("/admin/deleteUsers",(req,res,next)=>{
  // admin already authorized by middleware
  res.send('Delete Data of a User');
}
); 

// Other way of using middleware at route level
// app.get('/users',userAuth,(req,res,next)=>{
//   console.log("First app.get of routeHandler1");
//   next();
//  })

//  app.get('/users',(req,res,next)=>{
//   res.send("Now routeHandler ends in route2")
//  })
  // -----------------Error Handling --------------
// Case I :: Express handles error by default
// app.get('/users',(err,req,res,next)=>{
//     // many things inside the server will be xposed to the clients if server will not handle the error gracefully // use try catch
//     throw new Error("An Error instance is created");
//     next(err); // provided by defualt from express.js
//     //  res.send("Now routeHandler ends in route1")
//  });

// Case II : Custom Error Handling
// Be careful , while giving arguments to -> callback for routeHandler
// Two arguments it assumes -> req,res
// Three arguments it assumes -> req,res,next
// Four arguments it assumes -> err,req,res,next
// Even their order can't be changed , if you do then err might become next , next-> req , res->err and so on and so forth.
// app.get('/users',(req,res)=>{
//     try{
//         throw new Error("An Error instance is created");
//         return res.send("users endpoint hits");
//     }catch(err){
//         return res.status(500).send("Error is catched using try-catch blocks");
//     } 
//  });

 // Case III :: Centralized Error Handling
 app.get('/users',(req,res)=>{
    try{
        throw new Error("Something Went Wrong");
    }catch(err){
        next(err);
    } 
 });


 app.use((err,req,res,next)=>{
  console.error(err.message);
  res.status(500).json({
    success : false,
    message : err.message,
  })
 })
 app.use('/',(err,req,res,next)=>{
  res.status(501).send("Something Went Wrong");
 })// Using wildcard middleware to handle all errors
// Server is listening
app.listen(3000,()=>{
  console.log("Server is listening on port : 3000");
});