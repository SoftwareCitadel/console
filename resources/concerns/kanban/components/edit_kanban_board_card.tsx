import * as React from 'react'
import type { KanbanBoard } from '../types/kanban_board'
import useParams from '@/hooks/use_params'
import { useForm } from '@inertiajs/react'
import useSuccessToast from '@/hooks/use_success_toast'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import Label from '@/components/label'
import Input from '@/components/input'
import Button from '@/components/button'

interface EditKanbanBoardCardProps {
  board: KanbanBoard
}

const EditKanbanBoardCard: React.FunctionComponent<EditKanbanBoardCardProps> = ({ board }) => {
  const successToast = useSuccessToast()
  const form = useForm({
    name: board.name,
  })
  const params = useParams()
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.patch(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}`,
      {
        onSuccess: () => successToast(),
      }
    )
  }
  return (
    <form onSubmit={onSubmit}>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Edit kanban board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-1">
              <Label>Kanban board name</Label>
              <Input
                id="name"
                placeholder="acme"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button loading={form.processing} type="submit">
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default EditKanbanBoardCard
