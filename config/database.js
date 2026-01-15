const mongoose = require('mongoose');

const connectDB = async () => {   
await mongoose.connect("mongo_url");
};


module.exports = {connectDB}