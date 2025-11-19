import { supabase } from '../config/database'
import { IBlogPost, IBlogPostInput } from '../models/BlogPost'
import { IBlogComment, IBlogCommentInput } from '../models/BlogComment'

export class BlogService {
  // ===== POSTS =====
  static async getAllPosts(category?: string, status: string = 'published'): Promise<IBlogPost[]> {
    let query = supabase.from('blog_posts').select('*')

    if (category) {
      query = query.eq('category', category)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('published_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getPostById(id: string): Promise<IBlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)

    // Increment views
    if (data) {
      await supabase
        .from('blog_posts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)
    }

    return data || null
  }

  static async getPostBySlug(slug: string): Promise<IBlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)

    // Increment views
    if (data) {
      await supabase
        .from('blog_posts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id)
    }

    return data || null
  }

  static async createPost(postData: IBlogPostInput): Promise<IBlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...postData,
        views: 0,
        likes: 0,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async updatePost(id: string, postData: Partial<IBlogPostInput>): Promise<IBlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deletePost(id: string): Promise<boolean> {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)

    if (error) throw new Error(error.message)
    return true
  }

  static async likePost(id: string): Promise<IBlogPost> {
    const post = await this.getPostById(id)
    if (!post) throw new Error('Post not found')

    const { data, error } = await supabase
      .from('blog_posts')
      .update({ likes: (post.likes || 0) + 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async searchPosts(query: string): Promise<IBlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .eq('status', 'published')

    if (error) throw new Error(error.message)
    return data || []
  }

  // ===== COMMENTS =====
  static async getCommentsByPost(postId: string, approved: boolean = true): Promise<IBlogComment[]> {
    let query = supabase.from('blog_comments').select('*').eq('post_id', postId)

    if (approved) {
      query = query.eq('status', 'approved')
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createComment(commentData: IBlogCommentInput): Promise<IBlogComment> {
    const { data, error } = await supabase
      .from('blog_comments')
      .insert({
        ...commentData,
        status: commentData.status || 'pending',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async approveComment(id: string): Promise<IBlogComment> {
    const { data, error } = await supabase
      .from('blog_comments')
      .update({ status: 'approved' })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deleteComment(id: string): Promise<boolean> {
    const { error } = await supabase.from('blog_comments').delete().eq('id', id)

    if (error) throw new Error(error.message)
    return true
  }

  static async getPendingComments(): Promise<IBlogComment[]> {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }
}
