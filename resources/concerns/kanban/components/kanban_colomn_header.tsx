import React, { type ElementRef, useRef } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown_menu'
import { IconDots } from '@tabler/icons-react'
import { useToggle } from '@/hooks/use_toggle'
import { EditColumn } from './form/edit_kanban_column'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { router } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import useSuccessToast from '@/hooks/use_success_toast'

export function ColumnHeader(props: { columnId: number; columnName: string; countTask: number }) {
  const { columnId, columnName, countTask } = props
  const [enableEditing, onEnableEditing] = useToggle(false)
  const params = useParams()
  const success = useSuccessToast()

  function onDelete() {
    router.delete(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}/columns/${columnId}`,
      {
        onSuccess() {
          success(`[${columnName}] deleted.`)
        },
      }
    )
  }

  return (
    <div className="flex items-center justify-between mb-4 py-4 border-b-2 border-gray-500">
      <div className="flex items-center gap-x-2">
        {enableEditing ? (
          <EditColumn name={columnName} columnId={columnId} onClose={onEnableEditing} />
        ) : (
          <span onClick={onEnableEditing} role="button" className="text-sm font-medium ">
            {columnName}
          </span>
        )}
        {/* <Badge variant="outline">{countTask}</Badge> */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <IconDots className="size-4 stroke-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" forceMount>
          <DropdownMenuItem
            onClick={onEnableEditing}
            className="cursor-pointer flex items-center gap-x-2"
          >
            <PencilIcon className="size-4 stroke-primary" />
            Rename the column
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={Boolean(countTask > 0)}
            className="flex items-center gap-x-2 focus:bg-destructive/10  text-destructive focus:text-destructive"
          >
            <Trash2Icon className="size-4 stroke-destructive" />
            Delete column
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
