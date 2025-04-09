import React, { useState, useRef, TouchEvent } from 'react';

/** Represents the data for each tile in the carousel. */
export interface TileItem {
  id: number;
  title: string;
  imageUrl: string;
  /** Flyout content provided as a React node */
  flyoutContent: React.ReactNode;
  color: string;
}

/** Props for the flyout component. */
interface FlyoutProps {
  open: boolean;
  onClose: () => void;
  item?: TileItem;
}

/**
 * A full-screen flyout overlay that renders the passed flyoutContent.
 */
const TileCarouselFlyout: React.FC<FlyoutProps> = ({ open, onClose, item }) => {
  if (!open || !item) return null;

  return (
    <div className="tile-carousel-flyout-overlay" onClick={onClose}>
      <div className="tile-carousel-flyout-content" onClick={(e) => e.stopPropagation()}>
        <button className="tile-carousel-flyout-close-button" onClick={onClose}>
          X
        </button>
        <div className="tile-carousel-flyout-inner">
          {item.flyoutContent}
        </div>
      </div>
    </div>
  );
};

/** Props for the HorizontalTileCarousel component. */
interface HorizontalTileCarouselProps {
  items: TileItem[];
}

/**
 * A horizontally scrollable tile carousel with arrow buttons and touch swipe support.
 * Clicking a tile opens a full-screen flyout that renders the flyoutContent provided for that tile.
 */
const HorizontalTileCarousel: React.FC<HorizontalTileCarouselProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<TileItem | undefined>();
  const [flyoutOpen, setFlyoutOpen] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTileClick = (item: TileItem) => {
    setSelectedItem(item);
    setFlyoutOpen(true);
  };

  const handleFlyoutClose = () => {
    setSelectedItem(undefined);
    setFlyoutOpen(false);
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Handle touch events for mobile swipe scrolling.
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [touchEndX, setTouchEndX] = useState<number>(0);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const delta = touchStartX - touchEndX;
    const threshold = 50; // minimum swipe distance in pixels
    if (Math.abs(delta) > threshold && scrollRef.current) {
      scrollRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="tile-carousel-container">
        <button className="tile-carousel-arrow-button tile-carousel-arrow-button-left" onClick={handleScrollLeft}>
          &lt;
        </button>
        <div
          className="tile-carousel-scroller"
          ref={scrollRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="tile-carousel-tile"
              onClick={() => handleTileClick(item)}
              style={{
                backgroundColor: item.color,
              }}
            >
              <div className="tile-carousel-tile-image-container">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="tile-carousel-tile-image"
                />
              </div>
              <div className="tile-carousel-tile-title">
                {item.title}
              </div>
            </div>
          ))}
        </div>
        <button className="tile-carousel-arrow-button tile-carousel-arrow-button-right" onClick={handleScrollRight}>
          &gt;
        </button>
      </div>
      <TileCarouselFlyout open={flyoutOpen} onClose={handleFlyoutClose} item={selectedItem} />
    </>
  );
};

export default HorizontalTileCarousel;
