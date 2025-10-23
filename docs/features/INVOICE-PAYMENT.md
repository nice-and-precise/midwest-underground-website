# Invoice Payment System Implementation Guide

Complete guide for adding secure online invoice payment functionality to the Midwest Underground website.

---

## Overview

**Feature:** Online Invoice Payment System with Stripe Integration
**Implementation Time:** ~6-8 hours (full production) or ~2 hours (MVP/simulation)
**Complexity:** High (with real payments) / Medium (simulation mode)
**Files Modified/Created:** 5+ (invoice-payment.html, css/payment-styles.css, js/payment.js, .env, payment-success.html)

**Security Level:** CRITICAL - Handles financial transactions and sensitive data

---

## ⚠️ CRITICAL WARNINGS

**BEFORE YOU START:**

1. **HTTPS REQUIRED** - Payment processing MUST run on HTTPS in production. Stripe will not work on HTTP.
2. **API KEY SECURITY** - NEVER commit API keys to git. Use environment variables or server-side configuration.
3. **PCI COMPLIANCE** - Using Stripe Elements keeps you PCI-compliant by never touching card data directly.
4. **TEST MODE FIRST** - Always develop and test with Stripe test keys before going live.
5. **SERVER-SIDE REQUIRED** - Production implementations need a backend to securely create payment intents.
6. **NO CLIENT-SIDE SECRETS** - Never expose secret keys in JavaScript or HTML.

**This guide provides:**
- ✅ Production-ready architecture and code patterns
- ✅ MVP/simulation mode for portfolio demonstration
- ✅ Security best practices and PCI compliance guidance
- ⚠️ Clear warnings about what requires backend infrastructure

---

## Complete Feature Request

Copy and paste this into Claude Code:

```markdown
# FEATURE REQUEST: Invoice Payment System

## Context
Read CLAUDE.md and review the current codebase, particularly:
- Project structure and existing HTML pages
- css/styles.css (current styling patterns)
- js/main.js (existing JavaScript patterns)
- Contact form implementation (for reference)

## Feature Requirements

**What:** Implement a secure online invoice payment system that allows customers to pay outstanding invoices using credit/debit cards via Stripe.

**Why:**
- Improves cash flow by making it easier for customers to pay invoices
- Reduces payment processing time and manual handling
- Provides professional, modern payment experience
- Differentiates from competitors who lack online payment options
- Reduces accounts receivable aging

**User Story:**
As a Midwest Underground customer, I want to pay my invoice online using my credit card so that I can quickly settle outstanding balances without mailing checks or calling the office.

**Acceptance Criteria:**

**Phase 1: MVP/Simulation Mode (Portfolio Demo)**
- [ ] Invoice lookup page with professional UI
- [ ] Invoice number validation (client-side format check)
- [ ] Payment form with simulated Stripe Elements UI
- [ ] Amount display and verification
- [ ] Simulated payment processing with success/error states
- [ ] Success confirmation page with receipt details
- [ ] Mobile responsive design
- [ ] Security warnings and HTTPS requirement notices
- [ ] Clear indication that this is simulation mode
- [ ] No real API keys or backend required

**Phase 2: Production Implementation (Real Payments)**
- [ ] Stripe account setup and API key configuration
- [ ] Real Stripe Elements integration
- [ ] Backend server for payment intent creation (Node.js/Python/PHP)
- [ ] Secure invoice lookup against real database/accounting system
- [ ] Payment processing with Stripe Payment Intents API
- [ ] Webhook handlers for payment confirmation
- [ ] Email confirmations (customer + internal accounting)
- [ ] Payment receipt generation
- [ ] Transaction logging and audit trail
- [ ] Error handling and retry logic
- [ ] PCI compliance verification
- [ ] Security audit (penetration testing)
- [ ] HTTPS deployment on production domain
- [ ] Rate limiting and fraud detection
- [ ] Accessibility (WCAG AA)
- [ ] Performance maintained (Lighthouse > 90)
- [ ] Documentation for accounting staff

## Payment Flow

**User Journey:**
1. Customer receives invoice via email/mail with invoice number
2. Customer visits website and clicks "Pay Invoice" or goes to /invoice-payment.html
3. Customer enters invoice number to look up invoice
4. System displays invoice details (amount, date, description)
5. Customer confirms details and enters payment information
6. System processes payment through Stripe
7. Customer receives confirmation on screen and via email
8. Accounting system is updated with payment

## Implementation Approach

### MVP/Simulation Mode (Start Here)
- Client-side only implementation
- Simulated invoice database (JSON array in JavaScript)
- Styled payment form that looks like Stripe Elements
- Simulated processing with realistic delays
- Success/error states demonstration
- Perfect for portfolio and concept validation

### Production Mode (Phase 2)
- Backend server (Node.js, Python, or PHP)
- Real Stripe API integration
- Database integration for invoice lookup
- Webhook processing for payment events
- Email notifications
- Production security measures

## Technical Specifications

**Frontend:**
- HTML5 semantic markup
- CSS3 with custom properties for theming
- Vanilla JavaScript (no frameworks)
- Stripe Elements library (production) or custom styled inputs (MVP)
- Client-side validation
- Responsive design (mobile-first)

**Backend (Production Only):**
- RESTful API endpoints
- Stripe SDK for server-side payment processing
- Database queries for invoice verification
- Webhook endpoint for Stripe events
- Email service integration
- Logging and monitoring

**Security Requirements:**
- HTTPS everywhere
- Content Security Policy headers
- Input validation and sanitization
- CSRF protection (production)
- Rate limiting
- No sensitive data in client-side code
- Secure session management (production)

## Integration Points

**Accounting System:**
- Invoice lookup by invoice number
- Payment posting after successful transaction
- Receipt generation
- Accounts receivable updates

**Email System:**
- Payment confirmation to customer
- Payment notification to accounting
- Failed payment alerts

**Stripe Integration:**
- Payment Elements for card input
- Payment Intent API for processing
- Webhooks for event handling
- Customer and Payment Method management

## Success Metrics

**User Experience:**
- Payment completion time < 2 minutes
- Mobile payment success rate > 95%
- Form abandonment rate < 20%
- Customer satisfaction with payment process

**Business Impact:**
- Faster invoice payment (target: 7 days → 3 days)
- Reduced payment processing costs
- Improved cash flow
- Reduced accounts receivable aging
- Professional brand perception

## Quality Gates

- ✅ Invoice lookup works reliably
- ✅ Payment form validates all inputs
- ✅ Error messages are clear and actionable
- ✅ Success confirmation displays correctly
- ✅ Mobile responsive on all devices
- ✅ Accessible via keyboard and screen readers
- ✅ Secure (HTTPS, no exposed credentials)
- ✅ PCI compliant (using Stripe Elements)
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ Accounting staff trained on system
```

---

## System Architecture

### MVP/Simulation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER ONLY                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  invoice-payment.html                                        │
│  ├─ Invoice lookup form                                      │
│  ├─ Invoice display section                                 │
│  └─ Simulated payment form                                   │
│                                                              │
│  js/payment.js                                               │
│  ├─ Mock invoice database (JSON array)                       │
│  ├─ Invoice lookup logic                                     │
│  ├─ Form validation                                          │
│  ├─ Simulated payment processing                             │
│  └─ Success/error handling                                   │
│                                                              │
│  css/payment-styles.css                                      │
│  └─ Stripe-like payment form styling                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘

