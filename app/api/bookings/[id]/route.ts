import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookingId = Number(id);

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "BOOKING_NOT_FOUND",
          message: "Booking not found.",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: booking,
  });
}
