import { parseValue } from "../helpers/value.ts";
import { Data, SimpleTrainComposition, TrainCompositionResponse, TrainSegment } from "../interfaces/composition.ts";
import httpClient from "./httpClient.ts";
import { getVehicleInfoByVehicleId } from "./vehicles.ts";

/**
 * Retrieve train composition information in a simplified format
 */
export async function getSimpleComposition(
  vehicleId: string,
  from: string,
  to: string,
  date: string,
  data: Data = Data.all,
  lang: string = "en",
): Promise<SimpleTrainComposition | null> {
  console.log(`Getting simple composition for ${vehicleId} from ${from} to ${to}`);
  
  // just in case map vehicleId to a valid vehicle id, remove blank spaces
  vehicleId = vehicleId.trim();

  const response = await httpClient.get<TrainCompositionResponse>(
    `/composition/?id=${vehicleId}&data=${data}&lang=${lang}&format=json`,
  );

  const vehicleInfo = await getVehicleInfoByVehicleId(vehicleId, date, lang);
  const journey = vehicleInfo.journey;
  
  const composition = response.data.composition;
  const segments = composition.segments;
  
  // First try direct match with provided from/to
  let segment = segments.segment.find(
    (segment) => segment.origin.id === from || segment.destination.id === to,
  );
  
  // If no direct match is found, try to match with any stop in the journey
  if (!segment && journey && journey.length > 0) {
    // Get all station IDs from the journey
    const stationIds = journey.map(stop => stop.id);
    
    // Find a segment where any stop in the journey matches origin or destination
    segment = segments.segment.find(segment => 
      stationIds.includes(segment.origin.id) || stationIds.includes(segment.destination.id)
    );
  }
  
  if (!segment) {
    return null;
  }
  
  // Transform to simplified format
  return transformToSimpleFormat(segment, vehicleId);
}

/**
 * Transform API response to a simplified format
 */
function transformToSimpleFormat(segment: TrainSegment, trainId: string): SimpleTrainComposition {
  const units = segment.composition.units.unit.map((unit, index) => {
    return {
      number: index + 1,
      type: `${unit.materialType.parent_type} ${unit.materialType.sub_type}`.trim(),
      length: parseInt(unit.lengthInMeter),
      firstClassSeats: parseInt(unit.seatsFirstClass),
      secondClassSeats: parseInt(unit.seatsSecondClass),
      seatsLeftFirstClass: parseInt(unit.standingPlacesFirstClass),
      seatsLeftSecondClass: parseInt(unit.standingPlacesSecondClass),
      hasToilets: parseValue(unit.hasToilets) as boolean,
      hasPowerOutlets: parseValue(unit.hasFirstClassOutlets) as boolean || parseValue(unit.hasSecondClassOutlets) as boolean,
      hasAirConditioning: parseValue(unit.hasAirco) as boolean,
      hasHeating: parseValue(unit.hasHeating) as boolean, 
      hasBikeSection: parseValue(unit.hasBikeSection) as boolean,
      hasAccessibility: parseValue(unit.hasPrmSection) as boolean,
    };
  });
  
  const totalFirstClass = units.reduce((sum, unit) => sum + unit.firstClassSeats, 0);
  const totalSecondClass = units.reduce((sum, unit) => sum + unit.secondClassSeats, 0);
  
  return {
    trainId,
    journey: {
      from: {
        id: segment.origin.id,
        name: segment.origin.name,
      },
      to: {
        id: segment.destination.id,
        name: segment.destination.name,
      },
    },
    seating: {
      firstClass: totalFirstClass,
      secondClass: totalSecondClass,
      total: totalFirstClass + totalSecondClass,
    },
    units,
  };
}

/**
 * Original composition function with fixed parameter format
 */
export async function getComposition(
  vehicleId: string,
  from: string,
  to: string,
  data: Data = Data.all,
  lang: string = "en",
) {
  console.log(`Getting composition for ${vehicleId} from ${from} to ${to}`);
  
  const response = await httpClient.get<TrainCompositionResponse>(
    `/composition/?id=${vehicleId}&data=${data}&lang=${lang}&format=json`,
  );
  
  const composition = response.data.composition;
  const segments = composition.segments;
  const segment = segments.segment.find(
    (segment) => segment.origin.id === from || segment.destination.id === to,
  );
  
  return segment;
}