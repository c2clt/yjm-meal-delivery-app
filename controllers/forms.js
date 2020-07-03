const express = require("express");
const router = express.Router();

// login route
router.get("/login", (req, res)=>{
    res.render("forms/login", {
        title: "Login Page"
    });
});

router.post("/login", (req, res)=>{
    const errors = [];
    if (req.body.email == "") {
        const errUsername = "Email address as username is required";
        errors.push(errUsername);
    }

    if (req.body.password == ""){
        const errPassword = "Password is required for login";
        errors.push(errPassword);
    }

    if (errors.length > 0) {
        res.render("forms/login", {
            title: "Login Page",
            usernameError: "Email address as username is required",
            passwordError: "Password is required for login"
        });
    }
    else {
        res.redirect("/dashboard");
    }
});

// registration route
router.get("/registration", (req, res)=>{
    res.render("forms/registration", {
        title: "Registration Page"
    });
});

// process registration form when user submits form
router.post("/registration", (reg, res)=>{

});

module.exports = router;