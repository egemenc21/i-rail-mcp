import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import registerStationsTools from "./tools/stations.ts";
import registerConnectionsTools from "./tools/connections.ts";

export function getServer() {
  const server = new McpServer({
    name: "i-rail-mcp-server",
    version: "1.0.0",
  });

  registerStationsTools(server);
  registerConnectionsTools(server);

  return server;
}
