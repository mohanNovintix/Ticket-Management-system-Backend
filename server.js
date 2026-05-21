require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const cors    = require('cors');
const connectDB = require('./src/config/db');
const ticketRoutes = require('./src/routes/tickets.routes');

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/tickets', ticketRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
