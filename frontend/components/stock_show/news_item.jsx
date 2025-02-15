import React from 'react';

const NewsItem = ({ article }) => (
  <>
    <a className="news-link" href={article.url}>
      <div className="news-item">
        <div className="header">
          <div className="news-source">
            {article.source.name}
          </div>
          <div className="news-title">
            {article.title}
          </div>
        </div>
        <div className="news-image-container">
          <img className="news-pic" src={article.urlToImage} />
        </div>
      </div>
    </a>
  </>
);

export default NewsItem;
