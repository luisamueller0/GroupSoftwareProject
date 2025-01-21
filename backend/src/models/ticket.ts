export enum ticket_types {
    normal,
    child,
    senior,
    student
}

export type Ticket = {
    id : number,
    type : ticket_types,
    user_id : number,
    event_id : number,
    order_id: number
}