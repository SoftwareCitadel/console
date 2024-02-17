export type Message = {
  id: number
  body: string
  createdAt: string
  user: {
    id: number
    fullName: string
    email: string
  }
  channel?: { slug: string }
  conversation?: { id: number }
}
