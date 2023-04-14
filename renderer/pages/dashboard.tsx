// renderer/pages/index.tsx

import { useCallback, useEffect, useState } from "react";
import { getHDDList } from "../utils/utils";
import { machineIdSync } from "node-machine-id";
import { io } from "socket.io-client";

export default function DashBoard() {
  const [hDDList, sethDDList] = useState();
  const [pcKey, setPcKey] = useState<string | null>(null);
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("jwt") as string;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);
  }, []);

  const gethDDList = useCallback(async () => {
    const hDDList = await getHDDList();
    sethDDList(hDDList);
  }, []);

  useEffect(() => {
    gethDDList();

    const computerID = machineIdSync(true);
    const computerID2 = machineIdSync();
    const computerKey = `${computerID2} ${computerID}`;
    setPcKey(computerKey);
  }, []);

  useEffect(() => {
    pcKey &&
      token &&
      userId &&
      socket.emit("joinFromApp", {
        data: {
          userId,
          token,

          pcKey,
        },
      });
  }, [pcKey, socket, token, userId]);
  console.log({ pcKey, socket, token, userId });

  return (
    <div>
      <h1>Dash Board</h1>
    </div>
  );
}
