import React from 'react';
import { Link } from 'react-router-dom';

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentString: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {    
    this.setState({ currentString: e.target.value}, () => {      
      return this.props.searchStock(this.state.currentString)
    })
  }

  renderResults() {
    let results;    
    if (this.state.currentString === "") {
      results = null;
    } else {
      let allResults = Object.values(this.props.results)
      let filteredResults = allResults.filter(stock => {
        let region = "4. region";        
        if (stock[region] === "United States") return stock;  
      })      
      let outputResults = filteredResults.map((stock, idx) => {
        let symbol = "1. symbol";
        let name = "2. name";        
        return <li key={idx} ><Link to={`/stock/${stock[symbol]}`}>{stock[symbol]}: {stock[name]}</Link></li>
      })
      results = outputResults;
    }
    return results
  }

  render() {
    return (
      <div>
        <div className="search-container">
          <input type="text" className="search-barz" onChange={this.handleChange} value={this.state.currentString} placeholder="Search"/>
          <div className="search-results">
          <ul>
            {this.renderResults()}
          </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Search;