import React, { memo } from 'react';
import News from '../../news';

interface NewsSectionProps {
  news: React.JSX.Element[];
  ticker: string;
}

const NewsSection: React.FC<NewsSectionProps> = memo(({ news, ticker }) => {
  return (
    <div className="news-container">
      <h3 className="news-header">Latest News</h3>
      {news.length > 0 ? news : <p>No recent news available for {ticker}</p>}
    </div>
  );
});

export default NewsSection;
