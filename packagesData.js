const mongooes = require("mongoose");
const Schema = mongooes.Schema;

let db = mongooes.createConnection(process.env.MONGODB_KEY,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }, (err) => {
        if(err) {
            console.log(`The was an error connecting the database: ${err}`);
        }
        else {
            console.log(`Successfully connected to the database!`);
        }
    }
);

// define a package Schema
let packageSchema = new Schema({
    "title":  {
        type: String,
        unique: true
    },
    "price": Number,
    "category": String,
    "numOfMeals": Number,
    "content": String,
    "isTop": Boolean,
    "image": String,
});
// register Package model using the userSchema
// use the  collection mealPackages in the db to store documents
let Package = db.model("mealPackages", packageSchema);

// define a shoppingCart Schema
let cartSchema = new Schema({
    "image": String,
    "title": {
        type: String,
        unique: true
    },
    "quantity": Number,
    "price": Number
});
// register Cart model using the cartSchema
// use the collection in the db to store doucuments
let Cart = db.model("shoppingCarts", cartSchema);

module.exports.addPackage = function(packageData) {
    return new Promise(function(resolve, reject) {
        if(packageData.isTop == "") {
            packageData.isTop = true;
        }
        else {
            packageData.isTop = false;
        }
        let newPackage = new Package(packageData);
        if(newPackage) {
            newPackage.save((err, data) => {
                if(err) {
                    reject(`There was an error saving new meal package: ${err}`);
                }
                else {
                    resolve();
                }
            });
        }       
    });
}

module.exports.getAllPackagesData = function() {
    return new Promise(function(resolve, reject) {
        Package.find()
        .exec()
        .then((data) => {
            resolve(data);
        })
        .catch((err) => {
            reject(`No data found: ${err}`);
        });
    });
}

module.exports.getTopPackagesData = function() {
    return new Promise(function(resolve, reject) {
        Package.find({isTop: true})
        .exec()
        .then((data) => {
            resolve(data);
        })
        .catch((err) => {
            reject(`No top package found: ${err}`);
        });
    })
}

module.exports.getPackageByTitle = function(packageTtl) {
    return new Promise(function(resolve, reject) {
        Package.findOne({title: packageTtl})
        .exec()
        .then((data) => {
            if(!data) {
                reject(`No package found`);
            }
            else {
                resolve(data);
            }            
        })
        .catch((err) =>{
            reject(`There was an error finding the package: ${err}`);
        });
    });
}

module.exports.getPackageByCategory = function(categoryName) {
    return new Promise((resolve, reject) => {
        Package.find({ category: categoryName })
        .exec()
        .then((data) => {
            if(!data) {
                reject(`No package found!`);
            }
            else {
                resolve(data);
            }
        })
        .catch((err) => {
            reject(`There was an error finding catagory: ${err}`);
        });
    });
}

module.exports.updatePackage = function(packageData) {
    return new Promise(function(resolve, reject) {
        if(packageData.isTop) {
            packageData.isTop = true;
        }
        else {
            packageData.isTop = false;
        }

        Package.updateOne({title: packageData.title}, { 
            $set: {
                price: packageData.price,
                category: packageData.category,
                numOfMeals: packageData.numOfMeals,
                content: packageData.content,
                isTop: packageData.isTop,
                image: packageData.image
            }
        })
        .exec()
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(`Cannot update the package (${packageData.title}): ${err}`);
        });
    });
}

module.exports.deletePackageByTitle = function(packageTtl) {
    return new Promise(function(resolve, reject) {
        Package.deleteOne({title: packageTtl})
        .exec()
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(`There was an error deleting the package: ${err}`);
        });
    });
}

module.exports.addPackageToCart = function(itemData) {
    return new Promise((resolve, reject) => {
        let newItem = new Cart({
            image: itemData.image,
            title: itemData.title,
            quantity: itemData.quantity,
            price: itemData.price
        });

        newItem.save((err, data) => {
            if(err) {
                reject(`There was an error saving new item: ${err}`);
            }
            else {
                resolve();
            }
        });
    });
}

module.exports.getAllOrderItems = function() {
    return new Promise((resolve, reject) => {
        Cart.find()
        .exec()
        .then((data) => {
            if(data) {
                resolve(data);
            }
            else {
                reject(`No item found in the shopping cart`);
            }
        })
        .catch((err) => {
            reject(`There was an error getting all items in shopping cart: ${err}`);
        });
    });
}

module.exports.emptyShoppingCart = function() {
    return new Promise((resolve, reject) => {
        Cart.deleteMany({})
        .exec()
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(`There was an error emptying the shopping cart: ${err}`);
        });
    });
}

