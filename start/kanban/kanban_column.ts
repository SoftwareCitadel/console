import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'
const KanbanColumnsController = () => import('#controllers/kanban/kanban_columns_controller')

router
  .resource('organizations.projects.kanban_boards.columns', KanbanColumnsController)
  .except(['index', 'show', 'edit'])
  .params({
    organizations: 'organizationSlug',
    projects: 'projectSlug',
    kanban_boards: 'kanbanBoardSlug',
    columns: 'kanbanColumnId',
  })
  .use('*', middleware.auth())
