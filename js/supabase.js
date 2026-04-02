// ===== Supabase Client =====
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://jkzdixvnaroqbnxmjpnn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpremRpeHZuYXJvcWJueG1qcG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjAxODcsImV4cCI6MjA4OTczNjE4N30.NbDYAhcs5NsFrtpDReATfdDosnoY_1AcpIzjOnvmdA8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
