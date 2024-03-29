import * as React from 'react'
import type { Deployment, DeploymentStatus } from '../types/deployment'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'
import getInitiatedXAgo from '@/lib/get_initiated_x_ago'
import clsx from 'clsx'
import capitalize from '@/lib/capitalize'

function getColorClass(status: DeploymentStatus) {
  switch (status) {
    case 'stopped':
      return 'text-zinc-400 !bg-zinc-50'
    case 'building':
    case 'deploying':
      return 'text-yellow-500 !bg-yellow-100'
    case 'build-failed':
    case 'deployment-failed':
      return 'text-red-500 !bg-red-100'
    case 'success':
      return 'text-emerald-500 !bg-emerald-100'
  }
}

function getStatusTextColorClass(status: DeploymentStatus) {
  switch (status) {
    case 'stopped':
      return 'text-zinc-600 bg-zinc-50'
    case 'building':
    case 'deploying':
      return 'text-yellow-600 bg-yellow-50'
    case 'build-failed':
    case 'deployment-failed':
      return 'text-red-600 bg-red-50'
    case 'success':
      return 'text-emerald-600 bg-emerald-50'
  }
}

interface DeploymentCardProps {
  project: Project
  application: Application
  deployment: Deployment
  pulse?: boolean
}

const DeploymentCard: React.FunctionComponent<DeploymentCardProps> = ({
  deployment,
  project,
  application,
  pulse,
}) => {
  const [initiated, setInitiated] = React.useState<string>(
    getInitiatedXAgo(new Date(deployment.createdAt as unknown as string))
  )

  React.useEffect(() => {
    const interval = setInterval(() => {
      setInitiated(getInitiatedXAgo(new Date(deployment.createdAt as unknown as string)))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <li className="flex items-center space-x-4 px-6 py-6">
      <span
        hidden
        className="bg-emerald-500 bg-red-500 bg-yellow-500 bg-emerald-400 bg-red-400 bg-yellow-400 rounded-full animate-pulse"
      ></span>
      <div className="min-w-0 flex-auto">
        <div className="flex items-center gap-x-3">
          <div className={'flex-none rounded-full p-1 ' + getColorClass(deployment.status)}>
            <div
              className={clsx('h-2 w-2 rounded-full bg-current', pulse && 'animate-pulse')}
            ></div>
          </div>

          <h2 className="min-w-0 text-sm font-semibold leading-6 text-zinc-900">
            <p className="flex gap-x-2 text-zinc-900">
              <span className="truncate">{project.name}</span>
              <span className="text-zinc-400">/</span>
              <span className="whitespace-nowrap">{application.name}</span>
            </p>
          </h2>
          <div
            className={clsx(
              getStatusTextColorClass(deployment.status),
              'rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset ring-zinc-50'
            )}
          >
            {capitalize(deployment.status.replace('-', ' '))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-zinc-500">
          <p className="truncate">Deploys from {deployment.origin === 'cli' ? 'CLI' : 'GitHub'}</p>

          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-zinc-300">
            <circle cx="1" cy="1" r="1" />
          </svg>
          <p className="whitespace-nowrap">Initiated {initiated}</p>
        </div>
      </div>
    </li>
  )
}

export default DeploymentCard
