'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className={`mobile-menu-toggle ${isOpen ? 'active' : ''}`}
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <span className="hamburger"></span>
      </button>

      {/* Mobile Menu Backdrop */}
      <div
        className={`mobile-menu-backdrop ${isOpen ? 'active' : ''}`}
        onClick={closeMenu}
        style={{ display: isOpen ? 'block' : 'none' }}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        <ul className="mobile-menu-links">
          <li>
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" onClick={closeMenu}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/auth/login" onClick={closeMenu}>
              Login
            </Link>
          </li>
        </ul>

        <a
          href="tel:3203826636"
          className="mobile-menu-phone"
          aria-label="Call us at 320-382-6636"
        >
          📞 (320) 382-6636
        </a>
      </div>
    </>
  )
}
