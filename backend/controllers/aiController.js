// ============================================================
//  controllers/aiController.js
//  Handles AI Tutor chat using Google Gemini API.
//  - Tries multiple models automatically if one is overloaded
//  - Falls back to a helpful message if all models fail
// ============================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Document = require('../models/Document');

// Models to try in order (newest first, fallback down the list)
const MODELS = [
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-pro-latest',
  'gemini-flash-latest',
];

// ── Helper: try to get a response from any available model ────
const askGemini = async (apiKey, prompt, history = [], systemPrompt = '') => {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt || undefined,
      });

      const geminiHistory = history.map((msg) => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const chatSession = model.startChat({
        history: geminiHistory,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      });

      const result = await chatSession.sendMessage(prompt);
      const text = result.response.text();
      console.log(`✅ Used model: ${modelName}`);
      return text;

    } catch (err) {
      lastError = err;
      // Only retry on 503 (overloaded) or 404 (model unavailable)
      const is503 = err.message.includes('503') || err.message.includes('high demand');
      const is404 = err.message.includes('404') || err.message.includes('not found');
      if (is503 || is404) {
        console.log(`⚠️  ${modelName} unavailable, trying next...`);
        continue;
      }
      // Other errors (auth, quota) — throw immediately
      throw err;
    }
  }

  throw lastError;
};

// ── Helper: generate content (non-chat) with model fallback ───
const generateWithFallback = async (apiKey, prompt) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      console.log(`✅ Used model: ${modelName}`);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const is503 = err.message.includes('503') || err.message.includes('high demand');
      const is404 = err.message.includes('404') || err.message.includes('not found');
      if (is503 || is404) { console.log(`⚠️  ${modelName} unavailable, trying next...`); continue; }
      throw err;
    }
  }
  throw lastError;
};

// ── POST /api/ai/chat ────────────────────────────────────────
const chat = async (req, res) => {
  const { message, documentId, history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  // Fetch document context if provided
  let documentContext = '';
  if (documentId) {
    const doc = await Document.findOne({ _id: documentId, user: req.user._id });
    if (doc && doc.extractedText) {
      documentContext = doc.extractedText.slice(0, 3000);
    }
  }

  const systemPrompt = `You are StudyAI, a helpful and friendly AI study assistant for college students.
Your job is to help students understand their study material, explain concepts clearly, give examples, and help them prepare for exams.
${documentContext ? `\nStudent's study material:\n${documentContext}\n` : ''}
Guidelines:
- Explain clearly and simply, like a good teacher
- Use examples and analogies where helpful
- For code concepts, provide short code examples
- Keep answers concise but complete
- Be encouraging and supportive`;

  try {
    const reply = await askGemini(
      process.env.GEMINI_API_KEY,
      message,
      history,
      systemPrompt
    );

    res.status(200).json({ success: true, data: { reply, role: 'ai' } });

  } catch (error) {
    console.error('Gemini API error:', error.message);

    // Graceful fallback message
    if (error.message.includes('API_KEY') || error.message.includes('API key')) {
      return res.status(200).json({
        success: true,
        data: {
          reply: `I'm StudyAI! 🤖 My AI engine isn't configured yet.\n\nTo enable real AI responses:\n1. Get a free Gemini API key from https://aistudio.google.com/app/apikey\n2. Add it to backend/.env as GEMINI_API_KEY=your_key\n3. Restart the server`,
          role: 'ai',
        },
      });
    }

    if (error.message.includes('503') || error.message.includes('high demand')) {
      return res.status(200).json({
        success: true,
        data: {
          reply: `⚠️ Google's AI servers are temporarily overloaded. This usually resolves in a few minutes.\n\nPlease try again shortly! Your question was: "${message}"`,
          role: 'ai',
        },
      });
    }

    res.status(500).json({ success: false, message: 'AI service error: ' + error.message });
  }
};

// ── POST /api/ai/generate-quiz ───────────────────────────────
const generateQuiz = async (req, res) => {
  const { documentId, count = 5 } = req.body;

  if (!documentId) {
    return res.status(400).json({ success: false, message: 'Document ID required' });
  }

  const doc = await Document.findOne({ _id: documentId, user: req.user._id });
  if (!doc || !doc.extractedText) {
    return res.status(404).json({ success: false, message: 'Document not found or not ready' });
  }

  try {
    const prompt = `Based on the following study material, generate ${count} multiple choice questions.

Study Material:
${doc.extractedText.slice(0, 3000)}

Return ONLY a valid JSON array in this exact format (no extra text):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why this is correct."
  }
]`;

    let text = await generateWithFallback(process.env.GEMINI_API_KEY, prompt);
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questions = JSON.parse(text);

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error('Quiz generation error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate quiz: ' + error.message });
  }
};

// ── POST /api/ai/summarize ───────────────────────────────────
const summarize = async (req, res) => {
  const { documentId } = req.body;

  const doc = await Document.findOne({ _id: documentId, user: req.user._id });
  if (!doc || !doc.extractedText) {
    return res.status(404).json({ success: false, message: 'Document not found or not ready' });
  }

  try {
    const prompt = `Summarize the following study material in a clear, student-friendly way.
Include: key concepts, important points, and anything likely to be on an exam.
Keep it concise but comprehensive.

Material:
${doc.extractedText.slice(0, 4000)}`;

    const summary = await generateWithFallback(process.env.GEMINI_API_KEY, prompt);
    res.status(200).json({ success: true, data: { summary } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Summarization failed: ' + error.message });
  }
};

module.exports = { chat, generateQuiz, summarize };
