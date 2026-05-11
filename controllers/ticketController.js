const Tickets = require("../models/Tickets");
const User = require("../models/User");
const mongoose = require("mongoose");

const createTicket = async (req, res) => {
  try {
    const { subject, category, description, priority, status } = req.body;
    if (!subject || !description) {
      return res
        .status(400)
        .json({ message: "Subject and description are required." });
    }

    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const ticket = await Tickets.create({
      createdBy: userId,
      subject,
      category,
      description,
      priority,
      status,
    });

    res.status(201).json({ message: "Ticket created successfully.", ticket });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating ticket.", error: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    // ملحوظة: لو الأدمن بيشوف كله، ممكن تعدلي دي، لكن حالياً بتجيب تذاكر المستخدم نفسه
    const tickets = await Tickets.find({ createdBy: userId });
    res.status(200).json({ tickets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tickets.", error: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID." });
    }

    const ticket = await Tickets.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ticket.", error: error.message });
  }
};

const getTicketByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({ message: "Status parameter is required." });
    }

    const tickets = await Tickets.find({ status: status });
    res.status(200).json({ tickets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching status ticket.", error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID." });
    }

    const ticket = await Tickets.findOneAndDelete({
      _id: ticketId,
      createdBy: userId,
    });

    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or unauthorized." });
    }

    res.status(200).json({ message: "Ticket deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting ticket.", error: error.message });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;

    const allowedStatus = ["pending", "in-progress", "resolved", "closed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ticket = await Tickets.findByIdAndUpdate(
      ticketId,
      { status: status },
      { new: true },
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res
      .status(200)
      .json({ message: "Ticket status updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  getTicketByStatus,
  deleteTicket,
  updateTicketStatus,
};
