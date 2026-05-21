const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/tickets.controller');

router.post('/',    ctrl.createTicket);
router.get('/',     ctrl.getTickets);
router.get('/:id',  ctrl.getTicketById);
router.patch('/:id', ctrl.updateTicket);
router.delete('/:id', ctrl.deleteTicket);

module.exports = router;
