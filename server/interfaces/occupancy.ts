// Occupancy information interface
export interface OccupancyInfo {
    "@id": string;
    name: Occupancy;
  }

export enum Occupancy {
    "low" = "low",
    "medium" = "medium",
    "high" = "high",
    "unknown" = "unknown",
}
  