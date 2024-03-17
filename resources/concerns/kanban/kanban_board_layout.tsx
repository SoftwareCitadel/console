import * as React from 'react'
import { IconLayoutKanban } from '@tabler/icons-react'
import type { KanbanBoard } from './types/kanban_board'
import type { Project } from '../projects/types/project'
import ProjectLayout from '@/layouts/project_layout'
import { Link } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import KanbanBoardTabs from './components/kanban_board_tabs'

interface KanbanBoardLayoutProps {
  project: Project
  board: KanbanBoard
}



const KanbanBoardLayout: React.FunctionComponent<
  React.PropsWithChildren<KanbanBoardLayoutProps>
> = ({ project, board, children }) => {
  const params = useParams()

  return (
    <ProjectLayout className="!p-0">
      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 py-4 px-12 bg-white sm:flex-row sm:items-center border-b border-zinc-200">
        <div className="flex items-center gap-x-3">
          <h1 className="flex gap-x-3 text-base leading-7 items-center">
            <Link
              className="hover:opacity-75 transition"
              href={`/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards`}
            >
              <IconLayoutKanban className="w-5 h-5" />
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
              <span className="font-semibold text-zinc-900">{board.name}</span>
            </div>
          </h1>
        </div>
      </div>
      <KanbanBoardTabs project={project} board={board} />
      <div className="px-12 py-6">{children}</div>
    </ProjectLayout>
  )
}

export default KanbanBoardLayout
