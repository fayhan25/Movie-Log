const mongoose = require('mongoose');

const Schema = mongoose.Schema

const movieSchema = new Schema({
    name : {type: String, required: true},
    review: {type: String, required: true},
    stars: {type: Number, required: true},
    image: {type: String, required:true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
}
)

module.exports = mongoose.model ('Movie', movieSchema);

