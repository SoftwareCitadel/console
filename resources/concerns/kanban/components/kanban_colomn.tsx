import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import type { KanbanColumn } from '../types/kanban_column'
import { ColumnHeader } from './kanban_colomn_header'
import { ColumnItem } from './kanban_column_item'
import { CreateNewTask } from './form/create_kanban_task'
import { motion, AnimatePresence } from 'framer-motion'

export function Column(props: KanbanColumn & { index: number }) {
  const { id, name, tasks, index } = props

  return (
    <Draggable draggableId={id.toString() + '-list'} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="w-full min-w-80 max-w-80"
        >
          <div {...provided.dragHandleProps} className="">
            <ColumnHeader columnId={id} columnName={name} countTask={tasks.length} />
            <Droppable droppableId={id.toString()} type="card">
              {(provided, snapshot) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full p-2 rounded-lg bg-secondary"
                >
                  {tasks.map((task, idx) => (
                    <ColumnItem key={task.id} {...task} index={idx} />
                  ))}
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {!snapshot.draggingOverWith && <CreateNewTask columnId={id} />}
                    </motion.div>
                  </AnimatePresence>
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
