const Shelter = require('./models/shelter');
const Animal = require('./models/animal');

// Login middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "You must be signed in first!");
        return res.redirect('/login');
    }
    next();
};

// Auth middleware
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const shelter = await Shelter.findById(id);
    if (!shelter.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that");
        return res.redirect(`/shelters/${id}`);
    }
    next();
};

// Animals auth middleware
module.exports.isAnimalAuthor = async (req, res, next) => {
    const { id, animalId } = req.params;
    const animal = await Animal.findById(animalId);
    if (!animal.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that");
        return res.redirect(`/shelters/${id}`);
    }
    next();
};