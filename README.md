# 🌍 Disaster Management System

A modern disaster management platform designed to help users report disaster incidents, track reports, and support faster response and decision-making.

This project was developed as a hackathon project using a modern full-stack architecture.

---

## ✨ Features

### 🚨 Disaster Reporting

Users can submit disaster reports with:

- Disaster type
- Location details
- Interactive map location selection
- Latitude and longitude
- Severity level
- Description
- Number of affected people
- Contact information

### 🗺️ Interactive Map

The reporting system includes an interactive map that allows users to select the exact location of a disaster.

### 📋 Disaster Report Management

Users can:

- View submitted disaster reports
- View disaster details
- Check report severity
- Check report status
- Update disaster report status
- Refresh the latest reports

### 📊 Disaster Status Tracking

Reports can be managed using:

- Pending
- Verified
- Resolved

### 🤖 AI Integration

The system is designed to support AI-powered disaster analysis using the Gemini API.

---

# 🛠️ Tech Stack

## Frontend

- React
- JavaScript
- Vite
- Tailwind CSS
- Axios
- React Leaflet
- Leaflet

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic

## Database

- PostgreSQL / Supabase

## AI

- Google Gemini API

## API

- REST API

## Deployment

- Frontend → Vercel
- Backend → Render

## Version Control

- Git
- GitHub

---

# 📁 Project Structure

```text
mini-hackathon/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── reporting/
│   │   │       ├── DisasterReportForm.jsx
│   │   │       ├── LocationMap.jsx
│   │   │       └── ReportList.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── ReportingPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── utils/
│   │   │   └── validation.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   ├── connection.py
│   │   │   └── crud.py
│   │   │
│   │   ├── models/
│   │   │   └── disaster_report.py
│   │   │
│   │   ├── routes/
│   │   │   ├── reports.py
│   │   │   ├── ai.py
│   │   │   ├── dashboard.py
│   │   │   └── prediction.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── report.py
│   │   │   └── prediction.py
│   │   │
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   └── risk_service.py
│   │   │
│   │   └── main.py
│   │
│   └── requirements.txt
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js
- Python
- Git

---

# 💻 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

# 🐍 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend API will run at:

```text
http://127.0.0.1:8000
```

---

# 📚 API Documentation

FastAPI automatically provides interactive API documentation.

## Swagger UI

```text
http://127.0.0.1:8000/docs
```

## ReDoc

```text
http://127.0.0.1:8000/redoc
```

---

# 🔌 Disaster Reporting API

Example endpoints:

```text
POST   /api/disaster-report
GET    /api/disaster-report
GET    /api/disaster-report/{report_id}
PUT    /api/disaster-report/{report_id}/status
```

---

# 🗺️ Disaster Reporting Workflow

```text
User
  │
  ▼
Disaster Report Form
  │
  ▼
Select Location on Map
  │
  ▼
Frontend Validation
  │
  ▼
Axios REST API Request
  │
  ▼
FastAPI Backend
  │
  ▼
Database
  │
  ▼
Report Management
```

---

# 🔐 Environment Variables

Create a `.env` file where required.

Example:

```env
DATABASE_URL=your_database_connection_url
GEMINI_API_KEY=your_gemini_api_key
```

> Never commit your `.env` file or API keys to GitHub.

---

# 📦 Main Frontend Dependencies

```text
react
vite
axios
tailwindcss
@tailwindcss/vite
react-leaflet
leaflet
```

---

# 📦 Main Backend Dependencies

```text
fastapi
uvicorn
sqlalchemy
pydantic
psycopg2-binary
python-dotenv
google-generativeai
```

---

# 🌐 Deployment

## Frontend

Deploy the React + Vite application using **Vercel**.

## Backend

Deploy the FastAPI backend using **Render**.

## Database

Use **PostgreSQL or Supabase**.

---

# 👥 Team Collaboration

Each team member should work on a separate feature branch to reduce merge conflicts.

Create a branch:

```bash
git checkout -b feature/your-feature-name
```

Add changes:

```bash
git add .
```

Create a commit:

```bash
git commit -m "feat: add feature description"
```

Push the branch:

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

# 📝 Commit Convention

Use clear and modular commit messages.

Examples:

```text
feat: add disaster reporting form
feat: add interactive disaster location map
feat: add disaster report list
feat: add report status update
style: add tailwind styling
fix: validate disaster report coordinates
docs: update project readme
```

---

# 🎯 Future Improvements

- Real-time disaster alerts
- AI-powered disaster classification
- Disaster risk prediction
- Image upload support
- Emergency response recommendations
- Advanced analytics dashboard
- Real-time notifications
- User authentication
- Mobile optimization

---

# 🤝 Contributing

1. Create a feature branch.
2. Make focused changes.
3. Test your feature locally.
4. Create meaningful commits.
5. Push the branch to GitHub.
6. Open a Pull Request.

---

# 📄 License

This project was created for educational and hackathon purposes.

---

# 🌍 Building Technology for Faster Disaster Response

**Report. Analyze. Respond. Recover.**