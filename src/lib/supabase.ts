
import { createClient } from '@supabase/supabase-js';

// Define fallback values for development/testing
const FALLBACK_URL = 'https://hvizhodhphttndvawcmi.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aXpob2RocGh0dG5kdmF3Y21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMjQ0MDMsImV4cCI6MjA2MDcwMDQwM30.akG0uom9a04t3rfzwpW17Gq0EmXdinU8Tfm8T2uNsxM';

// Use environment variables if available, otherwise use fallbacks
// For production, always use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key length:', supabaseAnonKey?.length);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
