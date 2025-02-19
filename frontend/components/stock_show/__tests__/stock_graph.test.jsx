import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StockGraph from '../stock_graph';

jest.mock('react-odometerjs', () => {
  return ({ value }) => <div data-testid="odometer">{value}</div>;
});

Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  configurable: true,
  value: function () {
    return {
      width: 800,
      height: 400,
      top: 0,
      left: 0,
      bottom: 400,
      right: 800,
    };
  },
});

describe('StockGraph component', () => {
  const sampleData = [
    { date: '2025-02-15', time: '15:00:00', price: 145.00, idx: 0 },
    { date: '2025-02-15', time: '15:01:00', price: 150.00, idx: 1 },
  ];

  test('renders "No Data Available" when data is empty', () => {
    render(<StockGraph data={[]} range="1d" initialPrice={145} openingPrice={140} />);
    expect(screen.getByText("No Data Available")).toBeInTheDocument();
  });

  test('renders graph and odometer values correctly', async () => {
    render(<StockGraph data={sampleData} range="1d" initialPrice={145} openingPrice={140} />);

    await waitFor(() => {
      expect(screen.getByText("145")).toBeInTheDocument();
    });

    // Also check that the change info is calculated correctly.
    // (145 - 140 = 5, so we expect "$5.00" change and "3.57" percent)
    await waitFor(() => {
      expect(screen.getByText("5.00")).toBeInTheDocument();
      expect(screen.getByText("3.57")).toBeInTheDocument();
    });
  });
});