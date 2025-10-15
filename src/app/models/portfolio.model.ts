export interface Investment {
  id: string;
  assetType: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  totalValue: number;
  gainLoss: number;
  gainLossPercentage: number;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  investments: Investment[];
  assetAllocation: AssetAllocation[];
  performanceHistory: PerformanceData[];
}

export interface AssetAllocation {
  assetType: AssetType;
  percentage: number;
  value: number;
}

export interface PerformanceData {
  date: Date;
  totalValue: number;
  benchmarkValue: number;
}

export interface Benchmark {
  name: string;
  symbol: string;
  currentValue: number;
  performanceHistory: PerformanceData[];
}

export enum AssetType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  ETF = 'ETF',
  MUTUAL_FUND = 'MUTUAL_FUND',
  CRYPTO = 'CRYPTO',
  COMMODITY = 'COMMODITY',
  REAL_ESTATE = 'REAL_ESTATE'
}

export interface FormData {
  assetType: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
}

export interface ValidationError {
  field: string;
  message: string;
}
