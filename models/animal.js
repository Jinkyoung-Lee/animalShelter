const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animalSchema = new Schema({
    breed: String,
    image: String,
    sex: String,
    dateRescued: Date,
    locationRescued: String,
    age: Number,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const animal = mongoose.model('Animal', animalSchema);
module.exports = animal;