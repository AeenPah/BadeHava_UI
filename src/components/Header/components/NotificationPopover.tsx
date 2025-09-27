import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useHub from "@/hooks/useHub";
import AXIOS from "@/lib/AxiosInstance";
import { getCookie } from "@/utils/cookiesManagement";
import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";

type TNotification = {
  eventId: number;
  type: number;
  sender: string;
  eventTime: string;
};

const EVENT = ["FriendRequest", "Block", "ChatRequest"];

function NotificationPopover() {
  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [notifications, setNotification] = useState<TNotification[]>([]);

  useEffect(() => {
    getEvents();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                   useHub                                   */
  /* -------------------------------------------------------------------------- */

  const { hubConnection } = useHub();

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
    <Popover>
      <PopoverTrigger>
        <Button variant="secondary" size="icon">
          <BellIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
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
            <hr />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default NotificationPopover;
