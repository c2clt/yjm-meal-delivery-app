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

// dashboard route
router.get("/dashboard", (req, res)=>{
    res.render("general/dashboard", {
        title: "Welcome Page"
    });
});

module.exports = router;