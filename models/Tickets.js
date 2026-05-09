const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    description : {
        type: String,
        required: true,
        trim: true
    },
    subject:{
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    status:{
        type: String,
        enum: ["pending","in-progress", "resolved", "closed"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
