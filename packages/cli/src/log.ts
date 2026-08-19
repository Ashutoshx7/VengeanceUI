const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const TRUECOLOR_ZINC = "\x1b[38;2;161;161;170m";
const TRUECOLOR_INDIGO = "\x1b[38;2;99;102;241m";

function wantsColor(stream: NodeJS.WriteStream) {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR === "0") return false;
  if (process.env.FORCE_COLOR) return true;
  return Boolean(stream.isTTY);
}

function truecolor() {
  return process.env.COLORTERM === "truecolor" || process.env.COLORTERM === "24bit";
}

function paint(stream: NodeJS.WriteStream, codes: string, text: string) {
  if (!wantsColor(stream)) return text;
  return `${codes}${text}${RESET}`;
}

export const color = {
  bold: (text: string) => paint(process.stdout, BOLD, text),
  dim: (text: string) =>
    paint(process.stdout, truecolor() ? TRUECOLOR_ZINC : DIM, text),
  green: (text: string) => paint(process.stdout, GREEN, text),
  yellow: (text: string) => paint(process.stdout, YELLOW, text),
  cyan: (text: string) =>
    paint(
      process.stdout,
      truecolor() ? TRUECOLOR_INDIGO : CYAN,
      text,
    ),
  red: (text: string) => paint(process.stderr, RED, text),
  boldRed: (text: string) => paint(process.stderr, `${BOLD}${RED}`, text),
};

export function banner(opts: { dryRun: boolean; target: string }) {
  const name = color.bold("VengeanceUI");
  const command =
    opts.target === "all" ? "init" : `init ${opts.target}`;
  console.log();
  console.log(`  ${name}  ${color.dim(command)}`);
  if (opts.dryRun) {
    console.log(`  ${color.yellow("DRY RUN")}  ${color.dim("no files will be written")}`);
  }
  console.log();
}

export function ok(title: string) {
  console.log(`  ${color.green("✔")}  ${title}`);
}

export function row(label: string, path: string, status: string) {
  const padded = label.padEnd(8, " ");
  console.log(
    `     ${color.dim(padded)}${path}  ${color.dim(status)}`,
  );
}

export function done(command: string) {
  console.log();
  console.log(`  ${color.dim("Done. Reload the agent, then:")}`);
  console.log();
  console.log(`  ${command}`);
  console.log();
}

export function error(message: string) {
  console.error(`${color.boldRed("error")}  ${message}`);
}
