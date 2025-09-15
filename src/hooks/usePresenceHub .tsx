import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";

function usePresenceHub(queryParams: string): HubConnection | null {
  const baseURL = import.meta.env.VITE_API_URL + "/presenceHub";

  const [con, setCon] = useState<HubConnection | null>(null);

  useEffect(() => {
    // if (connection.current) return;

    const connection = new HubConnectionBuilder()
      .withUrl(baseURL + queryParams)
      .build();

    connection.onclose((err) => console.log("Socket disconnected: ", err));

    setCon(connection);

    connection
      ?.start()
      .catch((err) => console.error("Connection error: ", err));

    return () => {
      connection?.stop();
    };
  }, []);

  return con;
}

export default usePresenceHub;
