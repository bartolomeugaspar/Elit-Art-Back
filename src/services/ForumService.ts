import { supabase } from '../config/database'
import { IForumTopic, IForumTopicInput, IForumReply, IForumReplyInput } from '../models/ForumTopic'

export class ForumService {
  // ===== TOPICS =====
  static async getAllTopics(category?: string): Promise<IForumTopic[]> {
    let query = supabase.from('forum_topics').select('*')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getTopicById(id: string): Promise<IForumTopic | null> {
    const { data, error } = await supabase
      .from('forum_topics')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data || null
  }

  static async getTopicsByAuthor(authorId: string): Promise<IForumTopic[]> {
    const { data, error } = await supabase
      .from('forum_topics')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createTopic(topicData: IForumTopicInput): Promise<IForumTopic> {
    const { data, error } = await supabase
      .from('forum_topics')
      .insert({
        ...topicData,
        replies_count: 0,
        views: 0,
        is_pinned: topicData.is_pinned || false,
        is_closed: topicData.is_closed || false,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async updateTopic(id: string, topicData: Partial<IForumTopicInput>): Promise<IForumTopic> {
    const { data, error } = await supabase
      .from('forum_topics')
      .update(topicData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deleteTopic(id: string): Promise<boolean> {
    // Delete all replies first
    await supabase.from('forum_replies').delete().eq('topic_id', id)

    // Delete topic
    const { error } = await supabase.from('forum_topics').delete().eq('id', id)

    if (error) throw new Error(error.message)
    return true
  }

  static async pinTopic(id: string): Promise<IForumTopic> {
    return this.updateTopic(id, { is_pinned: true })
  }

  static async unpinTopic(id: string): Promise<IForumTopic> {
    return this.updateTopic(id, { is_pinned: false })
  }

  static async closeTopic(id: string): Promise<IForumTopic> {
    return this.updateTopic(id, { is_closed: true })
  }

  static async openTopic(id: string): Promise<IForumTopic> {
    return this.updateTopic(id, { is_closed: false })
  }

  static async incrementViews(id: string): Promise<void> {
    const topic = await this.getTopicById(id)
    if (topic) {
      await this.updateTopic(id, { views: (topic.views || 0) + 1 })
    }
  }

  // ===== REPLIES =====
  static async getRepliesByTopic(topicId: string): Promise<IForumReply[]> {
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getReplyById(id: string): Promise<IForumReply | null> {
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data || null
  }

  static async createReply(replyData: IForumReplyInput): Promise<IForumReply> {
    const topic = await this.getTopicById(replyData.topic_id)
    if (!topic) throw new Error('Topic not found')

    if (topic.is_closed) throw new Error('Topic is closed')

    const { data, error } = await supabase
      .from('forum_replies')
      .insert({
        ...replyData,
        likes: 0,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Increment replies count
    await this.updateTopic(replyData.topic_id, {
      replies_count: (topic.replies_count || 0) + 1,
    })

    return data
  }

  static async updateReply(id: string, replyData: Partial<IForumReplyInput>): Promise<IForumReply> {
    const { data, error } = await supabase
      .from('forum_replies')
      .update(replyData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deleteReply(id: string): Promise<boolean> {
    const reply = await this.getReplyById(id)
    if (!reply) throw new Error('Reply not found')

    const { error } = await supabase.from('forum_replies').delete().eq('id', id)

    if (error) throw new Error(error.message)

    // Decrement replies count
    const topic = await this.getTopicById(reply.topic_id)
    if (topic) {
      await this.updateTopic(reply.topic_id, {
        replies_count: Math.max(0, (topic.replies_count || 1) - 1),
      })
    }

    return true
  }

  static async likeReply(id: string): Promise<IForumReply> {
    const reply = await this.getReplyById(id)
    if (!reply) throw new Error('Reply not found')

    const { data, error } = await supabase
      .from('forum_replies')
      .update({ likes: (reply.likes || 0) + 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async getRecentTopics(limit: number = 10): Promise<IForumTopic[]> {
    const { data, error } = await supabase
      .from('forum_topics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getPopularTopics(limit: number = 10): Promise<IForumTopic[]> {
    const { data, error } = await supabase
      .from('forum_topics')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  }
}
