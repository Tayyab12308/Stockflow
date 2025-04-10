import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTransaction } from '../../../actions/session_actions';
import { OrderType, TransactionParams } from '../../../interfaces';
import { User } from '../../../interfaces/user.interface';
import assetService from '../../../services/assetService';
import { AppDispatch } from '../../../store';

export const useTransactionHandling = (user: User, ticker: string, priceData: any[]) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({ shares: "" });
  const [orderType, setOrderType] = useState<OrderType>("BUY");
  const [errors, setErrors] = useState<React.JSX.Element | null>(null);
  const [success, setSuccess] = useState<React.JSX.Element | null>(null);
  const [addedToWatchlist, setAddedToWatchlist] = useState<React.JSX.Element | null>(null);

  // Calculate total cost based on shares and current price
  const calculateOrderTotal = () => {
    if (!form.shares || form.shares.length === 0 || !priceData || priceData.length === 0) {
      return "0.00";
    }
    
    const latestPrice = priceData[priceData.length - 1]?.c || 0;
    return (parseInt(form.shares) * latestPrice).toFixed(2);
  };

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regNum = /^[0-9]*$/;
    if (regNum.test(e.target.value)) {
      setForm({ shares: e.target.value });
    }
  };

  // Set order type to buy
  const handleBuy = () => {
    clearErrors();
    clearSuccess();
    setForm({ shares: "" });
    setOrderType("BUY");
  };

  // Set order type to sell
  const handleSell = () => {
    clearErrors();
    clearSuccess();
    setForm({ shares: "" });
    setOrderType("SELL");
  };

  // Submit the buy/sell order
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    clearSuccess();
    
    const validationErrors = validateOrder();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      const transactionParams: TransactionParams = {
        tickerSymbol: ticker,
        transactionAmount: Number(calculateOrderTotal()),
        stockCount: parseInt(form.shares),
        transactionType: orderType,
      };

      await dispatch(createTransaction(transactionParams));
      setForm({ shares: "" });
      setSuccess(renderSuccess());
      
      return { success: true, orderType };
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrors(
        <div className="login-errors">
          <img className="error-icon transaction-errors" src={assetService.getImage('whiteWarningIcon')} />
          Transaction failed. Please try again.
        </div>
      );
      return { success: false };
    }
  };

  // Validate the order before submission
  const validateOrder = () => {
    if (form.shares.length < 1) {
      return (
        <div className="login-errors">
          <img className="error-icon transaction-errors" src={assetService.getImage('whiteWarningIcon')} />
          Please enter a valid number of shares
        </div>
      );
    }

    if (orderType === "BUY") {
      const orderTotal = calculateOrderTotal();
      const orderDifference = (Number(user.funds) || 0) - Number(orderTotal);
      if (orderDifference < 0) {
        return (
          <div className="login-errors transaction-errors">
            <p>
              <img className="error-icon" src={assetService.getImage('whiteWarningIcon')} />
              You don't have enough buying power to buy {parseInt(form.shares)} shares of {ticker}.
            </p>
            <br />
            <p>
              Please deposit ${Math.abs(orderDifference)} to purchase {parseInt(form.shares)} shares at market price.
            </p>
          </div>
        );
      }
    } else {
      const stockSymbolCount = user.totalStockCount[ticker] || 0;
      if (parseInt(form.shares) > stockSymbolCount) {
        return (
          <div className="login-errors transaction-errors">
            <img className="error-icon" src={assetService.getImage('whiteWarningIcon')} />
            You don't have enough shares of {ticker} to complete this order. Please buy some more shares.
          </div>
        );
      }
    }

    return null;
  };

  // Render success message
  const renderSuccess = () => {
    if (orderType === "BUY") {
      return (
        <div className="login-errors">
          Congratulations! You just bought {form.shares} shares of {ticker}
        </div>
      );
    } else {
      return (
        <div className="login-errors">
          Congratulations! You just sold {form.shares} shares of {ticker}
        </div>
      );
    }
  };

  // Clear error messages
  const clearErrors = () => setErrors(null);

  // Clear success messages
  const clearSuccess = () => {
    setSuccess(null);
    setAddedToWatchlist(null);
  };

  return {
    form,
    orderType,
    errors,
    success,
    addedToWatchlist,
    setAddedToWatchlist,
    calculateOrderTotal,
    handleChange,
    handleBuy,
    handleSell,
    handleSubmitOrder,
    clearErrors,
    clearSuccess
  };
};