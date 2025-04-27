/**
 * Represents an individual railway station
 */
export interface Station {
  "@id": string;
  id: string;
  name: string;
  locationX: string;
  locationY: string;
  standardname: string;
}

/**
 * Represents the complete station response
 */
export interface StationResponse {
  version: string;
  timestamp: string;
  station: Station[];
}

// Example usage:
// const response: StationResponse = {
//   version: "1.3",
//   timestamp: "1745735500",
//   station: [
//     {
//       "@id": "http://irail.be/stations/NMBS/008400319",
//       id: "BE.NMBS.008400319",
//       name: "'s Hertogenbosch",
//       locationX": "5.294278",
//       locationY": "51.69042",
//       standardname: "'s Hertogenbosch"
//     },
//     // more stations...
//   ]
// };
