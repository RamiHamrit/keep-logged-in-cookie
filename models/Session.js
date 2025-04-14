// models/Session.js
const mongoose = require('mongoose');

/**
 * Session schema for storing user sessions
 * - Used by connect-mongo for session persistence
 * - Not directly used in routes but required for session store
 */
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },  //    Automatically set to the current date/time when the session is created.

});

module.exports = mongoose.model('Session', sessionSchema);