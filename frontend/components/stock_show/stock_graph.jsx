import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Odometer from 'react-odometerjs'
import { VALID_RANGES } from '../../util/util';

const StockGraph = ({ data = [], range, initialPrice, openingPrice }) => {
  const [price, setPrice] = useState(initialPrice);
  const [defaultPrice, setDefaultPrice] = useState(initialPrice);
  const [localOpeningPrice, setLocalOpeningPrice] = useState(openingPrice);

  const formatXAxis = () => {
    if (data.length > 0) {
      if (range === "1d") {
        return [0, 390]
      } else {
        return [0, data.length - 1]
      }
    }
  }

  useEffect(() => {
    setPrice(initialPrice);
    setDefaultPrice(initialPrice);
    setLocalOpeningPrice(openingPrice);
  }, [data, initialPrice, openingPrice])

  const formatYAxis = () => {
    if (data.length > 0) {
      if (range === VALID_RANGES.ONE_DAY) {
        return ['auto', 'auto']
      } else {
        return [(dataMin) => dataMin - 100, (dataMax) => dataMax + 100]
      }
    }
  }

  const customTooltip = ({ payload }) => {
    if (Object.values(payload).length > 0) {
      return (
        <div className="graph-tooltip">
          {payload[0].payload.time} {payload[0].payload.date}
        </div>
      )
    }
  }

  const handleMouseMove = (e) => {
    if (e.activePayload !== undefined) {
      setPrice(e.activePayload[0].payload.price);
    }
  }

  const handleMouseLeave = () => setPrice(defaultPrice);

  if (!data || data.length === 0) {
    return <div>No Data Available</div>;
  }

  return (
    <>
      <div className="graph-price">
        $<Odometer value={price} duration={300} format='(,ddd).dd' />
      </div>
      <div className="graph-change-info">
        <div className="graph-change">$<Odometer value={(price - localOpeningPrice).toFixed(2)} /></div>
        <div> [ <Odometer value={(((price - localOpeningPrice) / localOpeningPrice) * 100).toFixed(2)} /> % ] </div>
      </div>
      <ResponsiveContainer width="100%" height={800}>
        <LineChart data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave} >
          <XAxis dataKey="idx"
            type="number"
            domain={formatXAxis()}
            orientation="top"
            allowDataOverflow={false}
            hide={true}
            interval={5}

          />
          <YAxis type="number"
            hide={true}
            domain={formatYAxis()}
          />
          <Tooltip position={{ y: 1 }}
            content={customTooltip}
          />
          <Line type="linear"
            connectNulls={true}
            dot={false}
            dataKey="price"
            stroke="#f45531"
            strokeWidth="2"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
};

export default StockGraph;