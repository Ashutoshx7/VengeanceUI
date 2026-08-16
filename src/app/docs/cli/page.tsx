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
            npm: "npx shadcn@latest add https://www.vengenceui.com/r/animated-rays.json -c ./apps/web",
            pnpm: "pnpm dlx shadcn@latest add https://www.vengenceui.com/r/animated-rays.json -c ./apps/web",
            yarn: "yarn dlx shadcn@latest add https://www.vengenceui.com/r/animated-rays.json -c ./apps/web",
            bun: "bunx shadcn@latest add https://www.vengenceui.com/r/animated-rays.json -c ./apps/web",
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
    "@vengeanceui": "https://www.vengenceui.com/r/{name}.json"
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

      <DocsSection title="Cursor agent skill + MCP">
        <DocsParagraph>
          This repo ships a Cursor skill at{" "}
          <InlineCode>.cursor/skills/vengeance-ui/</InlineCode> so agents prefer
          registry components over reinventing UI. Pair it with the{" "}
          <InlineCode>vengeanceui-mcp</InlineCode> server under{" "}
          <InlineCode>packages/mcp</InlineCode> to search the catalog, read
          props/usage, and get install commands.
        </DocsParagraph>
        <DocsParagraph>
          Project-level Cursor config at{" "}
          <InlineCode>.cursor/mcp.json</InlineCode> (from a clone of this
          repository):
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
          For global <InlineCode>~/.cursor/mcp.json</InlineCode>, use an
          absolute path to <InlineCode>dist/index.js</InlineCode>. Build the
          server first:{" "}
          <InlineCode>cd packages/mcp && npm install && npm run build</InlineCode>
          . When the package is published to npm, you can switch to{" "}
          <InlineCode>npx -y vengeanceui-mcp</InlineCode>. See{" "}
          <InlineCode>packages/mcp/README.md</InlineCode> for tools and index
          regeneration.
        </DocsParagraph>
      </DocsSection>
    </DocsArticle>
  );
}
