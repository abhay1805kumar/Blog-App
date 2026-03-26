import { createContext, useState, useEffect } from "react";

// ✅ Render backend URL
const API = "https://blog-app-zptr.onrender.com";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});

  // ✅ get profile on load
  useEffect(() => {
    fetch(`${API}/profile`, {
      credentials: "include", // IMPORTANT
    })
      .then((res) => res.json())
      .then((userInfo) => {
        setUserInfo(userInfo);
      })
      .catch((err) => console.log("profile fetch error", err));
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}