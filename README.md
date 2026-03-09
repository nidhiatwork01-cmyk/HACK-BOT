# 🎓 Campus Event Navigator

A modern, AI-powered platform for managing and discovering campus events at KIIT University. Built with React, Flask, and machine learning features.

**Deployment Platform:** Microsoft Azure

---

## ✨ Features

### Core Features
- 🎯 **Event Management** - Create, browse, and manage campus events
- 🔍 **Smart Search** - AI-powered semantic search for finding events
- 📅 **Calendar View** - Interactive calendar with event highlighting
- 🔐 **Authentication** - Secure login with KIIT email validation
- 📝 **Registration** - One-click event registration with tracking
- 👤 **User Profiles** - Personalized profiles with event history

### AI/ML Features
- 🤖 **Semantic Search** - Intelligent event discovery using embeddings
- ✍️ **Description Enhancement** - AI suggestions for better event descriptions
- 📊 **Success Prediction** - ML model predicts event success rates
- 💡 **Recommendations** - Personalized event recommendations
- 📈 **Trending Analysis** - Real-time trending categories
- 🗣️ **AI Assistant** - Chatbot for event requests (open access)

### Security Features
- Role-based access control (Student, Society President, Faculty, Admin)
- Password protection for events
- Banned words filter
- School email domain validation (@kiit.ac.in)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 3. Access Application

Open browser: `http://localhost:5173`

**Or use Windows batch files:**
```bash
START_BACKEND.bat
START_FRONTEND.bat
```

---

## 📦 Deployment on Microsoft Azure

This project is optimized for deployment on **Microsoft Azure**.

### Quick Deploy to Azure (15 minutes)

See: **[AZURE_QUICKSTART.md](AZURE_QUICKSTART.md)**

### Complete Azure Deployment Guide

See: **[AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)**

### Backend-Only Azure Deploy

If frontend is already deployed and API calls fail with `Is the backend running?`, deploy backend separately:

```powershell
cd C:\Users\hiten\Desktop\HackABot\HACK-BOT
.\DEPLOY_BACKEND_AZURE.ps1 -FrontendUrl "https://your-frontend-domain"
```

Then set frontend env and redeploy frontend:

```bash
VITE_API_URL=https://<backend-fqdn>/api
```

### Azure Architecture

```
Azure Resource Group
├── Azure Container Registry (ACR)
│   └── Docker Image (Frontend + Backend)
├── Azure Web App
│   ├── App Service Plan (Linux)
│   └── Container from ACR
└── Azure Database for PostgreSQL (Recommended)
    └── Events Database
```

### Deployment Options

1. **Azure Web App with Docker** (Recommended)
   - Single container with frontend + backend
   - Uses root `Dockerfile`
   - ~$30/month

2. **Azure Static Web Apps + Container Apps**
   - Separate frontend and backend
   - Better scalability
   - Free tier available

---

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **SQLite** - Development database
- **PostgreSQL** - Production database (Azure)
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Gunicorn** - WSGI HTTP Server

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Axios** - HTTP client

Frontend API base URL behavior:
- Uses `VITE_API_URL` when set (recommended for separate frontend/backend deploys)
- Falls back to `/api` for same-origin deployments

### ML/AI
- **TF-IDF** - Text search and similarity
- **Custom ML** - Event recommendations and predictions
- **Fallback architecture** - Works without heavy ML dependencies

---

## 📁 Project Structure

```
HACK-BOT/
├── backend/
│   ├── app.py                        # Main Flask application
│   ├── db_config_azure.py           # Azure database helper
│   ├── ml_assistant.py              # AI assistant
│   ├── ml_recommender.py            # Recommendations
│   ├── ml_search.py                 # Semantic search
│   ├── ml_description_enhancer.py   # Description AI
│   ├── ml_success_predictor.py      # Success prediction
│   ├── migrate_db.py                # Database migration
│   ├── add_kiit_sample_events.py    # Sample data
│   ├── delete_event_direct.py       # Event deletion tool
│   ├── fix_banned_words.py          # Banned words setup
│   ├── make_events_open.py          # Remove event passwords
│   ├── requirements.txt             # Python dependencies
│   └── events.db                    # SQLite database (dev)
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── context/                 # State management
│   │   ├── services/                # API services
│   │   └── utils/                   # Utility functions
│   ├── package.json                 # Node dependencies
│   └── vite.config.js              # Vite configuration
├── Dockerfile                        # Multi-stage Docker build
├── AZURE_DEPLOYMENT_GUIDE.md        # Complete Azure guide
├── AZURE_QUICKSTART.md              # Quick Azure setup
├── HOW_TO_RUN.md                    # Local setup guide
├── QUICKSTART.md                    # Quick local setup
└── README.md                        # This file
```

