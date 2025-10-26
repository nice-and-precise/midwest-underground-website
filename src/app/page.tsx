import Link from 'next/link'
import ParallaxSection from '@/components/ParallaxSection'

export default function HomePage() {
  return (
    <>
      {/* Hero Section - PUBLIC-FACING */}
      <section className="parallax-hero" style={{
        position: 'relative',
        minHeight: '600px',
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
            Minnesota's Precision Underground Experts
          </h1>
          <p style={{fontSize: 'var(--text-xl)', marginBottom: 'var(--space-xl)', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', color: 'var(--white)', opacity: 0.95}}>
            34 Years of Excellence in Directional Drilling, Fiber Optic Installation & Underground Utilities
          </p>
          <div style={{display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get Free Quote
            </Link>
            <a href="tel:3203826636" className="btn btn-lg" style={{backgroundColor: 'var(--white)', color: 'var(--color-primary)', border: 'none', fontWeight: 700}}>
              Call (320) 382-6636
            </a>
          </div>
        </div>
      </section>

      {/* Services Overview - PUBLIC-FACING BUSINESS SERVICES (NOT DASHBOARD) */}
      <ParallaxSection className="section gradient-bg-light" speed={0.15}>
        <div className="container">
          <div className="text-center" style={{marginBottom: 'var(--space-2xl)'}}>
            <h2 style={{color: 'var(--brand-slate-dark)'}}>Our Core Services</h2>
            <p style={{fontSize: 'var(--text-lg)', color: 'var(--brand-slate-dark)', maxWidth: '700px', margin: '0 auto'}}>
              From precision directional drilling to complete fiber optic networks, we deliver underground infrastructure solutions that power Minnesota's growth.
            </p>
          </div>

          <div className="services-grid">
            {/* Service 1: Horizontal Directional Drilling */}
            <article className="service-card">
              <div className="service-icon">🔧</div>
              <h3>Horizontal Directional Drilling</h3>
              <p>Precision underground utility installation with minimal surface disruption. Advanced HDD technology for projects of any scale.</p>
              <Link href="/services#hdd" className="service-link">
                Learn More <span>→</span>
              </Link>
            </article>

            {/* Service 2: Fiber Optic Installation */}
            <article className="service-card">
              <div className="service-icon">🌐</div>
              <h3>Fiber Optic Cable Installation</h3>
              <p>Expert fiber network deployment for broadband providers, municipalities, and telecommunications infrastructure projects.</p>
              <Link href="/services#fiber" className="service-link">
                Learn More <span>→</span>
              </Link>
            </article>

            {/* Service 3: Underground Utilities */}
            <article className="service-card">
              <div className="service-icon">⚡</div>
              <h3>Underground Utilities</h3>
              <p>Complete installation of water, sewer, power, and gas lines. Professional utility trenching and conduit placement.</p>
              <Link href="/services#utilities" className="service-link">
                Learn More <span>→</span>
              </Link>
            </article>

            {/* Service 4: Telecommunications Infrastructure */}
            <article className="service-card">
              <div className="service-icon">📡</div>
              <h3>Telecommunications Infrastructure</h3>
              <p>Comprehensive telecom infrastructure installation, splicing, and testing. Supporting Minnesota's broadband expansion.</p>
              <Link href="/services#telecom" className="service-link">
                Learn More <span>→</span>
              </Link>
            </article>

            {/* Service 5: Road Crossings */}
            <article className="service-card">
              <div className="service-icon">🛣️</div>
              <h3>Road Crossings & Boring</h3>
              <p>Expert road and railway crossings using advanced boring techniques. Minimal traffic disruption, maximum precision.</p>
              <Link href="/services#crossing" className="service-link">
                Learn More <span>→</span>
              </Link>
            </article>

            {/* Service 6: Emergency Services */}
            <article className="service-card">
              <div className="service-icon">🚨</div>
              <h3>24/7 Emergency Services</h3>
              <p>Round-the-clock emergency response for utility repairs, fiber breaks, and urgent infrastructure needs.</p>
              <Link href="/services#emergency" className="service-link">
                Learn More <span>→</span>
              </Link>
            </article>
          </div>
        </div>
      </ParallaxSection>

      {/* Why Choose Us Section */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{marginBottom: 'var(--space-2xl)'}}>
            <h2>Why Minnesota Chooses Midwest Underground</h2>
            <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto'}}>
              Three decades of underground expertise serving central Minnesota's growing infrastructure needs.
            </p>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-xl)'}}>
            <div style={{textAlign: 'center', padding: 'var(--space-lg)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🏆</div>
              <h3 style={{marginBottom: 'var(--space-sm)'}}>34+ Years Experience</h3>
              <p style={{color: 'var(--text-secondary)'}}>Established in 1991, we've completed thousands of successful projects across Minnesota.</p>
            </div>

            <div style={{textAlign: 'center', padding: 'var(--space-lg)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🎯</div>
              <h3 style={{marginBottom: 'var(--space-sm)'}}>Safety First</h3>
              <p style={{color: 'var(--text-secondary)'}}>Zero accidents, full 811 compliance, and comprehensive insurance on every project.</p>
            </div>

            <div style={{textAlign: 'center', padding: 'var(--space-lg)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>⚙️</div>
              <h3 style={{marginBottom: 'var(--space-sm)'}}>Advanced Equipment</h3>
              <p style={{color: 'var(--text-secondary)'}}>State-of-the-art HDD rigs and technology for projects of any complexity.</p>
            </div>

            <div style={{textAlign: 'center', padding: 'var(--space-lg)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>👥</div>
              <h3 style={{marginBottom: 'var(--space-sm)'}}>Expert Team</h3>
              <p style={{color: 'var(--text-secondary)'}}>18 skilled professionals with decades of combined underground construction experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - FIXED BUTTON CONTRAST */}
      <section className="section" style={{backgroundColor: 'var(--color-primary)', color: 'var(--white)'}}>
        <div className="container text-center">
          <h2 style={{marginBottom: 'var(--space-md)', color: 'var(--white)'}}>Ready to Start Your Project?</h2>
          <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-xl)', maxWidth: '700px', margin: '0 auto var(--space-xl)', color: 'var(--white)', opacity: 0.95}}>
            Get a free quote for your directional drilling, fiber optic, or underground utilities project in central Minnesota.
          </p>
          <div style={{display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/contact" className="btn btn-lg" style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--black)',
              border: '2px solid var(--color-secondary)',
              fontWeight: 700
            }}>
              Get Free Quote
            </Link>
            <a href="tel:3203826636" className="btn btn-lg" style={{
              backgroundColor: 'var(--white)',
              color: 'var(--color-primary)',
              border: '2px solid var(--white)',
              fontWeight: 700
            }}>
              Call (320) 382-6636
            </a>
          </div>
          <p style={{marginTop: 'var(--space-lg)', fontSize: 'var(--text-sm)', color: 'var(--white)', opacity: 0.8}}>
            Staff Login: <Link href="/auth/login" style={{color: 'var(--white)', textDecoration: 'underline'}}>Dashboard Access</Link>
          </p>
        </div>
      </section>
    </>
  )
}
