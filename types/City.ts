import User from "./user";

export interface City {
    id: string
    name: string
    price_for_region: string
    customer: User[]
    created_at: string
}