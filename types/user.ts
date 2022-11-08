export default interface User {
    id: string
    name: string
    second_name?: string
    region_id: string
    plan_id: string
    debts?: number
    address?: string
    created_at: Date
}