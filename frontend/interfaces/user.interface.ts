export interface User {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  phoneNumber: string;
  address: string;
  additionalAddress: string;
  city: string;
  state: string;
  zipCode: string;
  socialSecurityNumber: string;
  dateOfBirth: string;
  citizenship: string;
  investingExperience: string;
  optionsTradingPreference: string;
  employmentStatus: string;
  salaryRange: string;
  employerName: string;
  jobDescription: string;
  jobIndustry: string;
  jobAddress: string;
  jobAdditionalAddress: string;
  jobCity: string;
  jobState: string;
  jobZipCode: string;
  familyStatus: string;
  familyEmployment: string;
  employmentConflict: string;
  conflictFirmName: string;
  conflictEmployeeName: string;
  conflictRelationship: string;
  reportedAllIncome: boolean;
  marginAccount: boolean;
  dataSharing: boolean;
  funds: string | null;
  portfolioValue: string;
  transactions?: TransactionResponse[];
  watchlist: WatchListResponse[];
  totalStockCount: Record<string, number>;
}

export interface UserSessionDetails {
  emailAddress: string;
  password: string;
}

export interface TransactionResponse {
  createdAt: string;
  id: number;
  tickerSymbol: string;
  transactionAmount: string;
  transactionType: string;
}

export interface WatchListResponse {
  id: number;
  tickerSymbol: string;
}