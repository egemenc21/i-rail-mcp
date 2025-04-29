import { McpServer } from "@modelcontextprotocol/sdk";
import { z } from "zod";
import {
  getStationInfo,
  getStationInfoById,
  getStationInfoByStationName,
} from "../services/stations.ts";
import { StationInfo } from "../interfaces/stations.ts";

export default function registerStationsTools(server: McpServer) {
  // Get information about all stations
  server.tool("getStationsInfo", "Get information about all stations", {
    lang: z.string().length(2).describe("Two-letter lang code (e.g. en, fr)"),
  }, async ({ lang }: { lang: string }) => {
    const data = await getStationInfo(lang);
    return {
      content: data.station.map((station: StationInfo) => ({
        type: "text",
        text: JSON.stringify(station),
      })),
    };
  });

  // Get information about a station by name
  server.tool(
    "getStationInfoByName",
    "Get information about a station by name",
    {
      name: z.string().describe("Station name"),
      lang: z.string().length(2).describe("Two-letter lang code (e.g. en, fr)"),
    },
    async ({ name, lang }: { name: string; lang: string }) => {
      const data = await getStationInfoByStationName(name, lang);
      return {
        content: data
          ? [{
            type: "text",
            text: JSON.stringify(data),
          }]
          : [{
            type: "text",
            text: "Station not found",
          }],
      };
    },
  );

  // Get information about a station by @id
  server.tool("getStationInfoById", "Get information about a station by @id", {
    id: z.string().describe("Station @id"),
    lang: z.string().length(2).describe("Two-letter lang code (e.g. en, fr)"),
  }, async ({ id, lang }: { id: string; lang: string }) => {
    const data = await getStationInfoById(id, lang);

    return {
      content: data
        ? [{
          type: "text",
          text: JSON.stringify(data),
        }]
        : [{
          type: "text",
          text: "Station not found",
        }],
    };
  });
}
