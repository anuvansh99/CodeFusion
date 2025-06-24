var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var userModel = require("../models/userModel");
var projectModel = require("../models/projectModel");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signUp', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const secret = "secret"; // secret key for jwt

router.post("/signUp", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    
    // Check existing email
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await userModel.create({
      username,
      name,
      email,
      password: hashedPassword
    });

    // Generate JWT (if needed)
    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({ 
      success: true, 
      message: "User created",
      // token // Optional: Send JWT
    });
    
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });

  if (user) {
    // Rename the second `res` to avoid conflict
    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err) {
        return res.json({ success: false, message: "An error occurred", error: err });
      }
      if (isMatch) {
        let token = jwt.sign({ email: user.email, userId: user._id }, secret);
        return res.json({ success: true, message: "User logged in successfully", token: token, userId: user._id });
      } else {
        return res.json({ success: false, message: "Invalid email or password" });
      }
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getUserDetails", async (req, res) => {
  console.log("Called")
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    return res.json({ success: true, message: "User details fetched successfully", user: user });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/createProject", async (req, res) => {
  let { userId, title } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.create({
      title: title,
      createdBy: userId
    });


    return res.json({ success: true, message: "Project created successfully", projectId: project._id });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProjects", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let projects = await projectModel.find({ createdBy: userId });
    return res.json({ success: true, message: "Projects fetched successfully", projects: projects });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/deleteProject", async (req, res) => {
  let {userId, progId} = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOneAndDelete({ _id: progId });
    return res.json({ success: true, message: "Project deleted successfully" });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProject", async (req, res) => {
  let {userId,projId} = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOne({ _id: projId });
    return res.json({ success: true, message: "Project fetched successfully", project: project });
  }
  else{
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/updateProject", async (req, res) => {
  let { userId, htmlCode, cssCode, jsCode, projId } = req.body;
  let user = await userModel.findOne({ _id: userId });

  if (user) {
    let project = await projectModel.findOneAndUpdate(
      { _id: projId },
      { htmlCode: htmlCode, cssCode: cssCode, jsCode: jsCode },
      { new: true } // This option returns the updated document
    );

    if (project) {
      return res.json({ success: true, message: "Project updated successfully" });
    } else {
      return res.json({ success: false, message: "Project not found!" });
    }
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});


module.exports = router;
