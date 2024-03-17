import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'
const KanbanBoardsController = () => import('#controllers/kanban/kanban_boards_controller')

/**
 * Kanban board
 */
router
  .resource('organizations.projects.kanban_boards', KanbanBoardsController)
  .params({
    organizations: 'organizationSlug',
    projects: 'projectSlug',
    kanban_boards: 'kanbanBoardSlug',
  })
  .use(['index', 'show', 'edit'], middleware.loadProjects())
