// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://tfnzysccexealpxvtmdx.supabase.co";
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbnp5c2NjZXhlYWxweHZ0bWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDgzNzgsImV4cCI6MjA2ODQ4NDM3OH0.BDB3JHId02YVlk5dIrwZ-AB_mRns6_KSA6j5bbXi3zY";

// const supabase = createClient(supabaseUrl, supabaseKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: true,
//   },
// });

// export default supabase;


import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
