const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['Start', 'Pause', 'Resume', 'End'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false }); // Disable automatic generation of _id for history entries

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Ongoing', 'Paused', 'Completed'],
        default: 'Pending',
    },
    duration: {
        type: Number,
        default: 0,
    },
    history: [HistorySchema], // Use HistorySchema for history sub-documents
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);