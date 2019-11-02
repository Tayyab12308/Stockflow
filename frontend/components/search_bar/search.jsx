import React from 'react';
import { Link } from 'react-router-dom';

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentString: "",
      display: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleChange(e) {    
    this.setState({ currentString: e.target.value}, () => {      
      return this.props.searchStock(this.state.currentString)
    })
  }

  renderResults() {
    let results;    
    if (this.state.currentString === "") {
      results = <div className="no-results"></div>;
    } else {
      let allResults = Object.values(this.props.results)
      let filteredResults = allResults.filter(stock => {
        let region = "4. region";        
        if (stock[region] === "United States") return stock;  
      })      
      let outputResults = filteredResults.map((stock, idx) => {
        let symbol = "1. symbol";
        let name = "2. name";      
        return <li key={idx} className="filtered-search"><Link to={`/stock/${stock[symbol]}`}><div className="search-symbol">{stock[symbol]}</div> <span className="search-name">{stock[name]}</span></Link></li>
      });
      results = outputResults;
    }
    return results
  }

  handleBlur() {
    setTimeout(() => {
      if (this.state.display) {
        this.setState({ display: false, 
                        currentString: "",
                      });
      }
    }, 200);
  }

  handleFocus() {
    if (!this.state.display) {
      this.setState({ display: true })
    }
  }

  render() {    
    let allResults = this.renderResults();
    return (
      <div>
        <div className="search-container">
          <input type="text" className="search-barz" onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} value={this.state.currentString} placeholder="Search"/>
          {allResults.length > 0 && <div className={`search-results-${this.state.display}`} >
          <ul className="search-list">
            {allResults}
          </ul>
          </div> }
        </div> 
      </div>
    )
  }
}

export default Search;