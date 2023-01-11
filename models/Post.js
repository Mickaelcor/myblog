const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    Titre: { type: String, required: true },
    Auteur: { type: String },
    Description: { type: String, required: true },

});

module.exports = mongoose.model('Post', postSchema);