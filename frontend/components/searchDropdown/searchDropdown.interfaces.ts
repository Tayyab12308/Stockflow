export interface SearchResult {
  symbol: string;
  name: string;
}

export interface SearchDropdownProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResultSelected: (result: SearchResult) => void;
  searchFunction: (query: string) => Promise<SearchResult[]>;
  resultFormatter?: (results: SearchResult[]) => SearchResult[];
  clearOnSelect?: boolean;
  searchBarClassName?: string;
  resultsContainerClassName?: string;
  searchResultItemClassName?: string;
  placeholder?: string;
}