import axios from "axios";

const baseURL = "https://leaptechsolutions.com/api";

const publicApi = axios.create({
  baseURL,
});

const privateApi = (token) => axios.create({
  baseURL, headers: {
    Authorization: `Bearer ${token}`,
  },
});

export { publicApi, privateApi };
