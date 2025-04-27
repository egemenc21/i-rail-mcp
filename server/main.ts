
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getServer } from "./setupServer.ts";

async function startServer() {
  try {
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
