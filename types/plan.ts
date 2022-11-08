import User from "../types/user"
export default interface Plan {
  id: string
  name: string
  default_price: number
  users?: User[]
  created_at: Date
}