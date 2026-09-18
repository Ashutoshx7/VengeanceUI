import type { Metadata } from "next";
import {
  DocsArticle,
  DocsCodeBlock,
  DocsHeader,
  DocsParagraph,
  DocsSection,
  InlineCode,
} from "@/components/docs/static-docs";
import { getShadcnAddCommand } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Theming",
  description: "Customize VengeanceUI colors, radii, spacing, and transitions.",
  alternates: { canonical: "/docs/theming" },
};

export default function ThemingPage() {
  return (
    <DocsArticle>
      <DocsHeader
        title="Theming"
        description="Change shared design values in one place."
      />

      <DocsSection title="Install the theme tokens">
        <DocsParagraph>
          Add the optional theme item to a Tailwind CSS v4 project set up with
          shadcn/ui. It adds light and dark <InlineCode>--vng-*</InlineCode> values
          to your global CSS and connects the shared colors to shadcn tokens.
        </DocsParagraph>
        <DocsCodeBlock code={getShadcnAddCommand("vengeance-theme")} />
      </DocsSection>

      <DocsSection title="Set your colors">
        <DocsParagraph>
          Edit the generated values in your global CSS. Set dark colors in the
          <InlineCode>.dark</InlineCode> block as well.
        </DocsParagraph>
        <DocsCodeBlock
          title="app/globals.css"
          code={`:root {
  --vng-primary: #2563eb;
  --vng-primary-hover: #1d4ed8;
  --vng-primary-foreground: #ffffff;
  --vng-radius-md: 10px;
  --vng-transition-speed: 200ms;
}

.dark {
  --vng-primary: #60a5fa;
  --vng-primary-hover: #93c5fd;
  --vng-primary-foreground: #09090b;
}`}
        />
        <DocsParagraph>
          The theme also provides secondary, danger, success, warning, background,
          border, radius, and spacing tokens. Components copied by hand still
          work with the standard shadcn color tokens; add the theme item when
          you want the shared VengeanceUI controls.
        </DocsParagraph>
      </DocsSection>
    </DocsArticle>
  );
}
