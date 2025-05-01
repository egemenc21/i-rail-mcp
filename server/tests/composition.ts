import { Data } from "../interfaces/composition.ts";
import { getSimpleComposition} from "../services/composition.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";

// Test to verify train composition data
Deno.test("Verify train composition data", async () => {
  console.log("Testing train composition data...");

  try {
    const vehicleId = "IC735"; // Example vehicle ID
    const fromId = "BE.NMBS.008892007"; // Gent-Sint-Pieters ID
    const toId = "BE.NMBS.008821006"; // Antwerpen-Centraal ID
    const lang = "en";

    const compositionData = await getSimpleComposition(vehicleId, fromId, toId, Data.all, lang);

    // Verify that we received composition data
    assertExists(compositionData, "Should return composition data");

    // If we got a specific segment (when from and to are provided)
    if (compositionData) {
      // Test segment data
      const segment = compositionData;
      // Log segment details
      console.log("\nSegment details:");
      console.log(`From: ${segment.journey.from.name} (${segment.journey.from.id})`);
      console.log(`To: ${segment.journey.to.name} (${segment.journey.to.id})`);

      // Verify composition details
      assertExists(segment.units, "Should have units information");
      
      // Log composition details
      console.log("\nComposition details:");
      if (segment.units) {
        segment.units.forEach((unit, index) => {
          console.log(`\nUnit ${index + 1}:`);
          console.log(`Type: ${unit.type}`);
          console.log(`Length: ${unit.length}m`);
          console.log(`First Class Seats: ${unit.firstClassSeats}`);
          console.log(`Second Class Seats: ${unit.secondClassSeats}`);
          console.log(`First Class Seats Left: ${unit.seatsLeftFirstClass}`);
          console.log(`Second Class Seats Left: ${unit.seatsLeftSecondClass}`);
        });
      }
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching composition data:", errorMessage);
    throw error; // Re-throw to fail the test
  }
});
