const express = require("express");
const router = express.Router();

// login route
router.get("/login", (req, res)=>{
    res.render("forms/login", {
        title: "Login Page"
    });
});

router.post("/login", (req, res)=>{
    let errors = [];
    let errUsername = "";
    if (req.body.email == "") {       
        errUsername = "Email address as username is required"; 
        errors.push(errUsername);
    }

    let errPassword = "";
    if (req.body.password == ""){  
        errPassword = "Password is required for login";     
        errors.push(errPassword);
    }

    if (errors.length > 0) {
        res.render("forms/login", {
            title: "Login Page",
            usernameError: errUsername,
            passwordError: errPassword
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
router.post("/registration", (req, res)=>{
    
    const { firstName, lastName, phoneNumber, email, password, repeatpsd } = req.body;

    let errors = [];
    let firstNameErr = "";
    if(firstName == "") {
        firstNameErr = "The first name is required";
        errors.push(firstNameErr);
    }

    let lastNameErr = "";
    if (lastName == "") {
        lastNameErr = "The last name is required";
        errors.push(lastNameErr);
    }

    let phoneNumberErr = "";
    const phonePatt = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (phoneNumber == "") {
        phoneNumberErr = "The phone number is required";
        errors.push(phoneNumberErr);
    }
    else if (!phoneNumber.match(phonePatt)) {
        phoneNumberErr = "Invalid phone number";
        errors.push(phoneNumberErr);
    }

    let emailErr = "";
    if (email == "") {
        emailErr = "The email address is required";
        errors.push(emailErr);
    }
    
    let passwordErr = "";
    const psdPatt = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
    if (password == "") {
        passwordErr = "The password is required";
        errors.push(passwordErr);
    }
    else if (password.length < 6 || password.length > 12) {
        passwordErr = "The length of password must be between 6 and 12.";
        errors.push(passwordErr)
    }
    else if (!password.match(psdPatt)) {
        passwordErr = "The password must contain at least one digit number, one uppercase and lowercase letter.";
        errors.push(passwordErr);
    }

    let repeatpsdErr = "";
    if (repeatpsd != password) {
        repeatpsdErr = "The repeated password must be matched";
        errors.push(repeatpsdErr);
    }

    if (errors.length > 0) {
        res.render("#", {
            title: "Registration Page",
            errorFirst: firstNameErr,
            errorLast: lastNameErr,
            errorPhone: phoneNumberErr,
            errorEmail: emailErr,
            errorPsd: passwordErr,
            errorRepeat: repeatpsdErr
        });
    }
    else {
        res.redirect("/dashboard");
    }

});

module.exports = router;