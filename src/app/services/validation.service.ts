import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AssetType, ValidationError } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  // Custom validators
  static positiveNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value <= 0)) {
      return { positiveNumber: { value } };
    }
    return null;
  }

  static futureDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && new Date(value) > new Date()) {
      return { futureDate: { value } };
    }
    return null;
  }

  static validSymbol(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/^[A-Z]{1,5}$/.test(value)) {
      return { validSymbol: { value } };
    }
    return null;
  }

  static minQuantity(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < 0.0001)) {
      return { minQuantity: { value } };
    }
    return null;
  }

  static maxPrice(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value > 1000000)) {
      return { maxPrice: { value } };
    }
    return null;
  }

  // Get validation error messages
  getErrorMessage(fieldName: string, errors: ValidationErrors): string {
    const errorMessages: { [key: string]: string } = {
      required: `${fieldName} is required`,
      positiveNumber: `${fieldName} must be a positive number`,
      futureDate: `${fieldName} cannot be in the future`,
      validSymbol: `${fieldName} must be 1-5 uppercase letters`,
      minQuantity: `${fieldName} must be at least 0.0001`,
      maxPrice: `${fieldName} cannot exceed $1,000,000`,
      minlength: `${fieldName} must be at least ${errors['minlength']?.requiredLength} characters`,
      maxlength: `${fieldName} cannot exceed ${errors['maxlength']?.requiredLength} characters`,
      pattern: `${fieldName} format is invalid`,
      email: 'Please enter a valid email address'
    };

    const errorKey = Object.keys(errors)[0];
    return errorMessages[errorKey] || `${fieldName} is invalid`;
  }

  // Validate entire form
  validateForm(formData: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required field validations
    if (!formData.assetType) {
      errors.push({ field: 'assetType', message: 'Asset type is required' });
    }

    if (!formData.symbol || formData.symbol.trim() === '') {
      errors.push({ field: 'symbol', message: 'Symbol is required' });
    } else if (!/^[A-Z]{1,5}$/.test(formData.symbol)) {
      errors.push({ field: 'symbol', message: 'Symbol must be 1-5 uppercase letters' });
    }

    if (!formData.name || formData.name.trim() === '') {
      errors.push({ field: 'name', message: 'Name is required' });
    }

    if (!formData.quantity || formData.quantity <= 0) {
      errors.push({ field: 'quantity', message: 'Quantity must be a positive number' });
    }

    if (!formData.purchasePrice || formData.purchasePrice <= 0) {
      errors.push({ field: 'purchasePrice', message: 'Purchase price must be a positive number' });
    }

    if (!formData.purchaseDate) {
      errors.push({ field: 'purchaseDate', message: 'Purchase date is required' });
    } else if (new Date(formData.purchaseDate) > new Date()) {
      errors.push({ field: 'purchaseDate', message: 'Purchase date cannot be in the future' });
    }

    return errors;
  }

  // Asset type specific validations
  getAssetTypeValidations(assetType: AssetType): { [key: string]: ValidatorFn[] } {
    const baseValidations = {
      symbol: [ValidationService.validSymbol],
      quantity: [ValidationService.minQuantity],
      purchasePrice: [ValidationService.maxPrice]
    };

    switch (assetType) {
      case AssetType.CRYPTO:
        return {
          ...baseValidations,
          quantity: [ValidationService.minQuantity] // Crypto can have very small quantities
        };
      case AssetType.STOCK:
        return {
          ...baseValidations,
          quantity: [ValidationService.positiveNumber] // Stocks typically whole numbers
        };
      default:
        return baseValidations;
    }
  }
}
