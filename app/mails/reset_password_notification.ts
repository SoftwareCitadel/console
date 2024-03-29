import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'

export default class ResetPasswordNotification extends BaseMail {
  from = 'Software Citadel <no-reply@softwarecitadel.com>'
  subject = 'Reset your password'

  constructor(private readonly user: User) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const prefix = env.get('APP_URL')
    const suffix = router
      .builder()
      .params({ email: this.user.email })
      .makeSigned('/auth/reset_password/:email', { expiresIn: '30m' })
    const url = `${prefix}${suffix}`

    this.message.to(`${this.user.fullName} <${this.user.email}>`)
    this.message.htmlView('emails/reset_password_email', { url })
    this.message.textView('emails/reset_password_email.text', { url })
  }
}
