import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminAuth } from "@/lib/auth/admin";

// Setup Supabase client with service role key (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: List all volunteer applications
export async function GET(request: NextRequest) {
  const { isAdmin, error: authError } = await verifyAdminAuth(request)
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("volunteer_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ volunteers: data });
}

// POST: Create a new volunteer application
export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("volunteer_applications")
    .insert([body])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ volunteer: data[0] });
}

// PATCH: Update a volunteer application (expects { id, ...fields })
export async function PATCH(req: NextRequest) {
  const { isAdmin, error: authError } = await verifyAdminAuth(req)
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 })
  }

  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("volunteer_applications")
    .update(fields)
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ volunteer: data[0] });
}

// DELETE: Delete a volunteer application (expects { id })
export async function DELETE(req: NextRequest) {
  const { isAdmin, error: authError } = await verifyAdminAuth(req)
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 })
  }

  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const { error } = await supabase
    .from("volunteer_applications")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}