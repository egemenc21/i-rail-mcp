/**
 * TypeScript interfaces for the train station API response
 * Handles both departures and arrivals
 */

import { VehicleInfo } from "./vehicles.ts";
import { PlatformInfo } from "./platform.ts";
import { StationInfo } from "./stations.ts";
import { OccupancyInfo } from "./occupancy.ts";

// Common train stop interface (used for both departures and arrivals)
export interface TrainStop {
  id: string;
  station: string;
  stationinfo: StationInfo;
  time: string;
  delay: string;
  canceled: string;
  left: string;
  isExtra: string;
  vehicle: string;
  vehicleinfo: VehicleInfo;
  platform: string;
  platforminfo: PlatformInfo;
  occupancy: OccupancyInfo;
  departureConnection: string;
}

// Departures collection interface
export interface Departures {
  number: string;
  departure: TrainStop[];
}

// Arrivals collection interface
export interface Arrivals {
  number: string;
  arrival: TrainStop[];
}

// Response interface for departures
export interface TrainDeparturesResponse {
  version: string;
  timestamp: string;
  station: string;
  stationinfo: StationInfo;
  departures: Departures;
}

// Response interface for arrivals
export interface TrainArrivalsResponse {
  version: string;
  timestamp: string;
  station: string;
  stationinfo: StationInfo;
  arrivals: Arrivals;
}

// Combined response type that can be either departures or arrivals
export type TrainStationResponse = TrainDeparturesResponse | TrainArrivalsResponse;
