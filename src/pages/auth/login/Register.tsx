import { useNavigate } from "react-router-dom";
import AXIOS from "../../../lib/AxiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Register() {
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

      const result = AXIOS.post(`/auth/register`, data).then(() =>
        navigate("/auth/login")
      );

      console.log(result);
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
          Register
        </Button>
      </div>
    </form>
  );
}

export default Register;
