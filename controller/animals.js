const Shelter = require('../models/shelter');
const Animal = require('../models/animal');

// Create new animal route =============================================
module.exports.createAnimal = async (req, res) => {
    const shelter = await Shelter.findById(req.params.id);
    const animal = new Animal(req.body.animal);
    shelter.animals.push(animal);
    animal.author = req.user._id;
    await animal.save();
    await shelter.save();
    res.redirect(`/shelters/${shelter._id}`);
};

// Update route ========================================================
// (Form rendering)
module.exports.renderEditAnimal = async (req, res) => {
    const { id, animalId } = req.params;
    const shelter = await Shelter.findById(id);
    const animal = await Animal.findById(animalId);
    if (!animal) {
        req.flash('error', 'Animal not exist');
        return res.redirect(`/shelters/${animalId}`);
    }
    res.render('shelters/animalEdit', { shelter, animal });
};
// (Update animal)
module.exports.updateAnimal = async (req, res) => {
    const { id, animalId } = req.params;
    const animal = await Animal.findByIdAndUpdate(animalId, { ...req.body.animal });
    await animal.save();
    req.flash('success', 'Successfully updated animal info!');
    res.redirect(`/shelters/${id}`);
};

// Delete animal route =================================================
module.exports.deleteAnimal = async (req, res) => {
    const { id, animalId } = req.params;
    await Shelter.findByIdAndUpdate(id, { $pull: { animal: animalId }});
    await Animal.findByIdAndDelete(animalId);
    res.redirect(`/shelters/${id}`);
};