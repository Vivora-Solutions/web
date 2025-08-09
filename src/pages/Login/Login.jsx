import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { PublicAPI } from "../../utils/api";
import Header from "../User/components/Header";
import supabase from "../../utils/supabaseClient";
// Remove unused import

const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
    if (location.state?.password) setPassword(location.state.password);
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
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
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Login failed. Please try again.");
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

          {error && <p className="text-red-600 mt-3">{error}</p>}

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
          
          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: "http://localhost:5173/oauth-callback", // same as Supabase setting
                },
              })
            }
            className="mt-4 flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-300"
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="font-medium">Sign in with Google</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Login;
