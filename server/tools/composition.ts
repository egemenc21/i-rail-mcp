import { McpServer } from "@modelcontextprotocol/sdk";
import { z } from "zod";
import { getSimpleComposition } from "../services/composition.ts";
import { Data } from "../interfaces/composition.ts";

export default function registerCompositionTools(server: McpServer) {
  server.tool(
    "getComposition",
    "Get composition data, retrieve train information on a specific journey, if there is a specific origin and destination, how many seats left etc.",
    {
        vehicleId: z.string().describe("The vehicle name, ex: IC734"),
        from: z.string().describe("The origin station Id, ex: BE.NMBS.008892007"),
        to: z.string().describe("The destination station Id, ex: BE.NMBS.008821006"),
        date: z.string().describe("The date of the journey, ex: 03052025"),
        lang: z.string().describe("The language, ex: en, fr, de, nl"),
    },
    async (args: {
        vehicleId: string;
        from: string;
        to: string;
        date: string;
        lang: string;
    }) => {
        const segment = await getSimpleComposition(args.vehicleId, args.from, args.to, args.date, Data.all, args.lang);

        if(!segment) {
            return {
                content: [{ type: "text", text: `No composition found for ${args.vehicleId} from ${args.from} to ${args.to}` }],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(segment, null, 2),
                }
            ]
        }
    }
  );
}
