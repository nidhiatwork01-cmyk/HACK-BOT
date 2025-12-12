# 🎓 Events Navigator - Campus Event Management Platform

A modern, full-stack web application for managing and discovering campus events at KIIT University. Built with React, Flask, and ML-powered features.

## ✨ Features

### 🎯 Core Features
- **Event Management**: Create, browse, and manage campus events
- **Smart Search**: AI-powered semantic search for finding events
- **Calendar View**: Interactive calendar with event highlighting
- **User Authentication**: Secure login/signup with KIIT email validation
- **Event Registration**: One-click registration with tracking
- **User Profiles**: Personalized profiles showing event history

### 🤖 ML/AI Features
- **Semantic Search**: Intelligent event search using embeddings
- **Description Enhancement**: AI-powered suggestions to improve event descriptions
- **Success Prediction**: ML model predicts event success before it happens
- **Event Recommendations**: Personalized event recommendations
- **Trending Analysis**: Real-time trending event categories
- **AI Assistant**: Chatbot for requesting events (open to everyone)

### 🎨 UI/UX
- Modern, clean design with animations
- Responsive layout (mobile-friendly)
- KIIT branding with green color scheme
- Smooth transitions and hover effects
- Dark/light theme support

## 🚀 Quick Start

### Prerequisites
- Python 3.7+ 
- Node.js 16+
- npm or yarn

### Installation

#### 1. Backend Setup
```bash
cd backend
pip install Flask==3.0.0 flask-cors==4.0.0 PyJWT==2.8.0 bcrypt==4.1.2 python-dotenv==1.0.0
python app.py
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 3. Open Browser
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
hack-bot/
├── backend/
│   ├── app.py                 # Flask backend server
│   ├── ml_assistant.py       # AI assistant for event requests
│   ├── ml_recommender.py     # Event recommendations
│   ├── ml_search.py          # Semantic search
│   ├── ml_description_enhancer.py  # Description analysis
│   ├── ml_success_predictor.py     # Success prediction
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # State management
│   │   └── services/        # API services
│   └── package.json         # Node dependencies
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLite**: Database
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **ML Libraries**: Custom ML implementations with fallbacks

### Frontend
- **React**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **React Router**: Navigation
- **Axios**: HTTP client

## 🎯 Key Features Explained

### Landing Page
- College selection (KIIT validation)
- Beautiful hero section
- Feature highlights

### Event Management
- Create events with ML-powered suggestions
- Filter by category, date, venue
- Semantic search
- Calendar view

### ML Features
- **Semantic Search**: Finds events by meaning, not just keywords
- **Description Enhancement**: Real-time quality analysis with suggestions
- **Success Prediction**: Predicts event success score (0-100) with recommendations

### AI Assistant
- Public chatbot for event requests
- Automatic category detection
- Sentiment analysis
- Society name extraction
- Faculty dashboard for managing requests

## 📝 API Endpoints

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (auth required)
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/register` - Register for event

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### ML Features
- `GET /api/ml/search?q=query` - Semantic search
- `POST /api/ml/enhance-description` - Analyze description
- `POST /api/ml/predict-success` - Predict event success
- `GET /api/ml/recommendations` - Get recommendations
- `GET /api/ml/trending` - Get trending categories

### AI Assistant
- `POST /api/assistant/request` - Submit event request (public)
- `GET /api/assistant/requests/recent` - Get recent requests (public)
- `GET /api/assistant/requests` - Get all requests (privileged)

## 🔐 Authentication

### Student Registration
- Requires KIIT email (`@kiit.ac.in`)
- Standard user role

### Privileged Access
- Faculty, KSAC members, Society Presidents
- Secret key: `hiiamfromksac`
- Access to admin dashboard

## 📊 Database Schema

- **users**: User accounts with roles
- **events**: Event information
- **registrations**: Event registrations
- **event_requests**: AI assistant requests

## 🎨 UI Components

- Reusable Button, Card, Input components
- Event cards with hover effects
- Calendar widget with date highlighting
- ML dashboard with analytics
- Profile page with event history

## 🚧 Development

### Running in Development
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Environment Variables
Create `.env` in backend folder:
```
JWT_SECRET=your-secret-key
SCHOOL_EMAIL_DOMAINS=kiit.ac.in
```

## 📦 Git Setup

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit: Events Navigator Platform"
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Daily Workflow
```bash
git add .
git commit -m "Your commit message"
git push
```

## 📄 License

This project is created for HACK-A-BOT 2.0 hackathon.

## 👥 Contributors

Built for KIIT University students and faculty.

## 🙏 Acknowledgments

- KIIT University for the problem statement
- All the societies and clubs using the platform

---

**Made with ❤️ for KIIT Campus**
