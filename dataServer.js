const mongooes = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongooes.Schema;

// define a user Schema
let userSchema = new Schema({
    "firstName": String,
    "lastName": String,
    "phoneNumber": String,
    "email": {
        type: String,
        unique: true
    },
    "password": String
});

// register User model using the userScehma
// use the users collection in the db to store documents
let User;

module.exports.initialize = function() {
    return new Promise(function (resolve, reject) {
        let webDB = mongooes.createConnection(process.env.MONGODB_KEY,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            });

        webDB.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        webDB.once('open', ()=>{
            console.log(`Successfully connected to the database`)
            User = webDB.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function(registerData) {
    return new Promise(function(resolve, reject) { 
        console.log(registerData);       
        User.findOne({ email: registerData.email })
        .exec()
        .then((user) => {
            if(user) {
                console.log(`${user.email} found!`);
                reject(`The user is already in the database`);
            }
            else {
                console.log(`${registerData.email} not found`);
                bcrypt.genSalt(10, (err, salt) => {
                    if(err) {
                        reject(`There was an error encrypting the password: ${err}`);
                    }
                    else {
                        bcrypt.hash(registerData.password, salt, (err, hash) => {
                            if(err) {
                                reject(`There was an error encrypting the password: ${err}`);
                            }
                            else {
                                registerData.password = hash;
        
                                let newUser = new User(registerData);
                                console.log(newUser);
                                newUser.save((err) => {
                                    if(err) {
                                        reject(`There was an error saving the new user: ${err}`);
                                    }
                                    else {
                                        console.log(`New user was saved.`);
                                        resolve();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        })
        .catch((err) => {
            console.log(`There was an error: ${err}`);
        });

        console.log(registerData.firstName)
    });    
};


module.exports.checkUser = function(userData) {
    return new Promise(function(resolve, reject) {
        console.log(`Entered email: ${userData.email}`);
        User.find({ email: userData.email})
        .exec()
        .then((users) => {
            if(users.length == 0) {
                console.log(`Unable to find the user: ${userData.email}`);
                reject(`Entered email doesn't exist in the system!`);
            }
            else {
                bcrypt.compare(userData.password, users[0].password, (err, isMatch) => {
                    if(isMatch) {
                        console.log(`Login: passwords match`);
                        resolve(users[0]);
                    }
                    else {
                        reject(`Passord not match: ${err}`);
                    }
                });
            }
        })
        .catch((err) => {
            reject(`There was an error: ${err}`);
        });
    });
};
