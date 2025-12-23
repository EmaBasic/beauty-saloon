"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2, Loader2, Sparkles, User, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Service {
  id: number;
  name: string;
  duration_min: number;
  price: number;
}

interface Worker {
  id: number;
  display_name: string;
}

interface Slot {
  start: string;
  end: string;
}

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  // Selection state
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("any");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>(""); // ISO string
  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resParams, resWorkers] = await Promise.all([
          fetch("/api/services").then((r) => r.json()),
          fetch("/api/workers").then((r) => r.json()),
        ]);

        if (resParams.ok) setServices(resParams.data);
        if (resWorkers.ok) setWorkers(resWorkers.data);
      } catch (e) {
        console.error("Failed to fetch data", e);
      }
    };
    fetchData();
  }, []);

  // Fetch slots when date/service/worker changes
  useEffect(() => {
    if (!selectedDate || !selectedServiceId) return;

    const fetchSlots = async () => {
      setLoading(true);
      setSlots([]);
      try {
        // Format date as YYYY-MM-DD for API
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        
        const query = new URLSearchParams({
          date: dateStr,
          serviceId: selectedServiceId,
        });
        if (selectedWorkerId && selectedWorkerId !== "any") {
          query.append("workerId", selectedWorkerId);
        }

        const res = await fetch(`/api/availability?${query.toString()}`);
        const data = await res.json();
        if (data.ok) {
          setSlots(data.data.slots);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedServiceId, selectedWorkerId]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: Number(selectedServiceId),
          workerId: selectedWorkerId === "any" ? Number(workers[0]?.id) : Number(selectedWorkerId), // quickfix for "any" logic in backend if strictly required, ideally backend handles "assign any available"
          startTime: selectedTime,
          customer,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setStep(4);
      } else {
        setMessage(data.error?.message || "Booking failed.");
      }
    } catch (e) {
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getServiceName = (id: string) => services.find(s => s.id.toString() === id)?.name;

  if (step === 4) {
    return (
      <Card className="w-full max-w-lg mx-auto border-green-200 shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">Booking Confirmed!</CardTitle>
          <CardDescription>
            We can&apos;t wait to see you, {customer.fullName}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-2 text-sm text-gray-600">
          <p>You will receive a confirmation email at <strong>{customer.email}</strong> shortly.</p>
        </CardContent>
        <CardFooter className="justify-center">
           <Button 
            onClick={() => {
              setStep(1);
              setSelectedServiceId("");
              setSelectedWorkerId("any");
              setSelectedDate(undefined);
              setSelectedTime("");
              setCustomer({ fullName: "", phone: "", email: "" });
            }}
            variant="outline"
          >
            Book Another Appointment
           </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-t-4 border-t-black">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
           <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Step {step} of 3</span>
           {step > 1 && (
             <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
               Back
             </Button>
           )}
        </div>
        <CardTitle className="text-2xl flex items-center gap-2">
          {step === 1 && <><Sparkles className="w-5 h-5" /> Select Service</>}
          {step === 2 && <><CalendarIcon className="w-5 h-5" /> Date & Time</>}
          {step === 3 && <><User className="w-5 h-5" /> Your Details</>}
        </CardTitle>
        <CardDescription>
          {step === 1 && "Choose the treatment you deserve."}
          {step === 2 && "Find a time that works for you."}
          {step === 3 && "Tell us who is coming."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {message && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
              <X className="w-4 h-4" /> {message}
            </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Service</Label>
              <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a treatment" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      <div className="flex justify-between w-full min-w-[200px] items-center gap-4">
                        <span>{s.name}</span>
                        <span className="text-muted-foreground text-xs">{s.price} € • {s.duration_min} min</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Specialist</Label>
              <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Anyone available" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Anyone Available</SelectItem>
                  {workers.map((w) => (
                    <SelectItem key={w.id} value={w.id.toString()}>
                      {w.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {
                       setSelectedDate(d);
                       setSelectedTime("");
                    }}
                    disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
               <Label className="mb-2 block">Available Slots</Label>
               {loading && (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Checking availability...
                 </div>
               )}
               
               {!loading && selectedDate && slots.length === 0 && (
                 <p className="text-sm text-muted-foreground text-center py-4">No slots available on this date.</p>
               )}

               {!loading && selectedDate && slots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {slots.map((slot) => {
                      const isActive = selectedTime === slot.start;
                      const timeLabel = format(new Date(slot.start), "HH:mm");
                      return (
                        <Button
                          key={slot.start}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(slot.start)}
                          className={cn("w-full transition-all", isActive && "ring-2 ring-offset-1 ring-black")}
                        >
                          {timeLabel}
                        </Button>
                      )
                    })}
                  </div>
               )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
             <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="Jane Doe" 
                    value={customer.fullName}
                    onChange={(e) => setCustomer({...customer, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    placeholder="+387 60 000 000" 
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    placeholder="jane@example.com" 
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  />
                </div>
             </div>

             <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{getServiceName(selectedServiceId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                     {selectedDate && selectedTime ? format(new Date(selectedTime), "PPP 'at' HH:mm") : "-"}
                  </span>
                </div>
             </div>
          </div>
        )}

      </CardContent>
      <CardFooter>
        {step === 1 && (
           <Button className="w-full" onClick={() => setStep(2)} disabled={!selectedServiceId}>
             Continue
           </Button>
        )}
        {step === 2 && (
           <Button className="w-full" onClick={() => setStep(3)} disabled={!selectedTime}>
             Continue
           </Button>
        )}
        {step === 3 && (
           <Button className="w-full" onClick={handleSubmit} disabled={loading || !customer.fullName || !customer.phone}>
             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             Confirm Booking
           </Button>
        )}
      </CardFooter>
    </Card>
  );
}
