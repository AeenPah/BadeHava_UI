import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const AXIOS = axios.create({
  baseURL,
  //   timeout: 5000,
});

AXIOS.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) return Promise.reject(error);

    const { status } = error.response;

    switch (status) {
      case 401:
        alert("Unauthorized!");
        break;
      case 500:
        alert("Server Error");
        break;
    }

    return Promise.reject(error);
  }
);

export default AXIOS;