---

## 🔐 Environment Variables

### Backend Environment Variables (Azure)

```bash
SECRET_KEY=your-random-secret-key
KSAC_SECRET_KEY=hiiamfromksac
FACULTY_SECRET_KEY=faculty-secret-2024
SOCIETY_PRESIDENT_SECRET_KEY=society-secret-2024
ADMIN_SECRET_KEY=admin-secret-2024
DATABASE_URL=postgresql://user:pass@host/db  # For PostgreSQL
PORT=8080
```

Set in Azure Web App Configuration or Key Vault.

---

## 👥 User Roles

1. **Student** - Browse events, register for events
2. **Society President** - Create and manage society events
3. **Faculty** - Create academic events
4. **KSAC** - Full event management privileges
5. **Admin** - System administration

---

## 🗃️ Database Schema

### Users
- Authentication and profile data
- Role-based permissions
- Society associations

### Events
- Event details (title, description, category, etc.)
- Venue with location data
- Registration links
- Password protection
- Status flags (locked, expired)

### Registrations
- User event registrations
- Timestamps

### Banned Words
- Content moderation
- Admin-managed

### Assistant Requests
- AI assistant chat history
- Request/response pairs

---

## 🧪 Development Tools

### Utility Scripts

```bash
# Migrate database schema
python backend/migrate_db.py

# Add sample KIIT events
python backend/add_kiit_sample_events.py

# Make all events public (remove passwords)
python backend/make_events_open.py

# Delete specific event
python backend/delete_event_direct.py <event_id>

# Setup banned words filter
python backend/fix_banned_words.py

# Initialize PostgreSQL tables (Azure)
python backend/db_config_azure.py init

# Migrate SQLite to PostgreSQL (Azure)
python backend/db_config_azure.py migrate
```

### Windows Quick Start Scripts

```bash
# Start backend server
START_BACKEND.bat

# Start frontend dev server
START_FRONTEND.bat
```

---

## 🐳 Docker

### Local Docker Build

```bash
# Build image
docker build -t event-navigator .

# Run container
docker run -p 8080:8080 event-navigator
```

Access on: `http://localhost:8080`

### Azure Container Registry

See [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md) for ACR setup and deployment.

---

## 🔧 Configuration Files

- **Dockerfile** - Multi-stage build (frontend + backend)
- **.dockerignore** - Exclude files from Docker build
- **vite.config.js** - Vite build configuration
- **tailwind.config.js** - Tailwind CSS settings
- **postcss.config.js** - PostCSS configuration
- **db_config_azure.py** - Azure database adapter

---

## 📊 Features in Detail

### Event Creation
- Rich text descriptions
- Category selection (Technical, Cultural, Sports, Academic, Social)
- Date and time picker
- Venue with location picker (KIIT locations)
- Poster URL
- Registration link
- Optional password protection

### Search & Discovery
- **Keyword Search** - Fast text matching
- **Semantic Search** - AI-powered understanding
- **Category Filter** - Browse by type
- **Date Filter** - Upcoming events
- **Trending** - Popular categories

### ML Features
- **Success Prediction** - Analyzes title, description, category
- **Description Enhancement** - Identifies weak descriptions
- **Recommendations** - Based on user interests
- **Smart Search** - Understands context and intent

---

## 🚀 Performance

- **Frontend**: Vite for fast builds and HMR
- **Backend**: Gunicorn with multiple workers
- **Database**: PostgreSQL with connection pooling
- **Caching**: Browser caching for static assets
- **CDN**: Azure CDN support
- **Compression**: Gzip compression enabled

---

## 🔒 Security

- **HTTPS Only** - Enforced on Azure
- **Password Hashing** - Bcrypt with salt
- **JWT Tokens** - Secure authentication
- **CORS** - Configured for Azure domains
- **Input Validation** - Server-side validation
- **Content Moderation** - Banned words filter
- **Environment Secrets** - Azure Key Vault integration

