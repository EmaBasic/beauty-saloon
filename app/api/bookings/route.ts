import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/bookings
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, workerId, startTime, customer, notes } = body;

    // 1) Validate required fields
    if (
      !serviceId ||
      !workerId ||
      !startTime ||
      !customer?.fullName ||
      !customer?.phone ||
      !customer?.email
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required booking fields.",
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

    // 3) Check worker exists
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

    // 4) Conflict check (same worker + same startTime)
    const { data: conflict } = await supabase
      .from("bookings")
      .select("id")
      .eq("worker_id", workerId)
      .eq("start_time", startTime)
      .single();

    if (conflict) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "SLOT_TAKEN",
            message: "Selected time slot is already booked.",
          },
        },
        { status: 409 }
      );
    }

    // 5) Create new booking
    const { data: newBooking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        service_id: Number(serviceId),
        worker_id: Number(workerId),
        start_time: startTime,
        customer_full_name: customer.fullName,
        customer_phone: customer.phone,
        customer_email: customer.email,
        notes: notes ?? "",
        status: "CONFIRMED",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "DB_ERROR", message: insertError.message },
        },
        { status: 500 }
      );
    }

    // 6) Return success
    return NextResponse.json(
      {
        ok: true,
        data: {
          bookingId: newBooking.id,
          status: "CONFIRMED",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Invalid JSON or Server Error" } },
      { status: 500 }
    );
  }
}
