import AXIOS from "../../../lib/AxiosInstance";
import { getCookie, setCookie } from "../../../utils/cookiesManagement";
import SearchUsers from "../../../components/SearchUsers";
import usePresenceHub from "../../../hooks/usePresenceHub ";
import { useEffect } from "react";

function Home() {
  /* -------------------------------------------------------------------------- */
  /*                                 PresenceHub                                */
  /* -------------------------------------------------------------------------- */

  const accessToken = getCookie("accessToken");
  const connection = usePresenceHub("?accessToken=" + accessToken);

  // TODO: Clean this
  useEffect(() => {
    if (!connection) return;

    const handler = (_data: unknown, message: string) => {
      alert(message);
    };

    connection?.on("FailedRequest", handler);

    return () => {
      connection.off("FailedRequest", handler);
    };
  }, [connection]);

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

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

  function friendRequest(userId: number) {
    console.log(connection);
    if (connection) {
      connection.send("RequestFriendship", userId.toString());
    }
  }

  return (
    <div>
      <h4>Home</h4>
      <button onClick={logoutOnclick}>Logout</button> <br />
      <SearchUsers friendRequestOnclick={(userId) => friendRequest(userId)} />
      <button
        onClick={() => {
          connection?.stop();
        }}
      >
        test ro stop WS connection
      </button>
    </div>
  );
}

export default Home;
