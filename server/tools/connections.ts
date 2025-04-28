import { getConnections, SimpleConnection } from "../services/connections.ts";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk";
import { Connection } from "../interfaces/connections.ts";

export default function registerConnectionsTools(server: McpServer) {
  server.tool(
    "getConnections",
    "Get connections",
    {
      from: z.string().describe("The station name of the departure station"),
      to: z.string().describe("The station name of the arrival station"),
      date: z.string().describe("The date of the departure in format DDMMYYYY"),
      time: z.string().describe("The time of the departure in format HHMM"),
      lang: z.string().describe("The language of the response, ex: en, fr"),
    },
    async (
      { from, to, date, time, lang }: {
        from: string;
        to: string;
        date: string;
        time: string;
        lang: string;
      },
    ) => {
      const connections = await getConnections(
        from,
        to,
        date,
        time,
        lang,
      );
      return {
        content: connections.connections.map((connection: SimpleConnection) => ({
          type: "text",
          text: JSON.stringify(connection),
        })),
      };
    },
  );
}
