import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { 
  Mail, 
  AlertCircle, 
  CheckCircle,  
  Eye, 
  EyeOff, 
  Loader2, 
  RefreshCw, 
  Clock, 
  XCircle 
} from "lucide-react";

import logo from "../../assets/weblogo-white1.png";

import Header from "../User/components/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);
  
  // Check for stored auth errors and handle Google Auth callback
  useEffect(() => {
    const storedError = localStorage.getItem("authError");
    const storedErrorType = localStorage.getItem("authErrorType");
    
    if (storedError) {
      setError(storedError);
      setErrorType(storedErrorType || "error");
      
      // Clear the stored error after retrieving
      localStorage.removeItem("authError");
      localStorage.removeItem("authErrorType");
    }
    
    // Check for URL error parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get("error");
    
    if (urlError === "oauth_failed" && !storedError) {
      setError("Failed to sign in with Google. Please try again or use email sign-in.");
      setErrorType("error");
    }

    // Handle potential return from Google OAuth
    const checkSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }
        
        // If we have a session and user after OAuth flow
        if (sessionData?.session?.user) {
          // Set loading state to show user something is happening
          setLoading(true);
          
          try {
            const role = await getUserRole(sessionData.session.user.id);
            localStorage.setItem("user_role", role);

            const redirectPath = localStorage.getItem("redirectAfterLogin");

            if (redirectPath) {
              localStorage.removeItem("redirectAfterLogin");
              window.location.replace(`/${redirectPath}`);
            } else if (role === "salon_admin") {
              window.location.replace("/admin");
            } else if (role === "super_admin") {
              window.location.replace("/super-admin");
            } else if (role === "customer") {
              window.location.replace("/");
            } else {
              setError("Invalid user role. Please contact support.");
              setErrorType("error");
              setLoading(false);
            }
          } catch (roleError) {
            console.error("Error getting user role:", roleError);
            setError("Failed to get user role. Please try again.");
            setErrorType("error");
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, []);
  
  async function getUserRole(userId) {
    const { data, error } = await supabase
      .from("user")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Role fetch error:", error.message);
      return null;
    }
    console.log("User role:", data.role);
    return data.role;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrorType("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const errorMessage = error.message;
        
        // Categorize different types of errors
        if (errorMessage.toLowerCase().includes("email not confirmed") || 
            errorMessage.toLowerCase().includes("email confirmation") ||
            errorMessage.toLowerCase().includes("confirm your email")) {
          setError("Your email address hasn't been confirmed yet. Please check your email and click the confirmation link to activate your account.");
          setErrorType("email_confirmation");
        } else if (errorMessage.toLowerCase().includes("invalid credentials") ||
                   errorMessage.toLowerCase().includes("wrong password") ||
                   errorMessage.toLowerCase().includes("incorrect password")) {
          setError("Invalid email or password. Please check your credentials and try again.");
          setErrorType("credentials");
        } else if (errorMessage.toLowerCase().includes("too many requests") ||
                   errorMessage.toLowerCase().includes("rate limit")) {
          setError("Too many login attempts. Please wait a few minutes before trying again.");
          setErrorType("rate_limit");
        } else {
          setError(errorMessage);
          setErrorType("error");
        }
        return;
      }

      const role = await getUserRole(data.user.id);
      localStorage.setItem("user_role", role);

      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        window.location.replace(`/${redirectPath}`);
      } else if (role === "salon_admin") {
        window.location.replace("/admin");
      } else if (role === "super_admin") {
        window.location.replace("/super-admin");
      } else if (role === "customer") {
        window.location.replace("/");
      } else {
        setError("Invalid user role. Please contact support.");
        setErrorType("error");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setErrorType("error");
    } finally {
      setLoading(false);
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      setErrorType("error");
      return;
    }

    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setError(`Failed to resend confirmation email: ${error.message}`);
        setErrorType("error");
      } else {
        setError("Confirmation email sent! Please check your inbox and spam folder.");
        setErrorType("success");
      }
    } catch (error) {
      setError("Failed to resend confirmation email. Please try again.");
      setErrorType("error");
    } finally {
      setResendingEmail(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    setErrorType("");
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/oauth-callback`,
        },
      });
      
      if (error) {
        setError(`Google sign-in failed: ${error.message}`);
        setErrorType("error");
        setLoading(false);
      }
      // Don't need to handle success here as the OAuth process will redirect to the callback URL
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to connect with Google. Please try again or use email sign-in.");
      setErrorType("error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 to-white-100">
      <Header />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <img
              src={logo}
              alt="Logo"
              className="mx-auto h-16 w-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className={`p-4 rounded-lg border flex items-start space-x-3 ${
            errorType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : errorType === 'email_confirmation'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : errorType === 'credentials'
              ? 'bg-red-50 border-red-200 text-red-800'
              : errorType === 'rate_limit'
              ? 'bg-orange-50 border-orange-200 text-orange-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex-shrink-0">
              {errorType === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : errorType === 'email_confirmation' ? (
                <Mail className="h-5 w-5 text-amber-500" />
              ) : errorType === 'credentials' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : errorType === 'rate_limit' ? (
                <Clock className="h-5 w-5 text-orange-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{error}</p>
              {errorType === 'email_confirmation' && (
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resendingEmail}
                  className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-900 underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <RefreshCw className={`h-4 w-4 ${resendingEmail ? 'animate-spin' : ''}`} />
                  <span>{resendingEmail ? 'Sending...' : 'Resend confirmation email'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-4 mb-6 flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-medium">Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span className="font-medium">Sign in with Google</span>
            </>
          )}
        </button>


        <h1 className="text-center text-2xl font-semibold mb-4">Or</h1>


        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-brown-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-brown-500 transition-colors pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-black to-[#8B4513] text-white 
             py-3 px-4 rounded-lg 
             hover:from-[#8B4513] hover:to-black 
             focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2 
             transition-all duration-200 font-medium 
             disabled:opacity-50 disabled:cursor-not-allowed 
             flex items-center justify-center space-x-2"
>
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="font-medium text-brown-600 hover:text-brown-500 transition-colors">
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
