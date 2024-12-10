'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { SidebarItem, SidebarLabel } from './sidebar'
import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/20/solid'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else if (theme === 'light') setTheme('system')
    else setTheme('dark')
  }

  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return <MoonIcon className="h-5 w-5" />
      case 'light':
        return <SunIcon className="h-5 w-5" />
      default:
        return <ComputerDesktopIcon className="h-5 w-5" />
    }
  }

  if (!mounted) {
    return (
      <SidebarItem>
        <ComputerDesktopIcon className="h-5 w-5" />
        <SidebarLabel>Theme</SidebarLabel>
      </SidebarItem>
    )
  }

  return (
    <SidebarItem onClick={cycleTheme}>
      {getIcon()}
      <SidebarLabel>Theme: {theme}</SidebarLabel>
    </SidebarItem>
  )
}