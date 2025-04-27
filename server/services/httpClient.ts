import axios from "axios";

const API_URL = Deno.env.get("API_URL");

console.log(API_URL);
const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    "User-Agent":
      "iRail-MCP-Agent/1.0.0 (www.egemenc.com;egemenc2101@gmail.com)",
    Accept: "application/json",
    Connection: "keep-alive",
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout if the request takes too long
});

export default httpClient;
