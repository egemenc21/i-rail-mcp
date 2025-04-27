import { getStationInfo, getStationInfoById, getStationInfoByStationName } from "../services/stations.ts";
import { Station } from "../interfaces/stations.ts";

// Test to get all stations and filter for Belgian ones
Deno.test("Get all stations and find Belgian ones", async () => {
  console.log("Testing getStationInfo to find Belgian stations...");
  
  try {
    const stationData = await getStationInfo("en");
    console.log(`Total stations found: ${stationData.station.length}`);
    
    // A basic heuristic to identify Belgian stations - this is an example approach
    // Belgian stations often have BE in the ID or have specific naming patterns
    const belgianStations = stationData.station.filter((station: Station) => 
      station.name.includes("Bruxelles") ||
      station.name.includes("Brussel") ||
      station.name.includes("Liège") ||
      station.name.includes("Antwerpen") ||
      station.name.includes("Gent") ||
      station.name.includes("Charleroi")
    );
    
    console.log(`Identified Belgian stations: ${belgianStations.length}`);
    console.log("Sample Belgian stations:");
    belgianStations.slice(0, 5).forEach((station: Station) => {
      console.log(`- ${station.name} (ID: ${station["@id"]})`);
    });
  } catch (error) {
    console.error("Error fetching stations:", error);
  }
});

// Test the getStationInfoById function
Deno.test("Get station by ID", async () => {
  console.log("Testing getStationInfoById...");
  
  try {
    // Examples of Belgian station IDs - replace with actual IDs if known
    const stationIds = ["http://irail.be/stations/NMBS/008863156", "http://irail.be/stations/NMBS/008871308"];
    
    for (const id of stationIds) {
      const station = await getStationInfoById(id, "en");
      console.log(`Station with ID ${id}:`, station ? station.name : "Not found");
    }
  } catch (error) {
    console.error("Error fetching station by ID:", error);
  }
});

// Test the getStationInfoByStationName function
Deno.test("Get station by name", async () => {
  console.log("Testing getStationInfoByStationName...");
  
  try {
    // Examples of Belgian station names - replace with actual names if known
    const stationNames = ["Bruxelles-Central", "Antwerpen-Centraal"];
    
    for (const name of stationNames) {
      try {
        const station = await getStationInfoByStationName(name, "en");
        console.log(`Station with name ${name}:`, station ? `${station.name} (ID: ${station["@id"]})` : "Not found");
      } catch (error) {
        console.log(`Station with name ${name} not found`);
      }
    }
  } catch (error) {
    console.error("Error fetching station by name:", error);
  }
});
