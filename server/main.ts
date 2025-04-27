import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import httpClient from "./services/httpClient.ts";
import { getStationInfo } from "./services/stations.ts";

function getServer() {
  const server = new McpServer({
    name: "i-rail-mcp-server",
    version: "1.0.0",
  });

  server.tool(
    "get_stations_info",
    "Get information about all stations",
    {
      lang: z.string().length(2).describe("Two-letter lang code (e.g. en, fr)"),
    },
    async ({lang}) => {
      const response = await getStationInfo(lang);
      return response.data;
    },
  );

  return server;
}


async function startServer() {
  try {
    const stationInfo = await getStationInfo("en");
    console.log(stationInfo);

    const server = getServer();
    console.log(`MCPServer is running`);
    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
