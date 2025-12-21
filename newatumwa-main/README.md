# 🚀 Atumwa - Smart Delivery Platform

A modern, full-featured delivery and errand management platform built for Zimbabwe. Atumwa connects clients with trusted messengers for quick, reliable deliveries across Harare and beyond.

![Atumwa Platform](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Atumwa+Platform)

## ✨ Features

### For Clients
- 📦 **Post Gigs** - Create delivery requests with detailed requirements
- 🗺️ **Live Tracking** - Track your messenger in real-time on the map
- 💬 **Direct Messaging** - Communicate directly with your messenger
- 💳 **Secure Payments** - Transparent pricing and secure transactions
- ⭐ **Rating System** - Rate and review messengers

### For Messengers (Atumwas)
- 🎯 **Find Gigs** - Browse available delivery jobs nearby
- 📍 **Route Optimization** - Get optimal routes for deliveries
- 💰 **Earnings Dashboard** - Track your income and performance
- 🔔 **Real-time Notifications** - Never miss a delivery opportunity
- 📊 **Analytics** - View your stats and improve performance

### For Admins
- 👥 **User Management** - Manage clients and messengers
- 📈 **Platform Analytics** - Monitor platform performance
- 🚨 **Incident Reports** - Handle issues and disputes
- 💵 **Payment Processing** - Manage transactions and payouts

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS 3 + Custom Design System
- **Routing**: React Router v7
- **State Management**: React Context API
- **Maps**: Leaflet + React-Leaflet
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/atumwa.git
   cd atumwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
atumwa/
├── components/          # Reusable UI components
│   ├── Navigation.tsx
│   ├── GigCard.tsx
│   └── ...
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Gigs.tsx
│   ├── MapPage.tsx
│   └── ...
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   ├── DataContext.tsx
│   └── ToastContext.tsx
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
├── config/             # Configuration files
│   └── env.ts
├── types.ts            # TypeScript type definitions
├── constants.ts        # Mock data and constants
└── App.tsx             # Main application component
```

## 🎨 Design System

Atumwa features a premium design system with:

- **Custom Color Palette**: Brand colors optimized for accessibility
- **Typography**: Inter for body text, Outfit for headings
- **Glassmorphism**: Modern frosted glass effects
- **Micro-interactions**: Smooth animations powered by Framer Motion
- **Dark Mode**: Full dark mode support (coming soon)
- **Responsive Design**: Mobile-first, works on all devices

## 🔐 Authentication

The platform supports three user roles:

1. **Client** - Post gigs and track deliveries
2. **Atumwa (Messenger)** - Accept and complete deliveries
3. **Admin** - Manage the platform

*Note: Currently using mock authentication. Production version will integrate with a secure backend.*

## 🗺️ Map Features

- Real-time location tracking
- Route visualization
- Distance calculation
- Multiple stop support
- Marker clustering for performance

## 📱 Progressive Web App

Atumwa is a PWA that can be installed on mobile devices for a native app-like experience.

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by the Atumwa team

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Maps by [Leaflet](https://leafletjs.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

## 📧 Contact

For questions or support, reach out to: support@atumwa.co.zw

---

**Made in Zimbabwe 🇿🇼**
