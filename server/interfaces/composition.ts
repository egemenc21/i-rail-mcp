/**
 * TypeScript interfaces for train composition information
 */

import { StationInfo } from "./stations.ts";

// Material type information
export interface MaterialType {
  parent_type: string;
  sub_type: string;
  orientation: string;
}

// Train unit details
export interface TrainUnit {
  id: string;
  materialType: MaterialType;
  hasToilets: string;
  hasSecondClassOutlets: string;
  hasFirstClassOutlets: string;
  hasHeating: string;
  hasAirco: string;
  materialNumber: string;
  tractionType: string;
  canPassToNextUnit: string;
  seatsFirstClass: string;
  seatsCoupeFirstClass: string;
  standingPlacesFirstClass: string;
  seatsSecondClass: string;
  seatsCoupeSecondClass: string;
  standingPlacesSecondClass: string;
  lengthInMeter: string;
  hasSemiAutomaticInteriorDoors: string;
  materialSubTypeName: string;
  tractionPosition: string;
  hasPrmSection: string;
  hasPriorityPlaces: string;
  hasBikeSection: string;
}

// Units collection
export interface Units {
  number: string;
  unit: TrainUnit[];
}

// Composition details
export interface CompositionDetails {
  source: string;
  units: Units;
}

// Segment of the train journey
export interface TrainSegment {
  id: string;
  origin: StationInfo;
  destination: StationInfo;
  composition: CompositionDetails;
}

// Segments collection
export interface Segments {
  number: string;
  segment: TrainSegment[];
}

// Composition wrapper
export interface Composition {
  segments: Segments;
}

// Main response interface for train composition
export interface TrainCompositionResponse {
  version: string;
  timestamp: string;
  composition: Composition;
}