**Data Flow:**
1. User enters invoice number
2. JavaScript searches mock invoice array
3. Display invoice details if found
4. User enters payment info (simulated validation)
5. Simulate API call with setTimeout
6. Show success page with fake transaction ID
```

### Production Architecture

```
┌──────────────────┐         ┌──────────────────┐         ┌─────────────┐
│                  │         │                  │         │             │
│  Client Browser  │◄───────►│  Backend Server  │◄───────►│   Stripe    │
│                  │  HTTPS  │                  │   API   │     API     │
│  - Invoice form  │         │  - Payment API   │         │             │
│  - Stripe.js     │         │  - Invoice API   │         └─────────────┘
│  - Elements      │         │  - Webhooks      │
│                  │         │                  │
└──────────────────┘         └──────┬───────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │                              │
                    │  Database / Accounting CRM   │
                    │                              │
                    │  - Invoice records           │
                    │  - Customer data             │
                    │  - Payment history           │
                    │                              │
                    └──────────────────────────────┘
```

**Production Data Flow:**

1. **Invoice Lookup:**
   ```
   Client → Backend API → Database
   ├─ Validate invoice number format
   ├─ Query invoice by number
   ├─ Verify invoice status (unpaid, not expired)
   └─ Return invoice details (amount, description, customer)
   ```

2. **Payment Processing:**
   ```
   Client → Stripe.js → Stripe API (tokenize card)
   Client → Backend API → Stripe API (create payment intent)
   Client → Stripe Elements (confirm payment)
   Stripe → Backend Webhook (payment succeeded event)
   Backend → Database (update invoice status)
   Backend → Email Service (send confirmations)
   ```

3. **Confirmation:**
   ```
   Client → Backend API (get payment status)
   Backend → Client (transaction details)
   Client → Display success page
   ```

---

## Stripe Integration Details

### Step 1: Stripe Account Setup

1. **Create Stripe Account:**
   - Go to https://stripe.com
   - Sign up for a free account
   - Complete business verification (for production)

2. **Get API Keys:**
   - Navigate to Developers → API keys
   - Note your **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - Note your **Secret key** (starts with `sk_test_` or `sk_live_`)
   - **NEVER** commit secret keys to git

3. **Test vs. Live Mode:**
   - Test mode: Use `pk_test_*` and `sk_test_*` keys
   - Live mode: Use `pk_live_*` and `sk_live_*` keys
   - Toggle in Stripe Dashboard upper-right corner

### Step 2: Environment Configuration

**CRITICAL: Never hardcode API keys in your code!**

**Option 1: Server-Side Environment Variables (Recommended)**

```bash
# .env file (add to .gitignore!)
STRIPE_PUBLISHABLE_KEY=pk_test_51A...
STRIPE_SECRET_KEY=sk_test_51A...
INVOICE_API_URL=https://your-api.com/invoices
```

**.gitignore:**
```
.env
.env.local
.env.production
```

**Option 2: Server-Side Injection (for static sites)**

```html
<!-- Server generates this HTML with environment variable -->
<script>
  window.STRIPE_PUBLISHABLE_KEY = '<?= getenv("STRIPE_PUBLISHABLE_KEY") ?>';
</script>
```

**Option 3: Build-Time Injection (Netlify, Vercel)**

```javascript
// netlify.toml or vercel.json configuration
// Environment variables injected at build time
const stripeKey = process.env.STRIPE_PUBLISHABLE_KEY;
```

### Step 3: Install Stripe.js

Add to `<head>` of invoice-payment.html:

```html
<!-- Stripe.js - Always load from Stripe's CDN for PCI compliance -->
<script src="https://js.stripe.com/v3/"></script>
```

**Why load from Stripe's CDN?**
- PCI compliance requirement
- Automatic updates and security patches
- Ensures you're always using the latest version
- Required for Stripe Elements to work

### Step 4: Initialize Stripe Elements

```javascript
// js/payment.js

// Initialize Stripe with your publishable key
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY'); // Replace with your key

// Create an instance of Elements
const elements = stripe.elements();

// Custom styling to match your site
const style = {
  base: {
    color: '#333333',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#999999'
    }
  },
  invalid: {
    color: '#e74c3c',
    iconColor: '#e74c3c'
  }
};

// Create card element
const cardElement = elements.create('card', { style });

// Mount to DOM
cardElement.mount('#card-element');

// Handle validation errors
cardElement.on('change', function(event) {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});
```

### Step 5: Payment Intent Flow

**Production payment flow using Payment Intents API:**

```javascript
// Step 1: Create Payment Intent (requires backend)
async function createPaymentIntent(amount, invoiceNumber) {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amount, // Amount in cents
      invoice_number: invoiceNumber,
      currency: 'usd'
    })
  });

  const { clientSecret, error } = await response.json();

  if (error) {
    throw new Error(error);
  }

  return clientSecret;
}