---

## 📚 Documentation

- **[README.md](README.md)** - This file (project overview)
- **[AZURE_QUICKSTART.md](AZURE_QUICKSTART.md)** - 15-min Azure deployment
- **[AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)** - Complete Azure guide
- **[HOW_TO_RUN.md](HOW_TO_RUN.md)** - Local development setup
- **[QUICKSTART.md](QUICKSTART.md)** - Quick local setup

---

## 🐛 Troubleshooting

### Backend Issues

```bash
# Check logs on Azure
az webapp log tail --name <app-name> --resource-group <rg-name>

# Restart Azure Web App
az webapp restart --name <app-name> --resource-group <rg-name>

# Test imports locally
python -c "import app; print('✅ OK')"
```

### Database Issues

```bash
# Migrate database schema
python backend/migrate_db.py

# Initialize PostgreSQL tables (Azure)
python backend/db_config_azure.py init

# Migrate data from SQLite to PostgreSQL
python backend/db_config_azure.py migrate
```

### Frontend Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 💡 Azure Deployment Best Practices

1. **Use PostgreSQL** - Don't use SQLite in production on Azure
2. **Set Environment Variables** - Use Azure Key Vault for secrets
3. **Enable HTTPS** - Use Azure's free SSL certificate
4. **Monitor Logs** - Enable Application Insights
5. **Backup Database** - Configure automated backups
6. **Update Dependencies** - Keep packages current
7. **Use CI/CD** - Set up GitHub Actions for auto-deployment

---

## 📊 API Endpoints

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (auth required)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (auth required)
- `DELETE /api/events/:id` - Delete event (auth required)
- `POST /api/events/:id/register` - Register for event

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### ML Features
- `GET /api/ml/search?q=query` - Semantic search
- `POST /api/ml/enhance-description` - Analyze description
- `POST /api/ml/predict-success` - Predict event success
- `GET /api/ml/recommendations` - Get personalized recommendations
- `GET /api/ml/trending` - Get trending categories

### AI Assistant
- `POST /api/assistant/request` - Submit event request (public)
- `GET /api/assistant/requests/recent` - Get recent requests
- `GET /api/assistant/requests` - Get all requests (privileged)

---

## 🎯 Testing

### Test Sample User

After running `add_kiit_sample_events.py`:

```
Email: admin@kiit.ac.in
Password: admin123
```

### Sample Events

The script adds 10 sample KIIT events with real locations.

---

## 💰 Azure Cost Estimation

**Basic Setup (Development):**
- App Service Plan (B1): ~$13/month
- Azure Container Registry (Basic): ~$5/month
- PostgreSQL (Burstable B1ms): ~$12/month
- **Total: ~$30/month**

**Free Tier Option:**
- Azure Static Web Apps: FREE
- Azure Container Apps: FREE (first 180,000 vCPU-seconds)
- **Total: Nearly FREE**

**Note:** Azure offers $200 free credits for new accounts!

---

## 🤝 Contributing

This is an educational project. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

Educational project for KIIT University.

---

## 🙏 Acknowledgments

- KIIT University
- Built for campus event management
- Leverages Azure cloud services

---

## 📞 Support

For deployment issues:
- [Azure Documentation](https://docs.microsoft.com/azure/)
- [Azure Support](https://azure.microsoft.com/support/)
- Check [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)

For application issues:
- Check logs: `az webapp log tail`
- Review [HOW_TO_RUN.md](HOW_TO_RUN.md)

---

## 🎯 Roadmap

- [ ] Email notifications via Azure Communication Services
- [ ] Push notifications
- [ ] QR code check-in
- [ ] Analytics dashboard with Azure Monitor
- [ ] Mobile app (React Native)
- [ ] Calendar sync (Google, Outlook)
- [ ] Azure Cognitive Services integration
- [ ] Redis caching layer

---

## 🚀 Getting Started

1. **Local Development**: See [HOW_TO_RUN.md](HOW_TO_RUN.md)
2. **Quick Deploy**: See [AZURE_QUICKSTART.md](AZURE_QUICKSTART.md)
3. **Production Deploy**: See [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)

---

**Built with ❤️ for KIIT University**

**Deploy to Microsoft Azure:** [AZURE_QUICKSTART.md](AZURE_QUICKSTART.md)
