// import { useEffect } from "react";
// import supabase from "../utils/supabaseClient";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const OAuthHandler = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkSession = async () => {
//       const {
//         data: { session },
//         error: sessionError,
//       } = await supabase.auth.getSession();

//       console.log("🔐 Supabase Session:", session);
//       if (sessionError) console.error("Session error:", sessionError);

//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       console.log("👤 Supabase User:", user);
//       if (userError) console.error("User error:", userError);

//       if (user && session) {
//         await completeOAuthRegistration(user.id, session.access_token, user);
//       }
//     };

//     checkSession();
//   }, []);

//   const completeOAuthRegistration = async (userId, accessToken, user) => {
//     const payload = {
//       uid: userId,
//       email: user.email,
//       first_name: user.user_metadata?.full_name?.split(" ")[0] || null,
//       last_name:
//         user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || null,
//       date_of_birth: null,
//       location: null,
//       contact_number: null,
//     };

//     console.log("📦 Registration Payload:", payload);

//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/auth/register-customer-google",
//         payload
//       );

//       console.log(
//         "✅ OAuth registration completion successful!",
//         response.data
//       );

//       // Redirect after success
//       navigate("/profile");
//     } catch (error) {
//       console.error(
//         `❌ OAuth completion error: ${
//           error.response?.data?.error || error.message
//         }`
//       );

//       // If user already exists, redirect anyway
//       if (error.response?.data?.error?.includes("already exists")) {
//         navigate("/dashboard");
//       }
//     }
//   };

//   return (
//     <div className="mt-4 text-sm text-gray-600">
//       <p>🔍 Check your browser console for session/user info.</p>
//     </div>
//   );
// };

// export default OAuthHandler;

import { useEffect } from "react";
import supabase from "../utils/supabaseClient";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthFlow = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("🔐 Supabase Session:", session);
        if (sessionError) {
          console.error("Session error:", sessionError);
          navigate("/login?error=session_failed");
          return;
        }

        if (!session) {
          console.error("No session found");
          navigate("/login?error=no_session");
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        console.log("👤 Supabase User:", user);
        if (userError || !user) {
          console.error("User error:", userError);
          navigate("/login?error=user_failed");
          return;
        }

        // Try to login first (for existing users)
        try {
          const loginResponse = await axios.post(
            "http://localhost:3000/api/auth/google-oauth-login",
            {
              access_token: session.access_token,
            }
          );

          const { access_token, customRole } = loginResponse.data;

          console.log("✅ OAuth login successful!", loginResponse.data);

          // Store tokens (same as regular login)
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("user_role", customRole);

          // Redirect based on role
          redirectUserBasedOnRole(customRole);
        } catch (loginError) {
          // If login fails, user might not be registered yet
          if (
            loginError.response?.data?.error?.includes("not found in system")
          ) {
            console.log("🔄 User not found, attempting registration...");
            await handleNewUserRegistration(user, session);
          } else {
            console.error("OAuth login failed:", loginError);
            navigate("/login?error=login_failed");
          }
        }
      } catch (error) {
        console.error("OAuth flow error:", error);
        navigate("/login?error=oauth_failed");
      }
    };

    handleOAuthFlow();
  }, [navigate]);

  const handleNewUserRegistration = async (user, session) => {
    const payload = {
      uid: user.id,
      email: user.email,
      first_name: user.user_metadata?.full_name?.split(" ")[0] || null,
      last_name:
        user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || null,
      date_of_birth: null,
      location: null,
      contact_number: null,
    };

    console.log("📦 Registration Payload:", payload);

    try {
      const registrationResponse = await axios.post(
        "http://localhost:3000/api/auth/register-customer-google",
        payload
      );

      console.log(
        "✅ OAuth registration successful!",
        registrationResponse.data
      );

      // After successful registration, attempt login
      const loginResponse = await axios.post(
        "http://localhost:3000/api/auth/google-oauth-login",
        {
          access_token: session.access_token,
        }
      );

      const { access_token, customRole } = loginResponse.data;

      // Store tokens
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user_role", customRole);

      // Redirect based on role
      redirectUserBasedOnRole(customRole);
    } catch (error) {
      console.error("OAuth registration/login failed:", error);
      navigate("/login?error=registration_failed");
    }
  };

  const redirectUserBasedOnRole = (role) => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");

    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(`/${redirectPath}`);
    } else if (role === "salon_admin") {
      navigate("/admin");
    } else if (role === "super_admin") {
      navigate("/super-admin");
    } else if (role === "customer") {
      navigate("/");
    } else {
      navigate("/login?error=invalid_role");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          Processing Google Sign-in...
        </h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-600">
          🔍 Check your browser console for detailed info.
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
