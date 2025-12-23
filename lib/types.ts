export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: number;
          service_id: number | null;
          worker_id: number | null;
          start_time: string;
          customer_full_name: string;
          customer_phone: string;
          customer_email: string;
          notes: string | null;
          status: string;
        };
        Insert: {
          id?: number;
          service_id?: number | null;
          worker_id?: number | null;
          start_time: string;
          customer_full_name: string;
          customer_phone: string;
          customer_email: string;
          notes?: string | null;
          status?: string;
        };
        Update: {
          id?: number;
          service_id?: number | null;
          worker_id?: number | null;
          start_time?: string;
          customer_full_name?: string;
          customer_phone?: string;
          customer_email?: string;
          notes?: string | null;
          status?: string;
        };
      };
      services: {
        Row: {
          id: number;
          category: string;
          name: string;
          duration_min: number;
          price: number;
        };
        Insert: {
          id?: number;
          category: string;
          name: string;
          duration_min: number;
          price: number;
        };
        Update: {
          id?: number;
          category?: string;
          name?: string;
          duration_min?: number;
          price?: number;
        };
      };
      workers: {
        Row: {
          id: number;
          display_name: string;
        };
        Insert: {
          id?: number;
          display_name: string;
        };
        Update: {
          id?: number;
          display_name?: string;
        };
      };
    };
  };
}
