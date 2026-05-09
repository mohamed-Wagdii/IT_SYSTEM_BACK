
const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require("../middlware/authMiddleware");
const {createTicket, getAllTickets, getTicketById, getTicketByStatus, deleteTicket} = require("../controllers/ticketController");



router.post('/tickets', authMiddleware, createTicket);
router.get('/tickets', authMiddleware, getAllTickets);
router.get('/tickets/status/', authMiddleware, adminOnly, getTicketByStatus);
router.get('/tickets/:id', authMiddleware, getTicketById);
router.delete('/tickets/:id', authMiddleware, deleteTicket);




module.exports = router;