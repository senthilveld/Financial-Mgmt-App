import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { PortfolioService } from '../../services/portfolio.service';
import { AssetType } from '../../models/portfolio.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockPortfolioService: jasmine.SpyObj<PortfolioService>;

  const mockPortfolio = {
    id: '1',
    name: 'Test Portfolio',
    totalValue: 25000,
    totalGainLoss: 1500,
    totalGainLossPercentage: 6.38,
    investments: [
      {
        id: '1',
        assetType: AssetType.STOCK,
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        purchasePrice: 150,
        currentPrice: 175,
        purchaseDate: new Date('2023-01-15'),
        totalValue: 1750,
        gainLoss: 250,
        gainLossPercentage: 16.67
      }
    ],
    assetAllocation: [
      {
        assetType: AssetType.STOCK,
        percentage: 100,
        value: 25000
      }
    ],
    performanceHistory: []
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PortfolioService', ['getPortfolio']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
      providers: [
        { provide: PortfolioService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockPortfolioService = TestBed.inject(PortfolioService) as jasmine.SpyObj<PortfolioService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load portfolio data on init', () => {
    mockPortfolioService.getPortfolio.and.returnValue(of(mockPortfolio));
    
    component.ngOnInit();
    
    expect(mockPortfolioService.getPortfolio).toHaveBeenCalled();
  });

  it('should calculate top performers correctly', () => {
    mockPortfolioService.getPortfolio.and.returnValue(of(mockPortfolio));
    component.ngOnInit();
    
    const topPerformers = component.topPerformers();
    expect(topPerformers.length).toBe(1);
    expect(topPerformers[0].symbol).toBe('AAPL');
  });

  it('should get highlight type correctly', () => {
    expect(component.getHighlightType(10)).toBe('positive');
    expect(component.getHighlightType(-5)).toBe('negative');
    expect(component.getHighlightType(0)).toBe('neutral');
  });

  it('should refresh portfolio', () => {
    mockPortfolioService.getPortfolio.and.returnValue(of(mockPortfolio));
    
    component.refreshPortfolio();
    
    expect(mockPortfolioService.getPortfolio).toHaveBeenCalled();
  });
});
