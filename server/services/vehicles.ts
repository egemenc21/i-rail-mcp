import httpClient from "./httpClient.ts";
import {
  SimpleStop,
  SimpleVehicleInfo,
  TrainVehicleResponse,
} from "../interfaces/vehicles.ts";
import { formatTime } from "../helpers/time.ts";

/**
 * Fetches detailed information about a specific vehicle (train) by its ID
 *
 * @param vehicleId - The unique identifier of the vehicle to look up, either name or id
 * @param date - The date for which to get the vehicle information (format DDMMYYYY)
 * @param lang - The language code for the response (defaults to "en")
 * @returns Promise containing the vehicle information including stops and schedule
 */
export async function getVehicleInfoByVehicleId(
  vehicleId: string,
  date: string,
  lang: string = "en",
): Promise<SimpleVehicleInfo> {
  const response = await httpClient.get<TrainVehicleResponse>(
    `/vehicle/?id=${vehicleId}&date=${date}&format=json&lang=${lang}&alerts=false`,
  );
  // Transform the complex response into a simpler format
  const vehicle = response.data.vehicleinfo;
  const stops = response.data.stops.stop;

  // Create simplified journey information
  const journey: SimpleStop[] = stops.map((stop) => {
    return {
      id: stop.id,
      station: stop.station,
      standardName: stop.stationinfo.standardname,
      scheduledArrival: {
        time: stop.scheduledArrivalTime,
        formattedTime: formatTime(stop.scheduledArrivalTime),
        delay: parseInt(stop.arrivalDelay) / 60, // Convert to minutes
        canceled: stop.arrivalCanceled === "1",
      },
      scheduledDeparture: {
        time: stop.scheduledDepartureTime,
        formattedTime: formatTime(stop.scheduledDepartureTime),
        delay: parseInt(stop.departureDelay) / 60, // Convert to minutes
        canceled: stop.departureCanceled === "1",
      },
      platform: stop.platform,
      isPassed: stop.left === "1" || stop.arrived === "1",
      isExtraStop: stop.isExtraStop === "1",
    };
  });

  // Get origin and destination stations
  const origin = journey[0].station;
  const destination = journey[journey.length - 1].station;

  return {
    id: vehicle.name,
    name: vehicle.shortname,
    type: vehicle.type,
    number: vehicle.number,
    journey,
    origin,
    destination,
  };
}
