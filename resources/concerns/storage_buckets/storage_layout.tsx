import * as React from 'react'
import type { Project } from '@/concerns/projects/types/project'
import ProjectLayout from '@/layouts/project_layout'
import { Link } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import { IconArchive } from '@tabler/icons-react'
import usePageProps from '@/hooks/use_page_props'
import StorageTabs from './components/storage_tabs'
import type { StorageBucket } from './types/storage_bucket'
import type { StorageBucketFile } from '~/types/storage'

export type StorageLayoutProps = {
  project: Project
  storageBucket: StorageBucket
  files: StorageBucketFile[]
}

export default function StorageLayout({ children }: React.PropsWithChildren) {
  const params = useParams()
  const { project, storageBucket } = usePageProps<StorageLayoutProps>()
  return (
    <ProjectLayout className="!p-0">
      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 py-4 px-12 bg-white sm:flex-row sm:items-center border-b border-zinc-200">
        <div className="flex items-center gap-x-3">
          <h1 className="flex gap-x-3 text-base leading-7 items-center">
            <Link
              className="hover:opacity-75 transition"
              href={`/organizations/${params.organizationSlug}/projects/${project.slug}/storage_buckets`}
            >
              <IconArchive className="w-5 h-5" />
            </Link>
            <span className="!text-zinc-600">/</span>

            <div className="flex gap-x-2">
              <span className="font-semibold text-zinc-900">{project.name}</span>
              {project.name !== project.slug && (
                <span className="text-zinc-400">({project.slug})</span>
              )}
            </div>
            <span className="!text-zinc-600">/</span>
            <div className="flex gap-x-2">
              <span className="font-semibold text-zinc-900">{storageBucket.name}</span>
              {storageBucket.name !== storageBucket.slug && (
                <span className="text-zinc-400">({storageBucket.slug})</span>
              )}
            </div>
          </h1>
        </div>
      </div>
      <StorageTabs project={project} storageBucket={storageBucket} />
      {children}
    </ProjectLayout>
  )
}
