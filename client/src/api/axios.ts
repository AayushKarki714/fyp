import axios from "axios";

export default axios.create({
  baseURL: "https://project-zone.onrender.com/",
  withCredentials: true,
});
