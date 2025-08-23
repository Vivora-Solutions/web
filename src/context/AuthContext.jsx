// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { ProtectedAPI } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = async () => {
    try {
      const res = await ProtectedAPI.get("/auth/me");
      setUser(res.data);
    } catch {// Only set user to false if it's a real auth error, not network error
      if (error.response?.status === 401) {
        setUser(false);
      }
      // For other errors, don't change user state to avoid loops
    } finally {
      setLoading(false);
  }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
