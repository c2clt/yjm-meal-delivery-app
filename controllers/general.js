const express = require("express");
const router = express.Router();
const packageDataService = require("../packagesData.js");
const clientSessions = require("express-session");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Setup client-sessions
router.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_A7", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    resave: true,
    saveUninitialized: true
  }));

  // custom middleware to add "session" to all routers (res)
router.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// make sure the uploaded directory exist
if(!fs.existsSync("../public/img/uploaded")) {
  fs.mkdirSync("../public/img/uploaded");
}
// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: "../public/img/uploaded",
    filename: function (req, file, cb) {
      // we write the filename as the current date down to the millisecond
      // in a large web service this would possibly cause a problem if two people
      // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
      // this is a simple example.
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

// This is a helper middleware function that checks if a user is logged in
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/forms/login");
    } else {
      next();
    }
} 

//home route
router.get("/", (req, res)=>{
    packageDataService.getTopPackagesData().then((data) => {
        res.render("general/home", {
            title: "Home Page",
            topPackages: data
        });
    });
    
});




module.exports = router;