import React, { useState, useEffect, createContext, useContext } from "react";
import { loginUser, registerUser, getUserProfile } from "../services/authService";
import axios from "axios";

interface AuthContextType {
  user: any;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  refreshUser: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getUserProfile(token);
          if (res.success) {
            // Re-attach the token to the user object since /me doesn't return it
            setUser({ ...res.data, token });
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (credentials: any) => {
    try {
      const data = await loginUser(credentials);
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.data.token}`;
        setUser(data.data);
        return data.data;
      }
      return false;
    } catch (e: any) {
      throw e.response?.data?.message || "Login failed";
    }
  };

  const register = async (userData: any) => {
    try {
      const data = await registerUser(userData);
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.data.token}`;
        setUser(data.data);
        return data.data;
      }
      return false;
    } catch (e: any) {
      console.error("Registration Error Context:", e);
      // Better error extraction for structured responses
      const response = e.response?.data;
      if (response?.errors && Array.isArray(response.errors)) {
        throw response.errors.map((err: any) => err.message).join(", ");
      }
      throw response?.message || e.message || "Registration failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await getUserProfile(token);
        if (res.success) {
          setUser({ ...res.data, token });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>   
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
