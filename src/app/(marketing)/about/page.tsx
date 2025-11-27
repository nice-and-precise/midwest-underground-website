import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Midwest Underground of Minnesota',
  description: 'Learn about Midwest Underground of Minnesota - 34 years of excellence in horizontal directional drilling and underground utilities.',
}

export default function AboutPage() {
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
            About Midwest Underground
          </h1>
          <p style={{fontSize: 'var(--text-xl)', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', color: 'var(--white)', opacity: 0.95}}>
            34 years of underground excellence in central Minnesota
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section">
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'center'}}>
            <div>
              <h2 style={{color: 'var(--color-primary)', marginBottom: 'var(--space-md)'}}>Our Story</h2>
              <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)'}}>
                Founded in 1991 in Willmar, Minnesota, Midwest Underground of Minnesota Inc. has grown from a small directional drilling operation to one of central Minnesota's most trusted underground utility contractors.
              </p>
              <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)'}}>
                For over three decades, we've been committed to delivering precision underground infrastructure solutions while maintaining the highest standards of safety and professionalism. Our team has completed thousands of successful projects across the region, from small residential installations to major municipal infrastructure.
              </p>
              <p style={{color: 'var(--text-secondary)'}}>
                Today, we continue to serve Minnesota's growing infrastructure needs, helping connect communities to essential utilities and high-speed broadband networks.
              </p>
            </div>
            <div style={{backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)'}}>
              <h3 style={{marginBottom: 'var(--space-lg)', color: 'var(--color-primary)'}}>By the Numbers</h3>
              <div style={{display: 'grid', gap: 'var(--space-lg)'}}>
                <div style={{textAlign: 'center', padding: 'var(--space-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)'}}>
                  <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)'}}>34+</div>
                  <p style={{margin: 0}}>Years in Business</p>
                </div>
                <div style={{textAlign: 'center', padding: 'var(--space-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)'}}>
                  <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)'}}>18</div>
                  <p style={{margin: 0}}>Skilled Team Members</p>
                </div>
                <div style={{textAlign: 'center', padding: 'var(--space-md)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)'}}>
                  <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)'}}>1000s</div>
                  <p style={{margin: 0}}>Projects Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section gradient-bg-light">
        <div className="container">
          <div className="text-center" style={{marginBottom: 'var(--space-2xl)'}}>
            <h2 style={{color: 'var(--color-primary)'}}>Our Core Values</h2>
            <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto'}}>
              The principles that guide everything we do
            </p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-xl)'}}>
            <div className="service-card">
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🎯</div>
              <h3>Safety First</h3>
              <p>Zero compromise on safety. Full 811 compliance, proper training, and comprehensive insurance on every project.</p>
            </div>
            <div className="service-card">
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🤝</div>
              <h3>Integrity</h3>
              <p>Honest communication, fair pricing, and keeping our promises. We build long-term relationships with our clients.</p>
            </div>
            <div className="service-card">
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>⭐</div>
              <h3>Excellence</h3>
              <p>Precision workmanship and attention to detail on every project, no matter the size or complexity.</p>
            </div>
            <div className="service-card">
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🌱</div>
              <h3>Community</h3>
              <p>Proud to serve central Minnesota and contribute to our communities' growth and infrastructure needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{marginBottom: 'var(--space-2xl)'}}>
            <h2 style={{color: 'var(--color-primary)'}}>Our Expert Team</h2>
            <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto'}}>
              18 skilled professionals with decades of combined experience in underground construction
            </p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-xl)'}}>
            <div style={{textAlign: 'center', padding: 'var(--space-lg)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>👨‍💼</div>
              <h4>Project Managers</h4>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>Experienced leaders coordinating every aspect of your project</p>
            </div>
            <div style={{textAlign: 'center', padding: 'var(--space-lg)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🔧</div>
              <h4>Drill Operators</h4>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>Certified HDD operators with thousands of hours of experience</p>
            </div>
            <div style={{textAlign: 'center', padding: 'var(--space-lg)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>📍</div>
              <h4>Locators</h4>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>Precision guidance ensuring accurate bore paths</p>
            </div>
            <div style={{textAlign: 'center', padding: 'var(--space-lg)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>⚙️</div>
              <h4>Crew Members</h4>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>Skilled laborers supporting all aspects of operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="section gradient-bg-light">
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'center'}}>
            <div>
              <h2 style={{color: 'var(--color-primary)', marginBottom: 'var(--space-md)'}}>Our Location</h2>
              <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)'}}>
                Based in Willmar, Minnesota, we serve clients throughout central Minnesota and beyond. Our strategic location allows us to respond quickly to projects across the region.
              </p>
              <address style={{fontStyle: 'normal', lineHeight: 1.8, color: 'var(--text-secondary)'}}>
                <strong>Midwest Underground of Minnesota Inc.</strong><br />
                4320 County Rd 8 SE<br />
                Willmar, MN 56201<br /><br />
                <a href="tel:3203826636" style={{color: 'var(--color-primary)', fontWeight: 600}}>(320) 382-6636</a>
              </address>
            </div>
            <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center'}}>
              <h3 style={{marginBottom: 'var(--space-lg)'}}>Service Area</h3>
              <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-md)'}}>
                Serving central Minnesota including:
              </p>
              <ul style={{listStyle: 'none', padding: 0, color: 'var(--text-secondary)'}}>
                <li>Willmar &amp; Kandiyohi County</li>
                <li>St. Cloud &amp; Stearns County</li>
                <li>Alexandria &amp; Douglas County</li>
                <li>Litchfield &amp; Meeker County</li>
                <li>And surrounding areas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{backgroundColor: 'var(--color-primary)', color: 'var(--white)'}}>
        <div className="container text-center">
          <h2 style={{marginBottom: 'var(--space-md)', color: 'var(--white)'}}>Ready to Work With Us?</h2>
          <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-xl)', maxWidth: '700px', margin: '0 auto var(--space-xl)', color: 'var(--white)', opacity: 0.95}}>
            Contact us today to discuss your underground utility project.
          </p>
          <div style={{display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/contact" className="btn btn-lg" style={{
              backgroundColor: 'var(--white)',
              color: 'var(--color-primary)',
              border: '2px solid var(--white)',
              fontWeight: 700
            }}>
              Contact Us
            </Link>
            <Link href="/services" className="btn btn-lg" style={{
              backgroundColor: 'transparent',
              color: 'var(--white)',
              border: '2px solid var(--white)',
              fontWeight: 700
            }}>
              View Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
