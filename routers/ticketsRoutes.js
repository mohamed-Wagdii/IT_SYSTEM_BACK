
const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlware/authMiddleware");
const {createTicket, getAllTickets, getTicketById, deleteTicket} = require("../controllers/ticketController");



router.post('/tickets', authMiddleware, createTicket);
router.get('/tickets', authMiddleware, getAllTickets);
router.get('/tickets/:id', authMiddleware, getTicketById);
router.delete('/tickets/:id', authMiddleware, deleteTicket);



module.exports = router;