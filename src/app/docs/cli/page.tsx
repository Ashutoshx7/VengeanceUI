import type { Metadata } from "next";
import {
  DocsArticle,
  DocsCodeBlock,
  DocsHeader,
  DocsParagraph,
  DocsSection,
  InlineCode,
} from "@/components/docs/static-docs";
import { PackageCommand } from "@/components/docs/package-command";
import { getShadcnAddCommand } from "@/lib/registry";

const addAnimatedRaysCommand = getShadcnAddCommand("animated-rays");

export const metadata: Metadata = {
  title: "CLI Installation",
  description: "Install Vengeance UI components with the shadcn CLI and registry.",
  alternates: {
    canonical: "/docs/cli",
  },
};

export default function CliPage() {
  return (
    <DocsArticle>
      <DocsHeader
        title="CLI"
        description="Installing Vengeance UI with the shadcn CLI"
      />

      <DocsSection title="Initialization">
        <DocsParagraph>
          Use the <InlineCode>init</InlineCode> command to initialize a new
          shadcn project before adding registry components.
        </DocsParagraph>

        <PackageCommand
          commands={{
            npm: "npx shadcn@latest init",
            pnpm: "pnpm dlx shadcn@latest init",
            yarn: "yarn dlx shadcn@latest init",
            bun: "bunx shadcn@latest init",
          }}
        />

        <DocsCodeBlock
          code={`Which style would you like to use? New York
Which color would you like to use as base color? Zinc
Do you want to use CSS variables for colors? yes`}
        />
      </DocsSection>

      <DocsSection title="Add components">
        <DocsParagraph>
          Use the <InlineCode>add</InlineCode> command with the Vengeance UI
          registry URL from any component page.
        </DocsParagraph>

        <PackageCommand
          commands={{
            npm: addAnimatedRaysCommand,
            pnpm: addAnimatedRaysCommand.replace(/^npx/, "pnpm dlx"),
            yarn: addAnimatedRaysCommand.replace(/^npx/, "yarn dlx"),
            bun: addAnimatedRaysCommand.replace(/^npx/, "bunx"),
          }}
        />

        <DocsCodeBlock
          code={`Usage: shadcn add [options] [components...]

add a component to your project

Arguments:
  components        the components to add or a url to the component.

Options:
  -y, --yes         skip confirmation prompt
  -o, --overwrite   overwrite existing files
  -c, --cwd <cwd>   the working directory
  -p, --path <path> the path to add the component to
  -h, --help        display help for command`}
        />
      </DocsSection>

      <DocsSection title="Monorepo">
        <DocsParagraph>
          In a monorepo, pass the workspace path with <InlineCode>-c</InlineCode>{" "}
          or <InlineCode>--cwd</InlineCode>.
        </DocsParagraph>
        <PackageCommand
          commands={{
            npm: `${addAnimatedRaysCommand} -c ./apps/web`,
            pnpm: `${addAnimatedRaysCommand.replace(/^npx/, "pnpm dlx")} -c ./apps/web`,
            yarn: `${addAnimatedRaysCommand.replace(/^npx/, "yarn dlx")} -c ./apps/web`,
            bun: `${addAnimatedRaysCommand.replace(/^npx/, "bunx")} -c ./apps/web`,
          }}
        />
      </DocsSection>

      <DocsSection title="Namespaced registry">
        <DocsParagraph>
          If you prefer short component names, add a registry alias to{" "}
          <InlineCode>components.json</InlineCode>.
        </DocsParagraph>
        <DocsCodeBlock
          title="components.json"
          code={`{
  "registries": {
    "@vengeanceui": "https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/{name}.json"
  }
}`}
        />
        <PackageCommand
          commands={{
            npm: "npx shadcn@latest add @vengeanceui/animated-rays",
            pnpm: "pnpm dlx shadcn@latest add @vengeanceui/animated-rays",
            yarn: "yarn dlx shadcn@latest add @vengeanceui/animated-rays",
            bun: "bunx shadcn@latest add @vengeanceui/animated-rays",
          }}
        />
      </DocsSection>

      <DocsSection title="Agent skill + MCP">
        <DocsParagraph>
          Install the VengeanceUI agent skill, MCP server config, and
          instructions. In a terminal, <InlineCode>init</InlineCode> lets you
          arrow through Cursor, Claude, both, or MCP only, then confirm MCP
          config.
        </DocsParagraph>
        <PackageCommand
          commands={{
            npm: "npx vengeanceui init",
            pnpm: "pnpm dlx vengeanceui init",
            yarn: "yarn dlx vengeanceui init",
            bun: "bunx vengeanceui init",
          }}
        />
        <DocsCodeBlock
          code={`? Agent
❯ Cursor     skill, AGENTS.md
  Claude     skill, CLAUDE.md
  Both       Cursor + Claude
  MCP only   server config

? Configure MCP server? (Y/n)`}
        />
        <DocsParagraph>
          Skip the prompts with a target, or <InlineCode>-y</InlineCode> for
          Cursor + Claude + MCP (also the default when stdin is not a TTY):
        </DocsParagraph>
        <DocsCodeBlock
          code={`npx vengeanceui init cursor
npx vengeanceui init claude
npx vengeanceui init mcp
npx vengeanceui init -y`}
        />
        <DocsParagraph>
          MCP configs use <InlineCode>npx -y vengeanceui-mcp</InlineCode>. This
          does not replace shadcn <InlineCode>init</InlineCode> /{" "}
          <InlineCode>add</InlineCode> for installing components.
        </DocsParagraph>
        <DocsParagraph>
          Contributors cloning this repo can keep using a local MCP build at{" "}
          <InlineCode>packages/mcp</InlineCode>:
        </DocsParagraph>
        <DocsCodeBlock
          title=".cursor/mcp.json"
          code={`{
  "mcpServers": {
    "vengeance-ui": {
      "command": "node",
      "args": ["\${workspaceFolder}/packages/mcp/dist/index.js"]
    }
  }
}`}
        />
        <DocsParagraph>
          Build the server first:{" "}
          <InlineCode>cd packages/mcp && npm install && npm run build</InlineCode>
          .
        </DocsParagraph>
      </DocsSection>
    </DocsArticle>
  );
}
