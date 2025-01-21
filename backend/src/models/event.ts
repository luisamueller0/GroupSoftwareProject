export type Event = {
    id: string,
    title: string,
    start_date: string,
    end_date: string,
    is_past: boolean,
    location: string,
    picture: string,
    price: string,
    price_child: string,
    price_senior: string,
    price_student: string,
    description: string,
    description_html: string,
    eventLocation: {
        coordinates_lat: number,
        coordinates_lng: number
    }
}