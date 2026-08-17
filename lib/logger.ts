const APP_PREFIX = "[Workouts]";

/** Prefixed console logger — `createLogger("AI")` logs as
 * `[Workouts][AI] ...`, so app logs are easy to spot and filter by scope. */
export function createLogger(scope: string) {
  const prefix = `${APP_PREFIX}[${scope}]`;

  return {
    log: (...args: unknown[]) => console.log(prefix, ...args),
    warn: (...args: unknown[]) => console.warn(prefix, ...args),
    error: (...args: unknown[]) => console.error(prefix, ...args),
  };
}
