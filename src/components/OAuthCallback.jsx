import { useEffect, useRef } from "react";
import { supabase } from "../utils/supabaseClient";

const OAuthCallback = () => {
  const hasRedirected = useRef(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (hasRedirected.current) return;

      try {
        // Get the current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          redirectToLogin("Failed to get session. Please try again.");
          return;
        }

        if (!session) {
          redirectToLogin("No session found. Please try logging in again.");
          return;
        }

        // Get the user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("User error:", userError);
          redirectToLogin("Failed to get user information. Please try again.");
          return;
        }

        // Get user role from database
        const { data: userData, error: roleError } = await supabase
          .from("user")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleError) {
          // If user doesn't exist in the 'user' table, auto-register them as a customer
          if (
            roleError.message.includes("No rows found") ||
            roleError.code === "PGRST116"
          ) {
            try {
              console.log("New OAuth user detected, auto-registering...", {
                userId: user.id,
                email: user.email,
                userMetadata: user.user_metadata,
              });

              // Auto-register the OAuth user as a customer
              const response = await fetch(
                "http://localhost:3000/api/auth/register-customer-google",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    uid: user.id,
                    email: user.email,
                    first_name:
                      user.user_metadata?.full_name?.split(" ")[0] ||
                      user.user_metadata?.name?.split(" ")[0] ||
                      "New",
                    last_name:
                      user.user_metadata?.full_name
                        ?.split(" ")
                        .slice(1)
                        .join(" ") ||
                      user.user_metadata?.name?.split(" ").slice(1).join(" ") ||
                      "User",
                    contact_number: user.phone || "",
                  }),
                }
              );

              const registrationResult = await response.json();

              if (!response.ok) {
                console.error("Registration failed:", registrationResult);
                throw new Error(
                  registrationResult.message || "Auto-registration failed"
                );
              }

              console.log("Auto-registration successful:", registrationResult);

              // If registration was successful or user already existed, set role as customer and continue
              const userRole = registrationResult.role || "customer";
              localStorage.setItem("user_role", userRole);

              // Redirect based on role
              const redirectPath = localStorage.getItem("redirectAfterLogin");

              if (redirectPath) {
                localStorage.removeItem("redirectAfterLogin");
                redirectUser(`/${redirectPath}`);
              } else if (userRole === "salon_admin") {
                redirectUser("/admin");
              } else if (userRole === "super_admin") {
                redirectUser("/super-admin");
              } else {
                redirectUser("/");
              }
              return;
            } catch (registrationError) {
              console.error("Auto-registration failed:", registrationError);
              redirectToLogin(
                "Failed to set up your account. Please try again or contact support."
              );
              return;
            }
          } else {
            console.error("Role fetch error:", roleError);
            redirectToLogin("Failed to get user role. Please try again.");
          }
          return;
        }

        // Store user role and redirect
        localStorage.setItem("user_role", userData.role);

        // Redirect based on role
        const redirectPath = localStorage.getItem("redirectAfterLogin");

        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin");
          redirectUser(`/${redirectPath}`);
        } else if (userData.role === "salon_admin") {
          redirectUser("/admin");
        } else if (userData.role === "super_admin") {
          redirectUser("/super-admin");
        } else if (userData.role === "customer") {
          redirectUser("/");
        } else {
          redirectToLogin("Invalid user role. Please contact support.");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        redirectToLogin("An error occurred during sign in. Please try again.");
      }
    };

    handleOAuthCallback();
  }, []);

  const redirectToLogin = (errorMessage) => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    localStorage.setItem("authError", errorMessage);
    localStorage.setItem("authErrorType", "error");
    window.location.replace("/login");
  };

  const redirectUser = (path) => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    window.location.replace(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brown-50 to-brown-100 p-4 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-black to-[#8B4513] opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-black to-[#8B4513] opacity-10"></div>
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-[#8B4513] opacity-5"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-black opacity-5"></div>

      {/* Main content card */}
      <div className="z-10 bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full border border-gray-100">
        <div className="text-center">
          {/* Google Logo with pulsing effect */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-gray-100 animate-pulse"></div>
            <div className="relative z-10 bg-white rounded-full p-4 shadow-md w-24 h-24 mx-auto flex items-center justify-center">
              <svg
                width="40"
                height="40"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Authentication in Progress
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 mb-8 text-lg">
            We're securely authenticating your Google account
          </p>

          {/* Progress indicators */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700">
                Connecting to Google
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700">
                Verifying credentials
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mr-3"></div>
              <span className="text-sm text-blue-700 font-medium">
                Setting up your session
              </span>
            </div>
          </div>

          {/* Loading bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-black to-[#8B4513] h-1.5 rounded-full animate-pulse"
              style={{ width: "75%" }}
            ></div>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-500 italic">
            You'll be automatically redirected once the authentication is
            complete.
            <br />
            Please do not close this window.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
