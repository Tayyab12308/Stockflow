import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '../search';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';

// Mock the searchStock action creator so we can test that it was called.
jest.mock('../../../actions/stock_actions', () => ({
  searchStock: jest.fn((query) => ({ type: 'SEARCH_STOCK', query })),
}));

const mockStore = configureStore([]);

describe('Search Component', () => {
  let store;
  let initialState;
  const mockSearchResults = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOG', name: 'Alphabet Inc.' },
  ];

  beforeEach(() => {
    initialState = {
      entities: {
        search: mockSearchResults,
      },
    };
    store = mockStore(initialState);
    // Clear any previous calls to our mocked action creator.
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Search />
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders input with placeholder "Search"', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search');
    expect(input).toBeInTheDocument();
  });

  test('dispatches searchStock action on input change', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search');
    await userEvent.type(input, 'AAPL');
    // Verify that searchStock is called with the correct query.
    await waitFor(() =>
      expect(require('../../../actions/stock_actions').searchStock).toHaveBeenCalledWith('AAPL')
    );
  });

  test('displays search results when input is not empty and focused', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search');
    // Focus the input and type something
    fireEvent.focus(input);
    await userEvent.type(input, 'AAPL');
    // The component renders a <ul> with the class "search-list" when searchResults exist.
    const list = await screen.findByRole('list');
    expect(list).toBeInTheDocument();
    // Check that one of the result items appears (it should contain the symbol "AAPL")
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  test('clicking a search result resets the input field', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search');
    // Focus and type to show the results.
    fireEvent.focus(input);
    await userEvent.type(input, 'AAPL');
    // Find the link for the first search result.
    const resultLink = await screen.findByRole('link', { name: /AAPL/i });
    // Click the result
    await userEvent.click(resultLink);
    // After clicking, the input should be reset (empty)
    await waitFor(() => expect(input).toHaveValue(''));
  });

  test('hides search results on blur after a short delay', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search');

    fireEvent.focus(input);
    await userEvent.type(input, 'AAPL');

    const container = screen.getByText('Apple Inc.').closest('div');
    expect(container).toHaveClass('search-results-true');

    fireEvent.blur(input);

    await waitFor(() => {
      expect(container).toHaveClass('search-results-false');
    });
  });

  test('renders no-results div when search query is empty and search results exist', () => {
    // Create a store with search results in state even though the query is empty.
    const initialState = {
      entities: {
        search: [
          { symbol: 'AAPL', name: 'Apple Inc.' },
          { symbol: 'MSFT', name: 'Microsoft Corporation' }
        ]
      }
    };
    const store = mockStore(initialState);
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Search />
        </MemoryRouter>
      </Provider>
    );
    
    // Since currentString is empty (its initial state), renderResults should hit the branch:
    // if (currentString === "") { return <div className="no-results"></div>; }
    // We can check for the existence of an element with class "no-results".
    const noResultsDiv = document.querySelector('.no-results');
    expect(noResultsDiv).toBeInTheDocument();
  });

  test('hides search results on blur after a short delay', async () => {
    jest.useFakeTimers();

    // Use userEvent.setup with fake timers support.
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderComponent();
    const input = screen.getByPlaceholderText('Search');

    // Focus the input to trigger showing results.
    fireEvent.focus(input);
    await user.type(input, 'AAPL');

    // Assuming that when display is true, the container has a class like "search-results-true"
  const resultsContainer = screen.getByText((content, element) =>
    element.className.includes('search-results')
  );
  expect(resultsContainer.className).toMatch("true");

    // Trigger blur.
    fireEvent.blur(input);

    // Advance timers within act so that state updates flush.
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    // Wait for the component to re-render and expect that the container's class indicates hidden results.
  await waitFor(() => {
    expect(resultsContainer.className).toMatch("false");
  });

    jest.useRealTimers();
  });

  test('renders search results container with display false when input is not focused', () => {
    // Set up the store so that there are some search results.
    const store = mockStore({
      entities: {
        search: [
          { symbol: 'AAPL', name: 'Apple Inc.' },
          { symbol: 'GOOG', name: 'Alphabet Inc.' }
        ],
      },
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Search />
        </MemoryRouter>
      </Provider>
    );
    
    // Because currentString is initially empty, renderResults() returns a <div class="no-results" />.
    // However, since searchResults.length > 0, the container is rendered with a class that depends on display.
    // With the initial state of display being false, the container should have the class "search-results-false".
    
    // Query for an element with that class.
    const resultsContainer = screen.getByText('', { selector: '.search-results-false' });
    
    expect(resultsContainer).toBeInTheDocument();
  });
});