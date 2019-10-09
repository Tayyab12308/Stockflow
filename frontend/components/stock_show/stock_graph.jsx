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
        let startTime= new Date(`${this.props.data[1].date}T09:00:00`).toLocaleTimeString().split(" ")[0];
        let endTime = new Date(`${this.props.data[1].date}T16:00:00`).toLocaleTimeString().split(" ")[0];
        return [startTime, endTime]
      } else {
        return ['dataMin', 'dataMax']
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
    return (
      <>
        <div>
          <div className="graph-price">${this.showPrice()}</div>
        <ResponsiveContainer width={700} height={300}>
          <LineChart data={data}
                     margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="time"
                  //  type="number"
                    domain={this.formatXAxis()}
                    orientation={top}
                    // tickFormatter={(time) => new Date(time).toLocaleTimeString().split(" ")[0]}
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