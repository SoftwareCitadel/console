import bindProjectAndApplication from '#decorators/bind_project_and_application'
import { HttpContext } from '@adonisjs/core/http'
import { addCertificateValidator } from '#validators/add_certificate_validator'
import Project from '#models/project'
import Application from '#models/application'
import IDriver from '#drivers/idriver'
import Driver from '#drivers/driver'

export default class CertificatesController {
  private readonly driver: IDriver = Driver.getDriver()

  @bindProjectAndApplication
  public async index(
    { bouncer, inertia }: HttpContext,
    project: Project,
    application: Application
  ) {
    await bouncer.authorize('accessToProject', project)

    await application.load('certificates')

    return inertia.render('applications/certificates', {
      project,
      application,
    })
  }

  @bindProjectAndApplication
  public async store(
    { bouncer, request, response }: HttpContext,
    project: Project,
    application: Application
  ) {
    await bouncer.authorize('accessToProject', project)

    const { domain } = await request.validateUsing(addCertificateValidator, {
      meta: {
        applicationId: application.id,
      },
    })
    const certificate = await application.related('certificates').create({ domain, dnsEntries: [] })
    await certificate.save()

    certificate.dnsEntries = await this.driver.applications.createCertificate(
      project.organization,
      project,
      application,
      domain
    )
    await certificate.save()

    if (request.wantsJSON()) {
      return { domain }
    }

    return response.redirect().back()
  }

  @bindProjectAndApplication
  public async check(
    { bouncer, params, response }: HttpContext,
    project: Project,
    application: Application
  ) {
    await bouncer.authorize('accessToProject', project)

    const certificate = await application
      .related('certificates')
      .query()
      .where('domain', params.domain)
      .firstOrFail()

    const status = await this.driver.applications.checkDnsConfiguration(
      project.organization,
      project,
      application,
      certificate
    )

    if (status !== certificate.status) {
      certificate.status = status
      await certificate.save()
    }

    return response.redirect().back()
  }

  @bindProjectAndApplication
  public async destroy(
    { bouncer, response, params }: HttpContext,
    project: Project,
    application: Application
  ) {
    await bouncer.authorize('accessToProject', project)

    const certificate = await application
      .related('certificates')
      .query()
      .where('id', params.id)
      .firstOrFail()
    await certificate.delete()

    await application.load('certificates')

    await this.driver.applications.deleteCertificate(
      project.organization,
      project,
      application,
      certificate.domain
    )

    return response.redirect().back()
  }
}
