import httpClient from "./httpClient.ts";

export async function getLiveboard(
  stationId: string,
  stationName: string,
  date: string,
  time: string,
  arrdep: string,
  lang: string,
) {
  const response = await httpClient
    .get(
      `/liveboard/?station=${stationId}` +
      `&station=${stationName}` +
      `&date=${date}` +
      `&time=${time}` +
      `&arrdep=${arrdep}` + // whether it's arrival or departure information
      `&lang=${lang}` +
      `&format=json` +
      `&alerts=false`,
    );

  return response.data;
}
