import KanbanColumn from '#models/kanban_column'
import vine from '@vinejs/vine'

export const updateKanbanTaskValidator = vine.compile(
  vine.object({
    tasks: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          order: vine.number().min(1).positive(),
        })
      )
      .optional(),
    columnId: vine
      .string()
      .exists(async (db, value) => {
        const column = db.from(KanbanColumn.table).where('id', value).first()
        return column
      })
      .optional(),
    order: vine.number().min(1).positive().optional(),
    title: vine.string().minLength(2).maxLength(200).optional(),
  })
)
