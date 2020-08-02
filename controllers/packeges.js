const express = require("express");
const router = express.Router();
const packageDataService = require("../packagesData.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const PHOTODIRECTORY = "./public/img/uploaded";

//make sure the photos folder exists
if(!fs.existsSync(PHOTODIRECTORY)) {
    console.log("Not found directory");
    fs.mkdirSync(PHOTODIRECTORY);
}

// multer requires a few options to be setup to store files with file extensions
const storage = multer.diskStorage({
    destination: PHOTODIRECTORY,
    filename: (req, file, cd) => {
        cd(null, Date.now() + path.extname(file.originalname));
    }
});

// tell multer to use the diskStorage function for naming files instead of the default
const upload= multer({ storage: storage });

// This is a helper middleware function that checks if a user is logged in
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/forms/login");
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

router.get("/mealList/:title", (req, res) => {
    let packageDesc = {};
    packageDataService.getPackageByTitle(req.params.title).then((data) => {
        if(data) {
            packageDesc = data;
            res.render("packages/packageDesc", {
                title: "Package Description Page",
                description: packageDesc
            });
        }
        else{
            packageDesc = null;
        }
    })
    .catch((err) => {
        packageDesc = null;
        console.log(`There was an error: ${err}`);
    });
});

router.post("/mealList/:title", ensureLogin, (req, res) => {
    packageDataService.addPackageToCart(req.body).then(() => {
        res.redirect("/packages/shoppingCart");
    })
    .catch((err) => {
        res.status(500).send(`Unable to add the package into shopping cart: ${err}`);
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

router.get("/mealTable", ensureLogin, (req, res) => {
    packageDataService.getAllPackagesData().then((data) => {
        res.render("packages/mealTable", {
            title: "Meal List Page",
            packages: data                         
        });  
    });   
});

router.get("/package/:title", ensureLogin, (req, res) => {
    let viewPackage = {};
    packageDataService.getPackageByTitle(req.params.title).then((data) => {
        if (data) {
            viewPackage = data;
            res.render("packages/package", {
                title: "Package Page",
                viewData: viewPackage
            });
        }
        else {
            viewPackage = null;
        }
    }).catch((err) => {
        viewPackage = null;
        console.log(`There was an error: ${err}`);
    });
});

router.post("/package/update", ensureLogin, (req, res) => {
    packageDataService.updatePackage(req.body).then(() => {
        res.redirect("/packages/mealTable");
    }).catch((err) => {
        res.status(500).send(`Enable to find the package" ${err}`);
    });
});

router.get("/delete/:title", ensureLogin, (req, res) => {
    packageDataService.deletePackageByTitle(req.params.title).then(() => {
        res.redirect("/packages/mealTable");
    }).catch((err) => {
        res.status(500).send(`Unable to delete the package: ${err}`);
    });
});

router.get("/photos", ensureLogin, (req, res) => {
    fs.readdir(PHOTODIRECTORY, (err, data) => {
        if (!err) {
            res.render("packages/photos", {
                title: "Packages Photos Page",
                photos: data
            });
        }
        else {
            console.log(`There was an error reading the photos from file: ${err}`);
        }
    });    
});

router.get("/photos/add", ensureLogin, (req, res) => {
    res.render("packages/addPhoto", {
        title: "Add Photo Page"
    });
});

router.post("/photos/add", ensureLogin, upload.single("photoFile"), (req, res) => {
    res.redirect("/packages/photos");
});

router.get("/shoppingCart", ensureLogin, (req, res) => {
    packageDataService.getAllOrderItems().then((data) => {
        if(data) {
            let subtotal = 0;
            let tax = 0;
            let total = 0;
            data.forEach(element => {
                subtotal += element.quantity * element.price;
            });

            tax = subtotal * 0.13;
            total = subtotal + tax;

            res.render("packages/shoppingCart", {
                title: "Shopping Cart Page",
                user: req.session.user,
                items: data,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2)
            });
        }
        else {
            res.render("packages/shoppingCart", {
                title: "Shopping Cart Page",
                user: req.session.user,
                emptyCart: `Your shopping cart is empty`
            });
        }
    });
});

router.post("/shoppingCart", ensureLogin, (req, res) => {
    let recipient = `${req.body.shipFirst} ${req.body.shipLast}`;
    let address1 = `${req.body.shipAddress} ${req.body.shipApt} ${req.body.shipCity}`;
    let address2 = `${req.body.shipProvince} ${req.body.shipCountry} ${req.body.shipPostal}`;
    let phone = `${req.body.shipPhone}`;

    let allItems = [];
    packageDataService.getAllOrderItems().then((data) => {
        allItems = data;
    });

    let subtotal = req.body.subtotal;
    let tax = req.body.tax;
    let total = req.body.total;
    let table = `
    <h2>Order Summary</h2>
    <table class="table">
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            {{#each ${allItems}}}
            <tr>
                <td>{{title}}</a></td>
                <td>{{quantity}}</a></td>
                <td>{{price}}</td>
            </tr>
            {{/each}}
        </tbody>
        <tfoot>
            <tr>
                <td class="my-tfoot" colspan="3">Item Subtotal: </td>
                <td><input type="text" name="subtotal" value="${subtotal}" readonly></td>
            </tr>
            <tr>
                <td class="my-tfoot" colspan="3">Tax Calculated (GST/HST): </td>
                <td><input type="text" name="tax" value="${tax}" readonly></td>
            </tr>
            <tr>
                <td class="my-tfoot" colspan="3">Total: </td>
                <td><input type="text" name="total" value="${total}" readonly></td>
            </tr>
        </tfoot>
    </table>
    `;
    packageDataService.emptyShoppingCart().then(() => {
        res.render("packages/shoppingCart", {
            title: "Shopping Cart Page",
            user: req.session.user,
            emptyCart: "Your order has been placed"
        });
    })
    .catch((err) => {
        res.render("packages/shoppingCart", {
            title: "SHopping Cart Page",
            errmsg: err
        });
    });

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const msg = {
        to: `${req.session.user.email}`,
        from: `jzhou175@myseneca.ca`,
        subject: `Your YJM meal packages order are recieved`,
        html: 
        ` Thank you for shopping with us.<br />
        Your order will be sent to:<br />
        ${recipient} <br/>
        ${address1} <br/>
        ${address2} <br/>
        ${phone} <br />
        ${table}
        `
    };

    // Asynchronous operation (who don't know how long this will take to excute)
    sgMail.send(msg)
    .then(() => {            
        res.redirect("/packages/shoppingCart");
    })
    .catch((err) => {
        console.log(`Error ${err}`);
    });      
});

module.exports = router;