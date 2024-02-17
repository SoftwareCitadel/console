import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import type { KanbanColumn } from '../types/kanban_column'
import { ColumnHeader } from './kanban_colomn_header'
import { ColumnItem } from './kanban_column_item'
import { CreateNewTask } from './form/create_kanban_task'

export function Column(props: KanbanColumn & { index: number }) {
  const { id, name, tasks, index } = props
  const sortedTasks = tasks.sort((a, b) => {
    if (a.order < b.order) return -1
    if (a.order > b.order) return 1
    return 0
  })

  return (
    <Draggable draggableId={id.toString() + '-list'} index={index}>
      {(provided) => (
        <li {...provided.draggableProps} ref={provided.innerRef} className="w-full max-w-80">
          <div {...provided.dragHandleProps} className="">
            <ColumnHeader columnName={name} countTask={tasks.length} />
            <Droppable droppableId={id.toString()} type="card">
              {(provided, snapshot) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full p-2 rounded-lg bg-secondary space-y-2"
                >
                  {sortedTasks.map((task, idx) => (
                    <ColumnItem key={task.id} {...task} index={idx} />
                  ))}
                  {!snapshot.draggingOverWith && <CreateNewTask columnId={id} />}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
          </div>
        </li>
      )}
    </Draggable>
  )
}
