require('dotenv').config()
const express = require('express')
const cors = require('cors');
const deployRoutes = require('./routes/deployRoute');
const {connectDB } = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api', deployRoutes);

app.listen(PORT, async() => {
await  connectDB();
  console.log(`✅ Backend listening at http://localhost:${PORT}`);
});
