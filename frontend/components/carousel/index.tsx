import React, { useState, useRef, TouchEvent } from 'react';
import { CarouselProps } from './carousel.interfaces';

const Carousel: React.FC<CarouselProps> = ({ slides }: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleDotClick = (index: number): void => {
    setActiveIndex(index);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>): void => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (): void => {
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance in pixels
    if (delta > threshold && activeIndex < slides.length - 1) {
      // Swiped left: move to the next slide
      setActiveIndex(activeIndex + 1);
    } else if (delta < -threshold && activeIndex > 0) {
      // Swiped right: move to the previous slide
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-slides"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            {slide}
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
