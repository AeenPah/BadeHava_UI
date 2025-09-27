import { Fragment, useEffect, useRef, useState, type ChangeEvent } from "react";
import { getCookie } from "../../../utils/cookiesManagement";
import AXIOS from "../../../lib/AxiosInstance";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

type TUserType = { userId: number; username: string };

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
        let users: TUserType[] = data.data.users;
        if (!users.length) {
          users = [{ userId: 0, username: "No User found!" }];
        }

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
          foundUsers.map((u) => (
            <div
              key={u.username}
              className="flex items-center justify-between p-2 border-b"
            >
              <span>
                {u.userId}- {u.username}
              </span>
              {u.userId !== 0 && (
                <Button onClick={() => friendRequestOnclick(u.userId)}>
                  + Friend Request
                </Button>
              )}
            </div>
          ))}
      </div>
    </Fragment>
  );
}

export default SearchUsers;
