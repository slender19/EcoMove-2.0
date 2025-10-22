import axios from "axios";

const ApiClient = axios.create({
  baseURL: "http://192.168.80.12:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default ApiClient;
