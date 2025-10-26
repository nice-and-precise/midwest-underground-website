'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function ParallaxHero() {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return

      const scrolled = window.scrollY
      const parallaxBg = parallaxRef.current.querySelector('.parallax-bg') as HTMLElement

      if (parallaxBg) {
        // Move background slower than scroll for parallax effect
        parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`
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
