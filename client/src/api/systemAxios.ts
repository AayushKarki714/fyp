import axios from "axios";

export default axios.create({
  baseURL: "https://project-zone.onrender.com/",
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
