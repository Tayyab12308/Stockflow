import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

class StockGraph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      price: this.props.initialPrice,
      defaultPrice: this.props.initialPrice,
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

  setPrice() {
    if (this.props.data.length > 0) {      
      for (let i = this.props.length - 1; i >= 0; i--) {
        if (data.price !== null) {          
          return data.price;
        }
      }      
      return 0
    }
  }


  showPrice() {
    let lastData = this.props.data.slice(-1)[0]
    if (this.props.data.length > 0 && (lastData.price !== undefined && lastData.price !== null)) {        
        return (lastData.price.toFixed(2))
    } else {      
      return 0;
    }
  }

  formatYAxis() {
    if (this.props.data.length > 0) {
      if (this.props.range.range === "1d") {
        return ['dataMin - 10', 'dataMax + 5']
      } else {
        return ['dataMin - 100', 'dataMax + 100']
      }
    }
  }

  customTooltip({payload}) {
    if (Object.values(payload).length > 0) {
        return (
        <div className="graph-tooltip">
          {payload[0].payload.time} {payload[0].payload.date}
        </div> 
        )
    }
  }

  handleMouseMove(e) {
    this.setState({ price: e.activePayload[0].payload.price})
  }

  handleMouseLeave() {
    this.setState({ price: this.state.defaultPrice })
  }


  render() {
    let data = this.props.data || [];
    if (this.props.data !== undefined && this.props.data.length > 0) {
      return (
        <>
          <div>
            <div className="graph-price">${this.state.price}</div>
          <ResponsiveContainer width={700} height={300}>
            <LineChart data={data}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  onMouseMove={this.handleMouseMove.bind(this)}
                  onMouseLeave={this.handleMouseLeave.bind(this)} >
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
                    domain={this.formatYAxis()}
              />
              <Tooltip position={{y: 1}} 
                      content={this.customTooltip.bind(this) }
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
          <div className='dotted-graph-line'></div>
        </>
      )
    } else {
      return <div></div>
    }
  }
};

export default StockGraph;