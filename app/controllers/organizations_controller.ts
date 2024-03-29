import bindOrganization from '#decorators/bind_organization'
import InviteMemberNotification from '#mails/invite_member_notification'
import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'
import PresenceService from '#services/presence_service'
import { createOrganizationValidator } from '#validators/create_organization_validator'
import { updateOrganizationValidator } from '#validators/update_organization_validator'
import type { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import mail from '@adonisjs/mail/services/main'
import vine from '@vinejs/vine'

export default class OrganizationsController {
  async index({ auth, inertia, request, response }: HttpContext) {
    /**
     * If the current user is related to any organization,
     * then redirect to the first organization.
     */
    await auth.user!.load('organizations')

    if (request.wantsJSON()) {
      return auth.user!.organizations
    }

    if (auth.user!.organizations.length) {
      const organization = auth.user!.organizations[0]
      return response.redirect().toPath(`/organizations/${organization.slug}/projects`)
    }

    /**
     * If the user is not related to any organization,
     * then render a page allowing to create a new organization.
     */
    return inertia.render('organizations/index')
  }

  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrganizationValidator)
    const organization = await Organization.create(payload)
    await organization.related('members').create({
      userId: auth.user!.id,
      role: 'owner',
    })
    return response.redirect().toPath(`/organizations/${organization.slug}/projects`)
  }

  @bindOrganization
  async edit(
    { inertia }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    await organization.load('members', (query) => {
      query.preload('user')
    })
    for (const member of organization.members) {
      await member.user?.assignAvatarUrl()
    }
    const isOwner = organizationMember.role === 'owner'
    return inertia.render('organizations/edit', {
      organization,
      isOwner,
    })
  }

  @bindOrganization
  async update(
    { request, response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'owner') {
      return response.unauthorized()
    }
    const isOwner = organizationMember.role === 'owner'
    if (!isOwner) {
      return response.unauthorized()
    }
    const payload = await request.validateUsing(updateOrganizationValidator)
    organization.merge(payload)
    await organization.save()
    return response.redirect().back()
  }

  @bindOrganization
  async destroy(
    { response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'owner') {
      return response.unauthorized()
    }
    await organization.delete()
    return response.redirect().toPath('/organizations')
  }

  @bindOrganization
  async quit(
    { response }: HttpContext,
    _organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'member') {
      return response.unauthorized()
    }
    await organizationMember.delete()
    return response.redirect().toPath('/organizations')
  }

  @bindOrganization
  async invite(
    { request, response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'owner') {
      return response.unauthorized()
    }
    const payload = await request.validateUsing(
      vine.compile(
        vine.object({
          email: vine.string().email(),
        })
      )
    )

    await mail.send(new InviteMemberNotification(organization, payload.email))
    return response.redirect().toPath(`/organizations/${organization.slug}/edit`)
  }

  async join({ auth, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.redirect().toPath('/auth/sign_up')
    }
    const organization = await Organization.findByOrFail('slug', request.param('organizationSlug'))
    await organization
      .related('members')
      .firstOrCreate(
        { userId: auth.user!.id, role: 'member' },
        { userId: auth.user!.id, role: 'member' }
      )
    return response.redirect().toPath(`/organizations/${organization.slug}/projects`)
  }

  @bindOrganization
  async streamPresence({ auth, response }: HttpContext, organization: Organization) {
    response.prepareServerSentEventsHeaders()

    await PresenceService.addUserToOrganizationPresence(organization, auth.user!)

    const presence = await PresenceService.getOrganizationPresence(organization)
    response.sendServerSentEvent({ presence })

    emitter.on(`organizations:${organization.slug}:presence-update`, async (presence) => {
      response.sendServerSentEvent({ presence })
    })

    response.response.on('close', async () => {
      await PresenceService.removeUserFromOrganizationPresence(organization, auth.user!)
      response.response.end()
    })

    return response.noContent()
  }
}
