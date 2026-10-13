// ============================================================
//  models/Document.js
//  Represents an uploaded PDF study document.
// ============================================================

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    originalName: { type: String },
    filePath:     { type: String },        // server path to stored file
    size:         { type: Number },        // bytes
    pages:        { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Processing', 'Ready', 'Error'],
      default: 'Processing',
    },
    // Raw extracted text (used by AI Tutor + quiz generation)
    extractedText: {
      type: String,
      default: '',
    },
    subject: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
