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
import NotificationItem from "./NotificationItem";
import type { TUser } from "@/types/User";

export type TNotification = {
  eventId: number;
  eventType: number;
  status: number;
  sender: TUser;
  seen: boolean;
  createdAt: string;
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
          eventType: n.eventType,
          sender: n.sender,
          createdAt: n.createdAt,
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

    setNotification((prev) => prev.filter((p) => p.eventId !== eventId));
  }

  function chatRespond(
    eventId: number,
    type: "AcceptChatRequest" | "RefuseChatRequest"
  ) {
    switch (type) {
      case "AcceptChatRequest":
        hubConnection?.invoke("AcceptChatRequest", eventId);
        break;
      case "RefuseChatRequest":
        hubConnection?.invoke("RefuseChatRequest", eventId);
        break;
    }
    setNotification((prev) => prev.filter((p) => p.eventId !== eventId));
  }
  return (
    <Popover>
      <PopoverTrigger>
        <Button className="relative" variant="secondary" size="icon">
          <BellIcon />
          {notifications.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 rounded-full bg-red-400 text-white text-xs h-4 w-4 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {notifications.length === 0 ? (
          <div>There is no Notifications!</div>
        ) : (
          notifications.map((n, i) => (
            <NotificationItem
              key={i}
              notification={n}
              onFriendRespond={responseFriendRequest}
              onChatRespond={chatRespond}
              labelMap={EVENT}
            />
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NotificationPopover;
