# VengeanceUI MCP Integration

VengeanceUI supports the [Model Context Protocol (MCP)](https://modelcontextprotocol.io) through the [Shadcn MCP Server](https://github.com/shadcn-ui/mcp-server). This allows AI assistants (like Cursor, Claude Desktop) to browse and install VengeanceUI components directly.

## Setup

### 1. Update `components.json`

Add the VengeanceUI registry to your project's `components.json` file:

```json
{
  "registries": {
    "@vengeance": "https://www.vengenceui.com/r/{name}.json"
  }
}
```

### 2. Initialize MCP Server

Run the initialization command for your project:

```bash
npx shadcn@latest mcp init
```

For Cursor users:

```bash
npx shadcn@latest mcp init --client cursor
```

## Usage

Once configured, you can ask your AI assistant to add components:

- "Add the animated-button component from VengeanceUI"
- "Search for VengeanceUI components"
- "Install @vengeance/card"

## How it Works

The MCP server reads your `components.json` configuration and connects to the VengeanceUI registry. This allows the AI to see the list of available components and their code, enabling seamless integration.
