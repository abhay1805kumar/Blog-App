import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import "./Header.css";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-zinc-800 bg-zinc-900 text-zinc-200">

      <Link to="/" className="text-2xl font-bold text-blue-500">
        Blog Application
      </Link>

      <nav className="flex items-center gap-6">

        {username && (
          <>
            <Link
              to="/create"
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
            >
              Create new post
            </Link>

            <button
              onClick={logout}
              className="text-zinc-300 hover:text-white"
            >
              Logout ({username})
            </button>
          </>
        )}

        {!username && (
          <>
            <Link className="text-zinc-300 hover:text-white" to="/login">
              Login
            </Link>
            <Link className="text-zinc-300 hover:text-white" to="/register">
              Register
            </Link>
          </>
        )}

      </nav>
    </header>
  );
}
