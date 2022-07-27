// Requiring packages =======================================
// Installed
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Authored
const users = require('../controller/users');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const User = require('../models/user');


// Routes ===================================================
// Register: rendering form
router.get('/register', (users.renderRegister));

// Register: creating new user
router.post('/register', catchAsync(users.register));

// Login: rendering form
router.get('/login', (users.renderLogin));

// Login: submitting
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (users.login));

// Logout
router.get('/logout', (users.logout));

module.exports = router;