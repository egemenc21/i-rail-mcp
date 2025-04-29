import { TrainStationResponse } from "../interfaces/liveboard.ts";
import httpClient from "./httpClient.ts";

export async function getLiveboard(
  stationId: string,
  stationName: string,
  date: string,
  time: string,
  arrdep: string = "departure",
  lang: string = "en",
) {
  const response = await httpClient
    .get<TrainStationResponse>(
      `/liveboard/?station=${stationId}` +
      `&station=${stationName.trim()}` +
      `&date=${date}` +
      `&time=${time}` +
      `&arrdep=${arrdep}` + // whether it's arrival or departure information
      `&lang=${lang}` +
      `&format=json` +
      `&alerts=false`,
    );

  return response.data;
}
