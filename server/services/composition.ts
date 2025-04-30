import { TrainCompositionResponse } from "../interfaces/composition.ts";
import httpClient from "./httpClient.ts";

export enum Data {
  empty = "",
  all = "all",
}

// Retrieve train information on a specific journey, if specific origin and destination, how many seats left etc.
export async function getComposition(
  vehicleId: string,
  from: string,
  to: string,
  data: Data = Data.all,
  lang: string = "en",
) {
  console.log(`Getting composition for vehicle ${vehicleId} from ${from} to ${to} with data ${data} and lang ${lang}`);
  const response = await httpClient.get<TrainCompositionResponse>(
    `/composition/?id=${vehicleId}&data=${data}&lang=${lang}&format=json`,
  );
  debugger
  const composition = response.data.composition;

  if (from && to) {
    const segments = composition.segments;
    const segment = segments.segment.find(
      (segment) => segment.origin.id === from && segment.destination.id === to,
    );
    return segment;
  }

  return composition;
}
