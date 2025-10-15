import { Pipe, PipeTransform } from '@angular/core';
import { AssetType } from '../models/portfolio.model';

@Pipe({
  name: 'assetType',
  standalone: true
})
export class AssetTypePipe implements PipeTransform {
  transform(value: AssetType | null | undefined): string {
    if (!value) {
      return '';
    }
    
    const typeLabels: { [key in AssetType]: string } = {
      [AssetType.STOCK]: 'Stock',
      [AssetType.BOND]: 'Bond',
      [AssetType.ETF]: 'ETF',
      [AssetType.MUTUAL_FUND]: 'Mutual Fund',
      [AssetType.CRYPTO]: 'Cryptocurrency',
      [AssetType.COMMODITY]: 'Commodity',
      [AssetType.REAL_ESTATE]: 'Real Estate'
    };

    return typeLabels[value] || value;
  }
}
