// Used for the api-calls of the payment services
export type Option = {
    hostname: string,
    port: number,
    path: string,
    method: string

    headers: {                              // this can be left undefined for the SPWsafe-Service
          'Content-Type' : string,
          'Content-Length' : number
    };
}