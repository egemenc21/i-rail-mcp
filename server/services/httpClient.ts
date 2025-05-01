import axios from "axios";

const API_URL = Deno.env.get("API_URL");
const USER_AGENT = Deno.env.get("USER_AGENT");

const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
    Connection: "keep-alive",
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout if the request takes too long
});

export default httpClient;
