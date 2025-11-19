export interface IOrderItem {
  product_id: string
  quantity: number
  price: number
  subtotal: number
}

export interface IOrder {
  id: string
  user_id?: string
  email: string
  full_name: string
  phone_number?: string
  items: IOrderItem[]
  total_amount: number
  discount_amount?: number
  tax_amount?: number
  final_amount: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'stripe' | 'bank_transfer' | 'cash'
  payment_status: 'pending' | 'completed' | 'failed'
  stripe_payment_id?: string
  shipping_address: string
  shipping_city: string
  shipping_country: string
  shipping_postal_code: string
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface IOrderInput {
  user_id?: string
  email: string
  full_name: string
  phone_number?: string
  items: IOrderItem[]
  total_amount: number
  discount_amount?: number
  tax_amount?: number
  final_amount: number
  payment_method: 'stripe' | 'bank_transfer' | 'cash'
  shipping_address: string
  shipping_city: string
  shipping_country: string
  shipping_postal_code: string
  notes?: string
}
