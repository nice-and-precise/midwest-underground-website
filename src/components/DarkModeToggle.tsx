'use client'

import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check saved theme or system preference on mount
    const savedTheme = localStorage.getItem('midwest-underground-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light')

    // Remove no-transition class after initial load
    setTimeout(() => {
      document.documentElement.classList.remove('no-transition')
    }, 100)
  }, [])

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setIsDark(!isDark)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('midwest-underground-theme', newTheme)
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="dark-mode-toggle"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      title="Toggle dark/light mode"
    >
      <span className="toggle-circle"></span>
      <span className="sun-icon">☀️</span>
      <span className="moon-icon">🌙</span>
    </button>
  )
}
