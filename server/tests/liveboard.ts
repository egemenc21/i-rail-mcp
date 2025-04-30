import { getLiveboard } from "../services/liveboard.ts";
import { TrainStationResponse, TrainDeparturesResponse } from "../interfaces/liveboard.ts";
import {
  assertEquals,
  assertExists,
  assertRejects,
} from "https://deno.land/std@0.208.0/assert/mod.ts";

// Test to get liveboard from a valid station
Deno.test("Get liveboard from Gent-Sint-Pieters", async () => {
  console.log("Testing getLiveboard from Gent-Sint-Pieters...");

  try {
    const stationId = "BE.NMBS.008812005";
    const stationName = "Gent-Sint-Pieters";
    
    // Use current date in DDMMYYYY format
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, "0")}${
      String(today.getMonth() + 1).padStart(2, "0")
    }${today.getFullYear()}`;

    // Use current time in HHMM format
    const time = `${String(today.getHours()).padStart(2, "0")}${
      String(today.getMinutes()).padStart(2, "0")
    }`;
    const lang = "en";

    const liveboardData = await getLiveboard(stationId, stationName, date, time, "departure", lang) as TrainDeparturesResponse;
    console.log(`Number of departures found: ${liveboardData.departures.departure.length}`);

    // Assert that we got some departures back
    assertExists(liveboardData.departures, "Should return departure data");
    assertExists(liveboardData.departures.departure, "Should have departure information");
    assertEquals(
      Array.isArray(liveboardData.departures.departure),
      true,
      "Should return an array of departures",
    );

    // Log some sample departure details
    console.log("Sample departures:");
    liveboardData.departures.departure.slice(0, 3).forEach((departure, index) => {
      console.log(`Departure ${index + 1}:`);
      console.log(`- Platform: ${departure.platform}`);
      console.log(`- Station: ${departure.station}`);
      console.log(`- Time: ${departure.time}`);
      console.log(`- Vehicle: ${departure.vehicle}`);
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching liveboard:", errorMessage);
    throw error; // Re-throw to make the test fail
  }
});

// // Test with a non-existent station
// Deno.test("Get liveboard from a non-existent station", async () => {
//   console.log("Testing getLiveboard with invalid station...");

//   const stationId = "invalid-id";
//   const stationName = "NonExistentStation123456789";
  
//   // Use current date in DDMMYYYY format
//   const today = new Date();
//   const date = `${String(today.getDate()).padStart(2, "0")}${
//     String(today.getMonth() + 1).padStart(2, "0")
//   }${today.getFullYear()}`;

//   // Use current time in HHMM format
//   const time = `${String(today.getHours()).padStart(2, "0")}${
//     String(today.getMinutes()).padStart(2, "0")
//   }`;
//   const lang = "en";

//   // Assert that the API call fails with a 404 error
//   await assertRejects(
//     async () => {
//       await getLiveboard(stationId, stationName, date, time, "departure", lang);
//     },
//     Error,
//     "Expected API call to fail with an error",
//   );
// });
