/* Node-side stand-in for the Workers-runtime 'cloudflare:email' module
   (aliased in vitest.config.ts). Mirrors the constructor shape the Worker
   uses so tests can assert on the exact raw message it builds. */
export class EmailMessage {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly raw: string,
  ) {}
}
