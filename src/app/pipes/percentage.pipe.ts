import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
  standalone: true
})
export class PercentagePipe implements PipeTransform {
  transform(value: number | null | undefined, decimals: number = 2, showSign: boolean = true): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00%';
    }

    const formatted = value.toFixed(decimals);
    const sign = showSign && value > 0 ? '+' : '';
    
    return `${sign}${formatted}%`;
  }
}