// Step 2: Confirm payment with Stripe
async function handlePayment(clientSecret) {
  const { error, paymentIntent } = await stripe.confirmCardPayment(
    clientSecret,
    {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: document.getElementById('cardholder-name').value,
          email: document.getElementById('email').value
        }
      }
    }
  );

  if (error) {
    // Payment failed
    showError(error.message);
  } else if (paymentIntent.status === 'succeeded') {
    // Payment succeeded
    showSuccess(paymentIntent);
  }
}
```

**Backend endpoint (Node.js example):**

```javascript
// server.js (Node.js + Express)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, invoice_number, currency } = req.body;

    // Validate invoice exists and amount matches
    const invoice = await lookupInvoice(invoice_number);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.amount !== amount) {
      return res.status(400).json({ error: 'Amount mismatch' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ error: 'Invoice already paid' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'usd',
      metadata: {
        invoice_number: invoice_number,
        customer_name: invoice.customer_name
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error('Payment intent creation failed:', error);
    res.status(500).json({ error: 'Payment processing error' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Detailed Implementation Steps

### Phase 1: MVP/Simulation Mode (Start Here)

This implementation works entirely client-side and is perfect for portfolio demonstration and concept validation.

#### Step 1: Create HTML Structure (30 minutes)

Create `invoice-payment.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pay Invoice - Midwest Underground</title>

  <meta name="description" content="Pay your Midwest Underground invoice securely online with credit or debit card.">
  <meta name="robots" content="noindex, nofollow"> <!-- Don't index payment pages -->

  <!-- Existing site styles -->
  <link rel="stylesheet" href="css/styles.css">

  <!-- Payment-specific styles -->
  <link rel="stylesheet" href="css/payment-styles.css">
</head>
<body>

  <!-- Header (reuse from existing site) -->
  <header class="site-header">
    <!-- Copy header from index.html -->
  </header>

  <main class="payment-main">

    <!-- Security Notice (MVP Mode) -->
    <div class="alert alert-info">
      <strong>Demo Mode:</strong> This is a simulation for demonstration purposes.
      No real payments are processed. Production implementation requires HTTPS and backend server.
    </div>

    <!-- Page Header -->
    <section class="payment-header">
      <div class="container">
        <h1>Pay Your Invoice</h1>
        <p>Enter your invoice number to view details and submit payment securely.</p>
      </div>
    </section>

    <!-- Step 1: Invoice Lookup -->
    <section id="invoice-lookup-section" class="payment-section">
      <div class="container">
        <div class="payment-card">
          <h2>Step 1: Find Your Invoice</h2>

          <form id="invoice-lookup-form">
            <div class="form-group">
              <label for="invoice-number">Invoice Number</label>
              <input
                type="text"
                id="invoice-number"
                name="invoice-number"
                placeholder="INV-2024-001234"
                required
                pattern="INV-\d{4}-\d{6}"
                aria-describedby="invoice-help"
              >
              <small id="invoice-help" class="form-text">
                Format: INV-YYYY-NNNNNN (example: INV-2024-001234)
              </small>
              <div class="error-message" id="invoice-error"></div>
            </div>

            <button type="submit" class="btn btn-primary">
              Look Up Invoice
            </button>
          </form>

          <!-- Loading State -->
          <div id="invoice-loading" class="loading-spinner" style="display: none;">
            <div class="spinner"></div>
            <p>Looking up invoice...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Step 2: Invoice Details (hidden initially) -->
    <section id="invoice-details-section" class="payment-section" style="display: none;">
      <div class="container">
        <div class="payment-card">
          <h2>Step 2: Verify Invoice Details</h2>

          <div class="invoice-details">
            <div class="invoice-header">
              <div>
                <strong>Invoice Number:</strong>
                <span id="display-invoice-number"></span>
              </div>
              <div>
                <strong>Status:</strong>
                <span id="display-invoice-status" class="badge badge-warning">Unpaid</span>
              </div>
            </div>

            <div class="invoice-body">
              <div class="invoice-row">
                <span>Issue Date:</span>
                <span id="display-invoice-date"></span>
              </div>
              <div class="invoice-row">
                <span>Customer:</span>
                <span id="display-customer-name"></span>
              </div>
              <div class="invoice-row">
                <span>Description:</span>
                <span id="display-invoice-description"></span>
              </div>
              <div class="invoice-row invoice-total">
                <span><strong>Amount Due:</strong></span>
                <span id="display-invoice-amount" class="amount"></span>
              </div>
            </div>
          </div>

          <button id="proceed-to-payment" class="btn btn-primary">
            Proceed to Payment
          </button>
        </div>
      </div>
    </section>

    <!-- Step 3: Payment Form (hidden initially) -->
    <section id="payment-form-section" class="payment-section" style="display: none;">
      <div class="container">
        <div class="payment-card">
          <h2>Step 3: Enter Payment Information</h2>

          <form id="payment-form">

            <!-- Amount Display -->
            <div class="payment-amount-display">
              <span>Total Amount:</span>
              <span id="payment-amount" class="amount"></span>
            </div>

            <!-- Cardholder Information -->
            <div class="form-group">
              <label for="cardholder-name">Cardholder Name</label>
              <input
                type="text"
                id="cardholder-name"
                name="cardholder-name"
                placeholder="John Smith"
                required
                autocomplete="cc-name"
              >
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                required
                autocomplete="email"
              >
              <small class="form-text">Receipt will be sent to this email</small>
            </div>

            <!-- Card Element (simulated for MVP) -->
            <div class="form-group">
              <label for="card-number">Card Information</label>

              <!-- MVP: Custom styled inputs -->
              <div id="card-element-simulation" class="card-element">
                <input
                  type="text"
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  autocomplete="cc-number"
                  class="card-input"
                >
                <div class="card-details">
                  <input
                    type="text"
                    id="card-expiry"
                    placeholder="MM / YY"
                    maxlength="7"
                    autocomplete="cc-exp"
                    class="card-input-small"
                  >
                  <input
                    type="text"
                    id="card-cvc"
                    placeholder="CVC"
                    maxlength="4"
                    autocomplete="cc-csc"
                    class="card-input-small"
                  >
                </div>
              </div>

              <!-- For production: Replace above with Stripe Element -->
              <!-- <div id="card-element"></div> -->

              <div id="card-errors" class="error-message"></div>
            </div>

            <!-- Billing Address -->
            <div class="form-group">
              <label for="billing-zip">Billing ZIP Code</label>
              <input
                type="text"
                id="billing-zip"
                name="billing-zip"
                placeholder="12345"
                maxlength="10"
                autocomplete="postal-code"
              >
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1l5 2v4.5c0 3.5-2 6.5-5 8-3-1.5-5-4.5-5-8V3l5-2z"/>
              </svg>
              <span>Your payment information is encrypted and secure</span>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="submit-payment" class="btn btn-success btn-lg">
              <span id="button-text">Pay <span id="button-amount"></span></span>
              <span id="button-spinner" class="spinner" style="display: none;"></span>
            </button>

            <!-- Error Display -->
            <div id="payment-error" class="error-message" style="display: none;"></div>
          </form>

          <!-- Test Card Numbers (MVP only) -->
          <div class="test-cards-info">
            <details>
              <summary>Test Card Numbers (Demo Mode)</summary>
              <ul>
                <li><strong>Success:</strong> 4242 4242 4242 4242</li>
                <li><strong>Declined:</strong> 4000 0000 0000 0002</li>
                <li><strong>Insufficient Funds:</strong> 4000 0000 0000 9995</li>
                <li>Use any future expiry date and any 3-digit CVC</li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer (reuse from existing site) -->
  <footer class="site-footer">
    <!-- Copy footer from index.html -->
  </footer>

  <!-- Scripts -->
  <script src="js/main.js"></script>
  <script src="js/payment.js"></script>

</body>
</html>
```

#### Step 2: Create Payment Success Page (15 minutes)

Create `payment-success.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful - Midwest Underground</title>
  <meta name="robots" content="noindex, nofollow">

  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/payment-styles.css">
</head>
<body>

  <header class="site-header">
    <!-- Copy header -->
  </header>

  <main class="payment-success-main">
    <div class="container">
      <div class="success-card">

        <!-- Success Icon -->
        <div class="success-icon">
          <svg width="64" height="64" fill="#27ae60" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
        </div>

        <h1>Payment Successful!</h1>
        <p class="success-message">
          Your payment has been processed successfully.
          A confirmation email has been sent to <span id="receipt-email"></span>.
        </p>

        <!-- Transaction Details -->
        <div class="transaction-details">
          <h2>Transaction Details</h2>

          <div class="detail-row">
            <span>Transaction ID:</span>
            <span id="transaction-id" class="mono"></span>
          </div>

          <div class="detail-row">
            <span>Invoice Number:</span>
            <span id="paid-invoice-number"></span>
          </div>

          <div class="detail-row">
            <span>Amount Paid:</span>
            <span id="paid-amount" class="amount"></span>
          </div>

          <div class="detail-row">
            <span>Payment Date:</span>
            <span id="payment-date"></span>
          </div>

          <div class="detail-row">
            <span>Payment Method:</span>
            <span id="payment-method"></span>
          </div>
        </div>

        <!-- Actions -->
        <div class="success-actions">
          <button onclick="window.print()" class="btn btn-outline">
            Print Receipt
          </button>
          <a href="index.html" class="btn btn-primary">
            Return to Home
          </a>
        </div>

        <!-- Help Text -->
        <div class="help-text">
          <p>
            <strong>Need help?</strong> Contact our office at
            <a href="tel:+13203826636">(320) 382-6636</a> or
            <a href="mailto:info@midwestundergroundmn.com">info@midwestundergroundmn.com</a>
          </p>
        </div>

      </div>
    </div>
  </main>

  <footer class="site-footer">
    <!-- Copy footer -->
  </footer>

  <script src="js/payment-success.js"></script>

</body>
</html>
```

#### Step 3: Create Payment Styles (45 minutes)

Create `css/payment-styles.css`:

```css
/* ==========================================================================
   PAYMENT SYSTEM STYLES
   ========================================================================== */

/* Alert Messages */
.alert {
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  border-left: 4px solid;
}

.alert-info {
  background-color: #e3f2fd;
  border-color: #2196f3;
  color: #1976d2;
}

.alert-warning {
  background-color: #fff3e0;
  border-color: #ff9800;
  color: #f57c00;
}

.alert-danger {
  background-color: #ffebee;
  border-color: #f44336;
  color: #d32f2f;
}

/* Page Layout */
.payment-main {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  background-color: #f5f5f5;
}

.payment-header {
  background-color: #003B5C;
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
  text-align: center;
}

.payment-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.payment-header p {
  margin: 0;
  font-size: 1.125rem;
  opacity: 0.9;
}

/* Payment Sections */
.payment-section {
  margin-bottom: 2rem;
}

.payment-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.payment-card h2 {
  margin: 0 0 1.5rem 0;
  color: #003B5C;
  font-size: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f5f5f5;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333333;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #003B5C;
  box-shadow: 0 0 0 3px rgba(0, 59, 92, 0.1);
}

.form-group input.error {
  border-color: #e74c3c;
}

.form-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666666;
}

/* Card Element Styling (MVP Simulation) */
.card-element {
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.card-element:focus-within {
  border-color: #003B5C;
  box-shadow: 0 0 0 3px rgba(0, 59, 92, 0.1);
}

.card-element input {
  border: none;
  padding: 0.5rem 0;
  width: 100%;
  font-size: 1rem;
}

.card-element input:focus {
  outline: none;
  box-shadow: none;
}

.card-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
}

.card-input-small {
  padding: 0.5rem !important;
}

/* Invoice Details Display */
.invoice-details {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 4px 4px 0 0;
}

.invoice-body {
  padding: 1.5rem;
}

.invoice-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.invoice-row:last-child {
  border-bottom: none;
}

.invoice-row.invoice-total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #003B5C;
  font-size: 1.25rem;
}

/* Badge */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-warning {
  background-color: #fff3e0;
  color: #f57c00;
}

.badge-success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

/* Amount Display */
.amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #003B5C;
}

.payment-amount-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

/* Security Notice */
.security-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  color: #2e7d32;
  font-size: 0.875rem;
}

.security-notice svg {
  flex-shrink: 0;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  border: 2px solid transparent;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: #003B5C;
  color: white;
  border-color: #003B5C;
}

.btn-primary:hover {
  background-color: #002a42;
  border-color: #002a42;
}

.btn-success {
  background-color: #27ae60;
  color: white;
  border-color: #27ae60;
}

.btn-success:hover {
  background-color: #229954;
  border-color: #229954;
}

.btn-outline {
  background-color: transparent;
  color: #003B5C;
  border-color: #003B5C;
}

.btn-outline:hover {
  background-color: #003B5C;
  color: white;
}

.btn-lg {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading Spinner */
.loading-spinner {
  text-align: center;
  padding: 2rem;
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #003B5C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Messages */
.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: none;
}

.error-message.show {
  display: block;
}

/* Test Cards Info */
.test-cards-info {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.test-cards-info summary {
  cursor: pointer;
  color: #666666;
  font-size: 0.875rem;
  padding: 0.5rem;
}

.test-cards-info summary:hover {
  color: #003B5C;
}

.test-cards-info ul {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

.test-cards-info li {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #666666;
}

/* Success Page */
.payment-success-main {
  min-height: calc(100vh - 200px);
  padding: 4rem 0;
  background-color: #f5f5f5;
}

.success-card {
  background: white;
  border-radius: 8px;
  padding: 3rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.success-icon {
  margin-bottom: 1.5rem;
}

.success-card h1 {
  color: #27ae60;
  margin-bottom: 1rem;
}

.success-message {
  font-size: 1.125rem;
  color: #666666;
  margin-bottom: 2rem;
}

.transaction-details {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: left;
}

.transaction-details h2 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: #003B5C;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row:last-child {
  border-bottom: none;
}

.mono {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #666666;
}

.success-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}

.help-text {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.875rem;
  color: #666666;
}

.help-text a {
  color: #003B5C;
  text-decoration: none;
}

.help-text a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .payment-header h1 {
    font-size: 2rem;
  }

  .payment-card {
    padding: 1.5rem;
  }

  .invoice-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .card-details {
    grid-template-columns: 1fr;
  }

  .success-actions {
    flex-direction: column;
  }

  .success-card {
    padding: 2rem 1.5rem;
  }
}

/* Print Styles */
@media print {
  .site-header,
  .site-footer,
  .success-actions {
    display: none;
  }

  .success-card {
    box-shadow: none;
    border: 1px solid #e0e0e0;
  }
}
```

#### Step 4: Create Payment JavaScript (MVP - 90 minutes)

Create `js/payment.js`:

```javascript
/* ==========================================================================
   PAYMENT PROCESSING (MVP SIMULATION MODE)

   This is a client-side simulation for demonstration purposes.
   For production, you MUST implement:
   - Backend API for invoice lookup
   - Backend API for payment processing
   - Real Stripe integration with Payment Intents
   - Database integration
   - Email notifications
   - Security measures
   ========================================================================== */

// Mock invoice database (replace with real API in production)
const MOCK_INVOICES = [
  {
    invoice_number: 'INV-2024-001234',
    customer_name: 'ABC Telecom Inc.',
    amount: 15750.00,
    description: 'Horizontal Directional Drilling - Fiber Installation (2.5 miles)',
    issue_date: '2024-01-15',
    due_date: '2024-02-15',
    status: 'unpaid'
  },
  {
    invoice_number: 'INV-2024-001235',
    customer_name: 'City of Willmar',
    amount: 8250.00,
    description: 'Underground Utilities Installation - Water Line Crossing',
    issue_date: '2024-01-18',
    due_date: '2024-02-18',
    status: 'unpaid'
  },
  {
    invoice_number: 'INV-2024-001236',
    customer_name: 'Minnesota Rural Broadband',
    amount: 22500.00,
    description: 'Fiber Optic Cable Installation - Rural Expansion Project',
    issue_date: '2024-01-20',
    due_date: '2024-02-20',
    status: 'unpaid'
  }
];

// Stripe test card numbers for simulation
const TEST_CARDS = {
  success: '4242424242424242',
  declined: '4000000000000002',
  insufficient_funds: '4000000000009995'
};

class InvoicePaymentSystem {
  constructor() {
    this.currentInvoice = null;
    this.elements = {
      // Section containers
      lookupSection: document.getElementById('invoice-lookup-section'),
      detailsSection: document.getElementById('invoice-details-section'),
      paymentSection: document.getElementById('payment-form-section'),

      // Forms
      lookupForm: document.getElementById('invoice-lookup-form'),
      paymentForm: document.getElementById('payment-form'),

      // Inputs
      invoiceNumberInput: document.getElementById('invoice-number'),
      cardholderName: document.getElementById('cardholder-name'),
      email: document.getElementById('email'),
      cardNumber: document.getElementById('card-number'),
      cardExpiry: document.getElementById('card-expiry'),
      cardCvc: document.getElementById('card-cvc'),
      billingZip: document.getElementById('billing-zip'),

      // Buttons
      proceedButton: document.getElementById('proceed-to-payment'),
      submitButton: document.getElementById('submit-payment'),

      // Display elements
      displayInvoiceNumber: document.getElementById('display-invoice-number'),
      displayInvoiceStatus: document.getElementById('display-invoice-status'),
      displayInvoiceDate: document.getElementById('display-invoice-date'),
      displayCustomerName: document.getElementById('display-customer-name'),
      displayInvoiceDescription: document.getElementById('display-invoice-description'),
      displayInvoiceAmount: document.getElementById('display-invoice-amount'),
      paymentAmount: document.getElementById('payment-amount'),
      buttonAmount: document.getElementById('button-amount'),

      // Error/loading states
      invoiceError: document.getElementById('invoice-error'),
      invoiceLoading: document.getElementById('invoice-loading'),
      cardErrors: document.getElementById('card-errors'),
      paymentError: document.getElementById('payment-error'),
      buttonText: document.getElementById('button-text'),
      buttonSpinner: document.getElementById('button-spinner')
    };

    this.init();
  }

  init() {
    // Set up event listeners
    this.elements.lookupForm.addEventListener('submit', (e) => this.handleInvoiceLookup(e));
    this.elements.proceedButton.addEventListener('click', () => this.showPaymentForm());
    this.elements.paymentForm.addEventListener('submit', (e) => this.handlePaymentSubmit(e));

    // Card input formatting
    this.setupCardFormatting();
  }

  // ==========================================================================
  // STEP 1: Invoice Lookup
  // ==========================================================================

  async handleInvoiceLookup(e) {
    e.preventDefault();

    const invoiceNumber = this.elements.invoiceNumberInput.value.trim().toUpperCase();

    // Clear previous errors
    this.hideError(this.elements.invoiceError);

    // Validate format
    if (!this.validateInvoiceFormat(invoiceNumber)) {
      this.showError(
        this.elements.invoiceError,
        'Invalid invoice number format. Use format: INV-YYYY-NNNNNN'
      );
      return;
    }

    // Show loading state
    this.elements.invoiceLoading.style.display = 'block';
    this.elements.lookupForm.style.display = 'none';

    try {
      // Simulate API call delay
      await this.delay(1000);

      // Look up invoice (in production, this would be an API call)
      const invoice = await this.lookupInvoice(invoiceNumber);

      if (!invoice) {
        throw new Error('Invoice not found. Please check the invoice number and try again.');
      }

      if (invoice.status === 'paid') {
        throw new Error('This invoice has already been paid.');
      }

      // Store invoice and display details
      this.currentInvoice = invoice;
      this.displayInvoiceDetails(invoice);

      // Hide lookup section, show details section
      this.elements.lookupSection.style.display = 'none';
      this.elements.detailsSection.style.display = 'block';

      // Scroll to details
      this.elements.detailsSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      this.elements.invoiceLoading.style.display = 'none';
      this.elements.lookupForm.style.display = 'block';
      this.showError(this.elements.invoiceError, error.message);
    }
  }

  validateInvoiceFormat(invoiceNumber) {
    // Format: INV-YYYY-NNNNNN
    const pattern = /^INV-\d{4}-\d{6}$/;
    return pattern.test(invoiceNumber);
  }

  async lookupInvoice(invoiceNumber) {
    // PRODUCTION: Replace with real API call
    // const response = await fetch(`/api/invoices/${invoiceNumber}`);
    // if (!response.ok) throw new Error('Invoice not found');
    // return await response.json();

    // MVP: Search mock database
    return MOCK_INVOICES.find(inv => inv.invoice_number === invoiceNumber);
  }

  displayInvoiceDetails(invoice) {
    this.elements.displayInvoiceNumber.textContent = invoice.invoice_number;
    this.elements.displayInvoiceDate.textContent = this.formatDate(invoice.issue_date);
    this.elements.displayCustomerName.textContent = invoice.customer_name;
    this.elements.displayInvoiceDescription.textContent = invoice.description;
    this.elements.displayInvoiceAmount.textContent = this.formatCurrency(invoice.amount);
    this.elements.paymentAmount.textContent = this.formatCurrency(invoice.amount);
    this.elements.buttonAmount.textContent = this.formatCurrency(invoice.amount);
  }

  // ==========================================================================
  // STEP 2: Show Payment Form
  // ==========================================================================

  showPaymentForm() {
    this.elements.detailsSection.style.display = 'none';
    this.elements.paymentSection.style.display = 'block';
    this.elements.paymentSection.scrollIntoView({ behavior: 'smooth' });
  }

  // ==========================================================================
  // STEP 3: Payment Processing
  // ==========================================================================

  async handlePaymentSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    this.hideError(this.elements.cardErrors);
    this.hideError(this.elements.paymentError);

    // Validate all fields
    if (!this.validatePaymentForm()) {
      return;
    }

    // Disable submit button and show loading
    this.setLoadingState(true);

    try {
      // Simulate payment processing
      await this.processPayment();

      // Success - redirect to success page
      this.redirectToSuccess();

    } catch (error) {
      this.setLoadingState(false);
      this.showError(this.elements.paymentError, error.message);
      this.elements.paymentError.style.display = 'block';
    }
  }

  validatePaymentForm() {
    const cardNumber = this.elements.cardNumber.value.replace(/\s/g, '');
    const expiry = this.elements.cardExpiry.value;
    const cvc = this.elements.cardCvc.value;
    const name = this.elements.cardholderName.value.trim();
    const email = this.elements.email.value.trim();

    // Validate cardholder name
    if (!name || name.length < 3) {
      this.showError(this.elements.cardErrors, 'Please enter cardholder name');
      return false;
    }

    // Validate email
    if (!this.validateEmail(email)) {
      this.showError(this.elements.cardErrors, 'Please enter a valid email address');
      return false;
    }

    // Validate card number (Luhn algorithm)
    if (!this.validateCardNumber(cardNumber)) {
      this.showError(this.elements.cardErrors, 'Invalid card number');
      return false;
    }

    // Validate expiry
    if (!this.validateExpiry(expiry)) {
      this.showError(this.elements.cardErrors, 'Invalid or expired card');
      return false;
    }

    // Validate CVC
    if (!cvc || cvc.length < 3) {
      this.showError(this.elements.cardErrors, 'Invalid CVC code');
      return false;
    }

    return true;
  }

  async processPayment() {
    const cardNumber = this.elements.cardNumber.value.replace(/\s/g, '');

    // Simulate network delay
    await this.delay(2000);

    // PRODUCTION: Real Stripe payment processing
    // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: cardElement,
    //     billing_details: {
    //       name: this.elements.cardholderName.value,
    //       email: this.elements.email.value
    //     }
    //   }
    // });
    //
    // if (error) {
    //   throw new Error(error.message);
    // }

    // MVP: Simulate different outcomes based on test card numbers
    if (cardNumber === TEST_CARDS.declined) {
      throw new Error('Your card was declined. Please try a different payment method.');
    }

    if (cardNumber === TEST_CARDS.insufficient_funds) {
      throw new Error('Insufficient funds. Please try a different card.');
    }

    // Simulate success for valid cards
    if (cardNumber === TEST_CARDS.success || this.validateCardNumber(cardNumber)) {
      // Store payment data for success page
      this.storePaymentData();
      return true;
    }

    throw new Error('Payment processing failed. Please try again.');
  }

  storePaymentData() {
    // Store in sessionStorage for success page to retrieve
    const paymentData = {
      transaction_id: this.generateTransactionId(),
      invoice_number: this.currentInvoice.invoice_number,
      amount: this.currentInvoice.amount,
      email: this.elements.email.value,
      cardholder_name: this.elements.cardholderName.value,
      payment_date: new Date().toISOString(),
      last4: this.elements.cardNumber.value.replace(/\s/g, '').slice(-4)
    };

    sessionStorage.setItem('payment_data', JSON.stringify(paymentData));
  }

  redirectToSuccess() {
    // PRODUCTION: Server would redirect after confirming payment
    window.location.href = 'payment-success.html';
  }

  // ==========================================================================
  // Card Input Formatting
  // ==========================================================================

  setupCardFormatting() {
    // Format card number with spaces
    this.elements.cardNumber.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });

    // Format expiry as MM / YY
    this.elements.cardExpiry.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '').replace('/', '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
      }
      e.target.value = value;
    });

    // Limit CVC to 4 digits
    this.elements.cardCvc.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
  }

  // ==========================================================================
  // Validation Helpers
  // ==========================================================================

  validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  validateCardNumber(cardNumber) {
    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0 && cardNumber.length >= 13 && cardNumber.length <= 19;
  }

  validateExpiry(expiry) {
    const parts = expiry.split('/').map(p => p.trim());
    if (parts.length !== 2) return false;

    const month = parseInt(parts[0]);
    const year = parseInt('20' + parts[1]);

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  }

  // ==========================================================================
  // UI Helper Methods
  // ==========================================================================

  showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
  }

  hideError(element) {
    element.textContent = '';
    element.classList.remove('show');
  }

  setLoadingState(loading) {
    if (loading) {
      this.elements.submitButton.disabled = true;
      this.elements.buttonText.style.display = 'none';
      this.elements.buttonSpinner.style.display = 'inline-block';
    } else {
      this.elements.submitButton.disabled = false;
      this.elements.buttonText.style.display = 'inline';
      this.elements.buttonSpinner.style.display = 'none';
    }
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  generateTransactionId() {
    // MVP: Generate fake transaction ID
    // PRODUCTION: This comes from Stripe
    const prefix = 'txn_sim_';
    const random = Math.random().toString(36).substring(2, 15);
    return prefix + random;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize payment system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize on payment page
  if (document.getElementById('invoice-lookup-form')) {
    new InvoicePaymentSystem();
  }
});
```

#### Step 5: Create Success Page JavaScript (20 minutes)

Create `js/payment-success.js`:

```javascript
/* ==========================================================================
   PAYMENT SUCCESS PAGE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Retrieve payment data from sessionStorage
  const paymentDataStr = sessionStorage.getItem('payment_data');

  if (!paymentDataStr) {
    // No payment data - redirect to payment page
    window.location.href = 'invoice-payment.html';
    return;
  }

  const paymentData = JSON.parse(paymentDataStr);

  // Display transaction details
  document.getElementById('transaction-id').textContent = paymentData.transaction_id;
  document.getElementById('paid-invoice-number').textContent = paymentData.invoice_number;
  document.getElementById('paid-amount').textContent = formatCurrency(paymentData.amount);
  document.getElementById('payment-date').textContent = formatDateTime(paymentData.payment_date);
  document.getElementById('payment-method').textContent = `Card ending in ${paymentData.last4}`;
  document.getElementById('receipt-email').textContent = paymentData.email;

  // Clear payment data from sessionStorage (prevent duplicate displays)
  sessionStorage.removeItem('payment_data');

  // PRODUCTION: Send confirmation to backend
  // fetch('/api/payment-confirmation', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(paymentData)
  // });
});

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

---

### Phase 2: Production Implementation

**This section requires backend infrastructure.**

#### Backend Requirements

1. **Server Technology Options:**
   - Node.js + Express
   - Python + Flask/Django
   - PHP + Laravel
   - Ruby on Rails

2. **Required API Endpoints:**

```javascript
// POST /api/invoices/lookup
// Request: { invoice_number: "INV-2024-001234" }
// Response: { invoice: {...} }

// POST /api/create-payment-intent
// Request: { invoice_number, amount }
// Response: { clientSecret }

// POST /api/webhooks/stripe
// Stripe webhook events (payment.succeeded, payment.failed, etc.)

// GET /api/payment-status/:transaction_id
// Response: { status, transaction_details }
```

3. **Database Schema:**

```sql
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id),
  stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20),
  cardholder_email VARCHAR(255),
  cardholder_name VARCHAR(255),
  last4 VARCHAR(4),
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_logs (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER REFERENCES payments(id),
  event_type VARCHAR(50),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. **Environment Variables:**

```bash
# .env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://user:pass@host/db
EMAIL_API_KEY=...
FRONTEND_URL=https://yoursite.com
```

5. **Webhook Handler Example (Node.js):**

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');

app.post('/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

async function handlePaymentSuccess(paymentIntent) {
  const { invoice_number } = paymentIntent.metadata;

  // Update invoice status in database
  await updateInvoiceStatus(invoice_number, 'paid');

  // Record payment
  await recordPayment({
    invoice_number,
    stripe_payment_intent_id: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    status: 'succeeded',
    payment_date: new Date()
  });

  // Send confirmation emails
  await sendPaymentConfirmation(paymentIntent);
}
```

---

## Code Examples

### Production Stripe Integration

```javascript
// Initialize Stripe (production)
const stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);
const elements = stripe.elements();

// Create and mount card element
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#333',
      '::placeholder': { color: '#999' }
    }
  }
});
cardElement.mount('#card-element');

// Handle payment
async function processRealPayment(invoiceNumber, amount) {
  try {
    // Step 1: Create payment intent on backend
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoice_number: invoiceNumber,
        amount: Math.round(amount * 100) // Convert to cents
      })
    });

    const { clientSecret, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    // Step 2: Confirm payment with Stripe
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: document.getElementById('cardholder-name').value,
            email: document.getElementById('email').value
          }
        }
      }
    );

    if (confirmError) {
      throw new Error(confirmError.message);
    }

    if (paymentIntent.status === 'succeeded') {
      // Payment successful
      window.location.href = `payment-success.html?payment_intent=${paymentIntent.id}`;
    }

  } catch (error) {
    console.error('Payment failed:', error);
    showError(error.message);
  }
}
```

### Error Handling

```javascript
// Comprehensive error handling
function handlePaymentError(error) {
  const errorMessages = {
    'card_declined': 'Your card was declined. Please try a different payment method.',
    'insufficient_funds': 'Insufficient funds. Please use a different card.',
    'expired_card': 'Your card has expired. Please use a different card.',
    'incorrect_cvc': 'Incorrect CVC code. Please check and try again.',
    'processing_error': 'An error occurred while processing your payment. Please try again.',
    'invalid_number': 'Invalid card number. Please check and try again.'
  };

  const message = errorMessages[error.code] || error.message || 'Payment failed. Please try again.';

  // Display error to user
  showError(message);

  // Log error for debugging
  console.error('Payment error:', {
    code: error.code,
    message: error.message,
    type: error.type,
    decline_code: error.decline_code
  });

  // Send to error tracking service (production)
  // trackError('payment_error', error);
}
```

### Invoice Lookup with Validation

```javascript
// Production invoice lookup
async function lookupInvoiceProduction(invoiceNumber) {
  try {
    const response = await fetch(`/api/invoices/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken() // CSRF protection
      },
      body: JSON.stringify({ invoice_number: invoiceNumber })
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Invoice not found');
      }
      if (response.status === 400) {
        const { error } = await response.json();
        throw new Error(error);
      }
      throw new Error('Failed to lookup invoice');
    }

    const { invoice } = await response.json();

    // Validate invoice is payable
    if (invoice.status === 'paid') {
      throw new Error('This invoice has already been paid');
    }

    if (invoice.status === 'cancelled') {
      throw new Error('This invoice has been cancelled');
    }

    if (new Date(invoice.due_date) < new Date() - 90 * 24 * 60 * 60 * 1000) {
      throw new Error('This invoice is too old. Please contact our office.');
    }

    return invoice;

  } catch (error) {
    console.error('Invoice lookup failed:', error);
    throw error;
  }
}
```

---

## Security Best Practices

### 1. API Key Management

**DO:**
- ✅ Store secret keys in environment variables
- ✅ Use different keys for test and production
- ✅ Rotate keys regularly
- ✅ Restrict key permissions in Stripe dashboard
- ✅ Use server-side keys only on the server

**DON'T:**
- ❌ Never commit API keys to version control
- ❌ Never expose secret keys in JavaScript
- ❌ Never use production keys in development
- ❌ Never share keys in emails or chat

### 2. HTTPS Requirements

**Production must use HTTPS:**
- Stripe will reject non-HTTPS requests
- Card data must be encrypted in transit
- Use valid SSL certificate (Let's Encrypt is free)
- Redirect all HTTP to HTTPS

```nginx
# Nginx HTTPS redirect
server {
  listen 80;
  server_name yoursite.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yoursite.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  # Strong SSL configuration
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### 3. Input Validation

```javascript
// Server-side validation (REQUIRED)
function validatePaymentRequest(data) {
  const errors = [];

  // Validate invoice number format
  if (!/^INV-\d{4}-\d{6}$/.test(data.invoice_number)) {
    errors.push('Invalid invoice number format');
  }

  // Validate amount
  if (!data.amount || data.amount <= 0 || data.amount > 1000000) {
    errors.push('Invalid amount');
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email address');
  }

  // Validate against database
  const invoice = await getInvoice(data.invoice_number);
  if (!invoice) {
    errors.push('Invoice not found');
  }

  // Verify amount matches
  if (invoice && Math.abs(invoice.amount - data.amount) > 0.01) {
    errors.push('Amount mismatch');
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }

  return true;
}
```

### 4. PCI Compliance

**Using Stripe Elements ensures PCI compliance:**

- ✅ Card data never touches your server
- ✅ Stripe handles card tokenization
- ✅ You only receive secure tokens
- ✅ Stripe is PCI Level 1 certified

**Important:**
- Never log card numbers or CVC codes
- Never store card data in your database
- Use Stripe's Customer and PaymentMethod objects for saved cards
- Follow Stripe's security guidelines

### 5. Rate Limiting

```javascript
// Express rate limiting middleware
const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 payment attempts per 15 minutes
  message: 'Too many payment attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/api/create-payment-intent', paymentLimiter, async (req, res) => {
  // Payment processing logic
});
```

### 6. CSRF Protection

```javascript
// CSRF token middleware
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.post('/api/create-payment-intent', csrfProtection, async (req, res) => {
  // Payment processing logic
});

// Frontend: Include CSRF token in requests
fetch('/api/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
  },
  body: JSON.stringify(paymentData)
});
```

### 7. Webhook Signature Verification

**Always verify webhook signatures:**

```javascript
// Verify Stripe webhook signature
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      // Process verified event
      handleWebhookEvent(event);

      res.json({ received: true });
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);
```

---

## Testing Checklist

### Test Card Numbers

**Stripe provides test cards for different scenarios:**

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0000 0000 0069 | Expired card |
| 4000 0000 0000 0127 | Incorrect CVC |
| 4000 0000 0000 0341 | Processing error |
| 4000 0025 0000 3155 | 3D Secure required |

**Use any future expiry date and any 3-digit CVC**

### Functional Testing

**Invoice Lookup:**
- [ ] Valid invoice number displays details correctly
- [ ] Invalid format shows error message
- [ ] Non-existent invoice shows "not found"
- [ ] Already-paid invoice shows appropriate message
- [ ] Loading state displays during lookup
- [ ] Error handling works for network failures

**Payment Form:**
- [ ] All fields validate correctly
- [ ] Card number formatting works (spaces every 4 digits)
- [ ] Expiry formatting works (MM / YY)
- [ ] CVC limited to 3-4 digits
- [ ] Email validation works
- [ ] Required field validation works
- [ ] Card validation (Luhn algorithm) works

**Payment Processing:**
- [ ] Successful payment redirects to success page
- [ ] Success card (4242...) completes payment
- [ ] Declined card shows error message
- [ ] Insufficient funds shows error message
- [ ] Processing errors handled gracefully
- [ ] Loading state shows during processing
- [ ] Button disabled during processing

**Success Page:**
- [ ] Transaction details display correctly
- [ ] Invoice number shown
- [ ] Amount shown correctly
- [ ] Email address shown
- [ ] Transaction ID generated
- [ ] Print functionality works
- [ ] Navigation back to home works

### Security Testing

- [ ] HTTPS enforced in production
- [ ] No API keys in client-side code
- [ ] No console.log statements in production
- [ ] CSRF protection enabled
- [ ] Rate limiting active
- [ ] Input sanitization working
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (escaped output)

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Form labels associated with inputs
- [ ] Error messages announced by screen readers
- [ ] Success messages announced
- [ ] ARIA attributes correct
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

### Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Lighthouse performance score > 90
- [ ] No unnecessary JavaScript
- [ ] CSS minified
- [ ] Images optimized
- [ ] No memory leaks

---

## Production Deployment Checklist

### Pre-Launch

**Backend:**
- [ ] Production server configured and secured
- [ ] Database set up with proper indexes
- [ ] SSL certificate installed and valid
- [ ] Environment variables configured
- [ ] Stripe webhook endpoint registered
- [ ] Email service configured
- [ ] Logging and monitoring set up
- [ ] Backup system in place
- [ ] Error tracking (e.g., Sentry) configured

**Frontend:**
- [ ] Remove all console.log statements
- [ ] Replace test API keys with production keys
- [ ] Remove demo mode alerts
- [ ] Minify CSS and JavaScript
- [ ] Optimize images
- [ ] Configure CSP headers
- [ ] Test all payment flows
- [ ] Verify mobile responsiveness

**Stripe Configuration:**
- [ ] Switch from test mode to live mode
- [ ] Verify business information complete
- [ ] Bank account connected for payouts
- [ ] Webhook endpoints configured
- [ ] Email receipts enabled
- [ ] Statement descriptor set
- [ ] Radar rules configured (fraud detection)

**Security:**
- [ ] HTTPS enforced
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] SQL injection protection verified
- [ ] XSS protection verified
- [ ] Security headers configured
- [ ] Penetration testing completed

### Launch

- [ ] Deploy to production
- [ ] Verify HTTPS working
- [ ] Test end-to-end payment flow
- [ ] Verify webhook receiving events
- [ ] Test email confirmations
- [ ] Monitor error logs
- [ ] Test with real card (small amount)
- [ ] Verify database updates correctly

### Post-Launch

- [ ] Monitor transaction logs daily
- [ ] Check for failed payments
- [ ] Review error reports
- [ ] Monitor webhook deliveries
- [ ] Check email delivery rates
- [ ] Review customer support tickets
- [ ] Track payment success rates
- [ ] Monitor for fraud patterns

### Ongoing Maintenance

- [ ] Weekly: Review failed payments
- [ ] Monthly: Audit transaction logs
- [ ] Monthly: Review security logs
- [ ] Quarterly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Annually: Penetration testing
- [ ] Annually: PCI compliance review (if applicable)

---

## Troubleshooting

### Issue: "Stripe is not defined"

**Cause:** Stripe.js not loaded or loaded incorrectly

**Solution:**
```html
<!-- Ensure Stripe.js is loaded before your payment script -->
<script src="https://js.stripe.com/v3/"></script>
<script src="js/payment.js"></script>
```

---

### Issue: Payment fails with "Invalid API Key"

**Cause:** Wrong API key or key not loaded

**Solution:**
1. Verify you're using the correct key for the environment (test vs. live)
2. Check key starts with `pk_test_` or `pk_live_`
3. Ensure key is loaded from environment variable
4. Check for typos in key

```javascript
// Debug: Log key prefix (never log full key!)
console.log('Using key:', stripe._keyMode); // Should be 'test' or 'live'
```

---

### Issue: Webhook not receiving events

**Cause:** Webhook URL not registered or signature verification failing

**Solution:**
1. Register webhook in Stripe Dashboard → Developers → Webhooks
2. Use publicly accessible HTTPS URL
3. Copy webhook signing secret to environment
4. Verify signature verification code

```bash
# Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

