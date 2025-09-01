import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Event } from '@/components/data/events'

export interface EventsFilters {
  search?: string
  category?: string
  status?: string
  featured?: boolean
  dateFilter?: 'all' | 'upcoming' | 'today' | 'this-week'
  limit?: number
  offset?: number
}

export interface EventsResponse {
  events: Event[]
  total: number
  hasMore: boolean
}

export class EventsService {
  private get supabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) {
      throw new Error('Supabase environment variables are not set')
    }
    return createSupabaseClient(url, anonKey)
  }

  // Get all events with optional filters
  async getEvents(filters: EventsFilters = {}): Promise<EventsResponse> {
    let query = this.supabase
      .from('events')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    // Date filtering
    if (filters.dateFilter) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      switch (filters.dateFilter) {
        case 'today':
          query = query.eq('date', today.toISOString().split('T')[0])
          break
        case 'this-week':
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          query = query.gte('date', weekStart.toISOString().split('T')[0])
            .lte('date', weekEnd.toISOString().split('T')[0])
          break
        case 'upcoming':
          query = query.gte('date', today.toISOString().split('T')[0])
          break
      }
    }

    // Order by featured first, then by date
    query = query.order('featured', { ascending: false })
      .order('date', { ascending: true })

    // Apply pagination
    if (typeof filters.limit === 'number') {
      query = query.limit(filters.limit)
    }
    if (typeof filters.offset === 'number') {
      const start = filters.offset
      const end = start + ((typeof filters.limit === 'number' ? filters.limit : 10) - 1)
      query = query.range(start, end)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching events:', error)
      throw new Error(`Failed to fetch events: ${error.message}`)
    }

    // Transform data to match Event interface
    const events = data?.map(this.transformEvent) || []

    return {
      events,
      total: count || 0,
      hasMore: filters.limit ? (count || 0) > (filters.offset || 0) + (filters.limit || 10) : false
    }
  }

  // Get a single event by slug
  async getEventBySlug(slug: string): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching event:', error)
      throw new Error(`Failed to fetch event: ${error.message}`)
    }

    return data ? this.transformEvent(data) : null
  }

  // Get featured events
  async getFeaturedEvents(limit: number = 5): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('featured', true)
      .order('date', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured events:', error)
      throw new Error(`Failed to fetch featured events: ${error.message}`)
    }

    return data?.map(this.transformEvent) || []
  }

  // Create a new event
  async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const { data, error } = await this.supabase
      .from('events')
      .insert([this.transformToDatabase(eventData)])
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      throw new Error(`Failed to create event: ${error.message}`)
    }

    return this.transformEvent(data)
  }

  // Update an event
  async updateEvent(slug: string, eventData: Partial<Event>): Promise<Event> {
    const { data, error } = await this.supabase
      .from('events')
      .update(this.transformToDatabase(eventData))
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Error updating event:', error)
      throw new Error(`Failed to update event: ${error.message}`)
    }

    return this.transformEvent(data)
  }

  // Delete an event
  async deleteEvent(slug: string): Promise<void> {
    const { error } = await this.supabase
      .from('events')
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error('Error deleting event:', error)
      throw new Error(`Failed to delete event: ${error.message}`)
    }
  }

  // Increment registered count
  async incrementRegistered(slug: string): Promise<void> {
    // First get the current registered count
    const { data: currentEvent, error: fetchError } = await this.supabase
      .from('events')
      .select('registered')
      .eq('slug', slug)
      .single()

    if (fetchError) {
      console.error('Error fetching current registered count:', fetchError)
      throw new Error(`Failed to fetch current registered count: ${fetchError.message}`)
    }

    // Then update with incremented value
    const { error } = await this.supabase
      .from('events')
      .update({ registered: (currentEvent.registered || 0) + 1 })
      .eq('slug', slug)

    if (error) {
      console.error('Error incrementing registered count:', error)
      throw new Error(`Failed to increment registered count: ${error.message}`)
    }
  }

  // Get event categories
  async getCategories(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    const categories = [...new Set(data?.map(item => item.category) || [])]
    return categories.sort()
  }

  // Transform database record to Event interface
  private transformEvent(dbEvent: Record<string, unknown>): Event {
    return {
      id: dbEvent.id as number,
      slug: dbEvent.slug as string,
      title: dbEvent.title as string,
      excerpt: dbEvent.excerpt as string,
      description: dbEvent.description as string,
      organizer: dbEvent.organizer as string,
      organizer_contact: dbEvent.organizer_contact as Event['organizer_contact'],
      date: dbEvent.date as string,
      time: dbEvent.time as string,
      duration: dbEvent.duration as string,
      category: dbEvent.category as string,
      categories: (dbEvent.categories as string[]) || [],
      tags: (dbEvent.tags as string[]) || [],
      featured: dbEvent.featured as boolean,
      image: dbEvent.image as string,
      location: dbEvent.location as string,
      locations: (dbEvent.locations as string[]) || [],
      capacity: dbEvent.capacity as number,
      registered: dbEvent.registered as number,
      price: dbEvent.price as string,
      payment: dbEvent.payment as 'Paid' | 'Free',
      status: dbEvent.status as 'live' | 'expired' | 'closed' | 'recent',
      eventType: (dbEvent.event_type as ('Online' | 'Offline' | 'Hybrid')[]) || [],
      teamSize: dbEvent.team_size as number | [number, number],
      userTypes: (dbEvent.user_types as string[]) || [],
      registration_required: dbEvent.registration_required as boolean,
      registration_deadline: dbEvent.registration_deadline as string,
      rules: (dbEvent.rules as string[]) || [],
      schedule: (dbEvent.schedule as { date: string; label: string }[]) || [],
      prize: dbEvent.prize as string,
      prize_details: dbEvent.prize_details as string,
      faq: (dbEvent.faq as { question: string; answer: string }[]) || [],
      socials: dbEvent.socials as Event['socials'],
      sponsors: (dbEvent.sponsors as { name: string; logo: string; type: string }[]) || [],
      marking_scheme: dbEvent.marking_scheme as Event['marking_scheme'],
    }
  }

  // Transform Event interface to database format
  private transformToDatabase(event: Partial<Event>): Record<string, unknown> {
    const dbEvent: Record<string, unknown> = { ...event }
    
    // Transform field names to match database schema
    if (event.eventType !== undefined) {
      dbEvent.event_type = event.eventType
      delete dbEvent.eventType
    }
    
    if (event.teamSize !== undefined) {
      dbEvent.team_size = event.teamSize
      delete dbEvent.teamSize
    }
    
    if (event.userTypes !== undefined) {
      dbEvent.user_types = event.userTypes
      delete dbEvent.userTypes
    }
    
    if (event.registration_required !== undefined) {
      dbEvent.registration_required = event.registration_required
      delete dbEvent.registration_required
    }
    
    if (event.registration_deadline !== undefined) {
      dbEvent.registration_deadline = event.registration_deadline
      delete dbEvent.registration_deadline
    }
    
    if (event.prize_details !== undefined) {
      dbEvent.prize_details = event.prize_details
      delete dbEvent.prize_details
    }
    
    if (event.marking_scheme !== undefined) {
      dbEvent.marking_scheme = event.marking_scheme
      delete dbEvent.marking_scheme
    }

    return dbEvent
  }
}

// Export a singleton instance
export const eventsService = new EventsService() 