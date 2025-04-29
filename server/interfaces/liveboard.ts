/**
 * TypeScript interfaces for the train station API response
 * Handles both departures and arrivals
 */

import { VehicleInfo } from "./vehicle.ts";
import { PlatformInfo } from "./platform.ts";
import { Station } from "./stations.ts";

// Occupancy information interface
export interface OccupancyInfo {
  "@id": string;
  name: string;
}

// Common train stop interface (used for both departures and arrivals)
export interface TrainStop {
  id: string;
  station: string;
  stationinfo: Station;
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
  stationinfo: Station;
  departures: Departures;
}

// Response interface for arrivals
export interface TrainArrivalsResponse {
  version: string;
  timestamp: string;
  station: string;
  stationinfo: Station;
  arrivals: Arrivals;
}

// Combined response type that can be either departures or arrivals
export type TrainStationResponse = TrainDeparturesResponse | TrainArrivalsResponse;
