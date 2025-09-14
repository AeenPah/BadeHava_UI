import axios from "axios";
import { setCookie } from "../utils/cookiesManagement";

const baseURL = import.meta.env.VITE_API_URL;

const AXIOS = axios.create({
  baseURL,
});

AXIOS.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    // FIXME: Fix this type later
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest = error.config as any;
    const { status } = error.response;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${baseURL}/auth/refresh`,
          undefined,
          {
            withCredentials: true,
          }
        );

        setCookie("accessToken", data.data.accessToken);
        setCookie("username", data.data.username);

        // Attach new token to original request and retry
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return AXIOS(originalRequest);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            console.log("Redirect to login page");
            // window.location.href = "/auth/login";
          }
        }
        return Promise.reject(err);
      }
    }

    if (status === 500) {
      alert("Server Error. Try again later.");
    } else if (error.response.data?.message) {
      alert(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default AXIOS;
