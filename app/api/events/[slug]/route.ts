import { NextRequest, NextResponse } from 'next/server'
import { eventsService } from '@/lib/services/events'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'

// GET: Fetch a single event by slug
export async function GET(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const slug = pathname.split('/').pop() || ''
    const event = await eventsService.getEventBySlug(slug)
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(event)
  } catch (error) {
    console.error('Error in GET /api/events/[slug]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

// PUT: Update an event
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }
    const { pathname } = request.nextUrl
    const slug = pathname.split('/').pop() || ''
    const eventData = await request.json()
    
    const event = await eventsService.updateEvent(slug, eventData)
    
    return NextResponse.json(event)
  } catch (error) {
    console.error('Error in PUT /api/events/[slug]:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

// DELETE: Delete an event
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }
    const { pathname } = request.nextUrl
    const slug = pathname.split('/').pop() || ''
    await eventsService.deleteEvent(slug)
    
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/events/[slug]:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
} 