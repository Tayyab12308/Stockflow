import React, { useState, useCallback } from 'react';
import { addToWatchlist, deleteFromWatchlist } from '../../../actions/session_actions';
import { WatchlistParams } from '../../../interfaces';
import { User, WatchListResponse } from '../../../interfaces/user.interface';

export const useWatchlistHandling = (user: User, ticker: string, dispatch: any) => {
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [removeWatchlistClicked, setRemoveWatchlistClicked] = useState(0);
  const [removeWatchlistMessage, setRemoveWatchlistMessage] = useState<React.JSX.Element | null>(null);

  // Check if ticker is in user's watchlist
  const checkInWatchlist = useCallback(() => {
    const watchlistSymbols = user.watchlist.map((el: WatchListResponse) => el.tickerSymbol);
    setInWatchlist(watchlistSymbols.includes(ticker));
  }, [user, ticker]);

  // Handle watchlist action (add/remove)
  const handleWatchlistAction = (action: 'add' | 'remove') => async (e: React.MouseEvent) => {
    e.stopPropagation();
    let watchlistParams: WatchlistParams = { tickerSymbol: ticker };
    
    if (action === "add") {
      try {
        await dispatch(addToWatchlist(watchlistParams));
        setInWatchlist(true);
        setRemoveWatchlistMessage(null);
        setRemoveWatchlistClicked(0);
      } catch (error) {
        console.error("Failed to add to watchlist:", error);
      }
    } else {
      removeFromWatchlist();
    }
  };

  // Remove from watchlist with confirmation for owned stocks
  const removeFromWatchlist = async () => {
    const watchlistParams: WatchlistParams = { tickerSymbol: ticker };
    const currentlyInvested = user.totalStockCount;

    // Ask for confirmation if user owns this stock
    if (currentlyInvested[ticker] > 0 && removeWatchlistClicked < 1) {
      setRemoveWatchlistClicked(removeWatchlistClicked + 1);
      setRemoveWatchlistMessage(
        <div className="login-errors">
          It is not recommended to remove a stock you are currently invested in from your watchlist.
          If you would still like to remove {ticker} from your watchlist please push the button one more time
        </div>
      );
    } else {
      try {
        await dispatch(deleteFromWatchlist(watchlistParams));
        setInWatchlist(false);
        setRemoveWatchlistClicked(0);
        setRemoveWatchlistMessage(null);
      } catch (error) {
        console.error("Failed to remove from watchlist:", error);
      }
    }
  };

  // Handle first buy - automatically add to watchlist
  const handleFirstBuy = () => {
    setInWatchlist(true);
    return (
      <div className="login-errors">
        This stock has automatically been added to your watchlist so you can easily track changes in price
      </div>
    );
  };

  return {
    inWatchlist,
    removeWatchlistMessage,
    checkInWatchlist,
    handleWatchlistAction,
    handleFirstBuy
  };
};