/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import OrganizationMember from '#models/organization_member'
import Project from '#models/project'
import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const accessToProject = Bouncer.ability(async (user: User, project: Project) => {
  /**
   * For now, we are allowing everyone in the project's organization to access the manage the project.
   * So, we are checking if the user is a member of the project's organization.
   */
  const organizationMember = await OrganizationMember.query()
    .where('userId', user.id)
    .andWhere('organizationId', project.organizationId)
    .first()
  return organizationMember !== null
})
