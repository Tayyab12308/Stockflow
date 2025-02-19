jest.mock('jquery');

import { createTransaction } from '../transaction_api_util';

describe('createTransaction', () => {
  beforeEach(() => {
    $.ajax.mockReset();
  });

  it('calls $.ajax with the correct parameters and returns the response', async () => {
    const transaction = {
      ticker_symbol: 'AAPL',
      transaction_amount: 100,
      stock_count: 1,
      transaction_type: 'BUY'
    };

    const dummyResponse = { success: true };
    $.ajax.mockResolvedValue(dummyResponse);

    const result = await createTransaction(transaction);

    expect($.ajax).toHaveBeenCalledWith({
      method: "POST",
      url: '/api/transactions',
      data: { transaction }
    });

    expect(result).toEqual(dummyResponse);
  });
});