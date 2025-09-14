import { useEffect, useRef, useState, type ChangeEvent } from "react";
import AXIOS from "../../../lib/AxiosInstance";
import { getCookie, setCookie } from "../../../utils/cookiesManagement";

type TUserType = { userId: number; username: string };

function Home() {
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

  return (
    <div>
      <h4>Home</h4>
      <button onClick={logoutOnclick}>Logout</button> <br />
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
          </div>
        ))}
    </div>
  );
}

export default Home;
