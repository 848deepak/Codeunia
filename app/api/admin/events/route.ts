import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Input sanitization function
function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove HTML tags and encode special characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// Helper function to check admin authentication
async function checkAdminAuth(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // Get the authorization header
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 }
  }
  
  const token = authHeader.substring(7)
  
  try {
    // Verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return { error: 'Invalid token', status: 401 }
    }
    
    // Check if user has admin role
    if (user.user_metadata?.role !== 'admin') {
      return { error: 'Insufficient permissions', status: 403 }
    }
    
    return { user }
  } catch (error) {
    return { error: 'Authentication failed', status: 401 }
  }
}

// Admin-only endpoint for event management
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication first
    const authResult = await checkAdminAuth(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const eventData = await request.json()
    
    // Sanitize all input data
    const sanitizedEventData = sanitizeInput(eventData)
    
    // Use service role client for admin operations (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Validate required fields
    const requiredFields = ['slug', 'title', 'excerpt', 'description', 'organizer', 'date', 'time', 'duration', 'category', 'location', 'capacity', 'price', 'payment']
    for (const field of requiredFields) {
      if (!sanitizedEventData[field]) {
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
        slug: sanitizedEventData.slug,
        title: sanitizedEventData.title,
        excerpt: sanitizedEventData.excerpt,
        description: sanitizedEventData.description,
        organizer: sanitizedEventData.organizer,
        organizer_contact: sanitizedEventData.organizer_contact,
        date: sanitizedEventData.date,
        time: sanitizedEventData.time,
        duration: sanitizedEventData.duration,
        category: sanitizedEventData.category,
        categories: sanitizedEventData.categories || [],
        tags: sanitizedEventData.tags || [],
        featured: sanitizedEventData.featured || false,
        image: sanitizedEventData.image || '',
        location: sanitizedEventData.location,
        locations: sanitizedEventData.locations || [],
        capacity: sanitizedEventData.capacity,
        registered: sanitizedEventData.registered || 0,
        price: sanitizedEventData.price,
        payment: sanitizedEventData.payment,
        status: sanitizedEventData.status || 'live',
        event_type: sanitizedEventData.eventType || ['Online'],
        team_size: sanitizedEventData.teamSize || 1,
        user_types: sanitizedEventData.userTypes || [],
        registration_required: sanitizedEventData.registration_required || false,
        registration_deadline: sanitizedEventData.registration_deadline || '',
        rules: sanitizedEventData.rules || [],
        schedule: sanitizedEventData.schedule || [],
        prize: sanitizedEventData.prize || '',
        prize_details: sanitizedEventData.prize_details || '',
        faq: sanitizedEventData.faq || [],
        socials: sanitizedEventData.socials || {},
        sponsors: sanitizedEventData.sponsors || [],
        marking_scheme: sanitizedEventData.marking_scheme
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
    // Check admin authentication first
    const authResult = await checkAdminAuth(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const eventData = await request.json()
    const { slug, ...updateData } = eventData
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing event slug' },
        { status: 400 }
      )
    }
    
    // Sanitize all input data
    const sanitizedUpdateData = sanitizeInput(updateData)
    
    // Use service role client for admin operations (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Update event using service role client
    const { data, error } = await supabase
      .from('events')
      .update({
        title: sanitizedUpdateData.title,
        excerpt: sanitizedUpdateData.excerpt,
        description: sanitizedUpdateData.description,
        organizer: sanitizedUpdateData.organizer,
        organizer_contact: sanitizedUpdateData.organizer_contact,
        date: sanitizedUpdateData.date,
        time: sanitizedUpdateData.time,
        duration: sanitizedUpdateData.duration,
        category: sanitizedUpdateData.category,
        categories: sanitizedUpdateData.categories || [],
        tags: sanitizedUpdateData.tags || [],
        featured: sanitizedUpdateData.featured || false,
        image: sanitizedUpdateData.image || '',
        location: sanitizedUpdateData.location,
        locations: sanitizedUpdateData.locations || [],
        capacity: sanitizedUpdateData.capacity,
        registered: sanitizedUpdateData.registered || 0,
        price: sanitizedUpdateData.price,
        payment: sanitizedUpdateData.payment,
        status: sanitizedUpdateData.status || 'live',
        event_type: sanitizedUpdateData.eventType || ['Online'],
        team_size: sanitizedUpdateData.teamSize || 1,
        user_types: sanitizedUpdateData.userTypes || [],
        registration_required: sanitizedUpdateData.registration_required || false,
        registration_deadline: sanitizedUpdateData.registration_deadline || '',
        rules: sanitizedUpdateData.rules || [],
        schedule: sanitizedUpdateData.schedule || [],
        prize: sanitizedUpdateData.prize || '',
        prize_details: sanitizedUpdateData.prize_details || '',
        faq: sanitizedUpdateData.faq || [],
        socials: sanitizedUpdateData.socials || {},
        sponsors: sanitizedUpdateData.sponsors || [],
        marking_scheme: sanitizedUpdateData.marking_scheme
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
    // Check admin authentication first
    const authResult = await checkAdminAuth(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const { slug } = await request.json()
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing event slug' },
        { status: 400 }
      )
    }
    
    // Sanitize the slug
    const sanitizedSlug = sanitizeInput(slug)
    
    // Use service role client for admin operations (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Delete event using service role client
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('slug', sanitizedSlug)
    
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
