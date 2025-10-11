import { Fragment, useEffect, useRef, useState, type ChangeEvent } from "react";
import { getCookie } from "../../../utils/cookiesManagement";
import AXIOS from "../../../lib/AxiosInstance";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TUserType = {
  userId: number;
  username: string;
  avatarPicUrl?: string;
};

function SearchUsers({
  friendRequestOnclick,
}: {
  friendRequestOnclick: (userId: number) => void;
}) {
  /* -------------------------------------------------------------------------- */
  /*                                 React Hooks                                */
  /* -------------------------------------------------------------------------- */

  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [foundUsers, setFoundUsers] = useState<TUserType[] | null>(null);

  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(() => {
      if (!searchInput) {
        setFoundUsers(null);
        return;
      }

      const data = { searchInput };
      AXIOS.post("user/search", data, {
        headers: {
          Authorization: `Bearer ${getCookie("accessToken")}`,
        },
        withCredentials: true,
      }).then(({ data }) => {
        const users: TUserType[] = data.data.users;
        setFoundUsers(users);
      });
    }, 200);
  }, [searchInput]);

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  function searchOnChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchInput(event.target.value);
  }

  return (
    <Fragment>
      <Input
        type="text"
        placeholder="Search"
        name="searchUser"
        id="searchUser"
        onChange={(e) => searchOnChange(e)}
      />
      <div className="mt-3 flex-1 overflow-y-auto">
        {foundUsers &&
          (foundUsers.length !== 0 ? (
            foundUsers.map((u) => (
              <div
                key={u.username}
                className="flex items-center justify-between p-2 border-b"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="size-12">
                    <AvatarImage src={u.avatarPicUrl} />
                    <AvatarFallback>
                      {u?.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <span>{u.username}</span>
                </div>
                {u.userId !== 0 && (
                  <Button
                    size="sm"
                    onClick={() => friendRequestOnclick(u.userId)}
                  >
                    + Friend Request
                  </Button>
                )}
              </div>
            ))
          ) : (
            <>No user found!</>
          ))}
      </div>
    </Fragment>
  );
}

export default SearchUsers;
