import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { getCookie } from "@/utils/cookiesManagement";

type TUserInfo = {
  username: string;
  avatarUrl: string;
};

function UserInfo() {
  /* -------------------------------------------------------------------------- */
  /*                                 React Hook                                 */
  /* -------------------------------------------------------------------------- */

  const [userInfo, setUserInfo] = useState<TUserInfo | null>(null);

  useEffect(() => {
    // getEvents();
    setUserInfo({
      username: getCookie("username")!,
      avatarUrl: getCookie("avatar")!,
    });
  }, []);

  return (
    <div className="flex gap-2 items-center ">
      <Avatar className="size-12">
        <AvatarImage src={userInfo?.avatarUrl} />
        <AvatarFallback>
          {userInfo?.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <span>{userInfo?.username}</span>
    </div>
  );
}

export default UserInfo;
