// Common types used across the application

export interface LoginResult {
  token: string;
  employee: {
    id: number;
    username: string;
    name: string;
    position: string;
  };
}

export interface CreateEmployeeDTO {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  position: 'Admin' | 'Cashier';
}

export interface UpdateEmployeeDTO {
  password?: string;
  firstName?: string;
  lastName?: string;
  position?: 'Admin' | 'Cashier';
}

export interface CreateItemDTO {
  itemCode: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface UpdateItemDTO {
  name?: string;
  price?: number;
  quantity?: number;
  category?: string;
}

export interface TransactionItem {
  itemId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateTransactionDTO {
  type: 'Sale' | 'Rental' | 'Return';
  customerId?: number;
  employeeId: number;
  items: TransactionItem[];
  couponCode?: string;
  state?: string;
}

export interface CreateRentalDTO {
  phoneNumber: string;
  items: RentalItemDTO[];
  rentalDate: Date;
  employeeId: number;
}

export interface RentalItemDTO {
  itemId: number;
  quantity: number;
}

export interface ProcessReturnDTO {
  rentalId: number;
  employeeId: number;
}

export interface ReturnResult {
  rentalId: number;
  returnDate: Date;
  lateFee: number;
  itemReturned: string;
}

export interface DiscountResult {
  discountAmount: number;
  finalAmount: number;
}

export interface TotalResult {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

