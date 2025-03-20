"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  // Load token from localStorage when component mounts (Client-Side Only)
  useEffect(() => {
    
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");

    console.log("📦 Loading from localStorage:", { savedToken, savedUsername });

    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + savedToken;
    }

    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      console.warn("⚠️ Username is missing from localStorage");
    }
  }, []);

  // Function to log in (set token)
  const login = (newToken, newUsername) => {
    console.log("🔐 Logging in:", { newToken, newUsername }); // Debug log
    if (!newUsername) {
      console.error("❌ Username is undefined during login!");
      return;
    }  
    setToken(newToken);
    setUsername(newUsername);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    console.log("📦 Saved to localStorage:", {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
    });
    axios.defaults.headers.common["Authorization"] = "Bearer " + newToken;
  };

  // Function to log out (remove token)
  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
