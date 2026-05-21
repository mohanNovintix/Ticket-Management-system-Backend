const Ticket = require('../models/ticket.model');
const { classifyEmail } = require('../services/classification.service');

exports.createTicket = async (req, res) => {
  try {
    const { sender, rawSubject, rawBody } = req.body;
    if (!sender || !rawSubject || !rawBody) {
      return res.status(400).json({ error: 'sender, rawSubject, and rawBody are required.' });
    }

    const classification = await classifyEmail({ subject: rawSubject, body: rawBody });

    const ticket = await Ticket.create({
      sender,
      rawSubject,
      rawBody,
      ...classification,
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ticket.' });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const { type, status, priority, search } = req.query;
    const filter = {};

    if (type)     filter.type     = type;
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title:   { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tickets.' });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ticket.' });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ticket.' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ticket.' });
  }
};
