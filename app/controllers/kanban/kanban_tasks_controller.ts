import bindProjectAndKanbanBoardAndKanbanColumn from '#decorators/bind_project_and_kanban_board_and_kanban_column'
import bindProjectAndKanbanBoardAndKanbanColumnAndKanbanTask from '#decorators/bind_project_and_kanban_board_and_kanban_column_and_kanban_task'
import KanbanBoard from '#models/kanban_board'
import KanbanColumn from '#models/kanban_column'
import KanbanTask from '#models/kanban_task'
import Project from '#models/project'
import { updateKanbanTaskValidator } from '#validators/kanban_column/update_kanban_task_validator'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class KanbanTasksController {
  @bindProjectAndKanbanBoardAndKanbanColumn
  async store(
    { bouncer, request, response }: HttpContext,
    project: Project,
    _board: KanbanBoard,
    column: KanbanColumn
  ) {
    await bouncer.authorize('accessToProject', project)
    await column.load('tasks')
    await column
      .related('tasks')
      .create({ title: request.input('title'), order: column.tasks.length + 1 })
    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumnAndKanbanTask
  async update(
    { bouncer, request, response }: HttpContext,
    project: Project,
    _board: KanbanBoard,
    _column: KanbanColumn,
    task: KanbanTask
  ) {
    await bouncer.authorize('accessToProject', project)
    const payload = await request.validateUsing(updateKanbanTaskValidator)

    if (payload.columnId && payload.order) {
      task.columnId = payload.columnId
      task.order = payload.order
      await task.save()

      // Let's increment the order of all the tasks that are >= to the new order
      await db
        .query()
        .from('kanban_tasks')
        .where('column_id', task.columnId)
        .where('order', '>=', task.order)
        .where('id', '!=', task.id)
        .increment('order', 1)

      return response.redirect().back()
    }

    if (payload.tasks) {
      for (let i = 0; i < payload.tasks.length; i++) {
        await KanbanTask.query().where('id', payload.tasks[i].id).update(payload.tasks[i])
      }
    }

    if (payload.title) {
      task.title = payload.title
      await task.save()
    }

    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumnAndKanbanTask
  async destroy(
    { bouncer, response }: HttpContext,
    project: Project,
    _board: KanbanBoard,
    _column: KanbanColumn,
    task: KanbanTask
  ) {
    // await bouncer.authorize('accessToProject', project)
    console.log('Test')
    await task.delete()
    return response.redirect().back()
  }
}
