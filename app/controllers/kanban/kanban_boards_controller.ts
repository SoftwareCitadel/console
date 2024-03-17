import bindProject from '#decorators/bind_project'
import bindProjectAndKanbanBoard from '#decorators/bind_project_and_kanban_board'
import KanbanBoard from '#models/kanban_board'
import Project from '#models/project'
import { HttpContext } from '@adonisjs/core/http'

export default class KanbanBoardsController {
  @bindProject
  async index({ inertia }: HttpContext, project: Project) {
    const boards = await project.related('kanbanBoards').query()
    return inertia.render('kanban/index', { project, boards })
  }

  @bindProject
  async store({ request, response }: HttpContext, project: Project) {
    const kanbanBoard = await project.related('kanbanBoards').create(request.only(['name']))

    // Create default columns
    await kanbanBoard.related('columns').createMany([
      { name: 'TODO', order: 1 },
      { name: 'DOING', order: 2 },
      { name: 'DONE', order: 3 },
    ])

    return response
      .redirect()
      .toPath(
        `/organizations/${project.organization.slug}/projects/${project.slug}/kanban_boards/${kanbanBoard.slug}`
      )
  }

  @bindProjectAndKanbanBoard
  async show({ inertia }: HttpContext, project: Project, board: KanbanBoard) {
    await board.load('columns', (query) => {
      query.preload('tasks').orderBy('order', 'asc')

      query.orderBy('order', 'asc')
    })
    return inertia.render('kanban/show', { project, board })
  }

  @bindProjectAndKanbanBoard
  async edit({ inertia }: HttpContext, project: Project, board: KanbanBoard) {
    return inertia.render('kanban/edit', { project, board })
  }

  @bindProjectAndKanbanBoard
  async update({ request, response }: HttpContext, _project: Project, board: KanbanBoard) {
    if (request.input('name')) {
      await board.merge({ name: request.input('name') }).save()
    }
    return response.redirect().back()
  }

  @bindProjectAndKanbanBoard
  async destroy({ response }: HttpContext, project: Project, board: KanbanBoard) {
    await board.delete()
    return response
      .redirect()
      .toPath(`/organizations/${project.organization.slug}/projects/${project.slug}/kanban_boards`)
  }
}
