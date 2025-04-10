// File: components/StockShow/types.ts
import { TECHNICAL_INDICATORS } from '../../constants/technical_indicators';

// Re-export Period type from util
export { Period } from '../../util/util';

// Define chart types
export type ChartType = 'baseline' | 'candlestick';

// Define technical indicator keys
export type IndicatorKeys = keyof typeof TECHNICAL_INDICATORS;

// Define stock price data structure
export interface StockPriceData {
  t: number;     // timestamp
  o?: number;    // open price
  h?: number;    // high price
  l?: number;    // low price
  c: number;     // close price
  v?: number;    // volume
}

// Define chart data structures
export interface LineChartPoint {
  time: number;
  value: number;
}

export interface CandlestickChartPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type ChartPoint = LineChartPoint | CandlestickChartPoint;

// Define indicator data structure
export interface IndicatorData {
  timestamp: number;
  value: number;
  [key: string]: any;  // Additional properties specific to each indicator
}

// Define WebSocket message structure
export interface WebSocketMessage {
  sym: string;   // Symbol
  t?: number;    // timestamp
  o?: number;    // open price
  h?: number;    // high price
  l?: number;    // low price
  c?: number;    // close price
  v?: number;    // volume
}

// Define worker message types
export interface WorkerMessage {
  id: string;
  action: 'processChartData' | 'formatIndicatorData' | 'downsampleData';
  data?: any[];
  selectedRange?: string;
  chartType?: ChartType;
  indicator?: IndicatorKeys;
  indicatorData?: any[];
  priceData?: any[];
}

export interface WorkerResponse {
  id: string;
  result?: any[];
  error?: string;
}

// Define company information structures
export interface CompanyProfile {
  symbol: string;
  companyName?: string;
  exchange?: string;
  industry?: string;
  website?: string;
  description?: string;
  ceo?: string;
  securityName?: string;
  issueType?: string;
  sector?: string;
  city?: string;
  country?: string;
  fullTimeEmployees?: number;
  mktCap?: number;
  volAvg?: number;
}

export interface CompanyInfo {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description?: string;
  Exchange?: string;
  Currency?: string;
  Country?: string;
  Sector?: string;
  Industry?: string;
  "52WeekHigh"?: string;
  "52WeekLow"?: string;
  PERatio?: string;
}

export interface KeyStats {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
}

// Define news item structure
export interface NewsItem {
  publisher?: {
    name?: string;
    homepage_url?: string;
    logo_url?: string;
    favicon_url?: string;
  };
  image_url?: string;
  title?: string;
  tickers?: string[];
  published_utc?: string;
  article_url?: string;
}