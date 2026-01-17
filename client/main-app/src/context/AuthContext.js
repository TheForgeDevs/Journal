import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function getInitialUser() {
  try {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && userData !== "undefined") {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error reading auth data:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [loading] = useState(false);

  const login = (userData, token) => {
    if (!userData || !token) return;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
