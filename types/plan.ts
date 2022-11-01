import User from "../types/user"
export default interface Plan {
  id: string
  name: string
  price: number
  users?: User[]
}