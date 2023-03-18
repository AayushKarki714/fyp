import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
