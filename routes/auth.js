const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const redirect = require('./dashboard');

// validate user
// function isEmail(email){
//     let emailFormat=/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
//     if(email !== '' && email.match(emailFormat)){
//         return true;
//     }
//     else{
//         return false;
//     }
// }

// validation
const schemaRegister = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

//Register
router.post("/register", (req, res) => {
  // validate user
  const { error } = schemaRegister.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//Login
//Falta redirect a dashboard

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password; // Find user by email
  
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } // Check password
    const validPassword = bcrypt
    .compare(password, user.password)
    .then(isMatch => {
      if (isMatch) {
        // User matched
        bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
        return res.status(400).json({ error: "incorrect password" });
        // create token
        const token = jwt.sign(
          {
            email: user.email,
            id: user._id,
          },
          process.env.TOKEN_SECRET
          );
          
          res.header("auth-token", token).json({
            error: null,
            data: { token },
          });
          console.log("Dentro");
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
  });
});

//Logout
//falta logout y el no tener que meter en el .env el token a pelo
router.post('/logout', (req, res) => {
  // req.logout();
 return res.redirect('/');
  // res.send('Volvemos a login')
  console.log('Volvemos al login')
});
module.exports = router;
