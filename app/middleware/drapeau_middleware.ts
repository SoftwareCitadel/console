import DrapeauService from '#services/drapeau_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class DrapeauMiddleware {
  async handle(ctx: HttpContext, next: NextFn, featureKey: string) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (!DrapeauService.isFeatureEnabled(featureKey)) {
      return ctx.response.forbidden('Feature is not enabled')
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
