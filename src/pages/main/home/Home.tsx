import { getCookie, setCookie } from "../../../utils/cookiesManagement";
import SearchUsers from "../../../components/SearchUsers";
import { useEffect, useState, type FormEvent } from "react";
import AXIOS from "../../../lib/AxiosInstance";
import usePresenceHub, {
  type THubEventHandler,
} from "../../../hooks/usePresenceHub ";
import { useSearchParams } from "react-router-dom";

type TNotification = {
  eventId: number;
  type: number;
  sender: string;
  eventTime: string;
};

type TFriend = {
  userId: number;
  username: string;
  createAt: Date;
};

type TMessage = { from: number; message: string; seen: boolean };

const EVENT = ["FriendRequest", "Block", "ChatRequest"];

function Home() {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const [searchParams, setSearchParams] = useSearchParams();

  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [notifications, setNotification] = useState<TNotification[]>([]);
  const [Friends, setFriends] = useState<TFriend[]>([]);

  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<TMessage[]>([]);

  useEffect(() => {
    getEvents();

    AXIOS.get("user/friends/", {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    }).then((res) => {
      setFriends(res.data.data);
    });
    return () => {};
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               usePresenceHub                               */
  /* -------------------------------------------------------------------------- */

  const listeners: THubEventHandler[] = [
    {
      event: "FailedRequest",
      handler: (msg) => alert(msg),
    },
    {
      event: "RequestSent",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: (data: any) => {
        alert(data.message);
        setSearchParams({ room: data.roomId });
      },
    },
    {
      event: "ChatRequest",
      handler: (message) => {
        alert(JSON.stringify(message));
        getEvents();
      },
    },
    {
      event: "ChatReqRefused",
      handler: (msg) => alert(msg),
    },
    {
      event: "JoinedRoom",
      handler: (roomId) => setSearchParams({ room: `${roomId}` }),
    },
    {
      event: "Message",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: (data: any) => {
        setChatMessages((prev) => [{ ...data, seen: true }, ...prev]);
      },
    },
  ];
  const presenceHub = usePresenceHub(listeners);

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

  function requestChat(userId: number) {
    presenceHub?.invoke("RequestChat", userId.toString());
  }

  function chatRespond(
    eventId: number,
    type: "JoinChat" | "RefuseChatRequest"
  ) {
    switch (type) {
      case "JoinChat":
        presenceHub?.invoke("JoinChat", eventId);
        break;
      case "RefuseChatRequest":
        presenceHub?.invoke("RefuseChatRequest", eventId);
        break;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>, roomId: string) {
    event.preventDefault();
    if (!chatMessage.trim()) return;
    presenceHub?.invoke("SendMessage", roomId, chatMessage);
    setChatMessage("");
  }

  return (
    <div style={{ backgroundColor: "lightblue" }}>
      <h4>Home</h4>
      <button onClick={logoutOnclick}>Logout</button>

      {/* Notifications */}
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
      <SearchUsers friendRequestOnclick={(userId) => friendRequest(userId)} />

      {/* Friend List */}
      <h4>Friends</h4>
      {Friends.map((f) => (
        <div key={f.username}>
          {f.username}/
          <button onClick={() => requestChat(f.userId)}>Request Chat</button>
        </div>
      ))}

      {/* Chat Sections */}
      <h4>Chat</h4>
      {presenceHub && searchParams.get("room") && (
        <div>
          Chat
          <h4>Messages</h4>
          {chatMessages.map((m) => (
            <>
              {m.message} // FROM:{m.from} <br />
            </>
          ))}
          <form onSubmit={(e) => handleSubmit(e, searchParams.get("room")!)}>
            <input
              type="text"
              name="message"
              id="message"
              value={chatMessage}
              autoComplete="off"
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button>send</button>
          </form>
          <h4> chat room: {searchParams.get("room")}</h4>
        </div>
      )}
    </div>
  );
}

export default Home;
