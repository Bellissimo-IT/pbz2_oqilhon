import Plan from "./plan"

export default interface User {
    id: string
    name: string
    second_name?: string
    plan?: Plan
    planName?: string
}