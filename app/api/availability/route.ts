import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const workerId = searchParams.get("workerId");

  // 1) Validate required params
  if (!date || !serviceId) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "date and serviceId are required.",
        },
      },
      { status: 400 }
    );
  }

  // 2) Check service exists
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id")
    .eq("id", serviceId)
    .single();

  if (serviceError || !service) {
    return NextResponse.json(
      {
        ok: false,
        error: { code: "SERVICE_NOT_FOUND", message: "Service not found." },
      },
      { status: 404 }
    );
  }

  // 3) If workerId provided, check worker exists
  if (workerId) {
    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("id")
      .eq("id", workerId)
      .single();

    if (workerError || !worker) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "WORKER_NOT_FOUND", message: "Worker not found." },
        },
        { status: 404 }
      );
    }
  }

  // 4) Base slots (mock schedule)
  const baseSlots = [
    { start: `${date}T10:00:00+01:00`, end: `${date}T11:00:00+01:00` },
    { start: `${date}T12:00:00+01:00`, end: `${date}T13:00:00+01:00` },
    { start: `${date}T14:00:00+01:00`, end: `${date}T15:00:00+01:00` },
  ];

  // 5) Remove slots that are already booked
  // We need to fetch bookings for this date and worker (if specified)
  // We have startsWith logic in the old one, here we can use ISO string range filters in specific if needed
  // For simplicity, let's fetch all bookings that start on this date.
  
  // Note: Comparing dates in string format from DB depends on how they are stored (timestamptz stored as UTC usually).
  // Ideally, use a range query: start_time >= dateT00:00:00 AND start_time < date+1T00:00:00
  // But our simple ISO strings in db might vary. Let's assume standard behavior.
  
  const startOfDay = `${date}T00:00:00+01:00`;
  const endOfDay = `${date}T23:59:59+01:00`;

  let query = supabase
    .from("bookings")
    .select("worker_id, start_time")
    .gte("start_time", startOfDay)
    .lte("start_time", endOfDay);

  if (workerId) {
    query = query.eq("worker_id", workerId);
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const { data: bookings, error: bookingsError } = await query as any;

  if (bookingsError) {
     return NextResponse.json(
      { ok: false, error: { code: "DB_ERROR", message: bookingsError.message } },
      { status: 500 }
    );
  }

  const availableSlots = baseSlots.filter((slot) => {
    const isTaken = bookings?.some((b) => {
      // Compare simple strings for now as they should match exactly if generated from same base slots logic
      const sameStart = b.start_time === slot.start;
      
      const matchesWorker = workerId ? b.worker_id === Number(workerId) : true;
      
      return sameStart && matchesWorker;
    });

    return !isTaken;
  });

  return NextResponse.json({
    ok: true,
    data: {
      date,
      slots: availableSlots,
    },
  });
}
