// Requiring packages ================================
// Installed
const express = require('express');
const router = express.Router({ mergeParams: true });

// Authored
const animals = require('../controller/animals');
const { isLoggedIn, isAnimalAuthor } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');

// // Multer
// const multer = require('multer');
// const { storage } = require('../cloudinary');
// const upload = multer({ storage });

// Routes ============================================
// Animal: add new animal route
router.post('/shelters/:id/animals', isLoggedIn, catchAsync(animals.createAnimal));

// Animal: update route
// rendering form
router.get('/shelters/:id/animals/:animalId/edit', isLoggedIn, isAnimalAuthor, catchAsync(animals.renderEditAnimal));
// setting up the end point
router.put('/shelters/:id/animals/:animalId', isLoggedIn, isAnimalAuthor, catchAsync(animals.updateAnimal));

// Animal: delete route
router.delete('/shelters/:id/animals/:animalId', isLoggedIn, isAnimalAuthor, catchAsync(animals.deleteAnimal));

module.exports = router;