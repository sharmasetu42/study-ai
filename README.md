# StudyAI – AI-Powered Study Assistant 🎓

A full-stack AI study assistant built with React, Node.js, MongoDB, and Google Gemini AI.

## Features

- 🤖 **AI Tutor** – Chat with Gemini AI about your study material
- 📄 **Document Upload** – Upload PDFs and ask questions about them
- 🧠 **Smart Quiz** – Take quizzes with results saved to your profile
- 🃏 **Flashcards** – Review concepts with flip-card animations
- 📊 **Progress Tracking** – Track your learning analytics
- 🔐 **Authentication** – JWT-based register/login

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, React Router 6    |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas (Mongoose)          |
| AI        | Google Gemini API                 |
| Auth      | JWT (jsonwebtoken + bcryptjs)     |
| Styling   | Pure CSS with CSS Variables       |
| Icons     | Lucide React                      |

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Google Gemini API key (free)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/studyai.git
cd studyai
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Fill in your MongoDB URI and Gemini API key in .env
npm install
npm run dev
```

### 3. Setup Frontend
```bash
# In the root folder
npm install
npm run dev
```

### 4. Open the app
Visit **http://localhost:5173**

## Environment Variables

### Backend (`backend/.env`)
| Variable        | Description                        |
|-----------------|------------------------------------|
| `MONGODB_URI`   | MongoDB Atlas connection string    |
| `JWT_SECRET`    | Secret key for JWT tokens          |
| `GEMINI_API_KEY`| Google AI Studio API key           |
| `PORT`          | Server port (default: 5000)        |

### Frontend (`.env.local`)
| Variable       | Description              |
|----------------|--------------------------|
| `VITE_API_URL` | Backend API URL          |

## API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | `/api/auth/register`      | Register new user        |
| POST   | `/api/auth/login`         | Login                    |
| GET    | `/api/auth/me`            | Get current user         |
| GET    | `/api/documents`          | List documents           |
| POST   | `/api/documents/upload`   | Upload PDF               |
| DELETE | `/api/documents/:id`      | Delete document          |
| POST   | `/api/ai/chat`            | Chat with Gemini AI      |
| POST   | `/api/ai/generate-quiz`   | Generate quiz from PDF   |
| POST   | `/api/quiz/submit`        | Submit quiz results      |
| GET    | `/api/quiz/history`       | Get quiz history         |
| GET    | `/api/progress`           | Get learning progress    |

## Project Structure

```
studyai/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── layouts/            # App layout (sidebar + navbar)
│   ├── context/            # Auth context
│   ├── services/           # API service layer (Axios)
│   └── data/               # Mock data (fallback)
├── backend/                # Express backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── middleware/         # Auth + validation
│   └── config/             # DB connection
└── README.md
```

## License
MIT
