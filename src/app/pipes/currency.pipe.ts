import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined, currency: string = 'USD', showSign: boolean = false): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '$0.00';
    }

    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

    if (showSign && value > 0) {
      return `+${formatted}`;
    }

    return formatted;
  }
}
