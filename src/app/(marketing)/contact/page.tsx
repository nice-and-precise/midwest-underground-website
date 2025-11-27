import Link from 'next/link'
import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | Midwest Underground of Minnesota',
  description: 'Contact Midwest Underground of Minnesota for HDD services, fiber optic installation, and underground utility projects in central Minnesota.',
}

export default function ContactPage() {
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
            Contact Us
          </h1>
          <p style={{fontSize: 'var(--text-xl)', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', color: 'var(--white)', opacity: 0.95}}>
            Ready to start your underground utility project? Get in touch today.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section">
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)'}}>
            {/* Contact Form */}
            <div>
              <h2 style={{color: 'var(--color-primary)', marginBottom: 'var(--space-lg)'}}>Send Us a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Details */}
            <div>
              <h2 style={{color: 'var(--color-primary)', marginBottom: 'var(--space-lg)'}}>Get In Touch</h2>

              <div style={{marginBottom: 'var(--space-xl)'}}>
                <h3 style={{marginBottom: 'var(--space-sm)'}}>📍 Office Location</h3>
                <address style={{fontStyle: 'normal', lineHeight: 1.8, color: 'var(--text-secondary)'}}>
                  <strong>Midwest Underground of Minnesota Inc.</strong><br />
                  4320 County Rd 8 SE<br />
                  Willmar, MN 56201
                </address>
              </div>

              <div style={{marginBottom: 'var(--space-xl)'}}>
                <h3 style={{marginBottom: 'var(--space-sm)'}}>📞 Phone</h3>
                <p style={{color: 'var(--text-secondary)'}}>
                  <a href="tel:3203826636" style={{color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-lg)'}}>
                    (320) 382-6636
                  </a>
                </p>
                <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>
                  Available 24/7 for emergencies
                </p>
              </div>

              <div style={{marginBottom: 'var(--space-xl)'}}>
                <h3 style={{marginBottom: 'var(--space-sm)'}}>✉️ Email</h3>
                <p style={{color: 'var(--text-secondary)'}}>
                  <a href="mailto:info@midwestunderground.com" style={{color: 'var(--color-primary)', fontWeight: 600}}>
                    info@midwestunderground.com
                  </a>
                </p>
              </div>

              <div style={{marginBottom: 'var(--space-xl)'}}>
                <h3 style={{marginBottom: 'var(--space-sm)'}}>🕐 Business Hours</h3>
                <p style={{color: 'var(--text-secondary)', lineHeight: 1.8}}>
                  Monday - Friday: 7:00 AM - 5:00 PM<br />
                  Saturday: By Appointment<br />
                  Sunday: Closed<br />
                  <strong>Emergency services available 24/7</strong>
                </p>
              </div>

              <div style={{backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginTop: 'var(--space-xl)'}}>
                <h4 style={{color: 'var(--color-primary)', marginBottom: 'var(--space-sm)'}}>🚨 Emergency Line</h4>
                <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-md)'}}>
                  For urgent utility repairs and fiber breaks, call our 24/7 emergency line:
                </p>
                <a href="tel:3203826636" className="btn btn-primary">
                  (320) 382-6636
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area Map Placeholder */}
      <section className="section gradient-bg-light">
        <div className="container">
          <div className="text-center" style={{marginBottom: 'var(--space-xl)'}}>
            <h2 style={{color: 'var(--color-primary)'}}>Our Service Area</h2>
            <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto'}}>
              Proudly serving central Minnesota and surrounding areas
            </p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)', textAlign: 'center'}}>
            <div style={{padding: 'var(--space-lg)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)'}}>
              <strong>Kandiyohi County</strong>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>Willmar, Spicer, New London</p>
            </div>
            <div style={{padding: 'var(--space-lg)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)'}}>
              <strong>Stearns County</strong>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>St. Cloud, Cold Spring, Paynesville</p>
            </div>
            <div style={{padding: 'var(--space-lg)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)'}}>
              <strong>Douglas County</strong>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>Alexandria, Brandon, Garfield</p>
            </div>
            <div style={{padding: 'var(--space-lg)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)'}}>
              <strong>Meeker County</strong>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>Litchfield, Grove City, Dassel</p>
            </div>
            <div style={{padding: 'var(--space-lg)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)'}}>
              <strong>Pope County</strong>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>Glenwood, Starbuck, Villard</p>
            </div>
            <div style={{padding: 'var(--space-lg)', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)'}}>
              <strong>Swift County</strong>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>Benson, Appleton, Kerkhoven</p>
            </div>
          </div>
          <p style={{textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--text-secondary)'}}>
            Don't see your area listed? <Link href="/contact" style={{color: 'var(--color-primary)', fontWeight: 600}}>Contact us</Link> – we may still be able to help!
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{backgroundColor: 'var(--color-primary)', color: 'var(--white)'}}>
        <div className="container text-center">
          <h2 style={{marginBottom: 'var(--space-md)', color: 'var(--white)'}}>Ready to Start Your Project?</h2>
          <p style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-xl)', maxWidth: '700px', margin: '0 auto var(--space-xl)', color: 'var(--white)', opacity: 0.95}}>
            Get a free quote for your underground utility project today.
          </p>
          <div style={{display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="tel:3203826636" className="btn btn-lg" style={{
              backgroundColor: 'var(--white)',
              color: 'var(--color-primary)',
              border: '2px solid var(--white)',
              fontWeight: 700
            }}>
              Call (320) 382-6636
            </a>
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
