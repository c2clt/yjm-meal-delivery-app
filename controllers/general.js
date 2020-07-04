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

module.exports = router;