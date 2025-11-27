import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Projects | Midwest Underground of Minnesota',
  description: 'View our portfolio of HDD projects, fiber optic installations, and underground utility work across central Minnesota.',
}

export default function ProjectsPage() {
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
            Our Projects
          </h1>
          <p style={{fontSize: 'var(--text-xl)', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', color: 'var(--white)', opacity: 0.95}}>
            34 years of underground excellence across central Minnesota
          </p>
        </div>
      </section>

      {/* Project Stats */}
      <section className="section gradient-bg-light">
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-xl)', textAlign: 'center'}}>
            <div style={{padding: 'var(--space-xl)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)'}}>1000+</div>
              <p style={{color: 'var(--text-secondary)', fontWeight: 600}}>Projects Completed</p>
            </div>
            <div style={{padding: 'var(--space-xl)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)'}}>500K+</div>
              <p style={{color: 'var(--text-secondary)', fontWeight: 600}}>Linear Feet Drilled</p>
            </div>
            <div style={{padding: 'var(--space-xl)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)'}}>34</div>
              <p style={{color: 'var(--text-secondary)', fontWeight: 600}}>Years Experience</p>
            </div>
            <div style={{padding: 'var(--space-xl)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)'}}>100%</div>
              <p style={{color: 'var(--text-secondary)', fontWeight: 600}}>Safety Record</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{marginBottom: 'var(--space-2xl)'}}>
            <h2 style={{color: 'var(--color-primary)'}}>Featured Projects</h2>
            <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto'}}>
              A selection of our recent work across central Minnesota
            </p>
          </div>

          <div style={{display: 'grid', gap: 'var(--space-2xl)'}}>
            {/* Project 1 */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', alignItems: 'center', padding: 'var(--space-xl)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{backgroundColor: 'var(--gray-200)', borderRadius: 'var(--radius-md)', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontSize: '4rem'}}>🌐</div>
              </div>
              <div>
                <span style={{color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)', textTransform: 'uppercase'}}>Fiber Optic Installation</span>
                <h3 style={{marginTop: 'var(--space-xs)', marginBottom: 'var(--space-md)'}}>Rural Broadband Expansion</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-md)'}}>
                  Major fiber-to-the-home project bringing high-speed internet to rural Kandiyohi County. Installed over 25,000 linear feet of fiber conduit serving 200+ homes.
                </p>
                <ul style={{listStyle: 'none', padding: 0, color: 'var(--text-secondary)'}}>
                  <li><strong>Location:</strong> Kandiyohi County, MN</li>
                  <li><strong>Length:</strong> 25,000+ LF</li>
                  <li><strong>Type:</strong> FTTH Installation</li>
                </ul>
              </div>
            </div>

            {/* Project 2 */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', alignItems: 'center', padding: 'var(--space-xl)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{order: 1}}>
                <span style={{color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)', textTransform: 'uppercase'}}>Horizontal Directional Drilling</span>
                <h3 style={{marginTop: 'var(--space-xs)', marginBottom: 'var(--space-md)'}}>Highway 12 Crossing</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-md)'}}>
                  Complex highway crossing for municipal water main. Completed bore under active highway with zero traffic disruption and full MnDOT compliance.
                </p>
                <ul style={{listStyle: 'none', padding: 0, color: 'var(--text-secondary)'}}>
                  <li><strong>Location:</strong> Willmar, MN</li>
                  <li><strong>Length:</strong> 450 LF</li>
                  <li><strong>Type:</strong> Water Main Installation</li>
                </ul>
              </div>
              <div style={{backgroundColor: 'var(--gray-200)', borderRadius: 'var(--radius-md)', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontSize: '4rem'}}>🛣️</div>
              </div>
            </div>

            {/* Project 3 */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', alignItems: 'center', padding: 'var(--space-xl)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{backgroundColor: 'var(--gray-200)', borderRadius: 'var(--radius-md)', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontSize: '4rem'}}>📱</div>
              </div>
              <div>
                <span style={{color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)', textTransform: 'uppercase'}}>Telecommunications</span>
                <h3 style={{marginTop: 'var(--space-xs)', marginBottom: 'var(--space-md)'}}>Cell Tower Infrastructure</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-md)'}}>
                  Underground power and fiber installation for new 5G cell tower sites. Multiple locations across Stearns County supporting improved rural connectivity.
                </p>
                <ul style={{listStyle: 'none', padding: 0, color: 'var(--text-secondary)'}}>
                  <li><strong>Location:</strong> Stearns County, MN</li>
                  <li><strong>Sites:</strong> 8 Tower Locations</li>
                  <li><strong>Type:</strong> Power & Fiber Installation</li>
                </ul>
              </div>
            </div>

            {/* Project 4 */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', alignItems: 'center', padding: 'var(--space-xl)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{order: 1}}>
                <span style={{color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)', textTransform: 'uppercase'}}>Underground Utilities</span>
                <h3 style={{marginTop: 'var(--space-xs)', marginBottom: 'var(--space-md)'}}>Municipal Water System Upgrade</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-md)'}}>
                  Complete water main replacement for city infrastructure upgrade. Directional drilling minimized street disruption and reduced project timeline by 40%.
                </p>
                <ul style={{listStyle: 'none', padding: 0, color: 'var(--text-secondary)'}}>
                  <li><strong>Location:</strong> Litchfield, MN</li>
                  <li><strong>Length:</strong> 8,500 LF</li>
                  <li><strong>Type:</strong> Water Main Replacement</li>
                </ul>
              </div>
              <div style={{backgroundColor: 'var(--gray-200)', borderRadius: 'var(--radius-md)', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontSize: '4rem'}}>💧</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="section gradient-bg-light">
        <div className="container">
          <div className="text-center" style={{marginBottom: 'var(--space-2xl)'}}>
            <h2 style={{color: 'var(--color-primary)'}}>Types of Projects We Handle</h2>
            <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto'}}>
              From residential installations to major municipal infrastructure
            </p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-xl)'}}>
            <div className="service-card">
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🏠</div>
              <h3>Residential</h3>
              <p>Service line installations, fiber connections, and utility repairs for homeowners.</p>
            </div>
            <div className="service-card">
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🏢</div>
              <h3>Commercial</h3>
              <p>Business campus infrastructure, data center connectivity, and utility upgrades.</p>
            </div>
            <div className="service-card">
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🏛️</div>
              <h3>Municipal</h3>
              <p>City infrastructure projects, water/sewer systems, and public utility installations.</p>
            </div>
            <div className="service-card">
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-md)'}}>🌾</div>
              <h3>Agricultural</h3>
              <p>Farm utility installations, irrigation systems, and rural broadband connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{marginBottom: 'var(--space-2xl)'}}>
            <h2 style={{color: 'var(--color-primary)'}}>What Our Clients Say</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)'}}>
            <div style={{padding: 'var(--space-xl)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{fontSize: '2rem', color: 'var(--color-primary)', marginBottom: 'var(--space-md)'}}>"</div>
              <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontStyle: 'italic'}}>
                Midwest Underground completed our fiber installation ahead of schedule and with minimal disruption to our daily operations. Their professionalism and expertise are unmatched.
              </p>
              <p style={{fontWeight: 600}}>— City of Willmar</p>
            </div>
            <div style={{padding: 'var(--space-xl)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{fontSize: '2rem', color: 'var(--color-primary)', marginBottom: 'var(--space-md)'}}>"</div>
              <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontStyle: 'italic'}}>
                We've worked with Midwest Underground on multiple broadband expansion projects. Their knowledge of HDD and commitment to safety make them our go-to contractor.
              </p>
              <p style={{fontWeight: 600}}>— Regional ISP Provider</p>
            </div>
            <div style={{padding: 'var(--space-xl)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-lg)'}}>
              <div style={{fontSize: '2rem', color: 'var(--color-primary)', marginBottom: 'var(--space-md)'}}>"</div>
              <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontStyle: 'italic'}}>
                The highway crossing project was complex, but Midwest Underground handled all the permits and executed flawlessly. Highly recommend for any HDD work.
              </p>
              <p style={{fontWeight: 600}}>— Municipal Engineering Firm</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{backgroundColor: 'var(--color-primary)', color: 'var(--white)'}}>
        <div className="container text-center">
          <h2 style={{marginBottom: 'var(--space-md)', color: 'var(--white)'}}>Ready to Start Your Project?</h2>
          <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-xl)', maxWidth: '700px', margin: '0 auto var(--space-xl)', color: 'var(--white)', opacity: 0.95}}>
            Let us bring our 34 years of experience to your underground utility project.
          </p>
          <div style={{display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/contact" className="btn btn-lg" style={{
              backgroundColor: 'var(--white)',
              color: 'var(--color-primary)',
              border: '2px solid var(--white)',
              fontWeight: 700
            }}>
              Get a Free Quote
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
