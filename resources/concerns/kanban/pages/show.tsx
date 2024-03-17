import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { KanbanBoard } from '../types/kanban_board'
import KanbanBoardLayout from '../kanban_board_layout'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Column } from '../components/kanban_colomn'
import { router } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import { CreateNewColumn } from '../components/form/create_kanban_column'
import { useState } from 'react'
import reorder from '@/lib/reorder'
import type { KanbanColumn } from '../types/kanban_column'
import type { KanbanTask } from '../types/kanban_task'

interface ShowProps {
  project: Project
  board: KanbanBoard
}

type Result = {
  draggableId: string
  type: 'card' | 'column'
  source: {
    index: number
    droppableId: string
  }
  reason: 'DROP'
  mode: 'FLUID'
  destination: {
    droppableId: string
    index: number
  }
  combine: null
}

const Show: React.FunctionComponent<ShowProps> = ({ project, board }) => {
  const params = useParams()

  const [sortedColumns, setSortedColums] = useState(board.columns)

  React.useEffect(() => {
    setSortedColums(board.columns)
  }, [board])

  function onDragEnd({ destination, source, type }: Result) {
    /**
     * Skip if the user drops the item in the same place.
     */
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    ) {
      return
    }

    /**
     * The user moves a column.
     */
    if (type === 'column') {
      const items = reorder(sortedColumns, source.index, destination.index).map((item, index) => ({
        ...item,
        order: index + 1,
      }))

      setSortedColums(items)

      /**
       * Update the order of the columns.
       */
      router.put(
        `/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards/${board.slug}/columns/${
          board.columns[source.index].id
        }`,
        { columns: items }
      )
    }

    /**
     * The user moves a card.
     */
    if (type === 'card') {
      let newSortedColums = [...sortedColumns]
      /**
       * Retrieve the source and destination columns.
       */
      const sourceColumn = newSortedColums.find((column) => column.id === +source.droppableId)
      const destColumn = newSortedColums.find((column) => column.id === +destination.droppableId)
      if (!sourceColumn || !destColumn) return

      // Check if cards exists on the sourceList
      if (!sourceColumn.tasks) {
        sourceColumn.tasks = []
      }

      // Check if cards exists on the destList
      if (!destColumn.tasks) {
        destColumn.tasks = []
      }

      /**
       * The card is moved within the same column.
       * We only need to update the order of the cards.
       */
      if (source.droppableId === destination.droppableId) {
        const reorderedTasks = reorder(sourceColumn.tasks, source.index, destination.index)

        reorderedTasks.forEach((task, idx) => {
          task.order = idx + 1
        })

        sourceColumn.tasks = reorderedTasks
        setSortedColums(newSortedColums)

        router.patch(
          `/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards/${board.slug}/columns/${source.droppableId}/tasks/${sourceColumn.tasks[source.index].id}`,
          { tasks: reorderedTasks }
        )
      } else {
        /**
         * Remove card from the source list
         */
        const [movedTask] = sourceColumn.tasks.splice(source.index, 1)

        /**
         * Assign the new listId to the moved card
         */
        movedTask.columnId = +destination.droppableId

        /**
         * Add card to the destination list
         */
        destColumn.tasks.splice(destination.index, 0, movedTask)

        sourceColumn.tasks.forEach((task, idx) => {
          task.order = idx + 1
        })

        /**
         * Update the order for each card in the destination list
         */
        destColumn.tasks.forEach((task, idx) => {
          task.order = idx + 1
        })

        setSortedColums(newSortedColums)

        /**
         * The card is moved to a different column.
         * We need to update the order of the cards in both columns.
         */
        router.patch(
          `/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards/${board.slug}/columns/${source.droppableId}/tasks/${sourceColumn.tasks[source.index].id}`,
          { order: sourceColumn.tasks[destination.index].order, columnId: destination.droppableId }
        )
      }
    }
  }

  return (
    <KanbanBoardLayout project={project} board={board}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="columns" type="column" direction="horizontal">
            {(provided) => (
              <ol
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex  gap-x-4 items-start w-full overflow-x-scroll  min-h-[calc(100vh_-_230px)] "
              >
                {sortedColumns.map((column, index) => (
                  <Column key={column.id} {...column} index={index} />
                ))}
                <CreateNewColumn />
                {provided.placeholder}
              </ol>
            )}
          </Droppable>
        </DragDropContext>
    </KanbanBoardLayout>
  )
}

export default Show
