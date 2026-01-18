const mongoose = require('mongoose');

const connectDB = async () => {   
await mongoose.connect("mongodb_connection_string");
};


module.exports = {connectDB}
