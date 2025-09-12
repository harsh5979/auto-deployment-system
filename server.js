require('dotenv').config()
const express = require('express')
const cors = require('cors');
const deployRoutes = require('./routes/deploy.route');
const userRoutes = require('./routes/user.route')
const { connectDB } = require('./db');
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(cors(
  {
    origin: "http://10.162.119.76:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(cookieParser());

app.use('/v1', userRoutes)
app.use('/api', deployRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Backend listening at http://localhost:${PORT}`);
});
