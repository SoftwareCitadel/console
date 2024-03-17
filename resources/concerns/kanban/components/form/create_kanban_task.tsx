import React, { type FormEvent } from 'react'
import useParams from '@/hooks/use_params'
import { useToggle } from '@/hooks/use_toggle'
import { useForm } from '@inertiajs/react'
import { Card, CardHeader } from '@/components/card'
import Button from '@/components/button'
import { IconPlus, IconX } from '@tabler/icons-react'

export function CreateNewTask(props: { columnId: number }) {
  const { columnId } = props
  const [enabled, toggle] = useToggle(false)
  const params = useParams()
  const { data, setData, post, reset } = useForm({
    title: '',
  })

  function onCancel() {
    reset()
    toggle()
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    post(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}/columns/${columnId}/tasks`,
      {
        onSuccess() {
          onCancel()
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
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                name="title"
                className="appearance-none text-sm  border-none focus:outline-none focus:border-none focus:shadow-transparent focus:ring-0 rounded "
                placeholder="Enter a title for this card..."
              ></textarea>
            </CardHeader>
          </Card>
          <div className="flex items-center mt-2">
            <Button>Add card</Button>
            <Button onClick={onCancel} variant="ghost" type="button">
              {' '}
              <IconX className="size-5" />{' '}
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={toggle}
          className="w-full  border-2 border-dashed gap-x-2 bg-transparent"
          variant="outline"
        >
          <IconPlus className="w-4" />
          Add card
        </Button>
      )}
    </>
  )
}
