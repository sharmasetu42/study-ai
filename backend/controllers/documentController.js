// ============================================================
//  controllers/documentController.js
//  Handles PDF upload, listing, deletion for the logged-in user.
// ============================================================

const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

// ── GET /api/documents ───────────────────────────────────────
const getDocuments = async (req, res) => {
  const docs = await Document.find({ user: req.user._id })
    .sort({ createdAt: -1 }); // newest first

  res.status(200).json({ success: true, data: docs });
};

// ── POST /api/documents/upload ───────────────────────────────
const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Create the document record with Processing status
  const doc = await Document.create({
    user: req.user._id,
    name: req.file.originalname,
    originalName: req.file.originalname,
    filePath: req.file.path,
    size: req.file.size,
    status: 'Processing',
  });

  // Simulate processing (in production: use pdf-parse to extract text)
  // We update status to Ready after a short delay
  setTimeout(async () => {
    try {
      await Document.findByIdAndUpdate(doc._id, {
        status: 'Ready',
        pages: Math.floor(Math.random() * 40) + 5, // mock page count
        // In production: extractedText = parsed PDF text
        extractedText: `Content of ${req.file.originalname}. This is where the extracted PDF text would appear for AI processing.`,
      });
    } catch (e) {
      console.error('Processing error:', e.message);
    }
  }, 3000);

  res.status(201).json({ success: true, data: doc });
};

// ── GET /api/documents/:id ───────────────────────────────────
const getDocument = async (req, res) => {
  const doc = await Document.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!doc) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  res.status(200).json({ success: true, data: doc });
};

// ── DELETE /api/documents/:id ────────────────────────────────
const deleteDocument = async (req, res) => {
  const doc = await Document.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!doc) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  // Delete the physical file if it exists
  if (doc.filePath && fs.existsSync(doc.filePath)) {
    fs.unlinkSync(doc.filePath);
  }

  await doc.deleteOne();

  res.status(200).json({ success: true, message: 'Document deleted' });
};

module.exports = { getDocuments, uploadDocument, getDocument, deleteDocument };
