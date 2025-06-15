const mongoose = require("mongoose");
require("dotenv").config();
// Connect to MongoDB Atlas
const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    // console.log('DB CONNECTED SUCCESSFULLY');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

dbconnect();

// Define the User Schema
let userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  firebaseUid: { type: String, unique: true, sparse: true }, 
  date: {
    type: Date,
    default: Date.now
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Define the model and export it
module.exports = mongoose.model('User', userSchema);  // 'User' is the name of the collection
