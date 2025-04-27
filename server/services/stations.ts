import { Station, StationResponse } from "../interfaces/stations.ts";
import httpClient from "./httpClient.ts";

// In-memory cache
interface CacheEntry {
  timestamp: number;
  data: StationResponse;
}

// Using a Map instead of a plain object can be more efficient
const stationCache = new Map<string, CacheEntry>();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function getStationInfo(lang: string) : Promise<StationResponse> {
  // Check if we have cached data that's not expired
  const now = Date.now();
  const cached = stationCache.get(lang);

  if (cached && (now - cached.timestamp) < CACHE_EXPIRY) {
    return cached.data;
  }
  // If not cached or expired, fetch fresh data
  const response = await httpClient.get(`/stations/?format=json&lang=${lang}`);

  // Update cache
  stationCache.set(lang, {
    timestamp: now,
    data: response.data,
  });

  return response.data;
}

export async function getStationInfoById(
  id: string,
  lang: string,
): Promise<Station | undefined> {
  const data = await getStationInfo(lang);
  return data.station.find((station: Station) => station["@id"] == id) || data.station.find((station: Station) => station.id == id);
}

export async function getStationInfoByStationName(
  name: string,
  lang: string,
): Promise<Station | undefined> {
  const data = await getStationInfo(lang);
  const station =
    data.station.find((station: Station) => station.standardname == name) ||
    data.station.find((station: Station) => station.name == name);

  if (!station) {
    throw new Error(`Station not found: ${name}`);
  }

  return station;
}

