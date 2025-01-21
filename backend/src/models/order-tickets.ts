/*
    Represents a ticketgroup (grouped by event), used for showing orders
*/
export type OrderTickets = {
    normal_tickets: number,
    child_tickets: number,
    senior_tickets: number,
    student_tickets: number,
    type: number,
    title: string,
    start_date: string,
    end_date: string
}
