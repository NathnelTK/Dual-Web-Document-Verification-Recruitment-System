# 🚀 Dual-Web Document Verification & Recruitment System

> A modern, automated recruitment platform with instant document verification and intelligent candidate screening.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 📋 Overview

This system consists of two beautifully designed web applications that work together to streamline the recruitment process:

- **🎯 Admin Dashboard**: HR teams can post job vacancies, define automated requirements, and view verified candidates
- **💼 User Portal**: Job seekers can browse opportunities, apply instantly, and receive real-time verification feedback

## ✨ Features

### Admin Dashboard
- 🔐 Secure authentication (login/signup)
- 📊 Modern dashboard with analytics
- ✍️ Create and manage job vacancies
- 📝 Define custom requirement rules (GPA, degree, age, etc.)
- 👥 View verified candidates with detailed information
- 📈 Track application statistics

### User Portal
- 🎨 Beautiful, modern UI with smooth animations
- 🔍 Browse available job vacancies
- 📄 Apply with instant verification
- ✅ Real-time acceptance/rejection feedback
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: In-memory store (development) - ready for Firebase/Supabase
- **OCR/AI**: Prepared for OCR.space / Tesseract / OpenAI integration

## 📁 Project Structure

```
.
├── apps/
│   ├── admin/          # Admin Dashboard (React + Tailwind)
│   └── user/           # User Portal (React + Tailwind)
├── packages/
│   └── shared/         # Shared TypeScript types and utilities
├── server/             # Express API backend
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NathnelTK/Dual-Web-Document-Verification-Recruitment-System.git
   cd Dual-Web-Document-Verification-Recruitment-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional for development)
   
   Create a `server/.env` file:
   ```env
   PORT=4000
   OCRSPACE_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   ```

### Running the Application

#### Option 1: Run Everything Together

```bash
# Start backend and both frontend apps
npm run dev
```

#### Option 2: Run Individually

**Terminal 1 - Backend Server:**
```bash
npm run start
# Server runs on http://localhost:4000
```

**Terminal 2 - Admin Dashboard:**
```bash
cd apps/admin
npm run dev
# Admin app runs on http://localhost:5173
```

**Terminal 3 - User Portal:**
```bash
cd apps/user
npm run dev
# User app runs on http://localhost:5174
```

### 🎉 You're Ready!

- **Admin Dashboard**: http://localhost:5173
- **User Portal**: http://localhost:5174
- **API**: http://localhost:4000

## 📖 Usage Guide

### For Administrators

1. **Sign Up/Login**: Create an admin account or login
2. **Create Vacancy**: Click "Create Vacancy" and fill in job details
3. **Add Requirements**: Define automated verification rules (e.g., GPA >= 3.0)
4. **View Dashboard**: Monitor applications and verified candidates

### For Job Seekers

1. **Browse Vacancies**: View all available job openings
2. **Apply**: Click "Apply Now" on any vacancy
3. **Fill Information**: Enter your credentials (degree, GPA, institution, etc.)
4. **Get Instant Feedback**: Receive immediate verification results

## 🔌 API Endpoints

### Vacancies
- `GET /api/v1/vacancies` - Get all vacancies
- `POST /api/v1/vacancies` - Create a new vacancy

### Applications
- `GET /api/v1/applications` - Get all applications
- `POST /api/v1/applications` - Submit an application

### Health Check
- `GET /api/v1/health` - Check API status

## 🎨 Customization

### Styling
Both apps use Tailwind CSS. Customize the design by editing:
- `apps/admin/tailwind.config.js`
- `apps/user/tailwind.config.js`

### Requirements Rules
The system supports various operators:
- **Numeric/Date**: `>=`, `<=`, `>`, `<`, `==`
- **String**: `equals`, `==`

Supported fields:
- `degree` (string)
- `gpa` (number)
- `institution` (string)
- `age` (number)
- `graduation_date` (date)

## 🗺️ Roadmap

- [ ] Integrate real OCR services (OCR.space / Tesseract)
- [ ] Add AI-powered document analysis (OpenAI/HuggingFace)
- [ ] Implement persistent database (Firebase/Supabase)
- [ ] Add email notifications
- [ ] Implement file upload functionality
- [ ] Add user authentication for applicants
- [ ] Create admin user management
- [ ] Add export functionality (CSV/PDF)
- [ ] Implement advanced search and filters
- [ ] Add multi-language support

## 🤝 Contributing

We love contributions! This is an open-source project and we welcome any improvements, bug fixes, or new features.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add some amazing feature"
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Ideas

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🎨 Enhance UI/UX
- ⚡ Optimize performance
- 🧪 Add tests
- 🌍 Add translations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Thank you to all contributors who help make this project better! Your contributions, no matter how small, are greatly appreciated.

Special thanks to:
- The React and Node.js communities
- Tailwind CSS for the amazing styling framework
- All open-source contributors

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/NathnelTK/Dual-Web-Document-Verification-Recruitment-System/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NathnelTK/Dual-Web-Document-Verification-Recruitment-System/discussions)

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a star! It helps others discover the project and motivates us to keep improving it.

---

**Made with ❤️ by the community**

*Happy Recruiting! 🎉*
