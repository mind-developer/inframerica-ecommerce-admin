/** Orders screen settings (prototype: browser storage; here, server-side mock). */
export interface OrderSettings {
  /** Pending orders older than this are auto-canceled (visual only: the job doesn't run). */
  autoCancelDays: number;
  /** BI integration token (mock, no endpoint behind it). */
  biToken: string;
}
