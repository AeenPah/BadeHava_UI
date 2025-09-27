import { Button } from "@/components/ui/button";
import AXIOS from "@/lib/AxiosInstance";
import { getCookie, setCookie } from "@/utils/cookiesManagement";
import { LogOutIcon } from "lucide-react";

function LogoutButton() {
  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  function logoutOnclick() {
    if (!confirm("Do you want to log out?")) return;
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
    <Button variant="secondary" size="icon" onClick={logoutOnclick}>
      <LogOutIcon />
    </Button>
  );
}

export default LogoutButton;
