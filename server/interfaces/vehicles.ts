import { OccupancyInfo } from "./occupancy.ts";
import { PlatformInfo } from "./platform.ts";
import { StationInfo } from "./stations.ts";

/**
 * Vehicle information interface
 */
export interface VehicleInfo {
    name: string;
    shortname: string;
    number: string;
    type: string;
    locationX: string;
    locationY: string;
    "@id": string;
  }
// Individual stop interface
export interface Stop {
  id: string;
  station: string;
  stationinfo: StationInfo;
  time: string;
  platform: string;
  platforminfo: PlatformInfo;
  scheduledDepartureTime: string;
  scheduledArrivalTime: string;
  delay: string;
  canceled: string;
  departureDelay: string;
  departureCanceled: string;
  arrivalDelay: string;
  arrivalCanceled: string;
  left: string;
  arrived: string;
  isExtraStop: string;
  occupancy: OccupancyInfo;
  departureConnection: string;
}

// Stops collection interface
export interface Stops {
  number: string;
  stop: Stop[];
}

// Main vehicle response interface
export interface TrainVehicleResponse {
  version: string;
  timestamp: string;
  vehicle: string;
  vehicleinfo: VehicleInfo;
  stops: Stops;
}

// Simple vehicle response interface
export interface SimpleVehicleInfo {
  id: string;
  name: string;
  type: string;
  number: string;
  journey: SimpleStop[];
  origin: string;
  destination: string;
}

export interface SimpleStop {
  id: string;
  station: string;
  standardName: string;
  scheduledArrival: {
    time: string;
    formattedTime: string;
    delay: number;
    canceled: boolean;
  };
  scheduledDeparture: {
    time: string;
    formattedTime: string;
    delay: number;
    canceled: boolean;
  };
  platform: string;
  isPassed: boolean;
  isExtraStop: boolean;
}