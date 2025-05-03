# i-rail-mcp

A Model Context Protocol (MCP) server for accessing Belgian railway information, providing real-time data on train schedules, stations, connections, and more.

## Overview

This project implements an MCP server that provides AI assistants with tools to access Belgian railway data. It allows users to:

- Find information about train stations
- Check train connections between stations
- View liveboards (arrivals/departures at stations)
- Get vehicle/train information and routes
- Access train composition details (seating, facilities, etc.)

## Prerequisites

- [Deno](https://deno.com/) v1.40.0 or higher
- API access to Belgian railway data which has public API [iRail](https://docs.irail.be/)

### Installing Deno

You can install Deno directly:

```bash
# Using curl (macOS/Linux)
curl -fsSL https://deno.land/x/install/install.sh | sh

# Using PowerShell (Windows)
irm https://deno.land/install.ps1 | iex
```

Or install using npm:

```bash
# Install deno using npm
npm install -g deno

# Verify installation
deno --version
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/egemenc21/i-rail-mcp.git
   cd i-rail-mcp
   ```

2. Create a `.env` file in the `server` directory with your API credentials:
   ```
   API_KEY=your_api_key_here
   USER_AGENT="iRail-MCP-Agent/1.0.0 (www.yourwebsite.com;your.email@example.com)"
   ```
   
   > **Note:** The USER_AGENT is required by the iRail API to identify who is making the requests. Please provide your credentials and email.

3. Install dependencies (handled by Deno automatically when running the server) or use in server directory:
    ```
    deno install
    ```


## Running the Server

Navigate to the server directory and run:

```bash
cd server
deno task start
```

For development with auto-reload:

```bash
deno task dev
```

## MCP Client Integration

This MCP server can be integrated with any MCP-compatible client that supports tools functionality. Popular clients include [Cursor](https://cursor.com), [Claude Desktop App](https://claude.ai/download), VS Code with GitHub Copilot, and many others listed on the [MCP clients page](https://modelcontextprotocol.io/clients).

### Client Configuration

To configure an MCP client to use this server, add the following configuration to your client's MCP settings:

```json
{
  "mcpServers": {
    "i-rail-mcp-server": {
      "command": "deno",
      "args": ["run", "--env-file", "-A", "/path/to/i-rail-mcp/server/main.ts"],
      "env": {
        "API_URL": "https://api.irail.be"
      }
    }
  }
}
```

Replace `/path/to/i-rail-mcp` with the actual path where you've cloned this repository.

### Integration Examples:

1. **Cursor**: Add the configuration to `~/.cursor/mcp.json`
2. **Claude Desktop App**: Configure in the MCP settings panel
3. **VS Code**: Add to your settings.json under the Copilot configuration

Once configured, the railway information tools will be available to your AI assistant, allowing it to fetch and display real-time train information in response to your queries.

## Testing

The project includes test cases for each module:

```bash
deno task test-stations    # Test station-related functionality
deno task test-connections # Test connection-related functionality
deno task test-liveboard   # Test liveboard functionality
deno task test-vehicles    # Test vehicle information functionality
deno task test-composition # Test train composition functionality
```

## Examples

### Finding Train Connections

You can use this MCP server to find train connections between stations with details about journey duration, transfers, and more.

Example query:
```
Find trains from Gent-Sint-Pieters to Antwerp-Central on May 2nd, 2025, around 2 PM
```

Response:
```json
{
  "id": "1",
  "departure": {
    "station": "Ghent-Sint-Pieters",
    "time": "1746185220",
    "formattedTime": "14:27",
    "platform": "2",
    "delay": 0,
    "canceled": false
  },
  "arrival": {
    "station": "Antwerp-Central",
    "time": "1746188580",
    "formattedTime": "15:23",
    "platform": "2",
    "delay": 0,
    "canceled": false
  },
  "duration": {
    "minutes": 56,
    "formatted": "56min"
  },
  "trains": [
    {
      "number": "IC 734",
      "type": "IC",
      "direction": "Antwerp-Central"
    }
  ],
  "transfers": 0,
  "transferStops": [],
  "occupancy": "low"
}
```

### Getting Train Composition

You can retrieve detailed information about a specific train, including:
- Available seats
- Bike sections
- Toilets and other facilities

Example query:
```
Get composition for train IC734 from Gent-Sint-Pieters to Antwerp-Central
```

Response includes details about seating capacity, available facilities, and more.

### Station Information

Look up information about train stations, including their identifiers and geographic coordinates.

Example query:
```
Get information about Gent-Sint-Pieters station
```

Response:
```json
{
  "@id": "http://irail.be/stations/NMBS/008892007",
  "id": "BE.NMBS.008892007",
  "name": "Ghent-Sint-Pieters",
  "locationX": "3.710675",
  "locationY": "51.035896",
  "standardname": "Gent-Sint-Pieters"
}
```

## Architecture

This project is built using:
- Deno runtime
- Model Context Protocol (MCP) for AI tool integration
- TypeScript
- Zod for schema validation

The server exposes several tools that can be invoked by AI assistants through the MCP protocol to retrieve railway information.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE) 