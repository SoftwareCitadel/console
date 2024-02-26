import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'
const KanbanTasksController = () => import('#controllers/kanban/kanban_tasks_controller')

router
  .resource('organizations.projects.kanban_boards.columns.tasks', KanbanTasksController)
  .except(['index', 'show', 'edit'])
  .params({
    organizations: 'organizationSlug',
    projects: 'projectSlug',
    kanban_boards: 'kanbanBoardSlug',
    columns: 'kanbanColumnId',
    tasks: 'kanbanTaskId',
  })
  .use('*', middleware.auth())

