import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { machineIdSync } from "node-machine-id";
import md5 from "md5";
import os from "os";
export default function LoginPage() {
  const [email, setEmail] = useState("123@example.com");
  const [password, setPassword] = useState("321");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const [pcKey, setPcKey] = useState<string | null>(null);

  const pcUser = os.userInfo();
  const platform = os.type() + " " + os.platform();

  useEffect(() => {
    const computerID = machineIdSync(true);
    const computerID2 = machineIdSync();
    const computerKey = `${computerID2} ${computerID}`;
    setPcKey(computerKey);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setErrorMessage("");

      try {
        const response = await axios.post(
          "http://localhost:3000/api/user/login",
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

          const pcGet = await axios.get(
            `http://localhost:3000/api/pckey/${md5(pcKey)}`,
            {
              headers: {
                Authorization: `Bearer ${response.data.token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (pcGet?.status !== 200) {
            const addNewPc = await axios.post(
              `http://localhost:3000/api/user/${response.data.userId}/pc`,
              {
                pcKey: md5(pcKey),
                pcName: pcUser.username,
                platform,
                publicAccessKey: "unique_public_access_key",
                pcOnline: 1,
                pcSocketID: "socket_id",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${response.data.token}`,
                },
              }
            );
          }

          const socket = io("http://localhost:3001");

          socket.emit("user login", {
            userId: response.data.userId,
            token: response.data.token,
          });

          router.push("/dashboard");
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
    },
    [pcKey]
  );
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
