import React, { memo } from 'react';
import PriceOdometer from '../../odometer';
import { formatPrice } from '../../../util/chart_util';

interface PriceHeaderProps {
  ticker: string;
  price: number;
}

const PriceHeader: React.FC<PriceHeaderProps> = memo(({ ticker, price }) => {
  return (
    <div className="stock-show-header">
      <span>{ticker}</span>
      <PriceOdometer 
        price={price} 
        formatPrice={formatPrice} 
        injectedClassName="price-header" 
      />
    </div>
  );
});

export default PriceHeader;