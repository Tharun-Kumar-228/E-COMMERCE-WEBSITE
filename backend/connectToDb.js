const mongoose = require("mongoose");


function connectToDb() {
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch(err => console.error("MongoDB error:", err));
  // mongoose.connection.on("connected", () => {
  //   console.log("Connection to MongoDB successful");
  // });

  // mongoose.connection.on("error", () => {
  //   console.log("An error occured");
  // });
};

module.exports = { connectToDb };