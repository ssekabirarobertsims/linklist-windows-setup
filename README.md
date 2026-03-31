# Linklist - Desktop Link Management Application

> A powerful, cross-platform desktop application for organizing, managing, and sharing your links with ease.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Building](#building)
- [Features in Detail](#features-in-detail)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## About

**Linklist** is a modern desktop application designed to simplify link management. Whether you're a developer, researcher, content creator, or knowledge worker, Linklist helps you organize, categorize, and access your links efficiently across Windows, macOS, and Linux.

Built with **Electron**, **React**, **TypeScript**, and **Node.js**, Linklist combines the power of desktop applications with the familiarity of web technologies to provide a seamless user experience.

### Developer

**Author:** ssekabira robert sims

---

## ✨ Features

### Core Features

- **🔗 Link Management**
  - Add, edit, and delete links with ease
  - Organize links into collections and folders
  - Tag and categorize links for better organization
  - Search and filter links by title, URL, or tags

- **📁 Collections & Folders**
  - Group related links into named collections
  - Create nested folder structures
  - Manage multiple collections simultaneously
  - Quick access to frequently used collections

- **💾 Data Export & Import**
  - Export links to multiple formats (JSON, HTML, TXT)
  - Batch export entire collections
  - Import links from external sources
  - Preserve link metadata during export/import

- **📊 Dashboard & Analytics**
  - Visual overview of your link library
  - Statistics on saved links and collections
  - Activity logs and timestamps
  - Charts and graphs for link usage patterns

- **🔄 Synchronization**
  - Automatic backup of link data
  - User data persistence across sessions
  - Secure local storage of all information
  - Recovery from application backups

- **🌐 Sharing**
  - Share links directly with copy-to-clipboard functionality
  - Open external links in your default browser
  - Share collections via multiple platforms
  - Generate shareable link collections

- **📈 Advanced Features**
  - Recent links quick access
  - Link preview capabilities
  - Timestamp tracking (creation date, last modified)
  - Unique ID generation for each link
  - UUID-based collection identification

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI component library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **React Icons** - Icon library
- **Recharts** - Data visualization
- **React Share** - Social sharing integration
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **date-fns** - Date utilities

### Desktop
- **Electron** - Cross-platform desktop framework
- **Electron Builder** - Application packaging and distribution
- **IPC (Inter-Process Communication)** - Main/Renderer process communication

### Core Dependencies
- **uuid** - Unique identifier generation
- **electron-log** - Logging for Electron apps
- **check-disk-space** - Disk space monitoring
- **os-utils** - Operating system utilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** (implied) - Code formatting
- **Nodemon** - Auto-restart on changes
- **Concurrently** - Run multiple processes
- **Babel** - JavaScript compilation

---

## 📁 Project Structure

```
linklist.desktop-app/
├── app/                          # Electron main process
│   ├── main/
│   │   └── application.main.process.ts    # Electron entry point
│   ├── auth/                     # User authentication
│   ├── backups/                  # Backup functionality
│   ├── context/                  # Context bridge for IPC
│   ├── dialogs/                  # Dialog handlers
│   ├── exports/                  # Export utilities
│   ├── functions/                # Helper functions
│   ├── json/                     # Configuration files
│   ├── messages/                 # Message handlers
│   ├── modules/                  # Link CRUD operations
│   ├── public/                   # Static assets (icons, images)
│   └── windows/                  # Window definitions
│
├── backend/                      # Express backend server
│   ├── controller/               # Route controllers & middleware
│   ├── model/                    # Data models & configurations
│   └── view/                     # API endpoints & static files
│
├── desktop/                      # React frontend (Vite)
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components
│   │   ├── windows/              # Full-page windows
│   │   ├── context/              # Redux store & slices
│   │   ├── functions/            # Utility functions
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # TypeScript types
│   │   ├── stylesheets/          # CSS files
│   │   ├── Application.tsx       # Root component
│   │   └── main.tsx              # Entry point
│   └── public/                   # Static assets
│
├── package.json                  # Root dependencies
└── README.md                     # This file
```

---

## 💻 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **Git**

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linklist.desktop-app
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install app dependencies**
   ```bash
   cd app && npm install
   ```

4. **Install desktop dependencies**
   ```bash
   cd ../desktop && npm install
   ```

5. **Install backend dependencies**
   ```bash
   cd ../backend && npm install
   ```

---

## 🚀 Usage

### Development Mode

Run the application in development with hot-reload:

```bash
# From root directory
npm run dev:app
```

This command:
- Starts the Vite dev server for the desktop UI
- Watches for TypeScript changes in the main process
- Auto-restarts Electron when main process changes

### Run Individual Components

```bash
# Just the desktop UI
npm run dev:desktop

# Just the Electron app
npm run dev:mon

# Just the backend server
npm run dev:backend
```

---

## 🏗 Building

### Build for Windows (x64)
```bash
npm run build:win
```

### Build for Linux (x64)
```bash
npm run build:linux
```

### Build for macOS (ARM64)
```bash
npm run build:mac
```

### Compile TypeScript
```bash
npm run compile:app
```

### Watch TypeScript Changes
```bash
npm run watch
```

---

## 📚 Features in Detail

### Link Management

**Creating Links**
- Click "Add Link" or use the keyboard shortcut
- Enter link title, URL, and optional tags
- Assign to collections or folders
- Links are automatically timestamped

**Editing Links**
- Click the edit icon on any link
- Modify title, URL, tags, or collection
- Changes are saved instantly

**Deleting Links**
- Select links for deletion
- Confirm deletion (moved to trash initially)
- Permanently delete from trash

### Collections & Organization

- Create unlimited collections
- Nested folder structure support
- Drag-and-drop link organization
- Bulk move/copy operations
- Collection templates for quick setup

### Export & Import

**Export Formats:**
- **JSON** - Full link metadata with structure
- **HTML** - Formatted table for web viewing
- **TXT** - Simple text list for universal compatibility

**Backup System:**
- Automatic backups on each session
- Manual backup triggers
- Timestamped backup files
- One-click restore functionality

### Dashboard

- Total links count
- Collections overview
- Recent activity log
- Link creation trends
- Storage usage information

### Advanced Search

- Full-text search across all links
- Filter by collection, tag, or date range
- Sort by name, date created, or date modified
- Save frequent searches as quick filters

---

## 🗺 Roadmap

### v1.1.0 (Planned)
- [ ] Browser extension for quick link saving
- [ ] Cloud sync with backup
- [ ] Collaboration features (share collections with team)
- [ ] Custom themes and UI customization
- [ ] Advanced analytics dashboard

### v1.2.0 (Planned)
- [ ] Link preview thumbnails
- [ ] AI-powered tag suggestions
- [ ] Smart collections based on patterns
- [ ] Full-text search with regex support
- [ ] Mobile app (React Native)

### v2.0.0 (Future)
- [ ] Multi-user accounts
- [ ] Team workspace management
- [ ] Advanced permission controls
- [ ] API for third-party integrations
- [ ] Plugin system for extensibility

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Write TypeScript with strict mode enabled
- Follow the existing code style
- Add comments for complex logic
- Test your changes before submitting
- Update documentation as needed

---

## 📝 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 🔗 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev)

---

## 📞 Support

For issues, feature requests, or questions:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/linklist/issues)
- **Email**: [Contact the developer]()

---

## 🎯 Key Application Flows

### Main Application Flow
1. Application starts → Splash screen displayed
2. Main window loads React UI from Vite dev server
3. User authentication (if required)
4. Dashboard loads with saved links
5. User can manage links through UI

### Link Creation Flow
1. User clicks "Add Link"
2. Form dialog opens
3. User enters link details
4. Link is saved to `saved_links.json`
5. Collection metadata updated
6. UI refreshes automatically

### Export Flow
1. User selects links to export
2. Chooses export format (JSON/HTML/TXT)
3. System creates formatted file
4. File saved to user's Desktop/Documents
5. Collection entry added to `collections.json`
6. User receives success notification

---

## 🐛 Known Issues

- None reported yet. Please report any issues you find!

---

**Last Updated:** December 2025  
**Version:** 1.0.0

