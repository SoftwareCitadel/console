import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import slugify from '@/lib/slugify'
import { useForm } from '@inertiajs/react'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'
import Label from '@/components/label'
import Input from '@/components/input'
import Button from '@/components/button'
import useSuccessToast from '@/hooks/use_success_toast'
import useParams from '@/hooks/use_params'
import ResourcesConfigurator from './resources_configurator'

export type AppSettingsCardProps = {
  project: Project
  application: Application
}

export default function ApplicationSettingsCard({ project, application }: AppSettingsCardProps) {
  const successToast = useSuccessToast()
  const params = useParams()

  const form = useForm({
    name: application.name,
    cpu: application.cpu,
    ram: application.ram,
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.patch(
      `/organizations/${params.organizationSlug}/projects/${project.slug}/applications/${application.slug}`,
      {
        onSuccess: () => successToast(),
        data: form.data,
      }
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="mx-10">
        <CardHeader>
          <CardTitle>Application settings</CardTitle>
        </CardHeader>
        <CardContent className="!p-0 space-y-4">
          <div className="grid gap-1 px-6 py-4 pt-6">
            <Label>Application name</Label>
            <Input
              id="name"
              placeholder="webapp"
              value={form.data.name}
              onChange={(e) => form.setData('name', slugify(e.target.value))}
            />
          </div>
          <hr />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <ResourcesConfigurator form={form} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" loading={form.processing}>
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
