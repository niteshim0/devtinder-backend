const mongoose = require("mongoose");
 const dns = require("dns");
 dns.setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://<user_name>:<password>@nodejsseason1.plin1zo.mongodb.net/devTinder?appName=NodeJSSeason1",
    );
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = { connectDB };