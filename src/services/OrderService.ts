import { supabase } from '../config/database'
import { IOrder, IOrderInput } from '../models/Order'
import { ProductService } from './ProductService'

export class OrderService {
  static async getAllOrders(status?: string): Promise<IOrder[]> {
    let query = supabase.from('orders').select('*')

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getOrderById(id: string): Promise<IOrder | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data || null
  }

  static async getOrdersByUser(userId: string): Promise<IOrder[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getOrdersByEmail(email: string): Promise<IOrder[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createOrder(orderData: IOrderInput): Promise<IOrder> {
    // Validate stock for all items
    for (const item of orderData.items) {
      const product = await ProductService.getProductById(item.product_id)
      if (!product) throw new Error(`Product ${item.product_id} not found`)
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`)
      }
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Update product stock
    for (const item of orderData.items) {
      await ProductService.updateStock(item.product_id, item.quantity)
    }

    return data
  }

  static async updateOrderStatus(id: string, status: string): Promise<IOrder> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async updatePaymentStatus(id: string, paymentStatus: string, stripePaymentId?: string): Promise<IOrder> {
    const updateData: any = { payment_status: paymentStatus }
    if (stripePaymentId) {
      updateData.stripe_payment_id = stripePaymentId
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async cancelOrder(id: string): Promise<IOrder> {
    const order = await this.getOrderById(id)
    if (!order) throw new Error('Order not found')

    // Restore product stock
    for (const item of order.items) {
      const product = await ProductService.getProductById(item.product_id)
      if (product) {
        await supabase
          .from('products')
          .update({ stock: product.stock + item.quantity })
          .eq('id', item.product_id)
      }
    }

    return this.updateOrderStatus(id, 'cancelled')
  }

  static async getTotalRevenue(): Promise<number> {
    const { data, error } = await supabase
      .from('orders')
      .select('final_amount')
      .eq('payment_status', 'completed')

    if (error) throw new Error(error.message)

    return (data || []).reduce((sum, order) => sum + order.final_amount, 0)
  }

  static async getOrderStats() {
    const { data: orders, error } = await supabase.from('orders').select('*')

    if (error) throw new Error(error.message)

    const stats = {
      total_orders: orders?.length || 0,
      pending: orders?.filter((o) => o.status === 'pending').length || 0,
      paid: orders?.filter((o) => o.payment_status === 'completed').length || 0,
      shipped: orders?.filter((o) => o.status === 'shipped').length || 0,
      total_revenue: orders?.reduce((sum, o) => sum + o.final_amount, 0) || 0,
    }

    return stats
  }
}
