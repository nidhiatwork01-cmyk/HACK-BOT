# Technology Stack Documentation

This document provides a comprehensive overview of all technologies, frameworks, libraries, and tools used in the Events Navigator project.

---

## Frontend Technology Stack

### Core Framework & Runtime
- **React 18.2.0** - Modern JavaScript library for building user interfaces
  - Component-based architecture
  - Virtual DOM for efficient rendering
  - Hooks for state management and side effects

- **Vite 5.0.8** - Next-generation frontend build tool
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Native ES modules support
  - Development server with proxy configuration

### Routing
- **React Router DOM 6.20.0** - Declarative routing for React
  - Client-side routing
  - Protected routes with authentication
  - Dynamic route parameters
  - Navigation guards

### HTTP Client
- **Axios 1.6.2** - Promise-based HTTP client
  - Interceptors for request/response handling
  - Automatic token injection
  - Error handling and retry logic
  - Support for async/await

### Styling & UI
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
  - Responsive design utilities
  - Custom color palette
  - Dark mode support (if configured)
  - JIT (Just-In-Time) compilation

- **PostCSS 8.4.32** - CSS transformation tool
  - Autoprefixer integration
  - CSS processing pipeline

- **Autoprefixer 10.4.16** - Automatic vendor prefixing
  - Browser compatibility
  - CSS standardization

### Icons & UI Components
- **Lucide React 0.294.0** - Beautiful icon library
  - React component icons
  - Tree-shakeable imports
  - Consistent icon design

### Animations
- **Framer Motion 10.16.16** - Production-ready motion library
  - Smooth page transitions
  - Component animations
  - Gesture support
  - Layout animations

### Date Handling
- **date-fns 2.30.0** - Modern JavaScript date utility library
  - Date formatting
  - Date parsing and manipulation
  - Timezone handling
  - Relative time formatting

### Development Tools
- **@vitejs/plugin-react 4.2.1** - Vite plugin for React
  - Fast Refresh support
  - JSX transformation
  - React-specific optimizations

---

## 🔧 Backend Technology Stack

### Core Framework
- **Flask 3.0.0** - Lightweight Python web framework
  - RESTful API endpoints
  - Request routing and handling
  - Middleware support
  - Extension ecosystem

### Security & Authentication
- **PyJWT 2.8.0** - JSON Web Token implementation
  - Token generation and validation
  - Secure authentication
  - Token expiration handling

- **bcrypt 4.1.2** - Password hashing library
  - Secure password storage
  - Salt generation
  - Password verification

### CORS & API
- **Flask-CORS 4.0.0** - Cross-Origin Resource Sharing support
  - Multi-origin support
  - Configurable CORS policies
  - Preflight request handling

### Database
- **SQLite3** - Lightweight embedded database
  - File-based storage
  - ACID compliance
  - No server required
  - Easy migration and backup

### Environment Management
- **python-dotenv 1.0.0** - Environment variable management
  - `.env` file support
  - Configuration management
  - Secret key handling

### Production Server
- **Gunicorn 21.2.0** - Python WSGI HTTP Server
  - Production-ready server
  - Process management
  - Load balancing
  - Worker processes

### Machine Learning (Optional)
- **scikit-learn** - Machine learning library
  - Event recommendations
  - Popularity prediction
  - Classification algorithms

- **sentence-transformers** - Semantic search
  - Text embeddings
  - Similarity search
  - Natural language understanding

- **numpy** - Numerical computing
  - Array operations
  - Mathematical functions

- **pandas** - Data manipulation
  - Data analysis
  - Data transformation

- **nltk** - Natural Language Toolkit
  - Text processing
  - Tokenization
  - Sentiment analysis

---

## 🏗️ Architecture & Patterns

### Frontend Architecture
- **Component-Based Architecture**
  - Reusable UI components
  - Separation of concerns
  - Props and state management

- **Context API** - React's built-in state management
  - `AuthContext` - Authentication state
  - `EventContext` - Event data and operations

- **Service Layer Pattern**
  - `api.js` - API communication
  - `auth.js` - Authentication services
  - `ml.js` - ML feature services
  - `assistant.js` - AI assistant services

- **Protected Routes**
  - Route guards for authentication
  - Role-based access control
  - Redirect handling

### Backend Architecture
- **RESTful API Design**
  - Resource-based URLs
  - HTTP methods (GET, POST, PUT, DELETE)
  - JSON request/response format

