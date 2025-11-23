#  FoundrVerse

> India's First Practical Startup School for Students

A comprehensive Next.js platform that offers practical startup education through courses, internships, and pitch opportunities. Built with modern web technologies for a seamless learning experience.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=flat-square&logo=firebase)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-3395FF?style=flat-square)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Authentication](#-authentication)
- [Payments](#-payments)
- [Admin Dashboard](#-admin-dashboard)
- [Scripts](#-scripts)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎓 Student Features
- **Course Progress Tracking** - Monitor your learning journey with detailed progress metrics
- **Certificate Generation** - Get certified upon course completion
- **Payment Integration** - Seamless payment processing with Razorpay
- **Session Management** - Track and manage your learning sessions
- **Personal Dashboard** - Access all your learning resources in one place

### 👨‍💼 Admin Features
- **Student Management** - View and manage all enrolled students
- **Payment Management** - Track payments, generate reports, and export data
- **Revenue Analytics** - Comprehensive revenue tracking with charts and statistics
- **Internship Management** - Manage internship programs and opportunities
- **Pitch Management** - Track and manage student pitches
- **Cohort Management** - Organize students into cohorts
- **Real-time Updates** - Live data synchronization across the admin dashboard

### 🎨 User Experience
- **Modern UI/UX** - Beautiful, responsive design with smooth animations
- **Dark/Light Mode** - Theme support for comfortable viewing
- **Animated Components** - Engaging interactions using Framer Motion and GSAP
- **Mobile Responsive** - Optimized for all device sizes
- **Landing Page** - Compelling marketing pages with pricing, FAQ, and course breakdown

---

## 🛠 Tech Stack

### Core
- **Framework**: [Next.js 16.0.3](https://nextjs.org/) with App Router
- **Runtime**: [React 19.2.0](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### Authentication & Database
- **Firebase Authentication** - Email/Password & Google Sign-In
- **Firebase Admin SDK** - Server-side authentication and user management

### Payments
- **Razorpay** - Payment gateway integration with webhooks

### UI & Animations
- **Framer Motion** - Smooth animations and transitions
- **GSAP** - Advanced animation library
- **Recharts** - Data visualization and charts
- **Heroicons & Lucide** - Icon libraries
- **Radix UI** - Accessible component primitives

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Utilities
- **next-themes** - Theme management (dark/light mode)
- **Vercel Analytics** - Performance monitoring

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Firebase Project** - Set up Firebase Authentication
- **Razorpay Account** - For payment processing (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YuvisTechPoint/FoundrVerse.git
   cd FoundrVerse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Firebase Admin (Service Account)
   # Copy contents of service-account.json or use path
   FIREBASE_SERVICE_ACCOUNT_KEY=path/to/service-account.json
   
   # Razorpay Configuration (Optional)
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key
   RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**

   **Windows (PowerShell):**
   ```powershell
   .\start-dev.ps1
   ```
   
   **Or manually:**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start Scripts

- **Windows**: Use `start-dev.ps1` for automated setup
- **Linux/Mac**: Use `start-dev.sh` for automated setup

---

## 📁 Project Structure

```
FoundrVerse/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── payments/     # Payment processing
│   │   │   ├── admin/        # Admin API endpoints
│   │   │   └── certificate/  # Certificate generation
│   │   ├── dashboard/        # Student dashboard
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   ├── payment/          # Payment page
│   │   └── marketing/        # Landing pages
│   ├── components/
│   │   ├── admin/            # Admin dashboard components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Student dashboard components
│   │   ├── landing/          # Landing page components
│   │   ├── payments/         # Payment components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                   # Utility functions
│   │   ├── firebase.ts       # Firebase client config
│   │   ├── firebaseAdmin.ts  # Firebase admin config
│   │   ├── razorpay.ts       # Razorpay utilities
│   │   └── utils.ts          # General utilities
│   └── data/                  # Mock data (for development)
├── docs/                      # Documentation
├── public/                    # Static assets
├── tests/                     # Test files
└── service-account.json       # Firebase service account (gitignored)
```

---

## 🔐 Authentication

FoundrVerse uses Firebase Authentication with support for:

- **Email/Password Authentication**
- **Google Sign-In**
- **Session Management**
- **Protected Routes**

### Firebase Setup

1. Enable authentication providers in [Firebase Console](https://console.firebase.google.com)
2. Configure authorized domains
3. Add your service account credentials

📖 **Detailed Setup**: See [`docs/FIREBASE_AUTH.md`](docs/FIREBASE_AUTH.md) and [`FIREBASE_SETUP_CHECKLIST.md`](FIREBASE_SETUP_CHECKLIST.md)

---

## 💳 Payments

Integrated with Razorpay for secure payment processing:

- **Order Creation** - Server-side order generation
- **Payment Verification** - Signature verification
- **Webhook Support** - Real-time payment updates
- **Refund Management** - Handle refunds through admin panel
- **Payment Export** - CSV export functionality

📖 **Quick Start**: See [`RAZORPAY_QUICKSTART.md`](RAZORPAY_QUICKSTART.md)

📖 **Full Documentation**: See [`docs/RAZORPAY.md`](docs/RAZORPAY.md)

### Testing Payments

1. Visit `/test-payment` in development
2. Use Razorpay test cards:
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`

---

## 👨‍💼 Admin Dashboard

Access comprehensive admin features at `/admin/dashboard`:

- **Overview** - Key metrics and statistics
- **Students** - Manage student profiles and progress
- **Payments** - Track transactions and generate reports
- **Revenue** - Revenue analytics with charts
- **Internships** - Manage internship programs
- **Pitches** - Track student pitches
- **Cohorts** - Organize students by cohorts
- **Settings** - Platform configuration

### Admin Authentication

- Separate admin login at `/admin/login`
- Role-based access control
- Secure session management

---

## 📜 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint

# Utilities
npm run clean        # Clean build cache
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

FoundrVerse is optimized for Vercel deployment. Follow the complete guide:

📖 **[Complete Vercel Deployment Guide](VERCEL_DEPLOYMENT.md)**

**Quick Steps:**
1. Push your code to GitHub (already done ✅)
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Configure environment variables (see guide)
4. Deploy!

**Required Environment Variables:**
- Firebase configuration (all `NEXT_PUBLIC_FIREBASE_*` vars)
- Firebase Admin service account (`FIREBASE_SERVICE_ACCOUNT_KEY`)
- Razorpay keys (if using payments)
- `NEXT_PUBLIC_APP_URL` (your Vercel URL)

**⚠️ Important for Vercel:**
- Use inline JSON string for `FIREBASE_SERVICE_ACCOUNT_KEY` (not file path)
- Update Firebase Authorized Domains with your Vercel domain
- Configure Razorpay webhook URL to point to your Vercel deployment

---

## 📚 Documentation

Comprehensive documentation available:

- [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md) - **Complete Vercel deployment guide**
- [`QUICK_START.md`](QUICK_START.md) - Quick setup guide
- [`FIREBASE_SETUP_CHECKLIST.md`](FIREBASE_SETUP_CHECKLIST.md) - Firebase configuration
- [`RAZORPAY_QUICKSTART.md`](RAZORPAY_QUICKSTART.md) - Payment integration
- [`docs/FIREBASE_AUTH.md`](docs/FIREBASE_AUTH.md) - Firebase authentication details
- [`docs/EMAIL_PASSWORD_AUTH.md`](docs/EMAIL_PASSWORD_AUTH.md) - Email/Password auth
- [`docs/RAZORPAY.md`](docs/RAZORPAY.md) - Complete Razorpay guide

---

## 🔧 Environment Variables

See [Environment Variables](#-environment-variables) section above or check `.env.example` for all required variables.

⚠️ **Important**: Never commit `.env.local` or `service-account.json` to version control.

---

## 🧪 Testing

Test files are located in the `tests/` directory:

```bash
# Run authentication tests
tests/auth/verify.test.ts

# Run payment tests
tests/payments/verify.test.ts
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Firebase Authentication Errors
- Ensure Google Sign-In is enabled in Firebase Console
- Check authorized domains in Firebase settings
- Verify service account credentials

### Payment Issues
- Verify Razorpay keys in `.env.local`
- Check webhook configuration for production
- Use test mode keys during development

📖 See individual documentation files for detailed troubleshooting guides.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication powered by [Firebase](https://firebase.google.com/)
- Payments processed by [Razorpay](https://razorpay.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)

---

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Made with ❤️ by the FoundrVerse Team**

---

## 🌟 Key Highlights

- ⚡ **Fast** - Built with Next.js 16 and React 19 for optimal performance
- 🔒 **Secure** - Firebase Authentication with secure session management
- 💳 **Integrated** - Razorpay payment processing out of the box
- 📊 **Analytics** - Comprehensive admin dashboard with real-time data
- 🎨 **Beautiful** - Modern UI with smooth animations and dark mode
- 📱 **Responsive** - Works seamlessly on all devices
- 🚀 **Production Ready** - Fully configured for deployment

---

<div align="center">

**Start building your startup journey today! 🚀**

[Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>
