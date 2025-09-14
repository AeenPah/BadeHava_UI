import AXIOS from "../../../lib/AxiosInstance";
import { getCookie, setCookie } from "../../../utils/cookiesManagement";
import SearchUsers from "../../../components/SearchUsers";

function Home() {
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

  return (
    <div>
      <h4>Home</h4>
      <button onClick={logoutOnclick}>Logout</button> <br />
      <SearchUsers />
    </div>
  );
}

export default Home;
