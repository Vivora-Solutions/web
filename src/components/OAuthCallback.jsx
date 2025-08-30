

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";
import { PublicAPI } from "../utils/api";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const runOAuthFlow = async () => {
      try {
        const session = await getSessionOrFail();
        const user = await getUserOrFail();

        await attemptLoginOrRegister(user, session);
      } catch (error) {
        console.error("❌ OAuth Flow Error:", error);
        navigate(error.redirect || "/login?error=oauth_failed");
      }
    };

    runOAuthFlow();
  }, [navigate]);

  /** --- Helpers --- **/

  const getSessionOrFail = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log("🔐 Supabase Session:", session);

    if (error) throw { message: "Session error", redirect: "/login?error=session_failed" };
    if (!session) throw { message: "No session found", redirect: "/login?error=no_session" };

    return session;
  };

  const getUserOrFail = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("👤 Supabase User:", user);

    if (error || !user) throw { message: "User error", redirect: "/login?error=user_failed" };
    return user;
  };

  const attemptLoginOrRegister = async (user, session) => {
    try {
      await loginWithGoogle(session.access_token);
    } catch (loginError) {
      if (loginError.response?.data?.error?.includes("not found in system")) {
        console.log("🔄 User not found, registering...");
        await registerAndLogin(user, session);
      } else {
        console.error("OAuth login failed:", loginError);
        throw { redirect: "/login?error=login_failed" };
      }
    }
  };

  const loginWithGoogle = async (accessToken) => {
    const { access_token, customRole } = (
      await PublicAPI.post("/auth/google-oauth-login", { access_token: accessToken })
    ).data;

    console.log("✅ OAuth login successful!", { access_token, customRole });

    storeAuthData(access_token, customRole);
    enforceCustomerRole(customRole);
  };

  const registerAndLogin = async (user, session) => {
    const payload = {
      uid: user.id,
      email: user.email,
      first_name: user.user_metadata?.full_name?.split(" ")[0] || null,
      last_name: user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || null,
      date_of_birth: null,
      location: null,
      contact_number: null,
    };

    console.log("📦 Registration Payload:", payload);

    await PublicAPI.post("/auth/register-customer-google", payload);

    console.log("✅ OAuth registration successful!");
    await loginWithGoogle(session.access_token);
  };

  const storeAuthData = (accessToken, role) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user_role", role);
  };

  const enforceCustomerRole = (role) => {
    if (role !== "customer") {
      console.error("❌ Google Auth is only for customers");
      navigate("/login?error=invalid_google_role");
    } else {
      redirectUser(role);
    }
  };

  const redirectUser = (role) => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    const redirectPath = localStorage.getItem("redirectAfterLogin");

    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(`/${redirectPath}`);
    } else if (role === "customer") {
      navigate("/");
    } else {
      navigate("/login?error=invalid_role");
    }
  };

  /** --- UI --- **/
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Processing Google Sign-in...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-600">🔍 Check your browser console for detailed info.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
