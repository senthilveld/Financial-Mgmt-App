import { TestBed } from '@angular/core/testing';
import { PortfolioService } from './portfolio.service';
import { AssetType } from '../models/portfolio.model';

describe('PortfolioService', () => {
  let service: PortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return portfolio data', (done) => {
    service.getPortfolio().subscribe(portfolio => {
      expect(portfolio).toBeDefined();
      expect(portfolio.investments).toBeDefined();
      expect(Array.isArray(portfolio.investments)).toBe(true);
      done();
    });
  });

  it('should add investment', (done) => {
    const newInvestment = {
      id: 'test-1',
      assetType: AssetType.STOCK,
      symbol: 'TEST',
      name: 'Test Stock',
      quantity: 10,
      purchasePrice: 100,
      currentPrice: 100,
      purchaseDate: new Date(),
      totalValue: 1000,
      gainLoss: 0,
      gainLossPercentage: 0
    };

    service.addInvestment(newInvestment).subscribe(investment => {
      expect(investment).toEqual(newInvestment);
      done();
    });
  });

  it('should calculate portfolio metrics correctly', (done) => {
    service.getPortfolio().subscribe(portfolio => {
      const totalValue = portfolio.investments.reduce((sum, inv) => sum + inv.totalValue, 0);
      const totalCost = portfolio.investments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0);
      const expectedGainLoss = totalValue - totalCost;
      const expectedGainLossPercentage = totalCost > 0 ? (expectedGainLoss / totalCost) * 100 : 0;

      expect(portfolio.totalValue).toBe(totalValue);
      expect(portfolio.totalGainLoss).toBe(expectedGainLoss);
      expect(portfolio.totalGainLossPercentage).toBeCloseTo(expectedGainLossPercentage, 2);
      done();
    });
  });

  it('should return benchmark data', (done) => {
    service.getBenchmarkData().subscribe(benchmark => {
      expect(benchmark).toBeDefined();
      expect(benchmark.name).toBe('S&P 500');
      expect(benchmark.symbol).toBe('SPY');
      expect(benchmark.performanceHistory).toBeDefined();
      done();
    });
  });
});
