import bindProjectAndKanbanBoard from '#decorators/bind_project_and_kanban_board'
import bindProjectAndKanbanBoardAndKanbanColumn from '#decorators/bind_project_and_kanban_board_and_kanban_column'
import KanbanBoard from '#models/kanban_board'
import KanbanColumn from '#models/kanban_column'
import Project from '#models/project'
import { HttpContext } from '@adonisjs/core/http'
import { updateKanbanColumnValidator } from '#validators/kanban_column/update_kanban_column_validator'

export default class KanbanColumnsController {
  @bindProjectAndKanbanBoard
  async store({ request, response }: HttpContext, _project: Project, board: KanbanBoard) {
    await board.load('columns')
    const order = board.columns.length + 1
    await board.related('columns').create({ ...request.only(['name']), order })
    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumn
  async update(
    { request, response }: HttpContext,
    _project: Project,
    board: KanbanBoard,
    firstColumn: KanbanColumn
  ) {
    const payload = await request.validateUsing(updateKanbanColumnValidator)
    if (payload.name) {
      await firstColumn
        .merge({
          name: payload.name,
        })
        .save()
    }

    if (payload.columns) {
      for (let i = 0; i < payload.columns.length; i++) {
        await KanbanColumn.query().where('id', payload.columns[i].id).update(payload.columns[i])
      }
    }

    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumn
  async destroy(
    { response }: HttpContext,
    _project: Project,
    _board: KanbanBoard,
    column: KanbanColumn
  ) {
    await column.delete()
    return response.redirect().back()
  }
}
