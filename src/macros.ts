import { Request, Response } from '@adonisjs/core/http'

Request.macro('wantsJSON', function (this: Request) {
  const firstType = this.types()[0]
  if (!firstType) {
    return false
  }

  return firstType.includes('/json') || firstType.includes('+json')
})

Response.macro('prepareServerSentEventsHeaders', function (this: Response) {
  this.response.setHeader('Content-Type', 'text/event-stream')
  this.response.setHeader('Cache-Control', 'no-cache')
  this.response.setHeader('Connection', 'keep-alive')
  this.response.setHeader('Access-Control-Allow-Origin', '*')
  this.response.flushHeaders()
})

Response.macro('sendServerSentEvent', function (this: Response, data: any) {
  this.response.write(`data: ${JSON.stringify(data)}\n\n`)
  this.response.flushHeaders()
})

declare module '@adonisjs/core/http' {
  interface Request {
    wantsJSON(): boolean
  }

  interface Response {
    prepareServerSentEventsHeaders(): void
    sendServerSentEvent(data: any): void
  }
}
