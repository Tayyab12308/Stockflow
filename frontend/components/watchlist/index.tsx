import React from 'react';
import WatchlistItem from './watchlistItem';
import { WatchListResponse } from '../../interfaces/user.interface';

interface WatchlistProps {
  stocks: WatchListResponse[];
}

const Watchlist: React.FC<WatchlistProps> = ({ stocks }) => {
  return (
    <div className="watchlist">
      {stocks.map(stock => (
        <WatchlistItem key={stock.id} symbol={stock.tickerSymbol} />
      ))}
    </div>
  );
};

export default Watchlist;
