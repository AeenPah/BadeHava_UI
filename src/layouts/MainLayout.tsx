import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookiesManagement";

function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      //redirect
      navigate("auth/login", { replace: true });
    }
  }, []);

  return (
    <div>
      MainLayout
      <Outlet />
    </div>
  );
}

export default MainLayout;
