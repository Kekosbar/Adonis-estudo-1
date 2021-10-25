export default interface User {
  id?: number,
  name: string,
  age: number,
  email?: string,
  team_id: number,
  created_at?: Date,
  updated_at?: Date,
}