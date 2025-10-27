import axios from "axios";

const ApiClient = axios.create({
  baseURL: "http://192.168.80.12:8000",
});

export default ApiClient;