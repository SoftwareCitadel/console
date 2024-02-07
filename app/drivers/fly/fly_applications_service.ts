import Application from '#models/application'
import type { Response } from '@adonisjs/core/http'
import type { IDriverApplicationsService } from '#drivers/idriver'
import env from '#start/env'
import FlyApi from './api/fly_api.js'
import { AddressType } from './api/fly_networks_api.js'
import Certificate, { CertificateStatus } from '#models/certificate'
import { DnsEntries } from '#types/dns'

export default class FlyApplicationsService implements IDriverApplicationsService {
  private readonly flyApi: FlyApi = new FlyApi()

  async createApplication(application: Application) {
    const applicationName = this.flyApi.getFlyApplicationName(application.slug)
    const builderName = this.flyApi.getFlyApplicationName(application.slug, true)

    await this.flyApi.apps.createApplication({
      app_name: builderName,
      org_slug: env.get('FLY_ORG', 'personal'),
    })
    await this.flyApi.apps.createApplication({
      app_name: applicationName,
      org_slug: env.get('FLY_ORG', 'personal'),
    })

    application.sharedIpv4 = await this.flyApi.networks.allocateSharedIpAddress({
      appId: applicationName,
      type: AddressType.shared_v4,
    })
    application.ipv6 = await this.flyApi.networks.allocateIpAddress({
      appId: applicationName,
      type: AddressType.v6,
    })
    await application.save()
  }

  async deleteApplication(application: Application) {
    const applicationName = this.flyApi.getFlyApplicationName(application.slug)
    const builderName = this.flyApi.getFlyApplicationName(application.slug, true)

    await this.flyApi.apps.deleteApplication(applicationName)
    await this.flyApi.apps.deleteApplication(builderName)
  }

  streamLogs(_application: Application, _response: Response, _scope: 'application' | 'builder') {}

  async createCertificate(application: Application, hostname: string): Promise<DnsEntries> {
    const appId = this.flyApi.getFlyApplicationName(application.slug)
    await this.flyApi.certificates.addCertificate(appId, hostname)
    return []
  }

  checkDnsConfiguration(
    application: Application,
    certificate: Certificate
  ): Promise<CertificateStatus> {
    return this.flyApi.certificates.checkCertificate(application, certificate.domain)
  }

  async deleteCertificate(application: Application, hostname: string) {
    const appId = this.flyApi.getFlyApplicationName(application.slug)
    await this.flyApi.certificates.removeCertificate(appId, hostname)
  }
}
