import axios from "axios";
import { supabase } from "./supabaseClient";

const BASE_URL = "http://localhost:3000/api";  
//const BASE_URL = "http://13.48.10.1/api";
// const BASE_URL = "http://192.168.158.190:3000/api";
//const BASE_URL = "/api";
// const BASE_URL = "http://10.10.23.48:3000/api";
//const BASE_URL = 'https://backend-2-o7e5.onrender.com/api';

// For protected routes
const ProtectedAPI = axios.create({
  baseURL: BASE_URL,
});

ProtectedAPI.interceptors.request.use(async (req) => {
  try {
    // Get the current session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting Supabase session:', error);
      return req;
    }

    if (session?.access_token) {
      req.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      // Fallback: try to get token from localStorage (Supabase auth token)
      const supabaseAuthKey = Object.keys(localStorage).find(key => 
        key.includes('sb-') && key.includes('auth-token')
      );
      
      if (supabaseAuthKey) {
        try {
          const authData = JSON.parse(localStorage.getItem(supabaseAuthKey));
          if (authData?.access_token) {
            req.headers.Authorization = `Bearer ${authData.access_token}`;
          }
        } catch (parseError) {
          console.error('Error parsing Supabase auth token:', parseError);
        }
      }
    }
  } catch (error) {
    console.error('Error in ProtectedAPI interceptor:', error);
  }
  
  return req;
});

// For public routes (no auth token needed)
const PublicAPI = axios.create({
  baseURL: BASE_URL,
});

export { ProtectedAPI, PublicAPI };



















