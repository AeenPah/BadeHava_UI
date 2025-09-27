import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookiesManagement";
import HubProvider from "@/providers/HubContextProvider";
import Header from "@/components/Header/Header";

function MainLayout() {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                                 React Hook                                 */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      //redirect
      navigate("auth/login", { replace: true });
    }
  }, []);

  return (
    <HubProvider>
      <div style={{ backgroundColor: "lightcoral" }} className="h-dvh">
        <Header />
        <Outlet />
      </div>
    </HubProvider>
  );
}

export default MainLayout;
