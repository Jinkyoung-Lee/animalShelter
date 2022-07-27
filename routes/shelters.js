// Requiring packages =======================================
// Installed
const express = require('express');
const router = express.Router();

// Authored
const shelters = require('../controller/shelters');
const { isLoggedIn, isAuthor } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

// Multer
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// Routes ===================================================
// Shelter: index route
router.get('/shelters', catchAsync(shelters.index));

// Shelter: create new route
// rendering form
router.get('/shelters/new', isLoggedIn, (shelters.renderNewForm));
// setting up the end point
router.post('/shelters', isLoggedIn, upload.array('image'), catchAsync(shelters.createShelter));


// Shelter: show route
router.get('/shelters/:id', catchAsync(shelters.showShelter));

// Shelter: edit (update) route
// rendering form
router.get('/shelters/:id/edit', isLoggedIn, isAuthor, catchAsync(shelters.renderEditForm));
// setting up the end point
router.put('/shelters/:id', isLoggedIn, isAuthor, upload.array('image'), catchAsync(shelters.updateShelter));

// Shelter: delete route
router.delete('/shelters/:id', isLoggedIn, catchAsync(shelters.deleteShelter));

module.exports = router;