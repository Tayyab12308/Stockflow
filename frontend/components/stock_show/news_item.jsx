import React from 'react';
import { Link } from 'react-router-dom';

class NewsItem extends React.Component {
  render() {
    debugger
    return (
      <>
      <Link className="news-link" to={this.props.article.url}>
          <div className="news-item">
            <div className="header">
              <div className="news-source">
                {this.props.article.source.name}
              </div>
              <div className="news-title">
                {this.props.article.title}
              </div>
            </div>
            <div className="news-image-container">
              <img className="news-pic" src={this.props.article.urlToImage} />
            </div>
          </div>
      </Link>
      </>
    )
  }
}

export default NewsItem;