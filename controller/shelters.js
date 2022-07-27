// Authored
const { cloudinary } = require('../cloudinary');
const Shelter = require('../models/shelter');
const Animal = require('../models/animal');

// Installed
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

// Index route ======================================================
module.exports.index = async (req, res) => {
    const shelters = await Shelter.find({});
    res.render('shelters/index', { shelters });
};

// Create new route =================================================
// (Form rendering)
module.exports.renderNewForm = (req, res) => {
    res.render('shelters/new');
};
// (Shelter create)
module.exports.createShelter = async (req, res, next) => {
    // Map
    const geoData = await geocoder.forwardGeocode({
        query: req.body.shelter.location,
        limit: 1
    }).send();
    if (!req.body.shelter) throw new ExpressError('Invalid shelter data', 400);
    const shelter = new Shelter(req.body.shelter);
    shelter.geometry = geoData.body.features[0].geometry;
    shelter.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    shelter.author = req.user._id;
    await shelter.save();
    req.flash('success', 'Successfully added a new shelter!');
    res.redirect(`/shelters/${shelter._id}`);
};

// Show route =======================================================
module.exports.showShelter = async (req, res) => {
    const shelter = await Shelter.findById(req.params.id).populate({
        path: 'animals',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!shelter) {
        req.flash('error', 'Shelter not exist');
        return res.redirect('/shelters');
    };
    res.render('shelters/show', { shelter });
};

// Update route =====================================================
// (Form rendering)
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const shelter = await Shelter.findById(id);
    if (!shelter) {
        req.flash('error', 'Shelter not exist');
        return res.redirect('/shelters');
    };
    res.render('shelters/edit', { shelter });
};
// (Update shelter)
module.exports.updateShelter = async (req, res) => {
    const { id } = req.params;
    const shelter = await Shelter.findByIdAndUpdate(id, { ...req.body.shelter });
    // req.body
    // shelter: {
    // title: 'Test11',
    // location: 'test11',
    // phone: '12345671',
    // description: 'test11'
    // }
    const geoData = await geocoder.forwardGeocode({
        query: req.body.shelter.location,
        limit: 1
    }).send();
    shelter.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    shelter.images.push(...imgs);
    await shelter.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await shelter.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages} } } });
    }
    req.flash('success', "Successfully updated the shelter!");
    res.redirect(`/shelters/${shelter._id}`);
};

// Delete route =====================================================
module.exports.deleteShelter = async (req, res) => {
    const { id } = req.params;
    await Shelter.findByIdAndDelete(id);
    res.redirect('/shelters');
};