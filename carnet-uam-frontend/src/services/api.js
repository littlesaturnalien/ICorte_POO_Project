import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8087/uam-carnet-sys/user/login",
});

export default api;