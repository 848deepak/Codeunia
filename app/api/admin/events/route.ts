import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminAuth } from '@/lib/auth/admin'

// Admin-only endpoint for event management
export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    const { isAdmin, error: authError } = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: authError }, { status: 401 })
    }

    const eventData = await request.json()
    
    // Use service role client for admin operations (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Validate required fields
    const requiredFields = ['slug', 'title', 'excerpt', 'description', 'organizer', 'date', 'time', 'duration', 'category', 'location', 'capacity', 'price', 'payment']
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Create event using service role client
    const { data, error } = await supabase
      .from('events')
      .insert([{
        slug: eventData.slug,
        title: eventData.title,
        excerpt: eventData.excerpt,
        description: eventData.description,
        organizer: eventData.organizer,
        organizer_contact: eventData.organizer_contact,
        date: eventData.date,
        time: eventData.time,
        duration: eventData.duration,
        category: eventData.category,
        categories: eventData.categories || [],
        tags: eventData.tags || [],
        featured: eventData.featured || false,
        image: eventData.image || '',
        location: eventData.location,
        locations: eventData.locations || [],
        capacity: eventData.capacity,
        registered: eventData.registered || 0,
        price: eventData.price,
        payment: eventData.payment,
        status: eventData.status || 'live',
        event_type: eventData.eventType || ['Online'],
        team_size: eventData.teamSize || 1,
        user_types: eventData.userTypes || [],
        registration_required: eventData.registration_required || false,
        registration_deadline: eventData.registration_deadline || '',
        rules: eventData.rules || [],
        schedule: eventData.schedule || [],
        prize: eventData.prize || '',
        prize_details: eventData.prize_details || '',
        faq: eventData.faq || [],
        socials: eventData.socials || {},
        sponsors: eventData.sponsors || [],
        marking_scheme: eventData.marking_scheme
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating event:', error)
      return NextResponse.json(
        { error: 'Failed to create event: ' + error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/events:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

// Update event
export async function PUT(request: NextRequest) {
  try {
    // Check authentication first
    const { isAdmin, error: authError } = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: authError }, { status: 401 })
    }

    const eventData = await request.json()
    const { slug, ...updateData } = eventData
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing event slug' },
        { status: 400 }
      )
    }
    
    // Use service role client for admin operations (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Update event using service role client
    const { data, error } = await supabase
      .from('events')
      .update({
        title: updateData.title,
        excerpt: updateData.excerpt,
        description: updateData.description,
        organizer: updateData.organizer,
        organizer_contact: updateData.organizer_contact,
        date: updateData.date,
        time: updateData.time,
        duration: updateData.duration,
        category: updateData.category,
        categories: updateData.categories || [],
        tags: updateData.tags || [],
        featured: updateData.featured || false,
        image: updateData.image || '',
        location: updateData.location,
        locations: updateData.locations || [],
        capacity: updateData.capacity,
        registered: updateData.registered || 0,
        price: updateData.price,
        payment: updateData.payment,
        status: updateData.status || 'live',
        event_type: updateData.eventType || ['Online'],
        team_size: updateData.teamSize || 1,
        user_types: updateData.userTypes || [],
        registration_required: updateData.registration_required || false,
        registration_deadline: updateData.registration_deadline || '',
        rules: updateData.rules || [],
        schedule: updateData.schedule || [],
        prize: updateData.prize || '',
        prize_details: updateData.prize_details || '',
        faq: updateData.faq || [],
        socials: updateData.socials || {},
        sponsors: updateData.sponsors || [],
        marking_scheme: updateData.marking_scheme
      })
      .eq('slug', slug)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating event:', error)
      return NextResponse.json(
        { error: 'Failed to update event: ' + error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error in PUT /api/admin/events:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

// Delete event
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication first
    const { isAdmin, error: authError } = await verifyAdminAuth(request)
    if (!isAdmin) {
      return NextResponse.json({ error: authError }, { status: 401 })
    }

    const { slug } = await request.json()
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing event slug' },
        { status: 400 }
      )
    }
    
    // Use service role client for admin operations (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Delete event using service role client
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('slug', slug)
    
    if (error) {
      console.error('Error deleting event:', error)
      return NextResponse.json(
        { error: 'Failed to delete event: ' + error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/admin/events:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
