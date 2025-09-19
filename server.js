require('dotenv').config()
const express = require('express')
const cors = require('cors');
const deployRoutes = require('./routes/deploy.route');
const userRoutes = require('./routes/user.route')
const adminRoutes = require('./routes/admin.routes')
const { connectDB } = require('./db');
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;
const host = '10.121.31.76'
app.use(cors(
  {
    origin: process.env.CLIENT_URL,
    credentials: true,
  }
));
app.use(express.json());
app.use(cookieParser());

app.use('/v1', userRoutes)
app.use('/api', deployRoutes);
app.use('/v2',adminRoutes)

app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Backend listening at http://localhost:${PORT}`);
});
