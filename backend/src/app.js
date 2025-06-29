const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const passport = require('./passport/googleStrategy');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(passport.initialize());


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);

// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));


module.exports = app;
