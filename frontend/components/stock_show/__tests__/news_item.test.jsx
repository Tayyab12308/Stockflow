import React from 'react';
import { render, screen } from '@testing-library/react';
import NewsItem from '../news_item';

describe('NewsItem component', () => {
  const sampleArticle = {
    url: "https://example.com/article",
    source: { name: "Example Source" },
    title: "Example Title",
    urlToImage: "https://example.com/image.jpg"
  };

  test('renders a link with the correct href', () => {
    render(<NewsItem article={sampleArticle} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', sampleArticle.url);
  });

  test('renders the news source and title', () => {
    render(<NewsItem article={sampleArticle} />);
    const sourceElement = screen.getByText(sampleArticle.source.name);
    const titleElement = screen.getByText(sampleArticle.title);
    expect(sourceElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
  });

  test('renders an image with the correct src', () => {
    render(<NewsItem article={sampleArticle} />);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', sampleArticle.urlToImage);
  });
});