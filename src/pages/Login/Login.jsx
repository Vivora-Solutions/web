import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle, Info } from "lucide-react";

import { PublicAPI } from "../../utils/api";
import Header from "../User/components/Header";
import supabase from "../../utils/supabaseClient";


const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
    if (location.state?.password) setPassword(location.state.password);
  }, [location.state]);

  // Function to handle resending confirmation email
  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      setErrorType("input");
      return;
    }

    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setError("Confirmation email sent successfully! Please check your inbox and spam folder.");
      setErrorType("success");
    } catch (err) {
      console.error("Error resending confirmation:", err);
      setError("Failed to resend confirmation email. Please try again later.");
      setErrorType("error");
    } finally {
      setResendingEmail(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setErrorType("");
    setLoading(true);

    try {
      const response = await PublicAPI.post("/auth/login", {
        email,
        password,
      });

      const { access_token, customRole } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user_role", customRole);

      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        window.location.replace(`/${redirectPath}`);
      } else if (customRole === "salon_admin") {
        window.location.replace("/admin");
      } else if (customRole === "super_admin") {
        window.location.replace("/super-admin");
      } else if (customRole === "customer") {
        window.location.replace("/");
      } else {
        setError("Invalid user role. Please contact support.");
        setErrorType("error");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.error || "Login failed. Please try again.";
      
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${window.location.origin}/oauth-callback`
                },
              })
            }
            className="mt-4 mb-6 flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-300"
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="font-medium">Sign in with Google</span>
          </button>
          
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-3 rounded-md border border-gray-300 text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-3 rounded-md border border-gray-300 text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-3 rounded-md transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && (
            <div className={`mt-4 p-4 rounded-lg border ${
              errorType === "success" 
                ? "bg-green-50 border-green-200" 
                : errorType === "email_confirmation"
                ? "bg-blue-50 border-blue-200"
                : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {errorType === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : errorType === "email_confirmation" ? (
                    <Mail className="h-5 w-5 text-blue-500" />
                  ) : errorType === "credentials" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Info className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    errorType === "success" 
                      ? "text-green-800" 
                      : errorType === "email_confirmation"
                      ? "text-blue-800"
                      : "text-red-800"
                  }`}>
                    {errorType === "email_confirmation" ? "Email Confirmation Required" :
                     errorType === "credentials" ? "Login Failed" :
                     errorType === "success" ? "Success!" :
                     "Error"}
                  </p>
                  <p className={`text-sm mt-1 ${
                    errorType === "success" 
                      ? "text-green-700" 
                      : errorType === "email_confirmation"
                      ? "text-blue-700"
                      : "text-red-700"
                  }`}>
                    {error}
                  </p>
                  
                  {errorType === "email_confirmation" && (
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleResendConfirmation}
                        disabled={resendingEmail}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Mail className="h-4 w-4" />
                        {resendingEmail ? "Sending..." : "Resend Confirmation Email"}
                      </button>
                      <div className="text-xs text-blue-600 mt-2 sm:mt=0 sm:self-center">
                        Didn't receive the email? Check your spam folder.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="mt-5 text-sm">
            Not a member?{" "}
            <a href="/signup" className="text-gray-900 font-medium underline">
              Register Now
            </a>
          </p>
          <p className="my-3 text-gray-500">Or</p>

          <p>
            <a
              href="/salon-register"
              className="text-gray-900 font-medium underline"
            >
              Register As a Salon
            </a>
          </p>
          
          

        </div>
      </div>
    </div>
  );
};

export default Login;
