import React, { useState } from 'react';
import { SearchDropdownProps, SearchResult } from './searchDropdown.interfaces';

const SearchDropdown: React.FC<SearchDropdownProps> = ({
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
}: SearchDropdownProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val: string = e.target.value;
    onChange(e); // let the parent update the input value

    if (val.length > 0) {
      try {
        const rawResults: SearchResult[] = await searchFunction(val);
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

  const handleResultClick = (result: SearchResult): void => {
    // Pass the whole result (or just result.symbol) to the parent's handler.
    onResultSelected(result);
    if (clearOnSelect) {
      setResults([]);
    }
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (): void => {
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
          {results.map((result: SearchResult, idx: number): React.JSX.Element => (
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

export default SearchDropdown;

