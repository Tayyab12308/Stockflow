import React from "react";
import { NewsProps } from "./news.interfaces";
import { Link } from "react-router-dom";
import MiniTickerInfo from "../miniTickerInfo";

const News = ({
  publisher,
  time,
  title,
  url,
  tickers,
  shouldDisplayTicker,
  imageUrl,
  injectedClassName,
}: NewsProps): React.JSX.Element => (
  <div className={`news-item-container ${injectedClassName}`} onClick={() => window.location.href = url}>
    <div className="header-section">
      <div className="news-item-publisher">{publisher}</div>
      <div className="news-item-time-since">{time}</div>
    </div>
    <div className="body-container">
      <div className="news-item-title">
        {title}
      </div>
      <img className="news-item-image" src={imageUrl} />
    </div>
    {shouldDisplayTicker &&
      <div className="ticker-info">
        {tickers.map((ticker) => <MiniTickerInfo key={ticker} ticker={ticker} />)}
      </div>
    }
  </div>
)

export default News;
