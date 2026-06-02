# 🚀 Personal Portfolio — Full Stack

A modern, dark-themed developer portfolio built with **React + Vite** (frontend) and **Express.js + MongoDB** (backend), deployed on **Railway**.

---

## ✨ Features

- **Hero Section** — Role, headline, description, resume link & profile photo
- **Selected Works** — Last 4 projects displayed in a masonry-style grid
- **Testimonials** — Client reviews with star ratings
- **Contact Form** — Saves messages to MongoDB + sends email via Nodemailer
- **Contact Details** — Email, phone, location fetched from backend
- **Fully Responsive** — Mobile & desktop friendly
- **Smooth Animations** — Fade-up, float, and hover transitions

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Email | Nodemailer (Gmail) |
| Deployment | Railway |
| Fonts | Syne, DM Sans (Google Fonts) |

---

## 📁 Project Structure

```
portfolio/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── Contact.jsx
│   │   └── main.jsx
│   ├── .env
│   └── vite.config.js
│
└── backend/
    ├── controllers/
    │   └── contactController.js
    ├── models/
    │   └── contact.js
    ├── routes/
    │   └── api.js
    ├── .env
    └── server.js
```

---

## ⚙️ Environment Variables

### Frontend — `.env`
```env
VITE_URL_API=https://your-backend.railway.app/
```

### Backend — `.env`
```env
MONGODB_URI=mongodb+srv://...
EMAIL_USER=your@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx   # Gmail App Password
PORT=5000
```

> ⚠️ **Note:** For Gmail, you must use an **App Password**, not your normal Gmail password.
> Enable it at: Google Account → Security → 2-Step Verification → App Passwords

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Hamza-Maliikk/Express_JS_Practicing_Project.git
cd portfolio
```

### 2. Setup Backend
```bash
cd backend
npm install
# Create .env file and add your variables
npm run dev 
```

### 3. Setup Frontend
```bash
cd frontend
npm install
# Create .env file and add VITE_URL_API
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/homepage` | Fetch hero, projects, testimonials, resume |
| GET | `/api/contact` | Get all contact messages |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/details` | Get contact details (email, phone, location) |

---

## 📦 Deployment (Railway)

1. Push code to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Add environment variables in Railway → **Variables** tab
4. Deploy — Railway auto-detects Node.js

---

## 📸 Screenshots

> Add your screenshots here

---

## 📄 License

MIT — feel free to use and modify.

---
