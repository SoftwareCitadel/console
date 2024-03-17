import { useClickOutside } from '@/hooks/use_click_outside'
import { router, useForm } from "@inertiajs/react";
import React, { useRef, type ElementRef, type ChangeEvent, type FormEvent } from 'react'
import useParams from "@/hooks/use_params";
import useSuccessToast from "@/hooks/use_success_toast";

export function EditColumn(props: { columnId: number; name: string; onClose: () => void }) {
  const params = useParams()
  const { name, columnId, onClose } = props
  const ref = useRef<ElementRef<'input'>>(null)
  const success = useSuccessToast()


  const { data, setData, put } = useForm({
    name,
  })

  useClickOutside(ref, () => {
    onClose()
    setData('name', name)

  })

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setData('name', e.target.value)
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    put(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}/columns/${columnId}`,
      {
        onSuccess() {
          router.reload();
          success()
          onClose();
        }
      }
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={ref}
        autoFocus
        onChange={onChange}
        value={data.name}
        className="appearance-none border bg-transparent text-sm font-medium p-0 w-fit rounded-full focus:ring-black outline:ring-black"
      />
    </form>
  )
}
