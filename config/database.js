const mongoose = require('mongoose');

const connectDB = async () => {   
await mongoose.connect("mongodb+srv://niteshim0_db_user:7TqSPGaxDptI8xLk@nodejsseason1.plin1zo.mongodb.net/devTinder");
};


module.exports = {connectDB}