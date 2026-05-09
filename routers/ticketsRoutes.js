
const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require("../middlware/authMiddleware");
const {createTicket, getAllTickets, getTicketById, deleteTicket ,updateTicketStatus} = require("../controllers/ticketController");



router.post('/tickets', authMiddleware, createTicket);
router.get('/tickets', authMiddleware, getAllTickets);
router.get('/tickets/:id', authMiddleware, getTicketById);
router.delete('/tickets/:id', authMiddleware, deleteTicket);
router.put("/tickets/:id/status", authMiddleware,adminOnly ,updateTicketStatus);


module.exports = router;
