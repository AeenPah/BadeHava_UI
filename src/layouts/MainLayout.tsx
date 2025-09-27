import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "../utils/cookiesManagement";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AXIOS from "@/lib/AxiosInstance";
import useHub from "@/hooks/useHub";
import HubProvider from "@/providers/HubContextProvider";

type TNotification = {
  eventId: number;
  type: number;
  sender: string;
  eventTime: string;
};

const EVENT = ["FriendRequest", "Block", "ChatRequest"];

function MainLayout() {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                                   useHub                                   */
  /* -------------------------------------------------------------------------- */

  const { hubConnection } = useHub();

  /* -------------------------------------------------------------------------- */
  /*                                 React Hook                                 */
  /* -------------------------------------------------------------------------- */

  const [username, setUsername] = useState<string | null>(null);
  const [notifications, setNotification] = useState<TNotification[]>([]);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      //redirect
      navigate("auth/login", { replace: true });
    } else {
      getEvents();

      setUsername(getCookie("username"));
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  function getEvents() {
    AXIOS.get("event/", {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    }).then((res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tempNotifications: TNotification[] = res.data.data.map((n: any) => {
        return {
          eventId: n.eventId,
          type: n.eventType,
          sender: n.sender.username,
          eventTime: n.createdAt,
        };
      });

      setNotification(tempNotifications);
    });
  }

  function logoutOnclick() {
    AXIOS.post("auth/logout", undefined, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
      withCredentials: true,
    }).then(() => {
      setCookie("accessToken", "", -1);
      setCookie("username", "", -1);
      window.location.reload();
    });
  }

  function responseFriendRequest(
    eventId: number,
    action: "Accept" | "Decline"
  ) {
    const data = {
      eventId: eventId,
      action: action,
    };
    AXIOS.post("event/respond-to-friend-request", data, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    }).then((res) => alert(res.data.message));
  }

  function chatRespond(
    eventId: number,
    type: "JoinChat" | "RefuseChatRequest"
  ) {
    switch (type) {
      case "JoinChat":
        hubConnection?.invoke("JoinChat", eventId);
        break;
      case "RefuseChatRequest":
        hubConnection?.invoke("RefuseChatRequest", eventId);
        break;
    }
  }

  return (
    <HubProvider>
      <div style={{ backgroundColor: "lightcoral" }} className="h-dvh">
        <div className="flex justify-between py-2 px-1">
          <div className="flex gap-2 items-center ">
            <Avatar className="size-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span>{username}</span>
          </div>

          <h4>Notifications</h4>
          {notifications.map((n, i) => (
            <div key={i} style={{ border: "1px solid black" }}>
              {EVENT[n.type]} from
              <span style={{ fontWeight: "bold" }}> {n.sender}</span>
              at <i>{n.eventTime}</i>
              <br />
              {n.type === 0 ? (
                <>
                  <button
                    onClick={() => responseFriendRequest(n.eventId, "Accept")}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => responseFriendRequest(n.eventId, "Decline")}
                  >
                    Decline
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => chatRespond(n.eventId, "JoinChat")}>
                    Let's chat
                  </button>
                  <button
                    onClick={() => chatRespond(n.eventId, "RefuseChatRequest")}
                  >
                    Refuse
                  </button>
                </>
              )}
            </div>
          ))}
          <button onClick={logoutOnclick}>Logout</button>
        </div>

        <Outlet />
      </div>
    </HubProvider>
  );
}

export default MainLayout;
