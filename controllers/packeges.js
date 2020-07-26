const express = require("express");
const router = express.Router();
const packageDataService = require("../packagesData.js");
const clientSessions = require("express-session");

// Setup client-sessions
router.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_A7", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    resave: true,
    saveUninitialized: true
  }));

// This is a helper middleware function that checks if a user is logged in
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
}

// list All Meal Packages
router.get("/mealList", (req, res)=>{
    packageDataService.getAllPackagesData().then((data) => {
        res.render("packages/mealList", {
            title: "Meal Package Page",
            packages: data                         
        });  
    });    
      
});

// add new package route
router.get("/add", ensureLogin, (req, res) => {
    res.render("packages/addPackage", {
        title: "Add new package"
    });
});

router.post("/add", ensureLogin, (req, res) => {
    packageDataService.addPackage(req.body).then(() => {
        res.redirect("/packages/mealList");
    })
    .catch((err) => {
        res.status(500).send(`Unable to add the package: ${err}`);
    });
});

module.exports = router;