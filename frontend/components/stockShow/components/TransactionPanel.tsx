import React, { memo } from 'react';
import Odometer from '../../odometer';
import { User } from '../../../interfaces/user.interface';
import { OrderType } from '../../../interfaces';

interface TransactionPanelProps {
  ticker: string;
  latestPrice: number;
  user: User;
  form: { shares: string };
  orderType: OrderType;
  errors: React.ReactNode;
  success: React.ReactNode;
  addedToWatchlist: React.ReactNode;
  inWatchlist: boolean;
  removeWatchlistMessage: React.ReactNode;
  injectedClassName?: string;
  calculateOrderTotal: () => string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBuy: () => void;
  handleSell: () => void;
  handleSubmitOrder: (e: React.FormEvent) => void;
  handleWatchlistAction: (action: 'add' | 'remove') => (e: React.MouseEvent) => void;
}

const TransactionPanel: React.FC<TransactionPanelProps> = memo(({
  ticker,
  latestPrice,
  user,
  form,
  orderType,
  errors,
  success,
  addedToWatchlist,
  inWatchlist,
  removeWatchlistMessage,
  injectedClassName,
  calculateOrderTotal,
  handleChange,
  handleBuy,
  handleSell,
  handleSubmitOrder,
  handleWatchlistAction
}) => {
  const formatOrderType = () => `Place ${orderType[0] + orderType.slice(1).toLowerCase()} Order`;

  console.log({ userFunds: user.funds })

  const renderTotalStocks = () => (
    <div className="buying-power">
      {orderType === "SELL" ? (
        <>
          You have <Odometer 
            price={user.totalStockCount[ticker] || 0} 
            digitInjectedClassName="transaction-number" 
          /> shares to sell
        </>
      ) : (
        <>
          $ <Odometer 
            price={user.funds || 0} 
            digitInjectedClassName="transaction-number" 
          /> Buying Power Available
        </>
      )}
    </div>
  );

  const renderWatchlistButton = () => (
    <input
      type="submit"
      className="watchlist-button"
      onClick={inWatchlist ? handleWatchlistAction("remove") : handleWatchlistAction("add")}
      value={inWatchlist ? "Remove From Watchlist" : "Add to Watchlist"}
    />
  );

  return (
    <div className={`transaction-container ${injectedClassName}`}>
      <div className="transaction-form">
        <div className="transaction-type-header">
          <button 
            className={`transaction-header-${orderType === "BUY"} stockflow-button`} 
            onClick={handleBuy}
          >
            Buy <span>{ticker}</span>
          </button>
          <button 
            className={`transaction-header-${orderType === "SELL"} stockflow-button`} 
            onClick={handleSell}
          >
            Sell <span>{ticker}</span>
          </button>
        </div>
        <hr className="transaction-break" />
        <div>
          <form className="transaction-form-item" onSubmit={handleSubmitOrder}>
            <div className="transaction-form-row">
              <span>Shares</span>
              <input 
                className="transaction-input" 
                type="text" 
                value={form.shares} 
                onChange={handleChange} 
                placeholder="0" 
              />
            </div>
            <div className="transaction-form-row">
              <p>Market Price</p> 
              <span>${latestPrice?.toFixed(2) || 0}</span>
            </div>
            <hr className="transaction-break" />
            <div className="transaction-form-row">
              <p>Estimated Cost</p> 
              <span>${calculateOrderTotal()}</span>
            </div>
            <div>
              {errors} {success} {addedToWatchlist}
            </div>
            <div>
              <button 
                className="transaction-submit" 
                type="submit"
              >
                {formatOrderType()}
              </button>
            </div>
            <hr className="transaction-break" />
            <div>
              {renderTotalStocks()}
            </div>
          </form>
        </div>
        <div className="watchlist-button-container">
          {renderWatchlistButton()}
        </div>
        <div>
          {removeWatchlistMessage}
        </div>
      </div>
    </div>
  );
});

export default TransactionPanel;
