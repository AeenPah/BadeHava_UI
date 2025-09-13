import { Link, useNavigate } from "react-router-dom";
import AXIOS from "../../../lib/AxiosInstance";
import { setCookie } from "../../../utils/cookiesManagement";

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

      const result = AXIOS.post(`/auth/login`, data, {
        withCredentials: true,
      }).then(({ data }) => {
        setCookie("accessToken", data.data.accessToken);
        confirm(data.message);
        navigate("/home", { replace: true });
      });

      console.log(result);
    } else {
      alert("Fill the form");
    }
  }

  return (
    <div>
      <h3>Login</h3>

      <form onSubmit={onSubmit}>
        <label htmlFor="username"> Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="username"
        />

        <label htmlFor="password"> Password: </label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
        />

        <input type="submit" value="Submit" />
      </form>

      <Link to="/auth/register">Register here!</Link>
    </div>
  );
}

export default Login;
