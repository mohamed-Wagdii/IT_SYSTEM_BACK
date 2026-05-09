const Tickets = require("../models/Tickets");
const User = require("../models/User");
const mongoose = require("mongoose");

// Create a new ticket
const createTicket = async(req , res) => {
    try {
            const { subject, category, description, priority, status } = req.body;
        if (!subject || !description) {
            return res.status(400).json({ message: "Subject and description are required." });
        }
        // if (!["low", "medium", "high"].includes(priority)) {
        //     return res.status(400).json({ message: "Invalid priority value." });
        // }
        // if (!["pending","in-progress", "resolved", "closed"].includes(status)) {
        //     return res.status(400).json({ message: "Invalid status value." });
        // }

        const userId = req.user.id;
        
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const ticket = await Tickets.create({
            createdBy: userId,
            subject,
            category,
            description,
            priority,
            status
        });

        res.status(201).json({ message: "Ticket created successfully.", ticket });

    } catch (error) {
        res.status(500).json({ message: "Error creating ticket.", error });
    }
}

const getAllTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const tickets = await Tickets.find({ createdBy: userId });

        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tickets.", error });
    }
}

const getTicketById = async (req, res) => {

    try{
        const userId = req.user.id;
        const ticketId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ message: "Invalid ticket ID." });
        }
        if(req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied." });
        }
        const ticket = await Tickets.findOne({
         _id: ticketId,
        createdBy: userId
});

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        res.status(200).json({ ticket });

    } catch (error) {
        res.status(500).json({ message: "Error fetching ticket.", error });
    }
}

const getTicketByStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

    console.log(status);

        const tickets = await Tickets.find({
            // createdBy: userId,
            status: status
        });

        res.status(200).json({ tickets });


    } catch (error) {
         res.status(500).json({ message: "Error fetching status ticket.", error });
    }
}


const deleteTicket = async(req , res)=> {
    const userId = req.user.id;
    const ticketId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID." });
    }

    try {
        const ticket = await Tickets.findOneAndDelete({ _id: ticketId, createdBy: userId });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        res.status(200).json({ message: "Ticket deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting ticket.", error });
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    getTicketByStatus,
    deleteTicket
}
