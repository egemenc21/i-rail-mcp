import { getVehicleInfoByVehicleId } from "../services/vehicles.ts";
import { SimpleStop } from "../interfaces/vehicles.ts";
import {
  assertEquals,
  assertExists,
  assertRejects,
} from "https://deno.land/std@0.208.0/assert/mod.ts";

// Test to get vehicle info for a valid vehicle ID
Deno.test("Get vehicle info for a valid train", async () => {
  console.log("Testing getVehicleInfoByVehicleId with a valid train ID...");

  try {
    const vehicleId = "BE.NMBS.IC1509"; // Example train ID
    
    // Use current date in DDMMYYYY format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = `${String(tomorrow.getDate()).padStart(2, "0")}${
      String(tomorrow.getMonth() + 1).padStart(2, "0")
    }${tomorrow.getFullYear()}`;
    
    const lang = "en";

    const vehicleData = await getVehicleInfoByVehicleId(vehicleId, date, lang);
    console.log(`Vehicle info retrieved for: ${vehicleId}`);

    // Assert that we got vehicle data back
    assertExists(vehicleData, "Should return vehicle data");
    console.log(JSON.stringify(vehicleData, null, 2));
    assertExists(vehicleData.name, "Should have vehicle information");
    assertExists(vehicleData.journey, "Should have stops information");
    assertEquals(
      Array.isArray(vehicleData.journey),
      true,
      "Should return an array of stops",
    );

    // Log some sample vehicle details
    console.log("Vehicle details:");
    console.log(`- Vehicle ID: ${vehicleData.name}`);
    console.log(`- Number of stops: ${vehicleData.journey.length}`);
    
    // Log first 3 stops if available
    console.log("Sample stops:");
    vehicleData.journey.slice(0, 3).forEach((stop: SimpleStop, index: number) => {
      console.log(`Stop ${index + 1}:`);
      console.log(`- Station: ${stop.station}`);
      console.log(`- Scheduled Arrival: ${stop.scheduledArrival.formattedTime || 'N/A'}`);
      console.log(`- Scheduled Departure: ${stop.scheduledDeparture.formattedTime || 'N/A'}`);
      console.log(`- Platform: ${stop.platform}`);
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching vehicle info:", errorMessage);
    throw error; // Re-throw to make the test fail
  }
});

// // Test with a non-existent vehicle ID
// Deno.test("Get vehicle info for an invalid train ID", async () => {
//   console.log("Testing getVehicleInfoByVehicleId with invalid train ID...");

//   const vehicleId = "BE.NMBS.INVALID123456789";
  
//   // Use current date in DDMMYYYY format
//   const today = new Date();
//   const date = `${String(today.getDate()).padStart(2, "0")}${
//     String(today.getMonth() + 1).padStart(2, "0")
//   }${today.getFullYear()}`;
  
//   const lang = "en";

//   // Assert that the API call fails with an error
//   await assertRejects(
//     async () => {
//       await getVehicleInfoByVehicleId(vehicleId, date, lang);
//     },
//     Error,
//     "Expected API call to fail with an error",
//   );
// });
