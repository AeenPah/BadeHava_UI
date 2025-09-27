import useHub from "@/hooks/useHub";
import AXIOS from "@/lib/AxiosInstance";
import { getCookie } from "@/utils/cookiesManagement";
import { Fragment, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type TFriend = {
  userId: number;
  username: string;
  createAt: Date;
};

function FriendsList() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hubs                                    */
  /* -------------------------------------------------------------------------- */

  const { hubConnection } = useHub();

  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [Friends, setFriends] = useState<TFriend[]>([]);

  useEffect(() => {
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
  /*                                  Function                                  */
  /* -------------------------------------------------------------------------- */

  function requestChat(userId: number) {
    hubConnection?.invoke("RequestChat", userId.toString());
  }

  return (
    <Fragment>
      <h4>Friends</h4>
      <div className="flex gap-3">
        {Friends.map((f) => (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {f.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span>{f.username}</span>
            </div>
            <Button
              className="h-6 text-[10px] px-2"
              onClick={() => requestChat(f.userId)}
            >
              Request Chat
            </Button>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default FriendsList;