### Issue: Payment succeeds but invoice not marked paid

**Cause:** Webhook handler not updating database or webhook not firing

**Solution:**
1. Check webhook logs in Stripe Dashboard
2. Verify webhook handler is running
3. Check database connection
4. Review webhook handler logs
5. Ensure `payment_intent.succeeded` event is being handled

```javascript
// Add debugging to webhook handler
console.log('Webhook received:', event.type);
console.log('Payment Intent:', event.data.object.id);
```

---

### Issue: Card validation failing for valid cards

**Cause:** Luhn algorithm implementation error or formatting issue

**Solution:**
```javascript
// Ensure card number is stripped of spaces before validation
const cardNumber = inputValue.replace(/\s/g, '');

// Test with known valid card
console.log(validateCardNumber('4242424242424242')); // Should return true
```

---

### Issue: Success page shows "No payment data"

**Cause:** sessionStorage cleared or user accessed page directly

**Solution:**
```javascript
// Check if data exists before clearing
const paymentData = sessionStorage.getItem('payment_data');

if (!paymentData) {
  // For production: Fetch from server using transaction ID in URL
  const urlParams = new URLSearchParams(window.location.search);
  const paymentIntentId = urlParams.get('payment_intent');

  if (paymentIntentId) {
    // Fetch from API
    const data = await fetch(`/api/payment-status/${paymentIntentId}`);
    // Display data
  } else {
    // No data available - redirect
    window.location.href = 'invoice-payment.html';
  }
}
```

