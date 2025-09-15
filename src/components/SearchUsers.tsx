import { Fragment, useEffect, useRef, useState, type ChangeEvent } from "react";
import { getCookie } from "../utils/cookiesManagement";
import AXIOS from "../lib/AxiosInstance";

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

  const searchRef = useRef<number | null>(null);

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
      <input
        type="text"
        name="searchUser"
        id="searchUser"
        placeholder="Search Users ..."
        onChange={(e) => searchOnChange(e)}
      />
      {foundUsers &&
        foundUsers.map((u) => (
          <div key={u.username}>
            {u.userId}- {u.username}
            <button onClick={() => friendRequestOnclick(u.userId)}>
              + Friend Request
            </button>
          </div>
        ))}
    </Fragment>
  );
}

export default SearchUsers;
