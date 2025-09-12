import AXIOS from "../../../lib/AxiosInstance";

function Login() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (username && password) {
      const data = { username, password };

      const result = AXIOS.post(`/auth/login`, data);

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
    </div>
  );
}

export default Login;
