import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio, Investment, AssetType } from '../../models/portfolio.model';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { PercentagePipe } from '../../pipes/percentage.pipe';
import { AssetTypePipe } from '../../pipes/asset-type.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    PercentagePipe,
    AssetTypePipe,
    HighlightDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Using signals for reactive state
  portfolio = signal<Portfolio | null>(null);
  loading = signal<boolean>(true);
  
  // Computed values
  topPerformers = computed(() => this.getTopPerformers());
  worstPerformers = computed(() => this.getWorstPerformers());
  assetAllocationData = computed(() => this.getAssetAllocationData());

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadPortfolio();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPortfolio(): void {
    this.portfolioService.getPortfolio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (portfolio) => {
          this.portfolio.set(portfolio);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading portfolio:', error);
          this.loading.set(false);
        }
      });
  }

  private getTopPerformers(): Investment[] {
    const portfolio = this.portfolio();
    if (!portfolio) return [];
    
    return [...portfolio.investments]
      .sort((a, b) => b.gainLossPercentage - a.gainLossPercentage)
      .slice(0, 3);
  }

  private getWorstPerformers(): Investment[] {
    const portfolio = this.portfolio();
    if (!portfolio) return [];
    
    return [...portfolio.investments]
      .sort((a, b) => a.gainLossPercentage - b.gainLossPercentage)
      .slice(0, 3);
  }

  private getAssetAllocationData(): { label: string; value: number; percentage: number }[] {
    const portfolio = this.portfolio();
    if (!portfolio) return [];
    
    return portfolio.assetAllocation.map(allocation => ({
      label: this.getAssetTypeLabel(allocation.assetType),
      value: allocation.value,
      percentage: allocation.percentage
    }));
  }

  private getAssetTypeLabel(assetType: AssetType): string {
    const labels: { [key in AssetType]: string } = {
      [AssetType.STOCK]: 'Stocks',
      [AssetType.BOND]: 'Bonds',
      [AssetType.ETF]: 'ETFs',
      [AssetType.MUTUAL_FUND]: 'Mutual Funds',
      [AssetType.CRYPTO]: 'Cryptocurrency',
      [AssetType.COMMODITY]: 'Commodities',
      [AssetType.REAL_ESTATE]: 'Real Estate'
    };
    return labels[assetType] || assetType;
  }

  getHighlightType(value: number): 'positive' | 'negative' | 'neutral' {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  }

  refreshPortfolio(): void {
    this.loading.set(true);
    this.loadPortfolio();
  }
}
