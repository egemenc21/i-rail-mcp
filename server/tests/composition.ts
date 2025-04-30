import { getComposition, Data } from "../services/composition.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";

// Test to verify train composition data
Deno.test("Verify train composition data", async () => {
  console.log("Testing train composition data...");

  try {
    const vehicleId = "IC734"; // Example vehicle ID
    const fromId = "BE.NMBS.008892007"; // Gent-Sint-Pieters ID
    const toId = "BE.NMBS.008821006"; // Antwerpen-Centraal ID
    const lang = "en";

    const compositionData = await getComposition(vehicleId, fromId, toId, Data.all, lang);

    // Verify that we received composition data
    assertExists(compositionData, "Should return composition data");

    // If we got a specific segment (when from and to are provided)
    if (compositionData && 'origin' in compositionData) {
      // Test segment data
      const segment = compositionData;
      assertEquals(segment.origin.id, fromId, "Origin ID should match");
      assertEquals(segment.destination.id, toId, "Destination ID should match");

      // Log segment details
      console.log("\nSegment details:");
      console.log(`From: ${segment.origin.name} (${segment.origin.id})`);
      console.log(`To: ${segment.destination.name} (${segment.destination.id})`);

      // Verify composition details
      assertExists(segment.composition, "Should have composition details");
      assertExists(segment.composition.units, "Should have units information");
      
      // Log composition details
      console.log("\nComposition details:");
      console.log(`Source: ${segment.composition.source}`);
      if (segment.composition.units.unit) {
        segment.composition.units.unit.forEach((unit, index) => {
          console.log(`\nUnit ${index + 1}:`);
          console.log(`Type: ${unit.materialType.parent_type} - ${unit.materialType.sub_type}`);
          console.log(`Length: ${unit.lengthInMeter}m`);
          console.log(`First Class Seats: ${unit.seatsFirstClass}`);
          console.log(`Second Class Seats: ${unit.seatsSecondClass}`);
        });
      }
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching composition data:", errorMessage);
    throw error; // Re-throw to fail the test
  }
});
