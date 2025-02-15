import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchStock } from '../../actions/stock_actions';
import { useDispatch, useSelector } from 'react-redux';

const Search = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector(state => state.entities.search);
  const [currentString, setCurrentString] = useState("");
  const [display, setDisplay] = useState(false);

  const handleChange = (e) => {
    setCurrentString(e.target.value);
    dispatch(searchStock(e.target.value));
  };

  const renderResults = () => {
    if (currentString === "") { return <div className="no-results"></div>; }
    return searchResults.map((stock, idx) => (
      <li key={idx} className="filtered-search" onClick={() => setCurrentString("")}>
        <Link to={`/stock/${stock.symbol}`}>
          <div className="search-symbol">
            {stock.symbol}
          </div>
          <span className="search-name">
            {stock.name}
          </span>
        </Link>
      </li>
    ));
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (display) {
        setDisplay(false);
      }
    }, 200);
  }

  const handleFocus = () => {
    if (!display) {
      setDisplay(true)
    }
  }

  return (
    <div>
      <div className="search-container">
        <input type="text" className="search-barz" onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} value={currentString} placeholder="Search" />
        {searchResults.length > 0 && <div className={`search-results-${display}`} >
          <ul className="search-list">
            {renderResults()}
          </ul>
        </div>}
      </div>
    </div>
  )
};

export default Search;