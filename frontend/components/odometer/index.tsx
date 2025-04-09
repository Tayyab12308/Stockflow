import React, { useState, useEffect } from 'react';
import AnimatedDigit from './AnimatedDigit';

interface PriceOdometerProps {
  price: number | string;
  animationDuration?: number;
  formatPrice?: (price: number | string) => string;
  injectedClassName?: string;
  digitInjectedClassName?: string;
}

const Odometer: React.FC<PriceOdometerProps> = ({
  price,
  animationDuration = 300,
  formatPrice,
  injectedClassName,
  digitInjectedClassName,
}) => {
  const defaultFormatPrice = (price: number | string): string => price.toString();
  const formatter = formatPrice || defaultFormatPrice;
  const formattedPrice = formatter(price);
  const [prevPrice, setPrevPrice] = useState<string>(formattedPrice);

  // Determine overall price direction
  const globalDirection =
    parseFloat(formattedPrice) > parseFloat(prevPrice) ? 'up' : 'down';

  const maxLen = Math.max(formattedPrice.length, prevPrice.length);
  const paddedCurrent = formattedPrice.padStart(maxLen, ' ');
  const paddedPrev = prevPrice.padStart(maxLen, ' ');

  useEffect(() => {
    if (formattedPrice !== prevPrice) {
      setPrevPrice(formattedPrice);
    }
  }, [formattedPrice, prevPrice]);

  return (
    <div className={`price-odometer ${injectedClassName}`}>
      {paddedCurrent.split('').map((char, index) => {
        if (!/\d/.test(char)) {
          return (
            <span key={index} className="digit">
              {char}
            </span>
          );
        }
        return (
          <AnimatedDigit
            key={index}
            digit={char}
            animationDuration={animationDuration}
            globalDirection={globalDirection}
            digitInjectedClassName={digitInjectedClassName}
          />
        );
      })}
    </div>
  );
};

export default Odometer;