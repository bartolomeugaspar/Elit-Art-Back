import { supabase } from '../config/database'
import { IProduct, IProductInput } from '../models/Product'

export class ProductService {
  static async getAllProducts(category?: string, isActive?: boolean): Promise<IProduct[]> {
    let query = supabase.from('products').select('*')

    if (category) {
      query = query.eq('category', category)
    }

    // Only filter by is_active if explicitly set (true or false)
    // If undefined, return all products regardless of status
    if (isActive !== undefined) {
      query = query.eq('is_active', isActive)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getProductById(id: string): Promise<IProduct | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data || null
  }

  static async getProductBySku(sku: string): Promise<IProduct | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data || null
  }

  static async createProduct(productData: IProductInput): Promise<IProduct> {
    // Check if SKU already exists
    const existing = await this.getProductBySku(productData.sku)
    if (existing) {
      throw new Error('Product with this SKU already exists')
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        is_active: productData.is_active !== false,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async updateProduct(id: string, productData: Partial<IProductInput>): Promise<IProduct> {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) throw new Error(error.message)
    return true
  }

  static async updateStock(productId: string, quantity: number): Promise<IProduct> {
    const product = await this.getProductById(productId)
    if (!product) throw new Error('Product not found')

    const newStock = product.stock - quantity
    if (newStock < 0) throw new Error('Insufficient stock')

    return this.updateProduct(productId, { stock: newStock })
  }

  static async searchProducts(query: string): Promise<IProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,author.ilike.%${query}%`)
      .eq('is_active', true)

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getFeaturedProducts(limit: number = 6): Promise<IProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  }
}
