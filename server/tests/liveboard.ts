import { getLiveboard } from "../services/liveboard.ts";
import { TrainStationResponse, TrainDeparturesResponse, TrainArrivalsResponse } from "../interfaces/liveboard.ts";
import {
  assertEquals,
  assertExists,
  assertRejects,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import httpClient from "../services/httpClient.ts";

// Test to get liveboard from a valid station
Deno.test("Get departure liveboard from Gent-Sint-Pieters", async () => {
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
  } finally {
    // Clean up TCP connections by closing the axios http agent
    // This ensures all TCP connections are properly closed
    if (httpClient.defaults.httpAgent) {
      httpClient.defaults.httpAgent.destroy();
    }
    if (httpClient.defaults.httpsAgent) {
      httpClient.defaults.httpsAgent.destroy();
    }
    
    // For Deno's compatibility with axios, we need to explicitly close any open connections
    // Wait a short time to allow any pending operations to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
});

Deno.test("Get arrival liveboard from Gent-Sint-Pieters", async () => {
  console.log("Testing getLiveboard to Gent-Sint-Pieters...");

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

    const liveboardData = await getLiveboard(stationId, stationName, date, time, "arrivals", lang) as TrainArrivalsResponse;
    console.log(`Number of arrivals found: ${liveboardData.arrivals.arrival.length}`);

    // Assert that we got some departures back
    assertExists(liveboardData.arrivals, "Should return arrival data");
    assertExists(liveboardData.arrivals.arrival, "Should have arrival information");
    assertEquals(
      Array.isArray(liveboardData.arrivals.arrival),
      true,
      "Should return an array of arrivals",
    );

    // Log some sample departure details
    console.log("Sample arrivals:");
    liveboardData.arrivals.arrival.slice(0, 3).forEach((arrival, index) => {
      console.log(`Arrival ${index + 1}:`);
      console.log(`- Platform: ${arrival.platform}`);
      console.log(`- Station: ${arrival.station}`);
      console.log(`- Time: ${arrival.time}`);
      console.log(`- Vehicle: ${arrival.vehicle}`);
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching liveboard:", errorMessage);
    throw error; // Re-throw to make the test fail
  } finally {
    // Clean up TCP connections by closing the axios http agent
    // This ensures all TCP connections are properly closed
    if (httpClient.defaults.httpAgent) {
      httpClient.defaults.httpAgent.destroy();
    }
    if (httpClient.defaults.httpsAgent) {
      httpClient.defaults.httpsAgent.destroy();
    }
    
    // For Deno's compatibility with axios, we need to explicitly close any open connections
    // Wait a short time to allow any pending operations to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
});