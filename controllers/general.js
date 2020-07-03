const express = require("express");
const router = express.Router();

//load packagesModle
const packagesModle = require("../models/packages.js");

//home route
router.get("/", (req, res)=>{
    res.render("general/home", {
        title: "Home Page",
        topPackages: packagesModle.getTopPackage()
    });
});

// login route
router.get("/login", (req, res)=>{
    res.render("general/login", {
        title: "Login Page"
    });
});

// registration route
router.get("/registration", (req, res)=>{
    res.render("general/registration", {
        title: "Registration Page"
    });
});

// process registration form when user submits form
router.post("/registration", (reg, res)=>{

});

module.exports = router;