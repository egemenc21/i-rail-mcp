import { McpServer } from "@modelcontextprotocol/sdk";
import registerStationTools from "./tools/stations.ts";

export function getServer() {
  const server = new McpServer({
    name: "i-rail-mcp-server",
    version: "1.0.0",
  });

  registerStationTools(server);

  return server;
}
