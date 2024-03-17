import KanbanColumn from '#models/kanban_column'
import vine from '@vinejs/vine'

export const updateKanbanColumnValidator = vine.compile(
  vine.object({
    columns: vine
      .array(
        vine.object({
          id: vine.number(),
          order: vine.number().min(1).positive(),
        })
      )
      .distinct(['id', 'order'])
      .optional(),
    name: vine.string().minLength(2).maxLength(200).optional(),
  })
)
