import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default SearchDropdown = ({
  value,
  onChange,
  onResultSelected,
  searchFunction,
  resultFormatter,
  clearOnSelect = true,
  searchBarClassName = '',
  resultsContainerClassName = '',
  searchResultItemClassName = '',
  placeholder = 'Search...',
}) => {
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = async (e) => {
    const val = e.target.value;
    onChange(e); // let the parent update the input value

    if (val.length > 0) {
      try {
        const rawResults = await searchFunction(val);
        // If a formatter is provided, use it; otherwise, use raw results.
        const formattedResults = resultFormatter
          ? resultFormatter(rawResults)
          : rawResults;
        setResults(formattedResults);
      } catch (err) {
        console.error("Error during search:", err);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleResultClick = (result) => {
    // Pass the whole result (or just result.symbol) to the parent's handler.
    onResultSelected(result);
    if (clearOnSelect) {
      setResults([]);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay hiding the dropdown to allow clicks on results to register.
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  return (
    <div className="search-dropdown">
      <input
        type="text"
        className={`search-bar ${searchBarClassName}`}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isFocused && results.length > 0 && (
        <ul className={`search-results ${resultsContainerClassName}`}>
          {results.map((result, idx) => (
            <li
              key={idx}
              className={`search-result-item ${searchResultItemClassName}`}
              onClick={() => handleResultClick(result)}
            >
              <div className='search-item-symbol'>
                {result.symbol}
              </div>
              <div className='search-item-name'>
                {result.name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

SearchDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onResultSelected: PropTypes.func.isRequired,
  searchFunction: PropTypes.func.isRequired,
  resultFormatter: PropTypes.func,
  clearOnSelect: PropTypes.bool,
  searchBarClassName: PropTypes.string,
  resultsContainerClassName: PropTypes.string,
  searchResultItemClassName: PropTypes.string,
  placeholder: PropTypes.string,
};
