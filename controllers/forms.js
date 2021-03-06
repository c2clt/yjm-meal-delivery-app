const express = require("express");
const router = express.Router();
const dataServiceModel = require("../dataServer.js");

// This is a helper middleware function that checks if a user is logged in
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/forms/login");
    } else {
      next();
    }
} 

// login route
router.get("/login", (req, res)=>{
    res.render("forms/login", {
        title: "Login Page"
    });
});

router.post("/login", (req, res)=>{
    const { email, password } = req.body;
    let errors = [];
    let errUsername = "";
    if (email == "") {       
        errUsername = "Email address as username is required"; 
        errors.push(errUsername);
    }

    let errPassword = "";
    if (password == ""){  
        errPassword = "Password is required for login";     
        errors.push(errPassword);
    }

    if (errors.length > 0) {
        res.render("forms/login", {
            title: "Login Page",
            usernameError: errUsername,
            passwordError: errPassword,
            formData: { email, password }
        });
    }
    else {
        dataServiceModel.checkUser(req.body)
        .then((user) => {
            req.session.user = {
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                isClerk: user.isClerk
            }

            if(user.isClerk) {
                res.redirect("/forms/administration");
            }
            else {
                res.redirect("/forms/dashboard");
            }            
        })
        .catch((err) => {
            res.render("forms/login", 
            { errmsg: `Sorry, you entered the wrong email and/or password: ${err}` });
        });        
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
        res.render("forms/registration", {
            title: "Registration Page",
            errorFirst: firstNameErr,
            errorLast: lastNameErr,
            errorPhone: phoneNumberErr,
            errorEmail: emailErr,
            errorPsd: passwordErr,
            errorRepeat: repeatpsdErr,
            formData: { firstName, lastName, phoneNumber, email, password, repeatpsd }
        });
    }
    else {        
        dataServiceModel.registerUser(req.body).then(() => {
            req.session.user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email
            }
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            const msg = {
                to: `${req.body.email}`,
                from: `jzhou175@myseneca.ca`,
                subject: `Registration Form Received`,
                html: 
                `Welcome to Join YJM Meal Delivery<br>
                Here is your registration information:<br>
                Full Name: ${req.body.firstName} ${req.body.lastName}<br>
                Phone Number: ${req.body.phoneNumber}<br>
                Email Address: ${req.body.email}<br>
                `
            };

            // Asynchronous operation (who don't know how long this will take to excute)
            sgMail.send(msg)
            .then(()=>{            
                if(req.session.user.isClerk) {
                    res.redirect("/forms/administration");
                }
                else {
                    res.redirect("/forms/dashboard");
                }
            })
            .catch(err=>{
                console.log(`Error ${err}`);
            });             
        })
        .catch((err) => {
            res.render("forms/registration", 
                        { errmsg: err });
        });      
    }
});

// dashboard route
router.get("/dashboard", ensureLogin, (req, res)=>{
    res.render("forms/dashboard", {
        title: "Welcome Dashboard Page",
        user: req.session.user
    });
});

// administration route
router.get("/administration", ensureLogin, (req, res)=>{
    res.render("forms/administration", {
        title: "Welcome Administration Page",
        user: req.session.user
    });
});

//logout route
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/forms/login");
});

module.exports = router;