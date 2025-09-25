import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookiesManagement";

function usePresenceHub(): HubConnection | null {
  const accessToken = getCookie("accessToken");
  const url =
    import.meta.env.VITE_API_URL +
    "/presenceHub" +
    `?accessToken=${accessToken}`;

  const [con, setCon] = useState<HubConnection | null>(null);

  useEffect(() => {
    const connection = new HubConnectionBuilder().withUrl(url).build();

    connection.onclose((err) => console.log("Socket disconnected: ", err));

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        setCon(connection);
      })
      .catch((err) => console.error("Connection error: ", err));

    return () => {
      connection?.stop();
    };
  }, []);

  return con;
}

export default usePresenceHub;
