import useHub from "@/hooks/useHub";
import AXIOS from "@/lib/AxiosInstance";
import { getCookie, setCookie } from "@/utils/cookiesManagement";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { LogOutIcon, BellIcon, SearchIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import SearchUsers from "./SearchUsers";

type TNotification = {
  eventId: number;
  type: number;
  sender: string;
  eventTime: string;
};

const EVENT = ["FriendRequest", "Block", "ChatRequest"];

function Header() {
  /* -------------------------------------------------------------------------- */
  /*                                 React Hook                                 */
  /* -------------------------------------------------------------------------- */

  const [username, setUsername] = useState<string | null>(null);
  const [notifications, setNotification] = useState<TNotification[]>([]);

  useEffect(() => {
    getEvents();
    setUsername(getCookie("username"));
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

  function logoutOnclick() {
    if (!confirm("Do you want to log out?")) return;
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

  function friendRequest(userId: number) {
    const data = {
      receiverUserId: userId.toString(),
    };
    AXIOS.post("event/friend-request", data, {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    }).then((res) => alert(res.data.data));
  }

  return (
    <div className="flex justify-between py-2 px-1">
      <div className="flex gap-2 items-center ">
        <Avatar className="size-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <span>{username}</span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Search Users */}
        <Dialog>
          <DialogTrigger>
            <Button variant="secondary" size="icon">
              <SearchIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="top-16 translate-y-[0] max-h-[500px]">
            <h3>Search User</h3>
            <SearchUsers
              friendRequestOnclick={(userId) => friendRequest(userId)}
            />
          </DialogContent>
        </Dialog>

        {/* Notification */}
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
                      onClick={() =>
                        responseFriendRequest(n.eventId, "Decline")
                      }
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
                      onClick={() =>
                        chatRespond(n.eventId, "RefuseChatRequest")
                      }
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

        {/* Logout */}
        <Button variant="secondary" size="icon" onClick={logoutOnclick}>
          <LogOutIcon />
        </Button>
      </div>
    </div>
  );
}

export default Header;
