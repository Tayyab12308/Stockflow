import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

class StockGraph extends React.Component {
  constructor(props) {
    super(props)
    debugger
    this.state = {
      price: this.showPrice()
    }
  }

  formatXAxis() {
    if (this.props.data.length > 0) {
      if (this.props.range.range === "1d") {
        return [0, 390]
      } else {
        return [0, this.props.data.length]
      }
    }
  }

  showPrice() {
    if (this.props.data.length > 0) {
      debugger
      return this.props.data.slice(-1)[0].price
    } else {
      return 0
    }
  }


  render() {
    let data = this.props.data || [];
    debugger
    return (
      <>
        <div>
          <div className="graph-price">${this.showPrice()}</div>
        <ResponsiveContainer width={700} height={300}>
          <LineChart data={data}
                     margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="idx"
                   type="number"
                    domain={this.formatXAxis()}
                    orientation="top"
                    allowDataOverflow={false}
                    hide={true}
                    interval={5}
            />
            <YAxis type="number" 
                   hide={true}
                   domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip position={{y: 1}} 
                     content={this.props.data.date}
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
        </div>
      </>
    )
  }
};

export default StockGraph;