import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | Midwest Underground of Minnesota',
  description: 'Professional underground utility services including HDD, fiber optic installation, and utility infrastructure in central Minnesota.',
}

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="parallax-hero" style={{
        position: 'relative',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(52, 61, 70, 0.85), rgba(52, 61, 70, 0.85)), url(/images/BAckhoe digging.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'var(--white)'
      }}>
        <div className="container text-center">
          <h1 style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 'var(--space-lg)', color: 'var(--white)'}}>
            Our Services
          </h1>
          <p style={{fontSize: 'var(--text-xl)', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', color: 'var(--white)', opacity: 0.95}}>
            Complete underground utility solutions for Minnesota's infrastructure needs
          </p>
        </div>
      </section>

      {/* HDD Section */}
      <section id="hdd" className="section">
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'center'}}>
            <div>
              <h2 style={{color: 'var(--color-primary)', marginBottom: 'var(--space-md)'}}>Horizontal Directional Drilling</h2>
              <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)'}}>
                Precision underground utility installation with minimal surface disruption. Our advanced HDD technology allows us to complete projects of any scale while preserving landscapes, roadways, and existing infrastructure.
              </p>
              <ul style={{listStyle: 'none', padding: 0, margin: '0 0 var(--space-lg) 0'}}>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Fiber optic conduit installation</li>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Water and sewer line installation</li>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Electrical conduit placement</li>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Gas line installation</li>
                <li style={{padding: 'var(--space-sm) 0'}}>Road and railway crossings</li>
              </ul>
              <Link href="/contact" className="btn btn-primary">Request HDD Quote</Link>
            </div>
            <div style={{backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center'}}>
              <div style={{fontSize: '4rem', marginBottom: 'var(--space-md)'}}>🔧</div>
              <h3>34+ Years HDD Experience</h3>
              <p style={{color: 'var(--text-secondary)'}}>Precision drilling for projects of any complexity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fiber Section */}
      <section id="fiber" className="section gradient-bg-light">
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'center'}}>
            <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center'}}>
              <div style={{fontSize: '4rem', marginBottom: 'var(--space-md)'}}>🌐</div>
              <h3>Broadband Ready</h3>
              <p style={{color: 'var(--text-secondary)'}}>Supporting Minnesota's broadband expansion goals</p>
            </div>
            <div>
              <h2 style={{color: 'var(--color-primary)', marginBottom: 'var(--space-md)'}}>Fiber Optic Installation</h2>
              <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)'}}>
                Expert fiber network deployment for broadband providers, municipalities, and telecommunications infrastructure projects. We're helping connect rural Minnesota to high-speed internet.
              </p>
              <ul style={{listStyle: 'none', padding: 0, margin: '0 0 var(--space-lg) 0'}}>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Fiber optic cable installation</li>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Conduit installation and repair</li>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Splice and test services</li>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>FTTH (Fiber to the Home) projects</li>
                <li style={{padding: 'var(--space-sm) 0'}}>Network restoration</li>
              </ul>
              <Link href="/contact" className="btn btn-primary">Request Fiber Quote</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Utilities Section */}
      <section id="utilities" className="section">
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'center'}}>
            <div>
              <h2 style={{color: 'var(--color-primary)', marginBottom: 'var(--space-md)'}}>Underground Utilities</h2>
              <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)'}}>
                Complete installation of water, sewer, power, and gas lines. Professional utility trenching and conduit placement with full 811 compliance and safety protocols.
              </p>
              <ul style={{listStyle: 'none', padding: 0, margin: '0 0 var(--space-lg) 0'}}>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Water main installation</li>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Sanitary sewer lines</li>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Storm sewer systems</li>
                <li style={{padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-200)'}}>Gas line installation</li>
                <li style={{padding: 'var(--space-sm) 0'}}>Electrical conduit</li>
              </ul>
              <Link href="/contact" className="btn btn-primary">Request Utility Quote</Link>
            </div>
            <div style={{backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center'}}>
              <div style={{fontSize: '4rem', marginBottom: 'var(--space-md)'}}>⚡</div>
              <h3>Full 811 Compliance</h3>
              <p style={{color: 'var(--text-secondary)'}}>Safety-first approach on every project</p>
            </div>
          </div>
        </div>
      </section>

      {/* Telecom Section */}
      <section id="telecom" className="section gradient-bg-light">
        <div className="container">
          <div className="text-center" style={{marginBottom: 'var(--space-2xl)'}}>
            <h2 style={{color: 'var(--color-primary)'}}>Telecommunications Infrastructure</h2>
            <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto'}}>
              Comprehensive telecom infrastructure installation, splicing, and testing for providers across central Minnesota.
            </p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-xl)'}}>
            <div className="service-card">
              <h3>Cell Tower Infrastructure</h3>
              <p>Underground power and fiber for cellular installations</p>
            </div>
            <div className="service-card">
              <h3>ISP Networks</h3>
              <p>Distribution networks for internet service providers</p>
            </div>
            <div className="service-card">
              <h3>Enterprise Connectivity</h3>
              <p>Business campus fiber and data connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Road Crossings Section */}
      <section id="crossing" className="section">
        <div className="container text-center">
          <h2 style={{color: 'var(--color-primary)', marginBottom: 'var(--space-lg)'}}>Road Crossings & Boring</h2>
          <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto var(--space-xl)'}}>
            Expert road and railway crossings using advanced boring techniques. Minimal traffic disruption with maximum precision and safety.
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap', marginBottom: 'var(--space-xl)'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem'}}>🛣️</div>
              <p><strong>Highway Crossings</strong></p>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem'}}>🚂</div>
              <p><strong>Railway Crossings</strong></p>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3rem'}}>🏙️</div>
              <p><strong>Urban Boring</strong></p>
            </div>
          </div>
          <Link href="/contact" className="btn btn-primary btn-lg">Request Crossing Quote</Link>
        </div>
      </section>

      {/* Emergency Section */}
      <section id="emergency" className="section" style={{backgroundColor: 'var(--color-primary)', color: 'var(--white)'}}>
        <div className="container text-center">
          <div style={{fontSize: '4rem', marginBottom: 'var(--space-md)'}}>🚨</div>
          <h2 style={{marginBottom: 'var(--space-md)', color: 'var(--white)'}}>24/7 Emergency Services</h2>
          <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-xl)', maxWidth: '700px', margin: '0 auto var(--space-xl)', color: 'var(--white)', opacity: 0.95}}>
            Round-the-clock emergency response for utility repairs, fiber breaks, and urgent infrastructure needs. We're here when you need us most.
          </p>
          <a href="tel:3203826636" className="btn btn-lg" style={{
            backgroundColor: 'var(--white)',
            color: 'var(--color-primary)',
            border: '2px solid var(--white)',
            fontWeight: 700
          }}>
            Emergency Line: (320) 382-6636
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container text-center">
          <h2 style={{marginBottom: 'var(--space-md)'}}>Ready to Get Started?</h2>
          <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '600px', margin: '0 auto var(--space-xl)'}}>
            Contact us today for a free quote on your underground utility project.
          </p>
          <Link href="/contact" className="btn btn-primary btn-lg">
            Request Free Quote
          </Link>
        </div>
      </section>
    </>
  )
}
