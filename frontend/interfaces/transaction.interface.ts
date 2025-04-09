export type OrderType = "BUY" | "SELL";

export interface TransactionParams {
    tickerSymbol: string,
    transactionAmount: number,
    stockCount: number,
    transactionType: OrderType,
}

