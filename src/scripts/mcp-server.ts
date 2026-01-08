#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ErrorCode,
    McpError,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';

const REGISTRY_DIR = path.join(process.cwd(), 'public', 'r');
const REGISTRY_INDEX = path.join(REGISTRY_DIR, 'registry.json');

// Define the Registry Index Item interface based on build-registry.ts output
interface RegistryIndexItem {
    name: string;
    dependencies: string[];
    type: string;
    files: string[];
}

// Define the Registry Item interface
interface RegistryItem {
    $schema: string;
    name: string;
    type: string;
    dependencies: string[];
    files: Array<{
        path: string;
        content: string;
        type: string;
        target: string;
    }>;
}

class McpServer {
    private server: Server;

    constructor() {
        this.server = new Server(
            {
                name: 'vengeance-ui',
                version: '0.1.0',
            },
            {
                capabilities: {
                    resources: {},
                },
            }
        );

        this.setupResourceHandlers();

        // Error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    private setupResourceHandlers() {
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            if (!fs.existsSync(REGISTRY_INDEX)) {
                return {
                    resources: []
                };
            }

            const registryContent = fs.readFileSync(REGISTRY_INDEX, 'utf-8');
            const registry: RegistryIndexItem[] = JSON.parse(registryContent);

            return {
                resources: registry.map(item => ({
                    uri: `vengeance://${item.name}`,
                    name: item.name,
                    mimeType: 'application/json',
                    description: `Component: ${item.name}`
                }))
            };
        });

        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const uri = request.params.uri;
            const matchingName = uri.replace('vengeance://', '');

            if (!fs.existsSync(REGISTRY_INDEX)) {
                throw new McpError(ErrorCode.InternalError, 'Registry not found');
            }

            // We need to look up the component to find where its definition file is, 
            // though strictly speaking we know it is likely public/r/<name>.json based on build-registry.ts
            const componentPath = path.join(REGISTRY_DIR, `${matchingName}.json`);

            if (!fs.existsSync(componentPath)) {
                throw new McpError(ErrorCode.InvalidRequest, `Component not found: ${matchingName}`);
            }

            const componentContent = fs.readFileSync(componentPath, 'utf-8');

            // We return the content of the JSON file which contains the "files" array with code.
            return {
                contents: [
                    {
                        uri: uri,
                        mimeType: 'application/json',
                        text: componentContent
                    }
                ]
            };
        });
    }

    async run() {
        const serverTransport = new StdioServerTransport();
        await this.server.connect(serverTransport);
        console.error('Vengeance UI MCP Server running on stdio');
    }
}

const server = new McpServer();
server.run().catch(console.error);
