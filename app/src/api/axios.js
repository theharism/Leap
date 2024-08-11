import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://192.168.100.134:5000/api",
});

const privateApi = (token) => axios.create({
  baseURL: "http://192.168.100.134:5000/api", headers: {
    Authorization: `Bearer ${token}`,
  },
});

export { publicApi, privateApi };
