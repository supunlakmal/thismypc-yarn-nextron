import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

export default function LoginPage() {
  const [email, setEmail] = useState("123@example.com");
  const [password, setPassword] = useState("123");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.name === "Login successful") {
        // Store JWT token and user ID here
        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("userId", response.data.userId);

        const socket = io("http://localhost:3001");
        console.log(socket);

        socket.emit("user login", response.data.userId);

        // router.push("/");
      } else {
        setErrorMessage("Unexpected response from server");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.name);
      } else {
        setErrorMessage("Error connecting to server");
      }
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
