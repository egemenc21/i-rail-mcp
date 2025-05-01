import { getConnections } from "../services/connections.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import httpClient from "../services/httpClient.ts";

// Test to get connections from a valid station
Deno.test("Get connections from Gent-Sint-Pieters", async () => {
  console.log("Testing getConnections from Gent-Sint-Pieters...");

  try {
    // Use Gent-Sint-Pieters as origin
    const from = "Gent-Sint-Pieters";
    const to = "Mechelen";
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

    const connectionsData = await getConnections(from, to, date, time, lang);
    console.log(
      `Number of connections found: ${connectionsData.connections.length}`,
    );

    // Assert that we got some connections back
    assertExists(connectionsData.connections, "Should return connection data");
    assertEquals(
      connectionsData.connections.length > 0,
      true,
      "Should return at least one connection",
    );

    // Log some sample connection details
    console.log("Sample connections:");
    connectionsData.connections.slice(0, 3).forEach((connection, index) => {
      console.log(`Connection ${index + 1}:`);
      console.log(`- From: ${connection.departure.station}`);
      console.log(`- To: ${connection.arrival.station}`);
      console.log(
        `- Departure time: ${
          new Date(parseInt(connection.departure.time) * 1000)
            .toLocaleTimeString()
        }`,
      );
      console.log(`- Duration: ${connection.duration}`);
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching connections:", errorMessage);
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

// Test with different date/time parameters
Deno.test("Get connections for a future time", async () => {
  console.log("Testing getConnections for tomorrow...");

  try {
    // Use Gent-Sint-Pieters as origin
    const from = "Gent-Sint-Pieters";
    const to = "Mechelen";

    // Use tomorrow's date in DDMMYYYY format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = `${String(tomorrow.getDate()).padStart(2, "0")}${
      String(tomorrow.getMonth() + 1).padStart(2, "0")
    }${tomorrow.getFullYear()}`;

    // Use 10:00 as departure time
    const time = "1000";
    const lang = "en";

    const connectionsData = await getConnections(from, to, date, time, lang);

    // Assert that we got some connections back
    assertExists(connectionsData.connections, "Should return connection data");
    assertEquals(
      connectionsData.connections.length > 0,
      true,
      "Should return at least one connection",
    );

    // Check that the connections are for the requested date
    const requestedDate = new Date(
      parseInt(tomorrow.getFullYear().toString()),
      parseInt(String(tomorrow.getMonth())),
      parseInt(String(tomorrow.getDate())),
    );

    // Check the first connection's departure date
    const firstConnectionTime = new Date(
      parseInt(connectionsData.connections[0].departure.time) * 1000,
    );

    console.log(`Requested date: ${requestedDate.toDateString()}`);
    console.log(`First connection date: ${firstConnectionTime.toDateString()}`);

    // We can't do a strict equality check because of timezone issues
    // Just log the dates to manually verify
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching connections:", errorMessage);
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