import { Station } from "./stations.ts";

export interface ConnectionsResponse {
  version: string;
  timestamp: string;
  connection: Connection[];
}

export interface Connection {
  id: string;
  departure: DepartureArrival;
  arrival: DepartureArrival;
  vias: {
    number: string;
    via: Via[];
  };
  duration: string;
  remarks: {
    number: string;
    remark: any[];
  };
  alerts: {
    number: string;
    alert: any[];
  };
}

export interface DepartureArrival {
  delay: string;
  station: string;
  stationinfo: Station;
  time: string;
  vehicle: string;
  vehicleinfo: VehicleInfo;
  platform: string;
  platforminfo: PlatformInfo;
  canceled: string;
  direction?: {
    name: string;
  };
  left?: string;
  arrived?: string;
  walking?: string;
  departureConnection?: string;
  stops?: {
    number: string;
    stop: Stop[];
  };
  occupancy?: {
    "@id": string;
    name: string;
  };
}

export interface VehicleInfo {
  name: string;
  shortname: string;
  number: string;
  type: string;
  locationX: string;
  locationY: string;
  "@id": string;
}

export interface PlatformInfo {
  name: string;
  normal: string;
}

export interface Stop {
  id: string;
  station: string;
  stationinfo: Station;
  scheduledArrivalTime: string;
  arrivalCanceled: string;
  arrived: string;
  scheduledDepartureTime: string;
  arrivalDelay: string;
  departureDelay: string;
  departureCanceled: string;
  left: string;
  isExtraStop: string;
  platform: string;
  platforminfo: PlatformInfo;
}

export interface Via {
  id: string;
  arrival: DepartureArrival;
  departure: DepartureArrival;
  timebetween: string;
  station: string;
  stationinfo: Station;
  vehicle: string;
  vehicleinfo: VehicleInfo;
}
