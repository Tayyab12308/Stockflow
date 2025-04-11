import React from 'react';
import WatchlistItem from './watchlistItem';
import { WatchListResponse } from '../../interfaces/user.interface';
import Carousel from '../carousel';

interface WatchlistProps {
  stocks: WatchListResponse[];
}

const Watchlist: React.FC<WatchlistProps> = ({ stocks }) => {
  const watchlistItems = stocks.map(stock => (
    <WatchlistItem key={stock.id} symbol={stock.tickerSymbol} />
  ));

  return (
    <>
      <div className="watchlist-list">
        {watchlistItems}
      </div>
      <div className='watchlist-carousel'>
        <div>
          Watchlist
        </div>
        <Carousel slides={watchlistItems} />
      </div>
    </>
  );
};

export default Watchlist;
