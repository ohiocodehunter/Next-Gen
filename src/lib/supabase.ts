import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kllvojaioqlmrdcqozqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbHZvamFpb3FsbXJkY3FvenF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzYxNDYsImV4cCI6MjA1Nzk1MjE0Nn0.SJ3m4UHcDqrkuylRQCQWSPjQPfl0eLm7I82pwVH0d88';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);