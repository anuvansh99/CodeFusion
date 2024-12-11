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

// Define the schema for the 'Project' collection
const projectSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  date: {
    type: Date,
    default: Date.now
  },
  htmlCode: {
    type: String,
    default: `<h1>Hello World!</h1>`
  },
  cssCode: {
    type: String,
    default: `body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }`
  },
  jsCode: {
    type: String,
    default: 'console.log("Hello World")'
  }
});

// Export the Project model
module.exports = mongoose.model("Project", projectSchema);
