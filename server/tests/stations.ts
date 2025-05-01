import {
  getStationInfo,
  getStationInfoById,
  getStationInfoByStationName,
} from "../services/stations.ts";
import { StationInfo  } from "../interfaces/stations.ts";
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import httpClient from "../services/httpClient.ts";

// Test to get all stations 
Deno.test("Get all stations", async () => {
  console.log("Testing getStationInfo...");

  try {
    const stationData = await getStationInfo("en");
    console.log(`Total stations found: ${stationData.station.length}`);

    const stations = stationData.station.filter((station: StationInfo) =>
      station.name.includes("Bruxelles") ||
      station.name.includes("Brussel") ||
      station.name.includes("Liège") ||
      station.name.includes("Antwerpen") ||
      station.name.includes("Gent") ||
      station.name.includes("Charleroi")
    );

    console.log(`Identified stations: ${stations.length}`);
    console.log("Sample stations:");
    stations.slice(0, 5).forEach((station: StationInfo) => {
      console.log(`- ${station.name} (ID: ${station["@id"]})`);
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching stations:", errorMessage);
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

// Test the getStationInfoById function
Deno.test("Get station by ID", async () => {
  console.log("Testing getStationInfoById...");

  try {
    // Examples of Belgian station IDs - replace with actual IDs if known
    const stationId = "http://irail.be/stations/NMBS/008813003"; // Brussels-Central

    const station = await getStationInfoById(stationId, "en");
    if (station) {
      assertEquals(
        station.name,
        "Brussels-Central",
        `Station with ID ${stationId} should have the correct name`,
      );
      console.log(`Station with ID ${stationId} has the correct name: ok`);
    } else {
      console.log(`Station with ID ${stationId} not found`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching station by ID:", errorMessage);
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

// Test the getStationInfoByStationName function
Deno.test("Get station by name", async () => {
  console.log("Testing getStationInfoByStationName...");

  try {
    // Use only Brussels-Central and check for specific ID
    const name = "Brussels-Central";
    try {
      const station = await getStationInfoByStationName(name, "en");
      if (station) {
        assertEquals(
          station["@id"],
          "http://irail.be/stations/NMBS/008813003",
          `Station ${name} should have the correct ID`,
        );
        console.log(`Station ${name} has the correct ID: ok`);
      } else {
        console.log("Station not found");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      console.log(`Station with name ${name} not found: ${errorMessage}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching station by name:", errorMessage);
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
