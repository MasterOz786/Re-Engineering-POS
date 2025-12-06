// Application-wide constants
export const TAX_RATE = {
  DEFAULT: parseFloat(process.env.TAX_RATE || '0.06'),
  PA: 0.06,
  NJ: 0.07,
  NY: 0.04
} as const;

export const DISCOUNT = {
  COUPON_DEFAULT: parseFloat(process.env.COUPON_DISCOUNT || '0.10'),
  COUPON_PERCENTAGE: 0.90
} as const;

export const RENTAL = {
  DEFAULT_PERIOD_DAYS: parseInt(process.env.RENTAL_PERIOD_DAYS || '7'),
  LATE_FEE_RATE_PER_DAY: parseFloat(process.env.LATE_FEE_RATE || '0.10'),
  LATE_FEE_MULTIPLIER: 0.1
} as const;

export const VALIDATION = {
  CREDIT_CARD_LENGTH: 16,
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 50
} as const;

export const BUSINESS_RULES = {
  MIN_ITEM_QUANTITY: 0,
  MAX_ITEM_QUANTITY: 10000,
  MIN_ITEM_PRICE: 0,
  MAX_TRANSACTION_ITEMS: 100
} as const;

