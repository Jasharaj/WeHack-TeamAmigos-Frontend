# CasePilot - Modern Legal Tech Platform

CasePilot is a modern solution to delays in the justice system, providing a user-friendly LegalTech platform that helps users track cases, get AI assistance, and resolve disputes online.

![CasePilot Platform](public/legal-hero.svg)

## 🚀 Features

- **AI-Powered Legal Assistant** - Get instant answers to legal queries and document analysis with our advanced AI
- **Case Tracking & Updates** - Stay updated with real-time case status and important hearing dates
- **Document Management** - Securely store, organize, and share legal documents in one place
- **Online Dispute Resolution** - Resolve disputes efficiently through our online mediation platform
- **Automated Reminders** - Never miss a hearing or deadline with smart notifications
- **Available on Web & Mobile** - Access your legal matters anytime, anywhere on any device

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI**: React 19, TailwindCSS
- **State Management**: React Hooks
- **API Integration**: Fetch API
- **Styling**: TailwindCSS, Custom CSS

## 🏗️ Project Structure

```
frontend-weHack/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── lawyer-dashboard/  # Lawyer dashboard pages
│   │   ├── user-dashboard/    # User dashboard pages
│   │   ├── login/            # Authentication pages
│   │   ├── register/         # Registration pages
│   │   └── ...
│   ├── components/      # Reusable UI components
│   └── config.js        # Application configuration
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
└── tailwind.config.js   # TailwindCSS configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/frontend-weHack.git
   cd frontend-weHack
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the backend API:
   - Open `src/config.js` and update the `BASE_URL` to point to your backend API
   - Default is set to `http://localhost:5000`

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## 🔄 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🌐 Deployment

The application can be deployed to various platforms:

- **Vercel** (Recommended for Next.js apps)
- **Netlify**
- **AWS Amplify**
- **Docker** with a Node.js container

## 👥 User Roles

The application supports two main user roles:

1. **Citizens/Users** - Regular users who can:
   - Create and track their legal cases
   - Access AI-powered legal assistance
   - Manage legal documents
   - Initiate dispute resolution
   - Set reminders for important dates

2. **Lawyers** - Legal professionals who can:
   - View and manage assigned cases
   - Communicate with clients
   - Access case documents
   - Provide legal advice
   - Track case progress

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and included in API requests.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).