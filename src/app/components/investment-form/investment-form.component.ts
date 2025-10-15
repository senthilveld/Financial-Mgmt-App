import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import { ValidationService } from '../../services/validation.service';
import { AssetType, FormData, Investment } from '../../models/portfolio.model';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { AssetTypePipe } from '../../pipes/asset-type.pipe';

@Component({
  selector: 'app-investment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    AssetTypePipe
  ],
  templateUrl: './investment-form.component.html',
  styleUrls: ['./investment-form.component.css']
})
export class InvestmentFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  investmentForm!: FormGroup;
  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  showReview = signal<boolean>(false);
  
  // Form data for review
  formData = signal<FormData | null>(null);
  
  // Asset types for dropdown
  assetTypes = Object.values(AssetType);
  
  // Today's date for max date validation
  today = new Date().toISOString().split('T')[0];
  
  // Computed values
  totalInvestment = computed(() => {
    const data = this.formData();
    if (!data) return 0;
    return data.quantity * data.purchasePrice;
  });

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private validationService: ValidationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.investmentForm = this.fb.group({
      assetType: ['', [Validators.required]],
      symbol: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
        ValidationService.validSymbol
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      quantity: ['', [
        Validators.required,
        ValidationService.positiveNumber,
        ValidationService.minQuantity
      ]],
      purchasePrice: ['', [
        Validators.required,
        ValidationService.positiveNumber,
        ValidationService.maxPrice
      ]],
      purchaseDate: ['', [
        Validators.required,
        ValidationService.futureDate
      ]]
    });
  }

  private setupFormSubscriptions(): void {
    // Watch for asset type changes to apply specific validations
    this.investmentForm.get('assetType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(assetType => {
        this.updateValidatorsForAssetType(assetType);
      });

    // Auto-format symbol to uppercase
    this.investmentForm.get('symbol')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          const formattedValue = value.toUpperCase();
          if (formattedValue !== value) {
            this.investmentForm.get('symbol')?.setValue(formattedValue, { emitEvent: false });
          }
        }
      });
  }

  private updateValidatorsForAssetType(assetType: AssetType): void {
    const validations = this.validationService.getAssetTypeValidations(assetType);
    
    // Update symbol validators
    const symbolControl = this.investmentForm.get('symbol');
    if (symbolControl) {
      symbolControl.setValidators([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
        ...validations['symbol']
      ]);
      symbolControl.updateValueAndValidity();
    }

    // Update quantity validators
    const quantityControl = this.investmentForm.get('quantity');
    if (quantityControl) {
      quantityControl.setValidators([
        Validators.required,
        ...validations['quantity']
      ]);
      quantityControl.updateValueAndValidity();
    }

    // Update price validators
    const priceControl = this.investmentForm.get('purchasePrice');
    if (priceControl) {
      priceControl.setValidators([
        Validators.required,
        ...validations['purchasePrice']
      ]);
      priceControl.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    this.submitted.set(true);
    
    if (this.investmentForm.valid) {
      const formValue = this.investmentForm.value;
      this.formData.set(formValue);
      this.showReview.set(true);
    } else {
      this.markFormGroupTouched();
    }
  }

  onReviewSubmit(): void {
    const data = this.formData();
    if (!data) return;

    this.loading.set(true);

    // Create investment object
    const investment: Investment = {
      id: this.generateId(),
      assetType: data.assetType,
      symbol: data.symbol,
      name: data.name,
      quantity: data.quantity,
      purchasePrice: data.purchasePrice,
      currentPrice: data.purchasePrice, // Initially same as purchase price
      purchaseDate: new Date(data.purchaseDate),
      totalValue: data.quantity * data.purchasePrice,
      gainLoss: 0,
      gainLossPercentage: 0
    };

    this.portfolioService.addInvestment(investment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error adding investment:', error);
          this.loading.set(false);
        }
      });
  }

  onEdit(): void {
    this.showReview.set(false);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.investmentForm.get(fieldName);
    if (control && control.errors && this.submitted()) {
      return this.validationService.getErrorMessage(fieldName, control.errors);
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.investmentForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted()));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.investmentForm.controls).forEach(key => {
      const control = this.investmentForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Helper methods for template
  getAssetTypeLabel(assetType: AssetType): string {
    const labels: { [key in AssetType]: string } = {
      [AssetType.STOCK]: 'Stock',
      [AssetType.BOND]: 'Bond',
      [AssetType.ETF]: 'ETF',
      [AssetType.MUTUAL_FUND]: 'Mutual Fund',
      [AssetType.CRYPTO]: 'Cryptocurrency',
      [AssetType.COMMODITY]: 'Commodity',
      [AssetType.REAL_ESTATE]: 'Real Estate'
    };
    return labels[assetType] || assetType;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}
