import { TransactionItem, DiscountResult, TotalResult } from '../types';
import { TAX_RATE, DISCOUNT } from '../utils/constants';

export interface IPricingService {
  calculateSubtotal(items: TransactionItem[]): number;
  calculateTax(subtotal: number, state?: string): number;
  applyCouponDiscount(subtotal: number, couponCode?: string): DiscountResult;
  calculateTotal(items: TransactionItem[], options?: { state?: string; couponCode?: string }): TotalResult;
}

export class PricingService implements IPricingService {
  calculateSubtotal(items: TransactionItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.unitPrice * item.quantity);
    }, 0);
  }

  calculateTax(subtotal: number, state?: string): number {
    const taxRate = state 
      ? TAX_RATE[state as keyof typeof TAX_RATE] || TAX_RATE.DEFAULT
      : TAX_RATE.DEFAULT;
    
    return subtotal * taxRate;
  }

  applyCouponDiscount(subtotal: number, couponCode?: string): DiscountResult {
    if (!couponCode) {
      return { discountAmount: 0, finalAmount: subtotal };
    }

    // Business rule: 10% discount with valid coupon
    const discountAmount = subtotal * DISCOUNT.COUPON_DEFAULT;
    const finalAmount = subtotal * DISCOUNT.COUPON_PERCENTAGE;

    return { discountAmount, finalAmount };
  }

  calculateTotal(
    items: TransactionItem[],
    options: {
      state?: string;
      couponCode?: string;
    } = {}
  ): TotalResult {
    const subtotal = this.calculateSubtotal(items);
    const { discountAmount, finalAmount } = this.applyCouponDiscount(
      subtotal,
      options.couponCode
    );
    const tax = this.calculateTax(finalAmount, options.state);
    const total = finalAmount + tax;

    return {
      subtotal,
      tax,
      discount: discountAmount,
      total
    };
  }
}

