import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { Investment, Portfolio, AssetType, AssetAllocation, PerformanceData, Benchmark } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioSubject = new BehaviorSubject<Portfolio>(this.getInitialPortfolio());
  public portfolio$ = this.portfolioSubject.asObservable();

  // Using signals for reactive state management
  private portfolioSignal = signal<Portfolio>(this.getInitialPortfolio());
  public portfolio = this.portfolioSignal.asReadonly();

  // Computed signals for derived state
  public totalValue = computed(() => this.portfolio().totalValue);
  public totalGainLoss = computed(() => this.portfolio().totalGainLoss);
  public totalGainLossPercentage = computed(() => this.portfolio().totalGainLossPercentage);

  constructor() {
    // Simulate real-time price updates
    this.startPriceUpdates();
  }

  getPortfolio(): Observable<Portfolio> {
    return this.portfolio$.pipe(delay(100)); // Simulate API delay
  }

  addInvestment(investment: Investment): Observable<Investment> {
    const currentPortfolio = this.portfolioSignal();
    const updatedInvestments = [...currentPortfolio.investments, investment];
    const updatedPortfolio = this.calculatePortfolioMetrics({
      ...currentPortfolio,
      investments: updatedInvestments
    });

    this.portfolioSignal.set(updatedPortfolio);
    this.portfolioSubject.next(updatedPortfolio);

    return of(investment).pipe(delay(200));
  }

  updateInvestment(id: string, investment: Investment): Observable<Investment> {
    const currentPortfolio = this.portfolioSignal();
    const updatedInvestments = currentPortfolio.investments.map(inv => 
      inv.id === id ? investment : inv
    );
    const updatedPortfolio = this.calculatePortfolioMetrics({
      ...currentPortfolio,
      investments: updatedInvestments
    });

    this.portfolioSignal.set(updatedPortfolio);
    this.portfolioSubject.next(updatedPortfolio);

    return of(investment).pipe(delay(200));
  }

  deleteInvestment(id: string): Observable<boolean> {
    const currentPortfolio = this.portfolioSignal();
    const updatedInvestments = currentPortfolio.investments.filter(inv => inv.id !== id);
    const updatedPortfolio = this.calculatePortfolioMetrics({
      ...currentPortfolio,
      investments: updatedInvestments
    });

    this.portfolioSignal.set(updatedPortfolio);
    this.portfolioSubject.next(updatedPortfolio);

    return of(true).pipe(delay(200));
  }

  getBenchmarkData(): Observable<Benchmark> {
    return of(this.getMockBenchmark()).pipe(delay(150));
  }

  private calculatePortfolioMetrics(portfolio: Portfolio): Portfolio {
    const totalValue = portfolio.investments.reduce((sum, inv) => sum + inv.totalValue, 0);
    const totalCost = portfolio.investments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    const assetAllocation = this.calculateAssetAllocation(portfolio.investments, totalValue);

    return {
      ...portfolio,
      totalValue,
      totalGainLoss,
      totalGainLossPercentage,
      assetAllocation
    };
  }

  private calculateAssetAllocation(investments: Investment[], totalValue: number): AssetAllocation[] {
    const allocationMap = new Map<AssetType, number>();
    
    investments.forEach(inv => {
      const currentValue = allocationMap.get(inv.assetType) || 0;
      allocationMap.set(inv.assetType, currentValue + inv.totalValue);
    });

    return Array.from(allocationMap.entries()).map(([assetType, value]) => ({
      assetType,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
    }));
  }

  private startPriceUpdates(): void {
    setInterval(() => {
      const currentPortfolio = this.portfolioSignal();
      const updatedInvestments = currentPortfolio.investments.map(inv => ({
        ...inv,
        currentPrice: this.simulatePriceChange(inv.currentPrice),
        totalValue: inv.quantity * this.simulatePriceChange(inv.currentPrice),
        gainLoss: (inv.quantity * this.simulatePriceChange(inv.currentPrice)) - (inv.quantity * inv.purchasePrice),
        gainLossPercentage: ((inv.quantity * this.simulatePriceChange(inv.currentPrice)) - (inv.quantity * inv.purchasePrice)) / (inv.quantity * inv.purchasePrice) * 100
      }));

      const updatedPortfolio = this.calculatePortfolioMetrics({
        ...currentPortfolio,
        investments: updatedInvestments
      });

      this.portfolioSignal.set(updatedPortfolio);
      this.portfolioSubject.next(updatedPortfolio);
    }, 5000); // Update every 5 seconds
  }

  private simulatePriceChange(currentPrice: number): number {
    const change = (Math.random() - 0.5) * 0.02; // ±1% change
    return Math.max(0.01, currentPrice * (1 + change));
  }

  private getInitialPortfolio(): Portfolio {
    const mockInvestments: Investment[] = [
      {
        id: '1',
        assetType: AssetType.STOCK,
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        purchasePrice: 150.00,
        currentPrice: 175.50,
        purchaseDate: new Date('2023-01-15'),
        totalValue: 1755.00,
        gainLoss: 255.00,
        gainLossPercentage: 17.00
      },
      {
        id: '2',
        assetType: AssetType.STOCK,
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        quantity: 5,
        purchasePrice: 2800.00,
        currentPrice: 2950.00,
        purchaseDate: new Date('2023-03-20'),
        totalValue: 14750.00,
        gainLoss: 750.00,
        gainLossPercentage: 5.36
      },
      {
        id: '3',
        assetType: AssetType.ETF,
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        quantity: 20,
        purchasePrice: 400.00,
        currentPrice: 425.00,
        purchaseDate: new Date('2023-02-10'),
        totalValue: 8500.00,
        gainLoss: 500.00,
        gainLossPercentage: 6.25
      }
    ];

    const totalValue = mockInvestments.reduce((sum, inv) => sum + inv.totalValue, 0);
    const totalCost = mockInvestments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercentage = (totalGainLoss / totalCost) * 100;

    return {
      id: '1',
      name: 'My Portfolio',
      totalValue,
      totalGainLoss,
      totalGainLossPercentage,
      investments: mockInvestments,
      assetAllocation: this.calculateAssetAllocation(mockInvestments, totalValue),
      performanceHistory: this.generatePerformanceHistory()
    };
  }

  private getMockBenchmark(): Benchmark {
    return {
      name: 'S&P 500',
      symbol: 'SPY',
      currentValue: 425.00,
      performanceHistory: this.generatePerformanceHistory()
    };
  }

  private generatePerformanceHistory(): PerformanceData[] {
    const history: PerformanceData[] = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      history.push({
        date,
        totalValue: 20000 + (Math.random() - 0.5) * 5000,
        benchmarkValue: 400 + (Math.random() - 0.5) * 50
      });
    }

    return history;
  }
}
