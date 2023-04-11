import axios from "axios";

export default axios.create({
  // baseURL: "https://project-zone.onrender.com/",
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
