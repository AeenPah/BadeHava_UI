import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { getCookie } from "@/utils/cookiesManagement";

function UserInfo() {
  /* -------------------------------------------------------------------------- */
  /*                                 React Hook                                 */
  /* -------------------------------------------------------------------------- */

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // getEvents();
    setUsername(getCookie("username"));
  }, []);

  return (
    <div className="flex gap-2 items-center ">
      <Avatar className="size-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <span>{username}</span>
    </div>
  );
}

export default UserInfo;
