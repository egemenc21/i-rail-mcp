import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk";
import { getVehicleInfoByVehicleId } from "../services/vehicles.ts";
import { Stop } from "../interfaces/connections.ts";

export default function registerVehicles(server: McpServer) {
  server.tool(
    "getVehicleInfoByVehicleId",
    "Get vehicle info by vehicle id",
    {
      vehicleId: z.string().describe("The vehicle id, if name is provided then BE.NMBS.{name} is the vehicle id"),
      date: z.string().describe("The date in format DDMMYYYY"),
      lang: z.string().describe("The language of the response, ex: en, fr"),
    },
    async ({ vehicleId, date, lang }: {
      vehicleId: string;
      date: string;
      lang: string;
    }) => {
      const vehicleInfo = await getVehicleInfoByVehicleId(
        vehicleId,
        date,
        lang,
      );

      return {
        content: [
          {
            type: "text",
            text: `Vehicle ${vehicleInfo.name} (${vehicleInfo.type}) from ${vehicleInfo.origin} to ${vehicleInfo.destination}`,
          },
          {
            type: "text",
            text: JSON.stringify({
              vehicle: {
                id: vehicleInfo.id,
                name: vehicleInfo.name,
                type: vehicleInfo.type,
                number: vehicleInfo.number,
                route: `${vehicleInfo.origin} → ${vehicleInfo.destination}`
              },
              stops: vehicleInfo.journey
            }, null, 2),
          },
        ],
      };
    },
  );
}
