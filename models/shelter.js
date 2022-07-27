// Requiring mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Image schema
const imageSchema = new Schema(
    {
        url: String,
        filename: String
    }
);

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
});

const shelterSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    phone: Number,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    animals: [
        {
            type: Schema.Types.ObjectId,
            ref: "Animal"
        }
    ],
    deleteImages: Array
});

shelterSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Animal.deleteMany({
            _id: {
                $in: doc.animals
            }
        });
    };
});

const shelter = mongoose.model('Shelter', shelterSchema);
module.exports = shelter;