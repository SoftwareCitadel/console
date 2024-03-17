import React, { type PropsWithChildren } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import type { KanbanTask } from '../types/kanban_task'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { IconCalendar, IconMessageCircle2, IconPaperclip, IconPencil } from '@tabler/icons-react'
import Button from '@/components/button'
import { useToggle } from '@/hooks/use_toggle'
import { EditTask } from './form/edit_kanban_task'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/context_menu'
import { useForm } from '@inertiajs/react'
import useSuccessToast from '@/hooks/use_success_toast'
import useParams from '@/hooks/use_params'
import { CheckCircleIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react'

export function ColumnItem(props: KanbanTask & { index: number }) {
  const { id, title, description, index, columnId } = props
  const params = useParams()
  console.log(params)
  const successToast = useSuccessToast()
  const [enableEditing, onEnableEditing] = useToggle(false)

  const form = useForm()

  function onDelete() {
    form.delete(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}/columns/${columnId}/taks/${id}`,
      {
        onSuccess() {
          successToast('Task has been deleted successfully.')
        },
      }
    )
  }

  function onCompleted() {
    form.patch(
      `/organizations/${params.organizationslug}/projects/${params.projectslug}/kanban_boards/${params.kanbanboardslug}`,
      {
        onSuccess() {
          successToast('Task has been deleted successfully.')
        },
      }
    )
  }

  return (
    <>
      {enableEditing ? (
        <EditTask columnId={columnId} taskId={id} title={title} onClose={onEnableEditing} />
      ) : (
        <Draggable draggableId={id.toString()} index={index}>
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              role="button"
            >
              <ColumnItemContextMenu onDelete={onDelete} onEnableEditing={onEnableEditing}>
                <Card className="relative group mb-2">
                  <Button
                    onClick={onEnableEditing}
                    variant="ghost"
                    className="hidden group-hover:block absolute top-1 right-1 rounded-full"
                  >
                    <IconPencil className="size-4" />
                  </Button>
                  <CardHeader className="p-4 border-none space-y-1">
                    <CardTitle className="text-sm">{title}</CardTitle>
                    <CardDescription className="text-xs">{description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 border-none text-xs text-secondary-foreground font-medium">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span>Progress</span>
                        <span>4/10</span>
                      </div>
                      <div className="h-0.5 w-full bg-secondary ">
                        <div className="bg-orange-500 w-1/2 h-full transition-all duration-300"></div>
                      </div>
                      <div className="flex"></div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="flex items-center gap-x-2 text-muted-foreground text-xs">
                        <IconMessageCircle2 className="stroke-muted-foreground size-3" />
                        <span>12</span>
                      </span>
                      <span className="flex items-center gap-x-2 text-muted-foreground text-xs">
                        <IconPaperclip className="stroke-muted-foreground size-3" />
                        <span>12</span>
                      </span>
                      <span className="flex items-center gap-x-1 text-muted-foreground text-xs">
                        <IconCalendar className="stroke-muted-foreground size-3" />
                        <span>Nov</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </ColumnItemContextMenu>
            </div>
          )}
        </Draggable>
      )}
    </>
  )
}

type ColumnItemContextMenuProps = {
  onDelete: () => void
  onEnableEditing: () => void
}

function ColumnItemContextMenu({
  children,
  onDelete,
  onEnableEditing,
}: PropsWithChildren<ColumnItemContextMenuProps>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-60 font-medium">
        <ContextMenuItem onClick={onEnableEditing} className="gap-x-2">
          <PencilIcon className="size-4 stroke-primary" />
          Edit this tasks title
        </ContextMenuItem>
        <ContextMenuItem className="gap-x-2">
          <CheckCircleIcon className="size-4 stroke-primary" />
          Completed
        </ContextMenuItem>
        <ContextMenuItem className="gap-x-2">
          <EyeIcon className="size-4" />
          Show details
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onDelete}
          className="gap-x-2 focus:bg-destructive/10 text-destructive focus:text-destructive"
        >
          <TrashIcon className="size-4 stroke-destructive" />
          Delete Task
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
