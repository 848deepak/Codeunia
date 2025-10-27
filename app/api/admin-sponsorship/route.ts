import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminAuth } from "@/lib/auth/admin";

// Function to create Supabase client with service role key (bypasses RLS)
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: List all sponsorship applications
export async function GET() {
  const { isAdmin, error: authError } = await verifyAdminAuth()
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 })
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sponsorship_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ sponsorships: data });
}

// POST: Create a new sponsorship application
export async function POST(req: Request) {
  const body = await req.json();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sponsorship_applications")
    .insert([body])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ sponsorship: data[0] });
}

// PATCH: Update a sponsorship application (expects { id, ...fields })
export async function PATCH(req: NextRequest) {
  const { isAdmin, error: authError } = await verifyAdminAuth()
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 })
  }

  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sponsorship_applications")
    .update(fields)
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ sponsorship: data[0] });
}

// DELETE: Delete a sponsorship application (expects { id })
export async function DELETE(req: NextRequest) {
  const { isAdmin, error: authError } = await verifyAdminAuth()
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 })
  }

  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("sponsorship_applications")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
