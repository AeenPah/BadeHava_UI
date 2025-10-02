import { useNavigate } from "react-router-dom";
import AXIOS from "../../../lib/AxiosInstance";
import { setCookie } from "../../../utils/cookiesManagement";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Login() {
  /* -------------------------------------------------------------------------- */
  /*                              React Router Dom                              */
  /* -------------------------------------------------------------------------- */

  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                                  Functions                                 */
  /* -------------------------------------------------------------------------- */

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (username && password) {
      const data = { username, password };

      AXIOS.post("/auth/login", data, {
        withCredentials: true,
      }).then(({ data }) => {
        setCookie("accessToken", data.data.accessToken);
        setCookie("username", data.data.username);
        setCookie("avatar", data.data.avatarUrl || "");
        confirm(data.message);
        navigate("/home", { replace: true });
      });
    } else {
      alert("Fill the form");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username"> Username </label>
        <Input
          type="text"
          name="username"
          id="username"
          autoComplete="username"
        />

        <label htmlFor="password"> Password </label>
        <Input
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
        />

        <Button type="submit" className="w-full mt-4">
          Login
        </Button>
      </div>
    </form>
  );
}

export default Login;
