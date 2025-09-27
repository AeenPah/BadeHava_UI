import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookiesManagement";

// type THubEventHandler = {
//   event: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   handler: (data: any) => void;
// };

function usePresenceHub(): HubConnection | null {
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const url =
      import.meta.env.VITE_API_URL +
      "/presenceHub" +
      `?accessToken=${accessToken}`;

    const connection = new HubConnectionBuilder().withUrl(url).build();

    connection.onclose((err) => console.log("Socket disconnected: ", err));

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        setHubConnection(connection);

        // handlers.forEach(({ handler, event }) => {
        //   connection.off(event);
        //   connection.on(event, handler);
        // });
      })
      .catch((err) => console.error("Connection error: ", err));

    return () => {
      connection?.stop();
    };
  }, []);

  return hubConnection;
}

export default usePresenceHub;
