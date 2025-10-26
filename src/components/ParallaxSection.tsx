'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number // Parallax speed multiplier (default 0.2)
}

export default function ParallaxSection({
  children,
  className = '',
  speed = 0.2
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return

          const rect = sectionRef.current.getBoundingClientRect()
          const scrolled = window.scrollY

          // Only apply parallax when section is in viewport
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yPos = -(scrolled * speed)
            sectionRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`
          }

          ticking = false
        })

        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <section
      ref={sectionRef}
      className={`parallax-section ${className}`}
      style={{ willChange: 'transform' }}
    >
      {children}
    </section>
  )
}
