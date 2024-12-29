const mongoose = require('mongoose');

const infoArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['önce', 'sırası', 'sonrası', 'genel'],
        required: true
    },
    author: String,
    tags: [String],
    imageUrl: String,
    order: Number,
    isActive: {
        type: Boolean,
        default: true
    },
    shortDescription: String
}, {
    timestamps: true
});

module.exports = mongoose.model('InfoArticle', infoArticleSchema); 