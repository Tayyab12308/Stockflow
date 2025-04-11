export interface NewsProps {
  publisher: string;
  time: string;
  title: string;
  url: string;
  tickers: string[];
  shouldDisplayTicker: boolean;
  imageUrl: string;
  injectedClassName?: string;
}