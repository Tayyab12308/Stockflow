import axios, { AxiosResponse } from "axios";
import { WatchlistParams } from "../interfaces";

// Function to add an item to the watchlist
export const addToWatchlist = async (watchlist: WatchlistParams): Promise<AxiosResponse<any, any>> => {
  try {
    const res = await axios.post("/api/watchlists", { watchlist });
    return res;
  } catch (error) {
    console.error("Failed to add to watchlist:", error);
    throw error; // Rethrow for handling at the caller level
  }
};

// Function to delete an item from the watchlist
export const deleteFromWatchlist = async (watchlist: WatchlistParams): Promise<AxiosResponse<any, any>> => {
  try {
    const res = await axios.delete(`/api/watchlists/${watchlist.tickerSymbol}`);
    return res;
  } catch (error) {
    console.error("Failed to remove from watchlist:", error);
    throw error;
  }
};