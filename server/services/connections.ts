import { Connection, ConnectionsResponse } from "../interfaces/connections.ts";
import httpClient from "./httpClient.ts";

// Type definition for our cleaner response format
export interface SimpleConnection {
  id: string;
  from: {
    station: string;
    time: string;
    formattedTime: string;
    platform: string;
    delay: number;
    canceled: boolean;
  };
  to: {
    station: string;
    time: string;
    formattedTime: string;
    platform: string;
    delay: number;
    canceled: boolean;
  };
  duration: {
    minutes: number;
    formatted: string;
  };
  trains: {
    number: string;
    type: string;
    direction: string;
  }[];
  transfers: number;
  occupancy?: string;
}

export async function getConnections(
  from: string,
  to: string,
  date: string,
  time: string,
  lang: string,
): Promise<{ connections: SimpleConnection[] }> {
  const endpoint = `/connections/` +
    `?from=${from}` +
    `&to=${to}` +
    `&date=${date}` +
    `&time=${time}` +
    `&timesel=departure` +
    `&format=json` +
    `&lang=${lang}` +
    `&typeOfTransport=automatic` +
    `&alerts=false` +
    `&results=6`;
  
  console.log(endpoint);
  const response = await httpClient.get<ConnectionsResponse>(endpoint);
  
  // Transform the complex response into a simpler format
  const cleanConnections: SimpleConnection[] = response.data.connection.map((conn: Connection) => {
    // Calculate duration in minutes
    const durationMinutes = parseInt(conn.duration) / 60;
    
    // Format duration as hours and minutes
    const hours = Math.floor(durationMinutes / 60);
    const minutes = Math.floor(durationMinutes % 60);
    const formattedDuration = `${hours > 0 ? hours + 'h ' : ''}${minutes}min`;
    
    // Get train information from departure and vias
    const trains = [{
      number: conn.departure.vehicleinfo.shortname,
      type: conn.departure.vehicleinfo.type,
      direction: conn.departure.direction?.name || '',
    }];
    
    // Add trains from vias
    if (conn.vias && parseInt(conn.vias.number) > 0) {
      conn.vias.via.forEach(via => {
        trains.push({
          number: via.departure.vehicleinfo.shortname,
          type: via.departure.vehicleinfo.type,
          direction: via.departure.direction?.name || '',
        });
      });
    }
    
    return {
      id: conn.id,
      from: {
        station: conn.departure.station,
        time: conn.departure.time,
        formattedTime: formatTime(conn.departure.time),
        platform: conn.departure.platform,
        delay: parseInt(conn.departure.delay) / 60, // convert to minutes
        canceled: conn.departure.canceled === "1",
      },
      to: {
        station: conn.arrival.station,
        time: conn.arrival.time,
        formattedTime: formatTime(conn.arrival.time),
        platform: conn.arrival.platform,
        delay: parseInt(conn.arrival.delay) / 60, // convert to minutes
        canceled: conn.arrival.canceled === "1",
      },
      duration: {
        minutes: durationMinutes,
        formatted: formattedDuration,
      },
      trains,
      transfers: parseInt(conn.vias?.number || "0"),
      occupancy: conn.departure.occupancy?.name,
    };
  });
  
  return { connections: cleanConnections };
}

// Helper function to format Unix timestamp to readable time
function formatTime(unixTime: string): string {
  const date = new Date(parseInt(unixTime) * 1000);
  
  // Format as HH:MM
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}