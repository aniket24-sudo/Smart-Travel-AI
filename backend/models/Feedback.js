const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    rating: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    date: { 
        type: String, 
        default: () => new Date().toLocaleDateString() 
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);