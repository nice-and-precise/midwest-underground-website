/**
 * Modal Component System
 * Reusable modal functionality for CMS editing across all dashboard pages
 */

let activeModal = null;

/**
 * Initialize modal system
 */
function initModalSystem() {
  // Create modal container if it doesn't exist
  if (!document.getElementById('modal-root')) {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }

  // Handle ESC key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeModal) {
      hideModal();
    }
  });

  console.log('[Modal] Modal system initialized');
}

/**
 * Show a generic modal with custom content
 * @param {string} title - Modal title
 * @param {string} content - HTML content for modal body
 * @param {object} options - Modal options (buttons, callbacks, etc.)
 */
function showModal(title, content, options = {}) {
  const defaults = {
    showClose: true,
    buttons: [],
    onClose: null,
    width: '600px',
    className: ''
  };

  const config = { ...defaults, ...options };

  const modalHTML = `
    <div class="modal-overlay ${config.className}" id="active-modal">
      <div class="modal-container" style="max-width: ${config.width};">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          ${config.showClose ? '<button class="modal-close" id="modal-close-btn" aria-label="Close modal">&times;</button>' : ''}
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${config.buttons.length > 0 ? `
          <div class="modal-footer">
            ${config.buttons.map(btn => `
              <button class="btn ${btn.className || 'btn-secondary'}" id="${btn.id}">
                ${btn.text}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = modalHTML;

  const overlay = document.getElementById('active-modal');
  activeModal = overlay;

  // Animate in
  setTimeout(() => {
    overlay.classList.add('active');
    overlay.querySelector('.modal-container').style.transform = 'scale(1)';
  }, 10);

  // Close button handler
  if (config.showClose) {
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        hideModal(config.onClose);
      });
    }
  }

  // Overlay click to close
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      hideModal(config.onClose);
    }
  });

  // Attach button handlers
  config.buttons.forEach(btn => {
    const buttonEl = document.getElementById(btn.id);
    if (buttonEl && btn.onClick) {
      buttonEl.addEventListener('click', btn.onClick);
    }
  });

  return overlay;
}

/**
 * Hide active modal
 * @param {function} callback - Optional callback after modal closes
 */
function hideModal(callback) {
  if (!activeModal) return;

  const container = activeModal.querySelector('.modal-container');

  // Animate out
  activeModal.classList.remove('active');
  container.style.transform = 'scale(0.9)';

  setTimeout(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.innerHTML = '';
    }
    activeModal = null;

    if (callback) callback();
  }, 300);
}

/**
 * Show edit form modal
 * @param {string} title - Modal title
 * @param {object} formData - Form field data
 * @param {function} onSave - Callback when save is clicked
 * @param {function} onCancel - Callback when cancel is clicked
 */
function showEditModal(title, formData, onSave, onCancel) {
  const formHTML = generateFormHTML(formData);

  const modal = showModal(title, formHTML, {
    buttons: [
      {
        id: 'modal-cancel-btn',
        text: 'Cancel',
        className: 'btn-secondary',
        onClick: function() {
          hideModal(onCancel);
        }
      },
      {
        id: 'modal-save-btn',
        text: 'Save Changes',
        className: 'btn-primary',
        onClick: async function() {
          const saveBtn = document.getElementById('modal-save-btn');
          const formEl = document.getElementById('modal-edit-form');

          // Clear previous errors
          clearFormErrors();

          // Get form data
          const data = getFormData(formEl);

          // Validate
          const errors = validateFormData(data, formData);
          if (errors.length > 0) {
            showFormErrors(errors);
            return;
          }

          // Show loading state
          saveBtn.classList.add('loading');
          saveBtn.disabled = true;

          try {
            await onSave(data);
            hideModal();
          } catch (error) {
            console.error('[Modal] Save error:', error);
            showFormErrors([{ field: '_general', message: error.message || 'Failed to save changes' }]);
            saveBtn.classList.remove('loading');
            saveBtn.disabled = false;
          }
        }
      }
    ]
  });

  return modal;
}

/**
 * Show delete confirmation modal
 * @param {string} itemType - Type of item (e.g., "project", "customer")
 * @param {string} itemName - Name of item to delete
 * @param {function} onConfirm - Callback when delete is confirmed
 */
function showDeleteModal(itemType, itemName, onConfirm) {
  const content = `
    <div class="delete-confirmation">
      <div class="delete-icon">⚠️</div>
      <p class="delete-message">
        Are you sure you want to delete this ${itemType}?
      </p>
      <p class="delete-item-name"><strong>${itemName}</strong></p>
      <p class="delete-warning">This action cannot be undone.</p>
    </div>
  `;

  const modal = showModal(`Delete ${capitalize(itemType)}`, content, {
    buttons: [
      {
        id: 'modal-cancel-btn',
        text: 'Cancel',
        className: 'btn-secondary',
        onClick: function() {
          hideModal();
        }
      },
      {
        id: 'modal-delete-btn',
        text: 'Delete',
        className: 'btn-danger',
        onClick: async function() {
          const deleteBtn = document.getElementById('modal-delete-btn');
          deleteBtn.classList.add('loading');
          deleteBtn.disabled = true;

          try {
            await onConfirm();
            hideModal();
          } catch (error) {
            console.error('[Modal] Delete error:', error);
            showNotification(error.message || 'Failed to delete item', 'error');
            deleteBtn.classList.remove('loading');
            deleteBtn.disabled = false;
          }
        }
      }
    ],
    className: 'modal-delete'
  });

  return modal;
}

/**
 * Generate form HTML from form data configuration
 * @param {object} formData - Form field configuration
 */
function generateFormHTML(formData) {
  let html = '<form id="modal-edit-form" class="modal-form">';

  formData.fields.forEach(field => {
    html += `<div class="form-group" data-field="${field.name}">`;
    html += `<label class="form-label" for="field-${field.name}">${field.label}`;
    if (field.required) html += '<span class="required">*</span>';
    html += '</label>';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        html += `<input
          type="${field.type}"
          id="field-${field.name}"
          name="${field.name}"
          class="form-input"
          value="${field.value || ''}"
          ${field.required ? 'required' : ''}
          ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
          ${field.readonly ? 'readonly' : ''}
        >`;
        break;

      case 'select':
        html += `<select id="field-${field.name}" name="${field.name}" class="form-select" ${field.required ? 'required' : ''}>`;
        if (field.placeholder) {
          html += `<option value="">${field.placeholder}</option>`;
        }
        field.options.forEach(opt => {
          const selected = opt.value === field.value ? 'selected' : '';
          html += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
        });
        html += '</select>';
        break;

      case 'textarea':
        html += `<textarea
          id="field-${field.name}"
          name="${field.name}"
          class="form-textarea"
          rows="${field.rows || 4}"
          ${field.required ? 'required' : ''}
          ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
        >${field.value || ''}</textarea>`;
        break;

      case 'checkbox':
        html += `<label class="form-checkbox">
          <input
            type="checkbox"
            id="field-${field.name}"
            name="${field.name}"
            ${field.value ? 'checked' : ''}
          >
          <span>${field.checkboxLabel || ''}</span>
        </label>`;
        break;
    }

    html += '<div class="form-error"></div>';
    html += '</div>';
  });

  html += '</form>';
  return html;
}

/**
 * Get form data from form element
 * @param {HTMLElement} formEl - Form element
 */
function getFormData(formEl) {
  const data = {};
  const formData = new FormData(formEl);

  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Handle checkboxes separately
  formEl.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    data[checkbox.name] = checkbox.checked;
  });

  return data;
}

/**
 * Validate form data
 * @param {object} data - Form data
 * @param {object} formConfig - Form configuration
 */
function validateFormData(data, formConfig) {
  const errors = [];

  formConfig.fields.forEach(field => {
    // Required field validation
    if (field.required && !data[field.name]) {
      errors.push({
        field: field.name,
        message: `${field.label} is required`
      });
    }

    // Email validation
    if (field.type === 'email' && data[field.name]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data[field.name])) {
        errors.push({
          field: field.name,
          message: 'Please enter a valid email address'
        });
      }
    }

    // Number validation
    if (field.type === 'number' && data[field.name]) {
      const num = parseFloat(data[field.name]);
      if (isNaN(num)) {
        errors.push({
          field: field.name,
          message: 'Please enter a valid number'
        });
      }
      if (field.min !== undefined && num < field.min) {
        errors.push({
          field: field.name,
          message: `Value must be at least ${field.min}`
        });
      }
      if (field.max !== undefined && num > field.max) {
        errors.push({
          field: field.name,
          message: `Value must be at most ${field.max}`
        });
      }
    }

    // Custom validation
    if (field.validate && data[field.name]) {
      const customError = field.validate(data[field.name]);
      if (customError) {
        errors.push({
          field: field.name,
          message: customError
        });
      }
    }
  });

  return errors;
}

/**
 * Show form validation errors
 * @param {array} errors - Array of error objects
 */
function showFormErrors(errors) {
  errors.forEach(error => {
    if (error.field === '_general') {
      // Show general error at top of form
      const form = document.getElementById('modal-edit-form');
      let generalError = form.querySelector('.form-general-error');
      if (!generalError) {
        generalError = document.createElement('div');
        generalError.className = 'form-general-error';
        form.insertBefore(generalError, form.firstChild);
      }
      generalError.textContent = error.message;
    } else {
      // Show field-specific error
      const formGroup = document.querySelector(`[data-field="${error.field}"]`);
      if (formGroup) {
        formGroup.classList.add('error');
        const errorEl = formGroup.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = error.message;
        }
      }
    }
  });
}

/**
 * Clear all form errors
 */
function clearFormErrors() {
  const formGroups = document.querySelectorAll('.form-group.error');
  formGroups.forEach(group => {
    group.classList.remove('error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';
  });

  const generalError = document.querySelector('.form-general-error');
  if (generalError) generalError.remove();
}

/**
 * Utility: Capitalize first letter
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize modal system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModalSystem);
} else {
  initModalSystem();
}
