const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync"); 
const { savedRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');
const user = require('../models/user.js');

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(WrapAsync(userController.signup));

router.route('/login')
    .get(userController.renderLoginForm)
    .post(savedRedirectUrl, passport.authenticate("local",{failureRedirect: "/login",failureFlash: true, }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;