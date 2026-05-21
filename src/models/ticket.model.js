const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    rawSubject: { type: String, required: true },
    rawBody:    { type: String, required: true },
    sender:     { type: String, required: true },
    title:      { type: String, default: '' },
    summary:    { type: String, default: '' },
    type: {
      type: String,
      enum: ['Bug', 'Issue', 'Update', 'Unclassified'],
      default: 'Unclassified',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Review', 'Resolved', 'Closed'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
