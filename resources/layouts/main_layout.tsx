import * as React from 'react'
import useMainLayoutNavigation from '@/hooks/use_main_layout_navigation'
import SharedLayout from './shared_layout'
import { PresenceProvider } from '@/presence_context'

type MainLayoutProps = {
  className?: string
}

export default function MainLayout({
  children,
  className,
}: React.PropsWithChildren<MainLayoutProps>) {
  const mainLayoutNavigation = useMainLayoutNavigation()

  return (
    <PresenceProvider>
      <SharedLayout
        children={children}
        navigationItems={mainLayoutNavigation}
        className={className}
      />
    </PresenceProvider>
  )
}
