import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Info, 
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
  const navigate = useNavigate();

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
