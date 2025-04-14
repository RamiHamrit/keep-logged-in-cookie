// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const errorHandler = require('./middleware/errorHandler');
const { initializeUsers } = require('./utils/userUtils');
require('dotenv').config();

const app = express();

app.use(helmet()); // Add security headers
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    store: require('connect-mongo').create({
      mongoUrl: process.env.MONGO_URI,
      clientPromise: mongoose.connect(process.env.MONGO_URI).then((m) => {
        console.log('MongoDB session store connected');
        return m.connection.getClient();
      }).catch((err) => {
        console.error('❌ MongoDB session store failed:', err.message);
        throw err;
      }),
    }),
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE, 10) || 1800000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  })
);

app.use('/', challengeRoutes);
app.use('/', authRoutes);

app.use((req, res) => {
  res.status(404).render('pages/error', {
    user: req.session.user,
    error: 'Page not found!',
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    await initializeUsers();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1);
  });