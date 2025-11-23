<!-- TOC -->

## Table of Contents

  - [Overview](#overview)
  - [Complete Feature Request](#complete-feature-request)
- [FEATURE REQUEST: Multi-Step Service Request Form](#feature-request-multi-step-service-request-form)
  - [Context](#context)
  - [Feature Requirements](#feature-requirements)
  - [Form Structure Specifications](#form-structure-specifications)
    - [Step 1: Service Selection](#step-1-service-selection)
    - [Step 2: Project Details](#step-2-project-details)
    - [Step 3: Contact Information](#step-3-contact-information)
  - [Implementation Steps](#implementation-steps)
    - [Phase 1: HTML Structure (30 minutes)](#phase-1-html-structure-30-minutes)
    - [Phase 2: CSS Styling (45 minutes)](#phase-2-css-styling-45-minutes)
    - [Phase 3: JavaScript Implementation (90 minutes)](#phase-3-javascript-implementation-90-minutes)
    - [Phase 4: Formspree Integration (15 minutes)](#phase-4-formspree-integration-15-minutes)
  - [Testing Checklist](#testing-checklist)
    - [Functionality Testing](#functionality-testing)
    - [Visual Testing](#visual-testing)
    - [Accessibility Testing](#accessibility-testing)
    - [Performance Testing](#performance-testing)
    - [Validation Testing](#validation-testing)
  - [Documentation Requirements](#documentation-requirements)
    - [1. Update README.md](#1-update-readmemd)
    - [Service Request Form](#service-request-form)
    - [2. Update docs/ARCHITECTURE.md](#2-update-docsarchitecturemd)
  - [Service Request Form](#service-request-form)
    - [3. Update docs/MAINTENANCE.md](#3-update-docsmaintenancemd)
  - [Service Request Form Maintenance](#service-request-form-maintenance)
    - [Modifying Form Fields](#modifying-form-fields)
    - [Troubleshooting](#troubleshooting)
    - [Form Analytics](#form-analytics)
    - [Spam Prevention](#spam-prevention)
    - [4. Update docs/PLACEHOLDERS.md](#4-update-docsplaceholdersmd)
  - [Service Request Form](#service-request-form)
    - [Formspree Integration](#formspree-integration)
    - [Notification Email](#notification-email)
  - [Quality Gates](#quality-gates)
  - [Troubleshooting](#troubleshooting)
    - [Issue: Form not visible on page](#issue-form-not-visible-on-page)
    - [Issue: Validation not working](#issue-validation-not-working)
    - [Issue: Phone number not formatting](#issue-phone-number-not-formatting)
    - [Issue: File upload not working](#issue-file-upload-not-working)
    - [Issue: Progress not saving](#issue-progress-not-saving)
    - [Issue: Form submission fails](#issue-form-submission-fails)
    - [Issue: Mobile layout broken](#issue-mobile-layout-broken)
    - [Issue: Step navigation stuck](#issue-step-navigation-stuck)
    - [Issue: Success message not showing](#issue-success-message-not-showing)
    - [Issue: Error messages not accessible](#issue-error-messages-not-accessible)
    - [Issue: Character counter not updating](#issue-character-counter-not-updating)
    - [Issue: "Other" service field not showing](#issue-other-service-field-not-showing)
    - [Issue: Form data missing in email](#issue-form-data-missing-in-email)
  - [Additional Resources](#additional-resources)
    - [Formspree Documentation](#formspree-documentation)
    - [Accessibility Testing Tools](#accessibility-testing-tools)
    - [Form UX Best Practices](#form-ux-best-practices)
    - [Testing Checklist Resources](#testing-checklist-resources)

<!-- /TOC -->

# Service Request Form Implementation Guide

Complete guide for implementing a professional 3-step multi-step service request form for the Midwest Underground website.

---

## Overview

**Feature:** Multi-Step Service Request Form
**Implementation Time:** ~3-4 hours
**Complexity:** High
**Files Modified:** 4 (contact.html, css/styles.css, js/main.js, new js/form-handler.js)

**Business Value:**
- Captures qualified leads with detailed project information
- Reduces back-and-forth communication with structured data collection
- Professional UX increases conversion rates
- File upload capability for project documents/site plans
- Validates data before submission, reducing errors

---

## Complete Feature Request

Copy and paste this into Claude Code:

```markdown
# FEATURE REQUEST: Multi-Step Service Request Form

## Context
Read CLAUDE.md and review the current codebase, particularly:
- contact.html (current contact form structure)
- css/styles.css (form styling patterns)
- js/main.js (existing JavaScript patterns)

## Feature Requirements

**What:** Replace or enhance the existing contact form with a professional 3-step multi-step form that guides users through service selection, project details, and contact information. Include form validation, progress indicators, file upload capability, and Formspree integration.

**Why:** The current simple contact form doesn't capture enough information about customer needs. A multi-step form reduces cognitive load, increases completion rates, and collects structured data that helps the sales team qualify leads and respond appropriately. This is especially important for complex infrastructure projects requiring detailed specifications.

**User Story:** As a potential customer, I want to request services through a guided form experience so that I can provide all necessary project details without feeling overwhelmed, and receive a faster, more accurate response from Midwest Underground.

**Acceptance Criteria:**
- [ ] 3-step form with clear progress indicator
- [ ] Step 1: Service Selection (checkboxes for multiple services)
- [ ] Step 2: Project Details (timeline, scope, location, budget, description)
- [ ] Step 3: Contact Information (name, company, email, phone, file upload)
- [ ] Real-time validation for each field
- [ ] Previous/Next navigation between steps
- [ ] Cannot advance to next step until current step is valid
- [ ] File upload for documents (PDFs, images, max 5MB)
- [ ] Progress saved to sessionStorage (survives page refresh)
- [ ] Smooth animations between steps
- [ ] Form submission to Formspree with all data including file
- [ ] Success/error message handling
- [ ] Loading state during submission
- [ ] Mobile responsive (works on 375px+ screens)
- [ ] Keyboard accessible (Tab navigation, Enter to submit)
- [ ] Screen reader announcements for errors and success
- [ ] WCAG 2.1 AA compliant
- [ ] Performance maintained (no layout shifts)
- [ ] Clear error messages for validation failures

## Form Structure Specifications

### Step 1: Service Selection
**Heading:** "What services do you need?"
**Fields:**
- Service checkboxes (at least one required):
  - Horizontal Directional Drilling (HDD)
  - Fiber Optic Cable Installation
  - Underground Utilities Installation
  - Telecommunications Infrastructure
  - Power & Water Line Installation
  - Communications Facilities Splicing
  - Underground Geothermal Systems
  - Road Crossings & Utility Conduit
  - Other (with text input field when checked)
- Validation: At least one service must be selected
- Error message: "Please select at least one service"

### Step 2: Project Details
**Heading:** "Tell us about your project"
**Fields:**
- Project Timeline (required, radio buttons):
  - Immediate (Within 30 days)
  - This Quarter (1-3 months)
  - This Year (3-12 months)
  - Planning Phase (12+ months)
- Project Location (required, text input):
  - City/County in Minnesota
  - Validation: Not empty, 3-100 characters
  - Placeholder: "e.g., Willmar, Kandiyohi County"
- Project Scope (required, dropdown):
  - Small (Under $50K)
  - Medium ($50K - $250K)
  - Large ($250K - $1M)
  - Major Project ($1M+)
  - Not Sure Yet
- Linear Footage (optional, number input):
  - Placeholder: "Estimated feet (if known)"
  - Min: 0, Max: 999999
- Project Description (required, textarea):
  - Min length: 20 characters, Max: 2000 characters
  - Placeholder: "Please describe your project needs, site conditions, and any specific requirements..."
  - Character counter showing remaining characters

### Step 3: Contact Information
**Heading:** "How can we reach you?"
**Fields:**
- Full Name (required, text input):
  - Validation: 2-100 characters, letters, spaces, hyphens only
  - Placeholder: "John Smith"
- Company Name (optional, text input):
  - Placeholder: "Your Company Name"
  - Max: 100 characters
- Email (required, email input):
  - Validation: Valid email format
  - Placeholder: "john@company.com"
- Phone (required, tel input):
  - Validation: US phone format (XXX) XXX-XXXX
  - Auto-formatting as user types
  - Placeholder: "(320) 555-1234"
- Preferred Contact Method (required, radio buttons):
  - Email
  - Phone
  - Either
- Best Time to Contact (optional, dropdown):
  - Morning (8am-12pm)
  - Afternoon (12pm-5pm)
  - Anytime
- File Upload (optional):
  - Accept: .pdf, .doc, .docx, .jpg, .jpeg, .png, .dwg
  - Max size: 5MB
  - Label: "Attach plans, diagrams, or relevant documents"
  - Show file name and size after selection
  - Clear/remove file button

## Implementation Steps

### Phase 1: HTML Structure (30 minutes)

1. **Create Multi-Step Form Container in contact.html**

Replace or enhance the existing contact form section:

```html
<!-- Service Request Form Section -->
<section class="form-section">
  <div class="container">
    <div class="form-header">
      <h2>Request a Quote</h2>
      <p>Complete this form to tell us about your project. We'll respond within 24 hours.</p>
    </div>

    <!-- Progress Indicator -->
    <div class="progress-container" role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="3">
      <div class="progress-steps">
        <div class="progress-step active" data-step="1">
          <div class="step-circle">
            <span class="step-number">1</span>
            <svg class="step-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span class="step-label">Services</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step" data-step="2">
          <div class="step-circle">
            <span class="step-number">2</span>
            <svg class="step-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span class="step-label">Project Details</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step" data-step="3">
          <div class="step-circle">
            <span class="step-number">3</span>
            <svg class="step-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span class="step-label">Contact Info</span>
        </div>
      </div>
    </div>

    <!-- Multi-Step Form -->
    <form id="service-request-form" class="multi-step-form" novalidate>

      <!-- Step 1: Service Selection -->
      <div class="form-step active" data-step="1">
        <h3>What services do you need?</h3>
        <p class="step-description">Select all services that apply to your project</p>

        <div class="form-group">
          <fieldset>
            <legend class="sr-only">Select Services</legend>
            <div class="checkbox-grid">
              <label class="checkbox-card">
                <input type="checkbox" name="services" value="Horizontal Directional Drilling (HDD)">
                <span class="checkbox-content">
                  <span class="checkbox-title">Horizontal Directional Drilling (HDD)</span>
                  <span class="checkbox-desc">Trenchless drilling for utilities</span>
                </span>
              </label>

              <label class="checkbox-card">
                <input type="checkbox" name="services" value="Fiber Optic Cable Installation">
                <span class="checkbox-content">
                  <span class="checkbox-title">Fiber Optic Cable Installation</span>
                  <span class="checkbox-desc">High-speed network infrastructure</span>
                </span>
              </label>

              <label class="checkbox-card">
                <input type="checkbox" name="services" value="Underground Utilities Installation">
                <span class="checkbox-content">
                  <span class="checkbox-title">Underground Utilities Installation</span>
                  <span class="checkbox-desc">Water, power, and gas lines</span>
                </span>
              </label>

              <label class="checkbox-card">
                <input type="checkbox" name="services" value="Telecommunications Infrastructure">
                <span class="checkbox-content">
                  <span class="checkbox-title">Telecommunications Infrastructure</span>
                  <span class="checkbox-desc">Broadband and telecom systems</span>
                </span>
              </label>

              <label class="checkbox-card">
                <input type="checkbox" name="services" value="Power & Water Line Installation">
                <span class="checkbox-content">
                  <span class="checkbox-title">Power & Water Line Installation</span>
                  <span class="checkbox-desc">Electrical and water distribution</span>
                </span>
              </label>

              <label class="checkbox-card">
                <input type="checkbox" name="services" value="Communications Facilities Splicing">
                <span class="checkbox-content">
                  <span class="checkbox-title">Communications Facilities Splicing</span>
                  <span class="checkbox-desc">Fiber splicing and testing</span>
                </span>
              </label>

              <label class="checkbox-card">
                <input type="checkbox" name="services" value="Underground Geothermal Systems">
                <span class="checkbox-content">
                  <span class="checkbox-title">Underground Geothermal Systems</span>
                  <span class="checkbox-desc">Renewable heating/cooling</span>
                </span>
              </label>

              <label class="checkbox-card">
                <input type="checkbox" name="services" value="Road Crossings & Utility Conduit">
                <span class="checkbox-content">
                  <span class="checkbox-title">Road Crossings & Utility Conduit</span>
                  <span class="checkbox-desc">Infrastructure under roadways</span>
                </span>
              </label>

              <label class="checkbox-card">
                <input type="checkbox" name="services" value="Other" id="service-other">
                <span class="checkbox-content">
                  <span class="checkbox-title">Other</span>
                  <span class="checkbox-desc">Describe your needs</span>
                </span>
              </label>
            </div>

            <div class="conditional-field" id="other-service-field" style="display: none;">
              <label for="other-service-description">Please describe the service you need:</label>
              <input
                type="text"
                id="other-service-description"
                name="other_service_description"
                placeholder="e.g., Custom infrastructure solution"
                maxlength="200"
              >
            </div>

            <div class="error-message" id="services-error" role="alert"></div>
          </fieldset>
        </div>
      </div>

      <!-- Step 2: Project Details -->
      <div class="form-step" data-step="2">
        <h3>Tell us about your project</h3>
        <p class="step-description">Help us understand your project scope and timeline</p>

        <div class="form-group">
          <fieldset>
            <legend>Project Timeline <span class="required">*</span></legend>
            <div class="radio-group">
              <label class="radio-card">
                <input type="radio" name="timeline" value="Immediate (Within 30 days)" required>
                <span class="radio-content">
                  <span class="radio-title">Immediate</span>
                  <span class="radio-desc">Within 30 days</span>
                </span>
              </label>
              <label class="radio-card">
                <input type="radio" name="timeline" value="This Quarter (1-3 months)">
                <span class="radio-content">
                  <span class="radio-title">This Quarter</span>
                  <span class="radio-desc">1-3 months</span>
                </span>
              </label>
              <label class="radio-card">
                <input type="radio" name="timeline" value="This Year (3-12 months)">
                <span class="radio-content">
                  <span class="radio-title">This Year</span>
                  <span class="radio-desc">3-12 months</span>
                </span>
              </label>
              <label class="radio-card">
                <input type="radio" name="timeline" value="Planning Phase (12+ months)">
                <span class="radio-content">
                  <span class="radio-title">Planning Phase</span>
                  <span class="radio-desc">12+ months</span>
                </span>
              </label>
            </div>
            <div class="error-message" id="timeline-error" role="alert"></div>
          </fieldset>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="project-location">
              Project Location <span class="required">*</span>
              <span class="field-hint">City or County in Minnesota</span>
            </label>
            <input
              type="text"
              id="project-location"
              name="location"
              placeholder="e.g., Willmar, Kandiyobi County"
              required
              minlength="3"
              maxlength="100"
            >
            <div class="error-message" id="location-error" role="alert"></div>
          </div>

          <div class="form-group">
            <label for="project-scope">
              Project Scope <span class="required">*</span>
            </label>
            <select id="project-scope" name="scope" required>
              <option value="">Select budget range</option>
              <option value="Small (Under $50K)">Small (Under $50K)</option>
              <option value="Medium ($50K - $250K)">Medium ($50K - $250K)</option>
              <option value="Large ($250K - $1M)">Large ($250K - $1M)</option>
              <option value="Major Project ($1M+)">Major Project ($1M+)</option>
              <option value="Not Sure Yet">Not Sure Yet</option>
            </select>
            <div class="error-message" id="scope-error" role="alert"></div>
          </div>
        </div>

        <div class="form-group">
          <label for="linear-footage">
            Estimated Linear Footage
            <span class="field-hint">Optional - if known</span>
          </label>
          <input
            type="number"
            id="linear-footage"
            name="footage"
            placeholder="e.g., 5000"
            min="0"
            max="999999"
          >
          <div class="error-message" id="footage-error" role="alert"></div>
        </div>

        <div class="form-group">
          <label for="project-description">
            Project Description <span class="required">*</span>
            <span class="field-hint">Minimum 20 characters</span>
          </label>
          <textarea
            id="project-description"
            name="description"
            placeholder="Please describe your project needs, site conditions, and any specific requirements..."
            required
            minlength="20"
            maxlength="2000"
            rows="6"
          ></textarea>
          <div class="char-counter">
            <span id="char-count">0</span> / 2000 characters
          </div>
          <div class="error-message" id="description-error" role="alert"></div>
        </div>
      </div>

      <!-- Step 3: Contact Information -->
      <div class="form-step" data-step="3">
        <h3>How can we reach you?</h3>
        <p class="step-description">We'll use this information to send your quote</p>

        <div class="form-row">
          <div class="form-group">
            <label for="full-name">
              Full Name <span class="required">*</span>
            </label>
            <input
              type="text"
              id="full-name"
              name="name"
              placeholder="John Smith"
              required
              minlength="2"
              maxlength="100"
              pattern="[A-Za-z\s\-']+"
            >
            <div class="error-message" id="name-error" role="alert"></div>
          </div>

          <div class="form-group">
            <label for="company-name">
              Company Name
              <span class="field-hint">Optional</span>
            </label>
            <input
              type="text"
              id="company-name"
              name="company"
              placeholder="Your Company Name"
              maxlength="100"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="email">
              Email Address <span class="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@company.com"
              required
            >
            <div class="error-message" id="email-error" role="alert"></div>
          </div>

          <div class="form-group">
            <label for="phone">
              Phone Number <span class="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="(320) 555-1234"
              required
            >
            <div class="error-message" id="phone-error" role="alert"></div>
          </div>
        </div>

        <div class="form-group">
          <fieldset>
            <legend>Preferred Contact Method <span class="required">*</span></legend>
            <div class="radio-group-inline">
              <label class="radio-inline">
                <input type="radio" name="contact_method" value="Email" required>
                <span>Email</span>
              </label>
              <label class="radio-inline">
                <input type="radio" name="contact_method" value="Phone">
                <span>Phone</span>
              </label>
              <label class="radio-inline">
                <input type="radio" name="contact_method" value="Either">
                <span>Either</span>
              </label>
            </div>
            <div class="error-message" id="contact-method-error" role="alert"></div>
          </fieldset>
        </div>

        <div class="form-group">
          <label for="best-time">
            Best Time to Contact
            <span class="field-hint">Optional</span>
          </label>
          <select id="best-time" name="best_time">
            <option value="">Anytime</option>
            <option value="Morning (8am-12pm)">Morning (8am-12pm)</option>
            <option value="Afternoon (12pm-5pm)">Afternoon (12pm-5pm)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="file-upload">
            Attach Documents
            <span class="field-hint">Plans, diagrams, or relevant files (Max 5MB)</span>
          </label>
          <div class="file-upload-wrapper">
            <input
              type="file"
              id="file-upload"
              name="attachment"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
              class="file-input"
            >
            <label for="file-upload" class="file-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span class="file-label-text">Choose File</span>
            </label>
            <div class="file-info" id="file-info"></div>
            <button type="button" class="file-clear" id="file-clear" style="display: none;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="error-message" id="file-error" role="alert"></div>
        </div>
      </div>

      <!-- Form Navigation -->
      <div class="form-navigation">
        <button
          type="button"
          class="btn btn-secondary"
          id="prev-btn"
          style="display: none;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Previous
        </button>

        <button
          type="button"
          class="btn btn-primary"
          id="next-btn"
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button
          type="submit"
          class="btn btn-primary"
          id="submit-btn"
          style="display: none;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Submit Request
        </button>
      </div>

      <!-- Form Messages -->
      <div class="form-message" id="form-success" style="display: none;" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <div>
          <strong>Request Submitted Successfully!</strong>
          <p>Thank you for your service request. We'll review your information and contact you within 24 hours.</p>
        </div>
      </div>

      <div class="form-message error" id="form-error" style="display: none;" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div>
          <strong>Submission Failed</strong>
          <p id="error-message-text">Please check your information and try again.</p>
        </div>
      </div>
    </form>
  </div>
</section>
```

2. **Add Form Script Reference Before Closing </body> Tag**

```html
<script src="js/form-handler.js"></script>
```

### Phase 2: CSS Styling (45 minutes)

Add to css/styles.css:

```css
/* ==========================================================================
   SERVICE REQUEST FORM - Multi-Step Form Styles
   ========================================================================== */

.form-section {
  padding: var(--space-2xl) 0;
  background-color: var(--neutral-lightest);
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.form-header h2 {
  font-size: var(--font-size-3xl);
  color: var(--primary-blue);
  margin-bottom: var(--space-sm);
}

.form-header p {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}

/* Progress Indicator
   ========================================================================== */

.progress-container {
  margin-bottom: var(--space-2xl);
  padding: var(--space-lg);
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  z-index: 2;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--neutral-light);
  border: 3px solid var(--neutral-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-secondary);
  transition: all var(--transition-base);
  position: relative;
}

.step-number {
  display: block;
}

.step-check {
  display: none;
  width: 24px;
  height: 24px;
  color: var(--white);
}

.step-label {
  margin-top: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
  text-align: center;
}

/* Progress line between steps */
.progress-line {
  flex: 1;
  height: 3px;
  background-color: var(--neutral-medium);
  position: relative;
  top: -25px;
  margin: 0 -10px;
  z-index: 1;
  transition: background-color var(--transition-base);
}

/* Active state */
.progress-step.active .step-circle {
  background-color: var(--secondary-orange);
  border-color: var(--secondary-orange);
  color: var(--white);
}

.progress-step.active .step-label {
  color: var(--primary-blue);
  font-weight: 600;
}

/* Completed state */
.progress-step.completed .step-circle {
  background-color: var(--primary-blue);
  border-color: var(--primary-blue);
}

.progress-step.completed .step-number {
  display: none;
}

.progress-step.completed .step-check {
  display: block;
}

.progress-step.completed ~ .progress-line {
  background-color: var(--primary-blue);
}

/* Form Container
   ========================================================================== */

.multi-step-form {
  background-color: var(--white);
  padding: var(--space-2xl);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.form-step {
  display: none;
  animation: fadeIn 0.3s ease-in;
}

.form-step.active {
  display: block;
}

.form-step h3 {
  font-size: var(--font-size-2xl);
  color: var(--primary-blue);
  margin-bottom: var(--space-sm);
}

.step-description {
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  font-size: var(--font-size-base);
}

/* Form Groups and Fields
   ========================================================================== */

.form-group {
  margin-bottom: var(--space-xl);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-base);
}

.form-group legend {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  font-size: var(--font-size-lg);
}

.required {
  color: var(--secondary-orange);
  margin-left: 2px;
}

.field-hint {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 400;
  margin-top: 2px;
}

/* Input Fields */
.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--neutral-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: all var(--transition-fast);
  background-color: var(--white);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--secondary-orange);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #dc2626;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

/* Character Counter */
.char-counter {
  text-align: right;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--space-xs);
}

.char-counter.warning {
  color: var(--secondary-orange);
}

.char-counter.max {
  color: #dc2626;
  font-weight: 600;
}

/* Checkbox Cards
   ========================================================================== */

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-md);
}

.checkbox-card {
  position: relative;
  display: block;
  cursor: pointer;
}

.checkbox-card input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-content {
  display: block;
  padding: var(--space-lg);
  border: 2px solid var(--neutral-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  background-color: var(--white);
}

.checkbox-card:hover .checkbox-content {
  border-color: var(--secondary-orange);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1);
}

.checkbox-card input:checked ~ .checkbox-content {
  border-color: var(--secondary-orange);
  background-color: rgba(255, 107, 53, 0.05);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.checkbox-card input:focus ~ .checkbox-content {
  outline: 2px solid var(--secondary-orange);
  outline-offset: 2px;
}

.checkbox-title {
  display: block;
  font-weight: 600;
  color: var(--primary-blue);
  margin-bottom: var(--space-xs);
}

.checkbox-desc {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.conditional-field {
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  background-color: var(--neutral-lightest);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--secondary-orange);
}

/* Radio Cards
   ========================================================================== */

.radio-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
}

.radio-card {
  position: relative;
  display: block;
  cursor: pointer;
}

.radio-card input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-content {
  display: block;
  padding: var(--space-lg);
  border: 2px solid var(--neutral-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  background-color: var(--white);
  text-align: center;
}

.radio-card:hover .radio-content {
  border-color: var(--secondary-orange);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1);
}

.radio-card input:checked ~ .radio-content {
  border-color: var(--secondary-orange);
  background-color: rgba(255, 107, 53, 0.05);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.radio-card input:focus ~ .radio-content {
  outline: 2px solid var(--secondary-orange);
  outline-offset: 2px;
}

.radio-title {
  display: block;
  font-weight: 600;
  color: var(--primary-blue);
  margin-bottom: var(--space-xs);
}

.radio-desc {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* Inline Radio Buttons */
.radio-group-inline {
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.radio-inline {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-inline input[type="radio"] {
  width: 20px;
  height: 20px;
  margin-right: var(--space-sm);
  cursor: pointer;
  accent-color: var(--secondary-orange);
}

.radio-inline span {
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

/* File Upload
   ========================================================================== */

.file-upload-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background-color: var(--neutral-light);
  border: 2px solid var(--neutral-medium);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  color: var(--primary-blue);
  transition: all var(--transition-fast);
}

.file-label:hover {
  background-color: var(--neutral-medium);
  border-color: var(--secondary-orange);
}

.file-label:focus-within {
  outline: 2px solid var(--secondary-orange);
  outline-offset: 2px;
}

.file-info {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.file-info.has-file {
  color: var(--primary-blue);
  font-weight: 500;
}

.file-clear {
  padding: var(--space-sm);
  background: none;
  border: none;
  cursor: pointer;
  color: #dc2626;
  transition: all var(--transition-fast);
}

.file-clear:hover {
  background-color: rgba(220, 38, 38, 0.1);
  border-radius: var(--radius-sm);
}

/* Error Messages
   ========================================================================== */

.error-message {
  display: none;
  color: #dc2626;
  font-size: var(--font-size-sm);
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  background-color: rgba(220, 38, 38, 0.05);
  border-left: 3px solid #dc2626;
  border-radius: var(--radius-sm);
}

.error-message.visible {
  display: block;
}

/* Form Navigation
   ========================================================================== */

.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 2px solid var(--neutral-light);
}

.form-navigation .btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
  font-family: inherit;
}

.form-navigation .btn-primary {
  background-color: var(--secondary-orange);
  color: var(--white);
  margin-left: auto;
}

.form-navigation .btn-primary:hover {
  background-color: #e85d2a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.form-navigation .btn-secondary {
  background-color: var(--neutral-light);
  color: var(--primary-blue);
  border: 2px solid var(--neutral-medium);
}

.form-navigation .btn-secondary:hover {
  background-color: var(--neutral-medium);
  border-color: var(--primary-blue);
}

.form-navigation .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-navigation .btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Loading State */
.btn.loading {
  position: relative;
  pointer-events: none;
}

.btn.loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Form Messages
   ========================================================================== */

.form-message {
  display: none;
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  margin-top: var(--space-xl);
  gap: var(--space-md);
  align-items: flex-start;
}

.form-message.visible {
  display: flex;
}

.form-message svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.form-message strong {
  display: block;
  margin-bottom: var(--space-xs);
  font-size: var(--font-size-lg);
}

.form-message p {
  margin: 0;
  color: inherit;
}

.form-message:not(.error) {
  background-color: rgba(34, 197, 94, 0.1);
  border: 2px solid #22c55e;
  color: #15803d;
}

.form-message:not(.error) svg {
  color: #22c55e;
}

.form-message.error {
  background-color: rgba(220, 38, 38, 0.1);
  border: 2px solid #dc2626;
  color: #991b1b;
}

.form-message.error svg {
  color: #dc2626;
}

/* Animations
   ========================================================================== */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Screen Reader Only
   ========================================================================== */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Responsive Adjustments
   ========================================================================== */

@media (max-width: 768px) {
  .multi-step-form {
    padding: var(--space-lg);
  }

  .form-step h3 {
    font-size: var(--font-size-xl);
  }

  .checkbox-grid {
    grid-template-columns: 1fr;
  }

  .radio-group {
    grid-template-columns: 1fr;
  }

  .progress-steps {
    padding: 0 var(--space-sm);
  }

  .step-label {
    font-size: var(--font-size-xs);
  }

  .step-circle {
    width: 40px;
    height: 40px;
    font-size: var(--font-size-base);
  }

  .progress-line {
    top: -20px;
  }

  .form-navigation {
    flex-direction: column;
    gap: var(--space-md);
  }

  .form-navigation .btn {
    width: 100%;
    justify-content: center;
  }

  .form-navigation .btn-primary {
    margin-left: 0;
    order: -1;
  }
}

@media (max-width: 480px) {
  .step-label {
    display: none;
  }

  .progress-container {
    padding: var(--space-md);
  }

  .file-upload-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .file-label {
    justify-content: center;
  }
}

/* Dark Mode Support (if implemented)
   ========================================================================== */

[data-theme="dark"] .form-section {
  background-color: var(--bg-primary);
}

[data-theme="dark"] .multi-step-form,
[data-theme="dark"] .progress-container {
  background-color: var(--bg-secondary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .form-group input,
[data-theme="dark"] .form-group select,
[data-theme="dark"] .form-group textarea {
  background-color: var(--bg-primary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

[data-theme="dark"] .checkbox-content,
[data-theme="dark"] .radio-content {
  background-color: var(--bg-primary);
  border-color: var(--border-color);
}

[data-theme="dark"] .file-label {
  background-color: var(--bg-primary);
  border-color: var(--border-color);
}
```

### Phase 3: JavaScript Implementation (90 minutes)

Create new file js/form-handler.js:

```javascript
/**
 * SERVICE REQUEST FORM HANDLER
 * Multi-step form with validation, progress tracking, and Formspree integration
 */

class ServiceRequestForm {
  constructor(formId) {
    // Form elements
    this.form = document.getElementById(formId);
    if (!this.form) return;

    this.steps = Array.from(this.form.querySelectorAll('.form-step'));
    this.progressSteps = Array.from(document.querySelectorAll('.progress-step'));
    this.progressBar = document.querySelector('.progress-container');

    // Navigation buttons
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.submitBtn = document.getElementById('submit-btn');

    // Message containers
    this.successMessage = document.getElementById('form-success');
    this.errorMessage = document.getElementById('form-error');
    this.errorMessageText = document.getElementById('error-message-text');

    // Form state
    this.currentStep = 1;
    this.totalSteps = this.steps.length;
    this.formData = {};

    // Formspree endpoint (replace with your actual Formspree form ID)
    this.formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';

    // Initialize
    this.init();
  }

  init() {
    // Load saved progress from sessionStorage
    this.loadProgress();

    // Set up event listeners
    this.setupEventListeners();

    // Initialize special fields
    this.initializeCharacterCounter();
    this.initializePhoneFormatting();
    this.initializeFileUpload();
    this.initializeOtherServiceField();

    // Show first step
    this.showStep(this.currentStep);
  }

  setupEventListeners() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.previousStep());
    this.nextBtn.addEventListener('click', () => this.nextStep());
    this.submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.submitForm();
    });

    // Save progress on input change
    this.form.addEventListener('input', () => this.saveProgress());
    this.form.addEventListener('change', () => this.saveProgress());

    // Prevent default form submission
    this.form.addEventListener('submit', (e) => e.preventDefault());
  }

  // ==========================================================================
  // STEP NAVIGATION
  // ==========================================================================

  showStep(stepNumber) {
    // Hide all steps
    this.steps.forEach(step => step.classList.remove('active'));

    // Show current step
    const currentStepElement = this.steps[stepNumber - 1];
    if (currentStepElement) {
      currentStepElement.classList.add('active');
    }

    // Update progress indicator
    this.updateProgressIndicator(stepNumber);

    // Update navigation buttons
    this.updateNavigationButtons(stepNumber);

    // Update progress bar aria attributes
    this.progressBar.setAttribute('aria-valuenow', stepNumber);

    // Announce step change for screen readers
    this.announceStepChange(stepNumber);

    // Scroll to top of form
    this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  updateProgressIndicator(stepNumber) {
    this.progressSteps.forEach((step, index) => {
      const stepNum = index + 1;

      if (stepNum < stepNumber) {
        // Completed step
        step.classList.remove('active');
        step.classList.add('completed');
      } else if (stepNum === stepNumber) {
        // Current step
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        // Future step
        step.classList.remove('active', 'completed');
      }
    });
  }

  updateNavigationButtons(stepNumber) {
    // Previous button
    if (stepNumber === 1) {
      this.prevBtn.style.display = 'none';
    } else {
      this.prevBtn.style.display = 'inline-flex';
    }

    // Next/Submit buttons
    if (stepNumber === this.totalSteps) {
      this.nextBtn.style.display = 'none';
      this.submitBtn.style.display = 'inline-flex';
    } else {
      this.nextBtn.style.display = 'inline-flex';
      this.submitBtn.style.display = 'none';
    }
  }

  announceStepChange(stepNumber) {
    const stepNames = ['Service Selection', 'Project Details', 'Contact Information'];
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Step ${stepNumber} of ${this.totalSteps}: ${stepNames[stepNumber - 1]}`;

    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }

  nextStep() {
    // Validate current step
    if (this.validateStep(this.currentStep)) {
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  validateStep(stepNumber) {
    const stepElement = this.steps[stepNumber - 1];
    const fields = stepElement.querySelectorAll('input, select, textarea');
    let isValid = true;

    // Clear previous errors
    stepElement.querySelectorAll('.error-message').forEach(error => {
      error.classList.remove('visible');
    });

    stepElement.querySelectorAll('input, select, textarea').forEach(field => {
      field.classList.remove('error');
    });

    // Validate each field
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Step-specific validation
    if (stepNumber === 1) {
      isValid = this.validateServicesStep() && isValid;
    }

    return isValid;
  }

  validateField(field) {
    // Skip validation for optional fields that are empty
    if (!field.required && !field.value.trim()) {
      return true;
    }

    const fieldName = field.name;
    const fieldValue = field.value.trim();
    let errorMessage = '';

    // Required field check
    if (field.required && !fieldValue) {
      errorMessage = 'This field is required';
    }

    // Type-specific validation
    else if (field.type === 'email' && fieldValue) {
      if (!this.isValidEmail(fieldValue)) {
        errorMessage = 'Please enter a valid email address';
      }
    }

    else if (field.type === 'tel' && fieldValue) {
      if (!this.isValidPhone(fieldValue)) {
        errorMessage = 'Please enter a valid phone number: (XXX) XXX-XXXX';
      }
    }

    else if (field.type === 'number' && fieldValue) {
      const min = field.getAttribute('min');
      const max = field.getAttribute('max');
      if (min && parseFloat(fieldValue) < parseFloat(min)) {
        errorMessage = `Value must be at least ${min}`;
      }
      if (max && parseFloat(fieldValue) > parseFloat(max)) {
        errorMessage = `Value must not exceed ${max}`;
      }
    }

    // Length validation
    else if (field.minLength && fieldValue.length < field.minLength) {
      errorMessage = `Please enter at least ${field.minLength} characters`;
    }

    else if (field.maxLength && fieldValue.length > field.maxLength) {
      errorMessage = `Please enter no more than ${field.maxLength} characters`;
    }

    // Pattern validation
    else if (field.pattern && fieldValue) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(fieldValue)) {
        errorMessage = 'Please enter a valid value';
      }
    }

    // Show error if validation failed
    if (errorMessage) {
      this.showFieldError(field, errorMessage);
      return false;
    }

    return true;
  }

  validateServicesStep() {
    const checkboxes = this.form.querySelectorAll('input[name="services"]');
    const checked = Array.from(checkboxes).some(cb => cb.checked);

    if (!checked) {
      this.showError('services-error', 'Please select at least one service');
      return false;
    }

    return true;
  }

  showFieldError(field, message) {
    field.classList.add('error');

    const errorId = field.id + '-error' || field.name + '-error';
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('visible');
    }

    // Announce error for screen readers
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
  }

  showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('visible');
    }
  }

  // ==========================================================================
  // FIELD VALIDATORS
  // ==========================================================================

  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  isValidPhone(phone) {
    // Accept various formats: (320) 555-1234, 320-555-1234, 3205551234
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  }

  // ==========================================================================
  // SPECIAL FIELD HANDLERS
  // ==========================================================================

  initializeCharacterCounter() {
    const textarea = document.getElementById('project-description');
    const counter = document.getElementById('char-count');

    if (!textarea || !counter) return;

    textarea.addEventListener('input', () => {
      const length = textarea.value.length;
      const maxLength = textarea.maxLength;

      counter.textContent = length;

      const counterContainer = counter.parentElement;
      if (length >= maxLength) {
        counterContainer.classList.add('max');
        counterContainer.classList.remove('warning');
      } else if (length >= maxLength * 0.9) {
        counterContainer.classList.add('warning');
        counterContainer.classList.remove('max');
      } else {
        counterContainer.classList.remove('warning', 'max');
      }
    });
  }

  initializePhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 10) {
        value = value.slice(0, 10);
      }

      if (value.length >= 6) {
        e.target.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length >= 3) {
        e.target.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else if (value.length > 0) {
        e.target.value = value;
      }
    });
  }

  initializeFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const fileInfo = document.getElementById('file-info');
    const fileClear = document.getElementById('file-clear');
    const fileLabel = document.querySelector('.file-label-text');

    if (!fileInput || !fileInfo || !fileClear) return;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file) {
        // Check file size
        if (file.size > maxSize) {
          this.showError('file-error', 'File size must not exceed 5MB');
          fileInput.value = '';
          return;
        }

        // Show file info
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        fileInfo.textContent = `${file.name} (${sizeInMB} MB)`;
        fileInfo.classList.add('has-file');
        fileClear.style.display = 'block';
        fileLabel.textContent = 'Change File';

        // Clear any previous errors
        const errorElement = document.getElementById('file-error');
        if (errorElement) {
          errorElement.classList.remove('visible');
        }
      }
    });

    fileClear.addEventListener('click', () => {
      fileInput.value = '';
      fileInfo.textContent = '';
      fileInfo.classList.remove('has-file');
      fileClear.style.display = 'none';
      fileLabel.textContent = 'Choose File';
    });
  }

  initializeOtherServiceField() {
    const otherCheckbox = document.getElementById('service-other');
    const otherField = document.getElementById('other-service-field');

    if (!otherCheckbox || !otherField) return;

    otherCheckbox.addEventListener('change', () => {
      if (otherCheckbox.checked) {
        otherField.style.display = 'block';
        document.getElementById('other-service-description').required = true;
      } else {
        otherField.style.display = 'none';
        document.getElementById('other-service-description').required = false;
        document.getElementById('other-service-description').value = '';
      }
    });
  }

  // ==========================================================================
  // PROGRESS PERSISTENCE
  // ==========================================================================

  saveProgress() {
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values (checkboxes)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    sessionStorage.setItem('serviceRequestFormData', JSON.stringify(data));
    sessionStorage.setItem('serviceRequestFormStep', this.currentStep);
  }

  loadProgress() {
    const savedData = sessionStorage.getItem('serviceRequestFormData');
    const savedStep = sessionStorage.getItem('serviceRequestFormStep');

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        // Restore form values
        Object.keys(data).forEach(key => {
          const fields = this.form.querySelectorAll(`[name="${key}"]`);

          fields.forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
              if (Array.isArray(data[key])) {
                field.checked = data[key].includes(field.value);
              } else {
                field.checked = field.value === data[key];
              }
            } else {
              field.value = data[key];
            }
          });
        });

        // Restore step
        if (savedStep) {
          this.currentStep = parseInt(savedStep, 10);
        }
      } catch (e) {
        console.error('Error loading saved form data:', e);
      }
    }
  }

  clearProgress() {
    sessionStorage.removeItem('serviceRequestFormData');
    sessionStorage.removeItem('serviceRequestFormStep');
  }

  // ==========================================================================
  // FORM SUBMISSION
  // ==========================================================================

  async submitForm() {
    // Validate final step
    if (!this.validateStep(this.currentStep)) {
      return;
    }

    // Show loading state
    this.submitBtn.classList.add('loading');
    this.submitBtn.disabled = true;

    try {
      // Prepare form data
      const formData = new FormData(this.form);

      // Add selected services as a formatted list
      const services = Array.from(this.form.querySelectorAll('input[name="services"]:checked'))
        .map(cb => cb.value);
      formData.delete('services');
      formData.append('services', services.join(', '));

      // Submit to Formspree
      const response = await fetch(this.formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.handleSuccess();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      // Remove loading state
      this.submitBtn.classList.remove('loading');
      this.submitBtn.disabled = false;
    }
  }

  handleSuccess() {
    // Hide form
    this.form.style.display = 'none';

    // Show success message
    this.successMessage.classList.add('visible');
    this.successMessage.scrollIntoView({ behavior: 'smooth' });

    // Clear saved progress
    this.clearProgress();

    // Reset form after delay
    setTimeout(() => {
      this.form.reset();
      this.currentStep = 1;
    }, 1000);
  }

  handleError(error) {
    console.error('Form submission error:', error);

    // Show error message
    this.errorMessage.classList.add('visible');
    this.errorMessageText.textContent = 'There was an error submitting your request. Please try again or contact us directly at (320) 382-6636.';
    this.errorMessage.scrollIntoView({ behavior: 'smooth' });

    // Hide error after 10 seconds
    setTimeout(() => {
      this.errorMessage.classList.remove('visible');
    }, 10000);
  }
}

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  new ServiceRequestForm('service-request-form');
});
```

### Phase 4: Formspree Integration (15 minutes)

1. **Sign up for Formspree**
   - Go to https://formspree.io
   - Create free account (up to 50 submissions/month)
   - Create new form
   - Get your form ID

2. **Update Form Endpoint**

In js/form-handler.js, replace the placeholder:

```javascript
// Replace this line:
this.formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';

// With your actual Formspree endpoint:
this.formspreeEndpoint = 'https://formspree.io/f/xpwzabcd';
```

3. **Configure Formspree Settings**
   - Set notification email (where quotes should go)
   - Enable reCAPTCHA (spam protection)
   - Customize confirmation email (optional)
   - Add webhook for CRM integration (optional)

4. **Test Submission**
   - Submit test form
   - Verify email notification received
   - Check that all fields are captured correctly
   - Verify file attachment works

## Testing Checklist

### Functionality Testing

- [ ] **Step Navigation**
  - [ ] Can navigate forward through all steps
  - [ ] Can navigate backward to previous steps
  - [ ] Next button disabled on invalid step
  - [ ] Submit button only shows on final step
  - [ ] Progress indicator updates correctly

- [ ] **Step 1: Service Selection**
  - [ ] Can select multiple services
  - [ ] "Other" checkbox shows text input
  - [ ] Error shows if no service selected
  - [ ] Cannot proceed without selection

- [ ] **Step 2: Project Details**
  - [ ] All required fields validated
  - [ ] Timeline radio buttons work
  - [ ] Project scope dropdown works
  - [ ] Linear footage accepts numbers only
  - [ ] Character counter updates in real-time
  - [ ] Cannot exceed 2000 character limit
  - [ ] Cannot proceed with invalid data

- [ ] **Step 3: Contact Information**
  - [ ] Phone number auto-formats: (XXX) XXX-XXXX
  - [ ] Email validation works
  - [ ] Name accepts letters/spaces/hyphens only
  - [ ] File upload accepts specified formats only
  - [ ] File upload rejects files over 5MB
  - [ ] File name and size display after selection
  - [ ] Clear file button works
  - [ ] Cannot proceed with invalid data

- [ ] **Form Submission**
  - [ ] Form submits to Formspree successfully
  - [ ] Loading indicator shows during submission
  - [ ] Success message displays on completion
  - [ ] Error message shows on failure
  - [ ] Email notification received
  - [ ] All form data captured correctly
  - [ ] File attachment included (if uploaded)

- [ ] **Progress Persistence**
  - [ ] Form data saved to sessionStorage on input
  - [ ] Form data restored on page refresh
  - [ ] Current step restored on page refresh
  - [ ] Progress cleared after successful submission

### Visual Testing

- [ ] **Desktop (1920px)**
  - [ ] Progress indicator displays correctly
  - [ ] Form fields properly aligned
  - [ ] Checkbox/radio cards in grid layout
  - [ ] Buttons properly positioned
  - [ ] All text readable

- [ ] **Tablet (768px)**
  - [ ] Two-column layout maintained where appropriate
  - [ ] Progress steps legible
  - [ ] Form fields stack properly
  - [ ] Touch targets adequate size

- [ ] **Mobile (375px)**
  - [ ] Single column layout
  - [ ] Progress numbers visible (labels may hide)
  - [ ] Form fields full width
  - [ ] Buttons stack vertically
  - [ ] File upload button accessible

- [ ] **Interactions**
  - [ ] Hover states on cards/buttons
  - [ ] Focus indicators visible
  - [ ] Smooth transitions between steps
  - [ ] Error messages clearly visible
  - [ ] Success/error message animations

### Accessibility Testing

- [ ] **Keyboard Navigation**
  - [ ] Can Tab through all form fields
  - [ ] Can navigate with arrow keys in radio groups
  - [ ] Enter/Space activates checkboxes/radios
  - [ ] Enter submits form on final step
  - [ ] Focus indicators always visible

- [ ] **Screen Reader Testing**
  - [ ] Step changes announced
  - [ ] Error messages announced
  - [ ] Success message announced
  - [ ] Form labels properly associated
  - [ ] Required fields indicated
  - [ ] Field hints read correctly

- [ ] **ARIA Attributes**
  - [ ] Progress bar has proper role/aria attributes
  - [ ] Error messages have role="alert"
  - [ ] Invalid fields have aria-invalid="true"
  - [ ] Fields with errors have aria-describedby

- [ ] **Color Contrast**
  - [ ] All text meets WCAG AA (4.5:1)
  - [ ] Error messages readable
  - [ ] Buttons have sufficient contrast
  - [ ] Placeholder text meets 4.5:1 or better

### Performance Testing

- [ ] **Load Time**
  - [ ] Form renders in < 1 second
  - [ ] No layout shift on load
  - [ ] JavaScript loads and executes quickly

- [ ] **Runtime Performance**
  - [ ] No lag when typing
  - [ ] Smooth animations
  - [ ] File upload responsive
  - [ ] Form submission < 3 seconds

- [ ] **Browser Testing**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)
  - [ ] Mobile Safari (iOS)
  - [ ] Chrome Mobile (Android)

### Validation Testing

- [ ] **Email Field**
  - [ ] Rejects invalid formats
  - [ ] Accepts valid formats
  - [ ] Shows clear error message

- [ ] **Phone Field**
  - [ ] Auto-formats as (XXX) XXX-XXXX
  - [ ] Accepts 10-digit numbers
  - [ ] Rejects non-numeric input
  - [ ] Shows clear error message

- [ ] **Required Fields**
  - [ ] All required fields enforced
  - [ ] Cannot skip required fields
  - [ ] Clear indication of required fields

- [ ] **Length Validation**
  - [ ] Minimum lengths enforced
  - [ ] Maximum lengths enforced
  - [ ] Character counter accurate

- [ ] **File Upload**
  - [ ] Rejects invalid file types
  - [ ] Rejects files over 5MB
  - [ ] Shows file size in MB
  - [ ] Shows clear error for invalid files

## Documentation Requirements

### 1. Update README.md

Add to the Features section:

```markdown
### Service Request Form
- Professional 3-step multi-step form for quote requests
- Service selection, project details, and contact information
- Real-time validation with helpful error messages
- File upload for plans and diagrams (up to 5MB)
- Progress saved to sessionStorage (survives page refresh)
- Formspree integration for email delivery
- Fully accessible (WCAG 2.1 AA compliant)
- Mobile responsive with touch-friendly controls
```

### 2. Update docs/ARCHITECTURE.md

Add new section:

```markdown
## Service Request Form

**Technology:** Vanilla JavaScript + Formspree

**Files:**
- contact.html - Multi-step form HTML structure
- css/styles.css - Form styling and animations
- js/form-handler.js - Form logic, validation, and submission
- Formspree - Form submission service (https://formspree.io)

**Key Components:**

1. **ServiceRequestForm Class**
   - Manages form state and navigation
   - Handles validation and error display
   - Persists progress to sessionStorage
   - Submits data to Formspree

2. **Multi-Step Navigation**
   - 3 steps: Services → Project Details → Contact Info
   - Progress indicator with visual feedback
   - Previous/Next/Submit buttons
   - Prevents advancing on invalid step

3. **Validation System**
   - Real-time field validation
   - Step-level validation
   - Custom validators for email, phone, file size
   - Accessible error messages

4. **Special Features**
   - Phone number auto-formatting
   - Character counter for textarea
   - File upload with size/type validation
   - Conditional "Other" service field
   - Progress persistence across page refreshes

**Form Flow:**
1. User selects services (at least one required)
2. User provides project details (timeline, location, scope, description)
3. User enters contact information and optionally uploads files
4. Form validates all fields before submission
5. Data sent to Formspree endpoint
6. Success/error message displayed
7. Email notification sent to business

**Formspree Configuration:**
- Endpoint: `https://formspree.io/f/YOUR_FORM_ID`
- Free tier: 50 submissions/month
- Features used: Email notifications, file uploads, spam protection
- Notification email: info@midwestundergroundmn.com

**sessionStorage Keys:**
- `serviceRequestFormData` - JSON object with all form values
- `serviceRequestFormStep` - Current step number (1-3)

**Future Enhancements:**
- Save to CRM via webhook
- SMS notifications for urgent requests
- Real-time availability checking
- Automatic quote estimation
- Multi-language support
```

### 3. Update docs/MAINTENANCE.md

Add new section:

```markdown
## Service Request Form Maintenance

### Modifying Form Fields

**To add a new field:**

1. Add HTML in appropriate step in contact.html
2. Add validation logic in js/form-handler.js `validateField()`
3. Test thoroughly including error states

**To modify Formspree endpoint:**

1. Open js/form-handler.js
2. Find `this.formspreeEndpoint` in constructor
3. Replace with new Formspree form ID
4. Test submission

**To change service options:**

1. Open contact.html
2. Find Step 1 `.checkbox-grid`
3. Add/remove/modify `.checkbox-card` elements
4. Keep same structure for styling

### Troubleshooting

**Problem:** Form not submitting
**Solutions:**
- Check Formspree endpoint is correct
- Verify internet connection
- Check browser console for errors
- Ensure all required fields completed

**Problem:** Validation not working
**Solutions:**
- Check field `name` attributes match validation logic
- Verify `required` attribute on required fields
- Check `pattern`, `minlength`, `maxlength` attributes
- Test in different browsers

**Problem:** File upload failing
**Solutions:**
- Verify file under 5MB
- Check file type is in accepted list
- Ensure Formspree account allows file uploads
- Test with different file formats

**Problem:** Progress not saving
**Solutions:**
- Check sessionStorage is enabled in browser
- Verify no private browsing mode
- Check browser console for errors
- Clear sessionStorage and try again

**Problem:** Mobile layout broken
**Solutions:**
- Test responsive breakpoints in DevTools
- Verify viewport meta tag in HTML
- Check media queries in CSS
- Test on actual mobile devices

### Form Analytics

To track form performance:

1. **Submission Rate**
   - Check Formspree dashboard
   - Monitor submissions per month
   - Identify drop-off steps (if integrated with analytics)

2. **Common Errors**
   - Review user feedback
   - Check which validations fail most
   - Improve error messages as needed

3. **File Upload Usage**
   - Track percentage of submissions with files
   - Monitor file types uploaded
   - Adjust accepted types if needed

### Spam Prevention

Current measures:
- Formspree's built-in spam protection
- reCAPTCHA integration (if enabled)
- Field validation reduces bot submissions

To improve spam protection:
1. Enable reCAPTCHA in Formspree settings
2. Add honeypot field (hidden field bots will fill)
3. Implement rate limiting (Formspree handles this)
```

### 4. Update docs/PLACEHOLDERS.md

Add entry:

```markdown
## Service Request Form

### Formspree Integration
- **Location:** js/form-handler.js, line ~50
- **Current Value:** `https://formspree.io/f/YOUR_FORM_ID`
- **Action Required:** Replace with actual Formspree form ID after account setup
- **Instructions:** Sign up at formspree.io, create form, copy form ID

### Notification Email
- **Location:** Formspree settings dashboard
- **Current Value:** info@midwestundergroundmn.com (placeholder)
- **Action Required:** Update to actual business email
- **Instructions:** Log into Formspree, go to form settings, update notification email
```

## Quality Gates

Before marking this feature complete, ensure:

- ✅ All 3 steps navigate correctly with smooth animations
- ✅ Progress indicator updates accurately
- ✅ All required fields enforced with clear validation
- ✅ Email validation accepts valid formats only
- ✅ Phone formatting works: (XXX) XXX-XXXX
- ✅ File upload accepts specified formats, rejects >5MB
- ✅ Character counter accurate for project description
- ✅ "Other" service field shows/hides conditionally
- ✅ Cannot advance to next step with invalid data
- ✅ Progress saves to sessionStorage
- ✅ Progress restores on page refresh
- ✅ Form submits successfully to Formspree
- ✅ Success message displays after submission
- ✅ Error message displays on submission failure
- ✅ Email notification received at correct address
- ✅ All form data captured in email including file
- ✅ Form resets after successful submission
- ✅ sessionStorage cleared after submission
- ✅ Mobile responsive (375px to 1920px+)
- ✅ Keyboard accessible (Tab, Enter, Space)
- ✅ Screen reader announces steps and errors
- ✅ Focus indicators visible on all interactive elements
- ✅ All text meets WCAG AA contrast (4.5:1)
- ✅ Error messages have role="alert"
- ✅ Invalid fields have aria-invalid="true"
- ✅ Works in Chrome, Firefox, Safari, Edge
- ✅ No console errors
- ✅ No layout shift on load
- ✅ Smooth performance, no lag
- ✅ All documentation updated (README, ARCHITECTURE, MAINTENANCE, PLACEHOLDERS)

## Troubleshooting

### Issue: Form not visible on page

**Symptoms:** Contact page loads but form doesn't appear

**Solutions:**
1. Check that HTML was added to correct location in contact.html
2. Verify CSS file is linked correctly in `<head>`
3. Check browser console for JavaScript errors
4. Ensure js/form-handler.js is linked before closing `</body>` tag
5. Verify form ID matches: `id="service-request-form"`

### Issue: Validation not working

**Symptoms:** Can advance to next step with empty required fields

**Solutions:**
1. Verify all required fields have `required` attribute
2. Check that field `name` attributes match validation logic
3. Ensure js/form-handler.js loaded successfully
4. Check browser console for JavaScript errors
5. Test `validateStep()` function is being called

### Issue: Phone number not formatting

**Symptoms:** Phone field doesn't auto-format as (XXX) XXX-XXXX

**Solutions:**
1. Verify phone input has `id="phone"`
2. Check `initializePhoneFormatting()` is called in `init()`
3. Test with different input methods (typing, pasting)
4. Check for JavaScript errors in console
5. Ensure input type is `tel` not `text`

### Issue: File upload not working

**Symptoms:** Cannot select file or file doesn't upload

**Solutions:**
1. Verify Formspree endpoint is correct
2. Check file is under 5MB
3. Ensure file type is in accepted list
4. Verify Formspree account allows file uploads (free tier does)
5. Test with different file formats
6. Check browser console for errors

### Issue: Progress not saving

**Symptoms:** Form data lost on page refresh

**Solutions:**
1. Check sessionStorage is enabled (not disabled by browser settings)
2. Verify user isn't in private/incognito mode
3. Check `saveProgress()` is called on input events
4. Open DevTools → Application → Session Storage → check for keys
5. Verify JSON.stringify/parse working correctly
6. Test in different browser

### Issue: Form submission fails

**Symptoms:** Error message shows after clicking Submit

**Solutions:**
1. **Check Formspree endpoint:**
   - Verify form ID is correct in js/form-handler.js
   - Ensure endpoint format: `https://formspree.io/f/xxxxx`
   - Test endpoint in Postman or curl

2. **Check network connection:**
   - Open DevTools → Network tab
   - Look for failed requests (red)
   - Check response status code and message

3. **Verify all validation passes:**
   - Ensure all required fields filled
   - Check no validation errors showing
   - Test in browser console: `formInstance.validateStep(3)`

4. **Check CORS issues:**
   - Formspree should handle CORS automatically
   - If issue persists, contact Formspree support

5. **Review Formspree dashboard:**
   - Check for spam blocks
   - Verify form is active
   - Review submission logs

### Issue: Mobile layout broken

**Symptoms:** Form looks bad on mobile devices

**Solutions:**
1. Verify viewport meta tag in HTML:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. Check media queries in CSS are working
3. Test specific breakpoint: `@media (max-width: 768px)`
4. Use DevTools device toolbar to test different sizes
5. Test on actual mobile device (emulators not always accurate)
6. Check for horizontal scroll (indicates element too wide)

### Issue: Step navigation stuck

**Symptoms:** Cannot click Next/Previous buttons

**Solutions:**
1. Check buttons have correct event listeners
2. Verify `showStep()` function working correctly
3. Check for JavaScript errors preventing execution
4. Ensure `currentStep` variable updating correctly
5. Test in console: `formInstance.nextStep()` or `formInstance.previousStep()`
6. Verify button `disabled` state not stuck

### Issue: Success message not showing

**Symptoms:** Form submits but no success message appears

**Solutions:**
1. Check `handleSuccess()` function is called
2. Verify success message element exists: `id="form-success"`
3. Check CSS display property: should add `.visible` class
4. Ensure form `style.display = 'none'` is applied
5. Check for conflicting CSS hiding the message
6. Verify scroll behavior works correctly

### Issue: Error messages not accessible

**Symptoms:** Screen readers don't announce errors

**Solutions:**
1. Verify error elements have `role="alert"`
2. Check `aria-invalid="true"` on invalid fields
3. Ensure `aria-describedby` points to error message ID
4. Test with actual screen reader (NVDA, JAWS, VoiceOver)
5. Verify errors are in DOM (not dynamically hidden with CSS only)

### Issue: Character counter not updating

**Symptoms:** Counter shows 0 even when typing

**Solutions:**
1. Verify textarea has `id="project-description"`
2. Check counter element exists: `id="char-count"`
3. Ensure `initializeCharacterCounter()` called in `init()`
4. Check for JavaScript errors
5. Test input event is firing on textarea

### Issue: "Other" service field not showing

**Symptoms:** Checking "Other" doesn't reveal text input

**Solutions:**
1. Verify "Other" checkbox has `id="service-other"`
2. Check conditional field has `id="other-service-field"`
3. Ensure `initializeOtherServiceField()` called in `init()`
4. Check CSS display property toggling correctly
5. Verify event listener attached to checkbox

### Issue: Form data missing in email

**Symptoms:** Email received but some fields empty

**Solutions:**
1. Check field `name` attributes are unique and correct
2. Verify FormData includes all fields
3. Check checkboxes/radios have values set
4. Ensure services array being formatted correctly
5. Review Formspree submission in dashboard
6. Test with simple curl request to isolate issue

---

**Implementation Time:** ~3-4 hours
**Complexity:** High (multi-step logic, validation, file upload, persistence)
**Business Value:** Very High (qualified lead capture, professional appearance, competitive advantage)
**Dependencies:** Formspree account (free tier sufficient)

---

## Additional Resources

### Formspree Documentation
- Getting Started: https://help.formspree.io/hc/en-us/articles/360013470814
- File Uploads: https://help.formspree.io/hc/en-us/articles/360017735154
- Spam Protection: https://help.formspree.io/hc/en-us/articles/360013471154

### Accessibility Testing Tools
- WAVE: https://wave.webaim.org/
- axe DevTools: https://www.deque.com/axe/devtools/
- Lighthouse (Chrome DevTools)
- Screen Readers: NVDA (Windows), VoiceOver (Mac)

### Form UX Best Practices
- Nielsen Norman Group: https://www.nngroup.com/articles/web-form-design/
- Baymard Institute: https://baymard.com/blog/checkout-flow-average-form-fields
- Luke Wroblewski: https://www.lukew.com/resources/web_form_design.asp

### Testing Checklist Resources
- WebAIM Checklist: https://webaim.org/standards/wcag/checklist
- A11Y Project: https://www.a11yproject.com/checklist/

---

**Last Updated:** 2025-10-22
**Author:** Claude (Anthropic)
**Version:** 1.0
