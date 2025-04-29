import { Connection, ConnectionsResponse, SimpleConnection, TransferStop, Via } from "../interfaces/connections.ts";
import httpClient from "./httpClient.ts";
import { formatTime } from "../helpers/time.ts";

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
    
    // Process transfer stops if there are vias
    const transferStops: TransferStop[] = [];
    if (conn.vias && parseInt(conn.vias.number) > 0) {
      conn.vias.via.forEach((via: Via) => {
        // Add train to trains array
        trains.push({
          number: via.departure.vehicleinfo.shortname,
          type: via.departure.vehicleinfo.type,
          direction: via.departure.direction?.name || '',
        });
        
        // Calculate wait time at transfer station in minutes
        const arrivalTime = parseInt(via.arrival.time);
        const departureTime = parseInt(via.departure.time);
        const waitMinutes = (departureTime - arrivalTime) / 60;
        
        // Format wait time
        const waitHours = Math.floor(waitMinutes / 60);
        const waitMins = Math.floor(waitMinutes % 60);
        const formattedWaitTime = `${waitHours > 0 ? waitHours + 'h ' : ''}${waitMins}min`;
        
        // Add transfer stop information
        transferStops.push({
          station: via.station,
          arrival: {
            time: via.arrival.time,
            formattedTime: formatTime(via.arrival.time),
            platform: via.arrival.platform,
            delay: parseInt(via.arrival.delay) / 60,
            train: {
              number: via.arrival.vehicleinfo.shortname,
              type: via.arrival.vehicleinfo.type,
            }
          },
          departure: {
            time: via.departure.time,
            formattedTime: formatTime(via.departure.time),
            platform: via.departure.platform,
            delay: parseInt(via.departure.delay) / 60,
            train: {
              number: via.departure.vehicleinfo.shortname,
              type: via.departure.vehicleinfo.type,
              direction: via.departure.direction?.name || '',
            }
          },
          waitTime: {
            minutes: waitMinutes,
            formatted: formattedWaitTime,
          }
        });
      });
    }
    
    return {
      id: conn.id,
      departure: {
        station: conn.departure.station,
        time: conn.departure.time,
        formattedTime: formatTime(conn.departure.time),
        platform: conn.departure.platform,
        delay: parseInt(conn.departure.delay) / 60, // convert to minutes
        canceled: conn.departure.canceled === "1",
      },
      arrival: {
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
      transferStops,
      occupancy: conn.departure.occupancy?.name,
    };
  });
  
  return { connections: cleanConnections };
}
