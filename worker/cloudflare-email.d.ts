/* Minimal typing for the Workers-runtime-only module. The project only needs
   the EmailMessage constructor; pulling in @cloudflare/workers-types for one
   class is not worth the dependency. */
declare module 'cloudflare:email' {
  export class EmailMessage {
    constructor(from: string, to: string, raw: string)
    readonly from: string
    readonly to: string
  }
}
