import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookiesManagement";

function MainLayout() {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const [username, setUsername] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                   Effect                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      //redirect
      navigate("auth/login", { replace: true });
    } else {
      setUsername(getCookie("username"));
    }
  }, []);

  return (
    <div>
      MainLayout
      <h3>Username: {username}</h3>
      <Outlet />
    </div>
  );
}

export default MainLayout;
