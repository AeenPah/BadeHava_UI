import { getCookie, setCookie } from "../../../utils/cookiesManagement";
import SearchUsers from "../../../components/SearchUsers";
import { useEffect, useState } from "react";
import AXIOS from "../../../lib/AxiosInstance";

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

const EVENT = ["FriendRequest", "Block", "ChatRequest"];

function Home() {
  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [notifications, setNotification] = useState<TNotification[]>([]);
  const [Friends, setFriends] = useState<TFriend[]>([]);

  useEffect(() => {
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
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

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
          <button onClick={() => responseFriendRequest(n.eventId, "Accept")}>
            Accept
          </button>
          <button onClick={() => responseFriendRequest(n.eventId, "Decline")}>
            Decline
          </button>
        </div>
      ))}
      <SearchUsers friendRequestOnclick={(userId) => friendRequest(userId)} />

      {/* Friend List */}
      <h4>Friends</h4>
      {Friends.map((f) => (
        <div key={f.username}>{f.username}</div>
      ))}

      {/* Chat Sections */}
      <h4>Chat</h4>
    </div>
  );
}

export default Home;
