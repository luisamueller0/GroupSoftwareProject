export enum ticket_types {
  normal,
  child,
  senior,
  student,
  INVALID
}

export type TicketGroup = {
    picture: string,
    event_id: number,
    title: string
    number: string,
    start_date: string,
    end_date: string
  }
  
