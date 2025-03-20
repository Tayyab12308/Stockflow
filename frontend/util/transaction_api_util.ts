import axios, { AxiosResponse } from "axios";
import { TransactionParams } from "../interfaces";
import { convertKeysToSnakeCase } from "./util";

export const createTransaction = async (transaction: TransactionParams): Promise<AxiosResponse> => {
  try {
    const response = await axios.post("/api/transactions", { transaction: convertKeysToSnakeCase(transaction) });
    return response;
  } catch (error) {
    throw new Error(`Transaction creation failed: ${error}`);
  }
};