- **Decorator Pattern**
  - `@require_auth` - Authentication decorator
  - `@require_role` - Role-based authorization

- **Database Abstraction**
  - Connection pooling
  - Row factory for dict-like access
  - Transaction management

- **ML Module Pattern**
  - Separate ML modules for different features
  - Fallback mechanisms
  - Lazy loading of heavy dependencies

---

## 📦 Project Structure

### Frontend Structure
```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── assistant/   # AI assistant components
│   │   ├── auth/        # Authentication components
│   │   ├── calendar/    # Calendar widgets
│   │   ├── events/      # Event-related components
│   │   ├── home/        # Home page components
│   │   ├── layout/      # Layout components (Navbar, etc.)
│   │   ├── ml/          # ML feature components
│   │   └── ui/          # Base UI components
│   ├── context/         # React Context providers
│   ├── pages/           # Page components
│   ├── services/        # API and service layers
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

### Backend Structure
```
backend/
├── app.py              # Main Flask application
├── ml_assistant.py     # AI assistant module
├── ml_recommender.py   # Event recommendation system
├── ml_search.py         # Semantic search
├── ml_description_enhancer.py  # Description analysis
├── ml_success_predictor.py      # Success prediction
├── requirements.txt    # Python dependencies
└── events.db          # SQLite database
```

---

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API endpoints
- Token expiration handling

### Data Security
- SQL injection prevention (parameterized queries)
- CORS configuration
- Environment variable management
- Secret key management
- Input validation

---

## 🚀 Build & Development

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Scripts
```bash
python app.py    # Start Flask development server
```

### Environment Variables
- `VITE_API_URL` - Frontend API endpoint
- `SECRET_KEY` - JWT secret key
- `FACULTY_SECRET_KEY` - Faculty registration key
- `KSAC_SECRET_KEY` - KSAC member key
- `SOCIETY_PRESIDENT_SECRET_KEY` - Society president key
- `ADMIN_SECRET_KEY` - Admin key
- `PORT` - Server port (default: 5000)

---

## 📊 Key Features & Technologies

### Event Management
- CRUD operations for events
- Event categorization
- Event search and filtering
- Event registration system
- Event expiration handling
- Event deletion

### User Management
- User registration and authentication
- Role-based access (Student, Faculty, KSAC, Society President, Admin)
- User profiles
- Registration history

### Machine Learning Features
- **Semantic Search** - Intelligent event search using embeddings
- **Event Recommendations** - Personalized event suggestions
- **Popularity Prediction** - ML-based event success prediction
- **Description Enhancement** - AI-powered description analysis
- **Success Prediction** - Event success scoring

### AI Assistant
- Natural language event requests
- Category detection
- Sentiment analysis
- Auto-responses
- Request management dashboard

---

## 🌐 Deployment

### Frontend Deployment Options
- **Azure Static Web Apps** - Recommended for Vite/React apps
- **Azure App Service** - Full-featured web hosting

### Backend Deployment Options
- **Azure App Service** - Python web app hosting
- **Azure Container Instances** - Docker container deployment
- **Azure Functions** - Serverless deployment

### Configuration Files
- `vite.config.js` - Vite build configuration
- `Dockerfile` - Docker container configuration

---

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Router Documentation](https://reactrouter.com/)

### Learning Resources
- React Hooks
- Context API
- RESTful API Design
- JWT Authentication
- SQLite Database Management
- Machine Learning Integration

---

## 🔄 Version Information

### Frontend Dependencies
- React: ^18.2.0
- Vite: ^5.0.8
- React Router: ^6.20.0
- Axios: ^1.6.2
- Tailwind CSS: ^3.3.6
- Framer Motion: ^10.16.16

### Backend Dependencies
- Flask: 3.0.0
- Flask-CORS: 4.0.0
- PyJWT: 2.8.0
- bcrypt: 4.1.2
- python-dotenv: 1.0.0
- Gunicorn: 21.2.0

---

## 💡 Best Practices

### Code Organization
- Component reusability
- Separation of concerns
- Service layer abstraction
- Error handling
- Loading states

### Performance
- Code splitting
- Lazy loading
- Image optimization
- API request optimization
- Database query optimization

### Security
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration
- Secure password storage

---

**Last Updated:** 2024
**Project:** Events Navigator - Campus Event Management System

