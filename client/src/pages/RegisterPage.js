import { useState } from "react";
import "./openingPage.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("registration successful");
    } else {
      alert("registration failed");
    }
  }
  return (
    <div className="flex-col items-center">
      <div>
        <p className="welcome text-center">Start Blogging Here</p>
      </div>
      <form className="login p-20 items-center flex-col" onSubmit={register}>
        <div className="items-center justify-center flex-col p-8 ">
          <p className="loginHeader h-10 text-3xl font-bold  text-center mb-2">
            Register
          </p>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            className="my-4 border-t-0 border-r-0 border-l-0 border-b border-gray-400 px-4 py-2 focus:outline-none focus:border-gray-500 focus:border-b-2"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="my-4 border-t-0 border-r-0 border-l-0 border-b border-gray-400 px-4 py-2 focus:outline-none focus:border-gray-500 focus:border-b-2"
          />
          <button className="h-10 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
