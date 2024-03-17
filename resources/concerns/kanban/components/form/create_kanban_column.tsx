import React, { type FormEvent } from 'react'
import useParams from '@/hooks/use_params'
import { useToggle } from '@/hooks/use_toggle'
import { useForm } from '@inertiajs/react'
import { Card, CardHeader } from '@/components/card'
import Button from '@/components/button'
import { IconX } from '@tabler/icons-react'

export function CreateNewColumn() {
  const [enabled, toggle] = useToggle(false)
  const params = useParams()

  const { data, setData, post, reset } = useForm({
    name: '',
  })

  function onCancel() {
    reset()
    toggle()
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    post(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}/columns`,
      {
        onSuccess() {
          reset();
        },
      }
    )
  }
  return (
    <>
      {enabled ? (
        <form onSubmit={onSubmit}>
          <Card className="mt-auto">
            <CardHeader className="p-0 border-none space-y-1">
              <textarea
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                name="name"
                className="appearance-none text-sm  border-none focus:outline-none focus:border-none focus:shadow-transparent focus:ring-0 rounded "
                placeholder="Enter column title..."
              ></textarea>
            </CardHeader>
          </Card>
          <div className="flex items-center mt-2">
            <Button>Add column</Button>
            <Button onClick={onCancel} variant="ghost" type="button">
              <IconX className="size-5" />{' '}
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={toggle} className="w-full min-w-80 max-w-80 mt-4" variant="outline">
          Add another column
        </Button>
      )}
    </>
  )
}