---

### Issue: Mobile users can't complete payment

**Cause:** Form not mobile-responsive or keyboard issues

**Solution:**
1. Test on real mobile devices
2. Ensure viewport meta tag is set
3. Check input types for mobile keyboards
4. Verify tap targets are large enough (44x44px minimum)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Use appropriate input types -->
<input type="tel" inputmode="numeric" pattern="[0-9]*" id="card-number">
<input type="email" inputmode="email" id="email">
```

---

### Issue: High rate of abandoned payments

**Cause:** Friction in payment flow or unclear messaging

**Solution:**
- Simplify form (remove unnecessary fields)
- Add progress indicators
- Show security badges
- Display amount prominently
- Provide clear error messages
- Test on multiple devices
- A/B test form layouts

---

## Additional Resources

### Stripe Documentation
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Testing](https://stripe.com/docs/testing)
- [Webhooks](https://stripe.com/docs/webhooks)
- [Security Best Practices](https://stripe.com/docs/security/guide)

### Development Tools
- [Stripe CLI](https://stripe.com/docs/stripe-cli) - Test webhooks locally
- [Stripe Dashboard](https://dashboard.stripe.com) - Monitor payments
- [Stripe Logs](https://dashboard.stripe.com/logs) - Debug API calls

### Compliance
- [PCI Compliance](https://stripe.com/docs/security/guide#validating-pci-compliance)
- [GDPR Considerations](https://stripe.com/guides/general-data-protection-regulation)

---

**Implementation Time:**
- MVP/Simulation: ~2 hours
- Production (Backend + Frontend): ~6-8 hours
- Testing & QA: ~2-4 hours
- Documentation & Training: ~2 hours

**Total Production Time: ~10-14 hours**

**Complexity:** High (Production) / Medium (MVP)

**Business Value:** Very High
- Faster payment collection
- Improved cash flow
- Professional brand image
- Competitive advantage
- Reduced manual processing

---

*This guide provides both MVP simulation code for portfolio demonstration and production-ready architecture for real payment processing. Always prioritize security and compliance when handling real payments.*
