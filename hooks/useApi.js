import axios from "axios";

const Axios = axios.create({
  baseURL: process.env.API_URL,
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      //@todo refresh token and if not working only redirect to login
      window.location.href = process.env.BASE_URL + "/login";
    }

    if (error.response && error.response.status >= 500) {
      return Promise.reject(error);
    } else {
      return error.response;
    }
  }
);

Axios.defaults.withCredentials = true;

export default Axios;
