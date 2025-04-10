# README

About:

Stockflow is an online paper trading platform where users can live trade their favorite stocks to build up their portfolio. Users can check historic prices up to 5 years ago and add stocks to their watchlist if they're not sure about when to invest.

Link to Live Site:
[https://stockflow.dev/](https://stockflow.dev/)

Technologies Used:
Stockflow was built using Rails for the backend, Postgresql for the database, and React for the frontend. Intra-day and Historical stock prices were provided by Polygon APO. Search API was provided by Alphavantage. News for business and news for each stock was provided by News API. Tradingview lightweight-charts library was used to create charts for the dashboard and stock show page. 

Features: 
1. Multi-page sign up form
2. Search existing companies
3. Hover over chart to view prices
4. View value for personal portfolio
5. View specific company stock information and news
6. View real-time prices for a stock as well as historical prices
7. Add technical indicators to charts for advanced analysis


# Debugging Utilities

## Namespaced Debug Logging

This application includes a robust debugging utility that allows for detailed, categorized logging with namespace filtering and runtime toggling capabilities. This system helps developers diagnose issues across different parts of the application, particularly in production environments where traditional debugging methods may be limited.

### Features

- **Namespaced logging:** Filter logs by component, feature, or service
- **Runtime toggling:** Enable or disable debugging without code changes
- **Pattern matching:** Enable logs for entire categories using wildcards
- **Customizable prefixes:** Maintain readable, consistent log formatting
- **Production-safe:** All debug logs can be disabled in production by default
- **No environment variables needed:** Works with any build system, including esbuild

### Basic Usage

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

### Advanced Filtering

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

### Namespace Conventions

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

### Production Debugging

To diagnose issues in production:

1. Open browser console
2. Enable specific debugging: `debugUtil.enable('api:keys')`
3. Perform the operation to reproduce the issue
4. Disable debugging when done: `debugUtil.disable('api:keys')`

This allows for targeted debugging without flooding the console with unnecessary logs.