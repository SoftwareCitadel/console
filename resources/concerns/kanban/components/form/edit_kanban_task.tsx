import React, { useRef, type ElementRef, type FormEvent } from 'react'
import useParams from '@/hooks/use_params'
import { useForm } from '@inertiajs/react'
import { Card, CardHeader } from '@/components/card'
import Button from '@/components/button'
import { useClickOutside } from '@/hooks/use_click_outside'

export function EditTask(props: {
  columnId: number
  taskId: number
  title: string
  onClose: () => void
}) {
  const { taskId, columnId, title, onClose } = props
  const params = useParams()
  const ref = useRef<ElementRef<'form'>>(null)

  const { data, setData, patch, reset } = useForm({
    title,
  })

  useClickOutside(ref, () => {
    onClose()
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    patch(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}/columns/${columnId}/tasks/${taskId}`,
      {
        onSuccess() {
          reset()
          onClose()
        },
      }
    )
  }
  return (
    <div className="mb-2">
      <form ref={ref} onSubmit={onSubmit}>
        <Card>
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
          <Button>Save</Button>
        </div>
      </form>
    </div>
  )
}
