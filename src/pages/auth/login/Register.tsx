import { Link } from "react-router-dom";
import AXIOS from "../../../lib/AxiosInstance";

function Register() {
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

      const result = AXIOS.post(`/auth/register`, data);

      console.log(result);
    } else {
      alert("Fill the form");
    }
  }

  return (
    <div>
      <h3>Register</h3>

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

      <Link to="/auth/login">Back to login!</Link>
    </div>
  );
}

export default Register;
