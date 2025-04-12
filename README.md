# Stockflow – Paper Trading Platform

Stockflow is a next‑generation paper trading platform empowering users to simulate real market conditions with unparalleled realism and security. Built with Ruby on Rails and React, Stockflow delivers a robust, fully mobile‑responsive environment featuring secure API key management, live market data integration, interactive technical charts, comprehensive trading simulations, and educational content designed to help users master investing.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Secure API Key Management](#secure-api-key-management)
  - [Real-Time Market Data and WebSocket Updates](#real-time-market-data-and-websocket-updates)
  - [Interactive Trading, Charting & Technical Analysis](#interactive-trading-charting--technical-analysis)
  - [User Onboarding, Authentication & Session Management](#user-onboarding-authentication--session-management)
  - [Watchlist and Portfolio Management](#watchlist-and-portfolio-management)
  - [Educational Modules and Investment Resources](#educational-modules-and-investment-resources)
  - [Fully Mobile‑Responsive Design](#fully-mobile-responsive-design)
- [System Architecture](#system-architecture)
  - [Frontend (React & Redux)](#frontend-react--redux)
  - [Backend (Ruby on Rails)](#backend-ruby-on-rails)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

Stockflow offers a next‑level simulated trading experience by combining real‑time market data, innovative charting and trading features, and advanced security measures. The platform uses a dual‑tiered architecture with a Ruby on Rails backend and a React‑powered frontend. Secure handling of sensitive API keys, WebSocket‑driven real‑time data, and comprehensive user onboarding ensures an immersive and safe environment for both novice and experienced traders.

---

## Key Features

### Secure API Key Management

Stockflow is built with security as a core principle. API keys required for market data and other integrations are handled securely on the backend—never exposed directly to the frontend.

- **Encrypted Credentials:** API keys are stored securely using Rails’ built-in encrypted credentials.
- **Temporary Token Exchange:** The backend issues temporary one‑time tokens that the frontend uses to securely retrieve API keys via the `/api/keys/exchange` endpoint.
- **Stringent Token Validation:** Every API key request is validated using session data, IP addresses, and user‑agent strings to guarantee that only legitimate requests can obtain API keys.
- **Audit Logging & Rate Limiting:** All API key accesses are logged and safeguarded against brute‑force attempts using rate‑limiting and one‑time token policies.

_Example (Frontend API key fetch):_

```typescript
import { getApiKeys } from './services/apiKeyService';

async function example() {
  try {
    const apiKeys = await getApiKeys();
    // Use apiKeys.polygon_api_key securely without persisting sensitive data locally.
  } catch (error) {
    console.error("Error fetching API keys:", error);
  }
}
```

### Debugging Utilities

#### Namespaced Debug Logging

This application includes a robust debugging utility that allows for detailed, categorized logging with namespace filtering and runtime toggling capabilities. This system helps developers diagnose issues across different parts of the application, particularly in production environments where traditional debugging methods may be limited.

#### Features

- **Namespaced logging:** Filter logs by component, feature, or service
- **Runtime toggling:** Enable or disable debugging without code changes
- **Pattern matching:** Enable logs for entire categories using wildcards
- **Customizable prefixes:** Maintain readable, consistent log formatting
- **Production-safe:** All debug logs can be disabled in production by default
- **No environment variables needed:** Works with any build system, including esbuild

#### Basic Usage

```typescript
import { createDebugger } from '../utils/debug';

// Create a debugger for a specific component or service
const debug = createDebugger({ 
 namespace: 'api:auth',      // Category for filtering
 prefix: '[AuthService] '    // Display prefix in console
});

// Usage throughout code
debug.log('User authenticated successfully');
debug.warn('Login attempt with expired token');
debug.error('Authentication failed', error);
```

#### Advanced Filtering

The debugging system supports granular control over which logs are displayed:

```typescript
// In browser console - enable all debugging
debugUtil.enableAll();

// Enable specific component logs
debugUtil.enable('api:keys');

// Enable multiple related namespaces with pattern matching
debugUtil.enablePatterns('api:*');

// Enable multiple specific namespaces
debugUtil.enablePatterns('components:dashboard,api:auth');

// See what's currently enabled
debugUtil.listEnabled();

// Disable specific namespace
debugUtil.disable('api:keys');

// Disable all debugging
debugUtil.disableAll();
```

#### Namespace Conventions

We use a hierarchical namespace convention to organize logs:

- `api:*` - API and service-related logs
  - `api:auth` - Authentication service
  - `api:keys` - API key management
- `components:*` - React component logs
  - `components:dashboard` - Dashboard component
  - `components:charts` - Chart components
- `store:*` - Redux store logs
  - `store:actions` - Action creators
  - `store:reducers` - Reducers

#### Production Debugging

To diagnose issues in production:

1. Open browser console
2. Enable specific debugging: `debugUtil.enable('api:keys')`
3. Perform the operation to reproduce the issue
4. Disable debugging when done: `debugUtil.disable('api:keys')`

This allows for targeted debugging without flooding the console with unnecessary logs.


### Real-Time Market Data and WebSocket Updates

- **Polygon Integration:** Stockflow integrates with Polygon’s API to deliver live market data and key financial aggregates.
- **WebSocket-Driven Updates:** Utilizing custom hooks and a singleton WebSocket service, the platform continuously updates stock prices, technical indicators, and trading charts with real‑time data.
- **Efficient Data Processing:** Custom utilities and hooks (like \`useStockData\` and \`useWebSocketUpdates\`) ensure efficient data conversion, downsampling, and timely updates to the UI.

### Interactive Trading, Charting & Technical Analysis

- **Dynamic Chart Types:** Switch effortlessly between baseline (line) charts and candlestick charts to evaluate market trends.
- **Technical Indicators:** Leverage built‑in support for indicators such as RSI, MACD, SMA, EMA, and more—each with its own color scheme and dynamic updating mechanism.
- **Comprehensive Chart Controls:** Users can select time ranges (e.g., 1D, 1W, 1M, etc.), toggle technical indicators, and adjust display settings with smooth interactions.
- **Real-Time Trade Simulation:** Execute simulated BUY and SELL orders with realistic updates to user funds, portfolio value, and current stock prices. The transaction panels provide instant feedback and error handling.

### User Onboarding, Authentication & Session Management

- **Robust Authentication:** Stockflow uses secure session management powered by Rails' encrypted session tokens and password hashing using BCrypt.
- **Multi‑Step Signup Flow:** New users complete a comprehensive, multi‑step onboarding process covering everything from personal details to financial information, with real‑time validations and easy navigation.
- **Seamless Session Handling:** The platform ensures consistent user sessions with auto‑refresh and secure logout functionality.
- **Contextual User Data:** A dedicated React User Context makes user data readily accessible while maintaining security.

### Watchlist and Portfolio Management

- **Personalized Watchlists:** Easily add or remove stocks from a customizable watchlist, complete with confirmation prompts for risky removals.
- **Real-Time Portfolio Tracking:** Your portfolio updates instantly based on simulated transactions, dynamically recalculating holdings and available funds.
- **Integrated Alerts and Mini-Charts:** Watchlist items display live mini‑charts and price updates using WebSocket feeds.

### Educational Modules and Investment Resources

- **Interactive Learning Modules:** Stockflow Learn offers curated educational content covering stock market basics to advanced technical analysis, delivered via engaging flyouts and carousels.
- **Practical Tutorials:** Step‑by‑step guides empower users to master investment strategies.
- **Built-In Investment Calculators:** Use integrated tools to compute trade costs, manage risk, and predict returns based on live market data.

### Fully Mobile‑Responsive Design

- **Responsive Layouts:** Designed to work seamlessly across desktop, tablet, and mobile devices, Stockflow’s interface adjusts fluidly to screen size.
- **Touch-Friendly Interactions:** Mobile-friendly components, such as swipe-enabled carousels and tap‑responsive menus, ensure smooth navigation on touch devices.
- **Consistent User Experience:** Modern CSS frameworks and customized media queries guarantee an optimal experience on every platform.

---

## System Architecture

### Frontend (React & Redux)

- **Component-Based Structure:** Every feature—from authentication and dashboards to trading simulations and educational modules—is built as modular, reusable React components.
- **Redux State Management:** Redux is used to ensure predictable state management, providing a single source of truth for the entire application.
- **Custom Hooks & Contexts:** Tailored hooks (e.g., \`useStockData\`, \`useTechnicalIndicators\`, \`useTransactionHandling\`, and \`useWatchlistHandling\`) manage data efficiently, ensuring fast performance.
- **Responsive and Accessible UI:** The interface is designed with responsiveness and accessibility in mind, offering seamless integration across devices.

### Backend (Ruby on Rails)

- **Robust RESTful APIs:** Rails controllers provide endpoints for sessions, users, transactions, assets, and watchlists, following standard RESTful design.
- **Secure Token & API Key Exchange:** Dedicated endpoints manage secure token exchange and API key retrieval, ensuring sensitive keys never reach the client.
- **Redis Integration:** Temporary tokens are stored in Redis with strict expiration to enforce one‑time token usage.
- **MVC Framework:** Rails' classic MVC structure ensures clean, maintainable code with clear separations of concerns.
- **Model Validations & Associations:** Models implement robust validations, secure password hashing, and business logic (e.g., portfolio recalculation) to maintain data integrity.

---

## Installation & Setup

### Prerequisites

- **Backend:** Ruby 2.7+, Rails 6+, PostgreSQL (or preferred database), Redis for temporary token storage.
- **Frontend:** Node.js 14+, npm or yarn.
- **API Credentials:** Secure API credentials for Polygon, FinancialModelPrep, AlphaVantage, etc. (configured via Rails encrypted credentials).

### Steps

1. **Clone the Repository:**

```bash
git clone https://github.com/your-username/stockflow.git
cd stockflow
```

2. **Setup the Backend:**

```bash
cd backend
bundle install
rails db:create && rails db:migrate
rails s
```

Ensure your Rails credentials are set to include all required API keys.

3. **Setup the Frontend:**

```bash
cd ../frontend
npm install  # or yarn install
npm run build:dev    # or yarn start
```

4. **Load Assets & Run:**

The frontend fetches assets securely using the AssetService (via `/api/assets`). Open your browser at \`http://localhost:3000\` (or your configured port).

---

## Usage

- **User Authentication:** Sign up using the multi-step signup flow and log in securely.
- **Trading Simulation:** Access real-time charts on the dashboard, execute simulated BUY/SELL orders, and monitor transaction outcomes.
- **Portfolio Monitoring:** Track your personalized watchlist and portfolio updates as market data is updated in real time.
- **Educational Content:** Explore Stockflow Learn to deepen your understanding of investing through interactive tutorials.
- **Responsive Navigation:** Enjoy a seamless experience on any device, whether desktop or mobile.

---

## Contributing

We welcome contributions to enhance Stockflow’s functionality. To contribute:

1. **Fork the Repository.**
2. **Create a New Branch:**

```bash
git checkout -b feature/your-feature
```

3. **Commit Your Changes:**

```bash
git commit -am "Add feature or fix bug"
```

4. **Push and Submit a Pull Request:**

```bash
git push origin feature/your-feature
```

Please adhere to our coding standards and include tests and documentation for any new features.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Polygon.io:** For providing robust, real-time market data APIs.
- **FinancialModelPrep & AlphaVantage:** For essential financial data integrations.

---

Stockflow merges sophisticated trading simulations, top-tier security measures, and an intuitive, responsive UI to deliver an unmatched paper trading experience. Join the new generation of investors today and master the art of trading—all in a secure and engaging environment.

*Happy Trading!*
