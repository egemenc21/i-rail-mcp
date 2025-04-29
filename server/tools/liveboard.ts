import { McpServer } from "@modelcontextprotocol/sdk";
import z from "zod";
import { getLiveboard } from "../services/liveboard.ts";
import { TrainStop } from "../interfaces/liveboard.ts";
export default function registerLiveboardTools(server: McpServer) {
  server.tool("getLiveboard", "Get liveboard", {
    stationId: z.string().describe("The id of the station"),
    stationName: z.string().describe("The name of the station"),
    date: z.string().describe("The date of the liveboard in format DDMMYYYY"),
    time: z.string().describe("The time of the liveboard in format HHMM"),
    arrdep: z.string().describe(
      "Whether it's arrival or departure information, ex: departure, arrival",
    ),
    lang: z.string().describe("The language of the response, ex: en, fr"),
  }, async ({ stationId, stationName, date, time, arrdep, lang }: {
    stationId: string;
    stationName: string;
    date: string;
    time: string;
    arrdep: string;
    lang: string;
  }) => {
    const liveboard = await getLiveboard(
      stationId,
      stationName,
      date,
      time,
      arrdep,
      lang,
    );
    if(arrdep === "departure") {
      if ('departures' in liveboard) {
        return {
          content: liveboard.departures.departure.map((departure: TrainStop) => ({
            type: "text",
            text: JSON.stringify(departure),
          })),
        };
      }
    } else {
      if ('arrivals' in liveboard) {
        return {
          content: liveboard.arrivals.arrival.map((arrival: TrainStop) => ({
            type: "text",
            text: JSON.stringify(arrival),
          })),
        };
      }
    }
    return { content: [] };
  });
}
