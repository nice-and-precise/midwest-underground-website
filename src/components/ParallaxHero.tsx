'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function ParallaxHero() {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!parallaxRef.current) return

          const scrolled = window.scrollY
          const parallaxBg = parallaxRef.current.querySelector('.parallax-bg') as HTMLElement

          if (parallaxBg) {
            // Move background slower than scroll for parallax effect
            // Adjust the multiplier (0.4) to change parallax speed
            parallaxBg.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`
          }

          ticking = false
        })

        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={parallaxRef} className="parallax-hero" role="banner">
      <div className="parallax-bg" style={{backgroundImage: "url('/images/BAckhoe digging.webp')"}}></div>
      <div className="parallax-overlay"></div>
      <div className="parallax-content">
        <h1>HDD Field Operations Management</h1>
        <p>Professional bore tracking, field reports, and project management for Midwest Underground of Minnesota</p>
        <div className="parallax-cta">
          <Link href="/dashboard" className="btn btn-primary btn-lg">Access Dashboard</Link>
          <Link href="/auth/login" className="btn btn-white btn-lg">Sign In</Link>
        </div>
      </div>
    </section>
  )
}
