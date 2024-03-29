import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from '@/components/dialog'
import Button from '@/components/button'
import slugify from '@/lib/slugify'
import { useForm } from '@inertiajs/react'
import Label from '@/components/label'
import Input from '@/components/input'
import useParams from '@/hooks/use_params'

export type AddWebsiteDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AddWebsiteDialog({ open, setOpen }: AddWebsiteDialogProps) {
  const params = useParams()
  const form = useForm({
    domain: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/analytics_websites`,
      {
        onSuccess: () => {
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>Add Website</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 px-6 pt-0">
            <div className="grid gap-1">
              <Label>Website Domain</Label>

              <Input
                id="name"
                className="!col-span-3 w-full"
                value={form.data.domain}
                placeholder="acme.com"
                onChange={(e) => form.setData('domain', slugify(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" loading={form.processing}>
              <span>Add website</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
