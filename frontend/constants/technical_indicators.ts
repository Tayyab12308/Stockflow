/**
 * Define technical indicator types and their configurations
 */
export const TECHNICAL_INDICATORS = {
  RSI: {
    name: 'RSI',
    endpoint: 'rsi',
    color: '#E91E63',
    params: { window: 14 }
  },
  MACD: {
    name: 'MACD',
    endpoint: 'macd',
    color: '#2196F3',
    params: { short_window: 12, long_window: 26, signal_window: 9 }
  },
  SMA: {
    name: 'SMA 20',
    endpoint: 'sma',
    color: '#4CAF50',
    params: { window: 20 }
  },
  EMA: {
    name: 'EMA 50',
    endpoint: 'ema',
    color: '#FF9800',
    params: { window: 50 }
  }
};

export type IndicatorKeys = keyof typeof TECHNICAL_INDICATORS;
