export function ok(message: string) {
  console.log(`✔ ${message}`);
}

export function info(message: string) {
  console.log(message);
}

export function dry(message: string) {
  console.log(`[dry-run] ${message}`);
}
