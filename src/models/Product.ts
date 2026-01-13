export interface IProduct {
  id: string
  name: string
  description: string
  category: 'hat' | 'backpack' | 'tshirt'
  price: number
  discount_price?: number
  image_url: string
  stock: number
  sku: string
  author?: string
  isbn?: string
  pages?: number
  publication_date?: string
  digital_url?: string // URL para download de produto digital
  is_digital: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface IProductInput {
  name: string
  description: string
  category: 'hat' | 'backpack' | 'tshirt'
  price: number
  discount_price?: number
  image_url: string
  stock: number
  sku: string
  author?: string
  isbn?: string
  pages?: number
  publication_date?: string
  digital_url?: string
  is_digital: boolean
  is_active?: boolean
}
