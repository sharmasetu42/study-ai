// ============================================================
//  models/Quiz.js
//  Stores a completed quiz attempt with score.
// ============================================================

const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex:  { type: Number },
  question:       { type: String },
  selectedIndex:  { type: Number },
  correctIndex:   { type: Number },
  correct:        { type: Boolean },
}, { _id: false });

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject:    { type: String, default: 'General' },
    totalQ:     { type: Number },
    correct:    { type: Number },
    score:      { type: Number },   // percentage 0-100
    answers:    [answerSchema],
    timeTaken:  { type: Number },   // seconds (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
