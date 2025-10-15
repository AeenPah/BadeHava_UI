import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useHub from "@/hooks/useHub";
import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import type { TUser } from "@/types/User";
import GetEvents, { type TEvent } from "@/endpoints/Events/GetEvents";

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

  const [notifications, setNotification] = useState<TEvent[]>([]);

  useEffect(() => {
    GetEvents((data) => setNotification(data.data));

    window.addEventListener("refetchEvents", () =>
      GetEvents((data) => setNotification(data.data))
    );

    return () => {
      window.removeEventListener("refetchEvents", () =>
        GetEvents((data) => setNotification(data.data))
      );
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                   useHub                                   */
  /* -------------------------------------------------------------------------- */

  const { hubConnection } = useHub();

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  function responseFriendRequest(
    eventId: number,
    action: "Accept" | "Decline"
  ) {
    hubConnection?.invoke("RespondFriendRequest", eventId, action);

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
