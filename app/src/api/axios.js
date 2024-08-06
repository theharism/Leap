import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://leaptechsolutions.com/api",
});

const privateApi = (token) => axios.create({
  baseURL: "https://leaptechsolutions.com/api", headers: {
    Authorization: `Bearer ${token}`,
  },
});

export { publicApi, privateApi };
