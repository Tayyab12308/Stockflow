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

  componentDidMount() {
    this.props.searchStock(this.state.currentString)
  }

  render() {
    const results = Object.values(this.props.results).map((stock, idx) => {
      let symbol = "1. symbol";
      let name = "2. name";
      return <li key={idx}><Link to={`/stock/${stock[symbol]}`}>{stock[symbol]}: {stock[name]}</Link></li>
    })
    return (
      <div>
        <input type="text" onChange={this.handleChange} value={this.state.currentString} />
        <ul>
          {results}
        </ul>
      </div>
    )
  }
}

export default Search;