import { Station } from "../interfaces/stations.ts";
import httpClient from "./httpClient.ts";

export async function getStationInfo(lang: string) {
  const response = await httpClient.get(`/stations/?format=json&lang=${lang}`);
  return response.data;
}

export async function getStationInfoById(id: string, lang:string) {
  const data = await getStationInfo(lang)
  const allStations = data.station
  const station = allStations.find((station: Station) => station["@id"] == id)
  return station;
}

export async function getStationInfoByStationName(name: string, lang:string) {
  const data = await getStationInfo(lang)
  const allStations = data.station
  const station = allStations.find((station: Station) => station.name == name)
  return station;
}