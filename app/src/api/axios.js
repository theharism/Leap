import axios from "axios";

const baseURL = "https://leaptechsolutions.com/api";
// const baseURL = "http://192.168.100.134:5000/api";

const publicApi = axios.create({
  baseURL,
});

const privateApi = (token) => axios.create({
  baseURL, headers: {
    Authorization: `Bearer ${token}`,
  },
});

export { publicApi, privateApi };
