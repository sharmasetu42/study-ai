// ============================================================
//  routes/documents.js
//  All routes require a valid JWT (protect middleware).
// ============================================================

const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const router   = express.Router();

const {
  getDocuments, uploadDocument,
  getDocument,  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

// ── Multer storage: save PDFs to /backend/uploads/ ───────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    // Create uploads folder if it doesn't exist
    require('fs').mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Unique filename: userId_timestamp_originalname
    const unique = `${req.user._id}_${Date.now()}_${file.originalname}`;
    cb(null, unique);
  },
});

// Only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
});

// Routes
router.get('/',             protect, getDocuments);
router.post('/upload',      protect, upload.single('pdf'), uploadDocument);
router.get('/:id',          protect, getDocument);
router.delete('/:id',       protect, deleteDocument);

module.exports = router;
