/**
 * Kaipu Srujan Reddy - Portfolio JavaScript
 * Features:
 * - Theme Switcher (Dark Mode & Normal / Light Mode with localStorage)
 * - Smooth Scroll Reveal Animations (IntersectionObserver)
 * - Complete Dual-Channel Contact Form (Email & Direct WhatsApp)
 * - Certificate Lightbox Modal & Credential ID Copy
 * - Interactive Project Screenshot Switcher
 */

// ===================================================================
// 1. THEME SWITCHER (Dark & Normal / Light Mode)
// ===================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('srujan_portfolio_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default to dark theme

  applyTheme(initialTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('srujan_portfolio_theme', theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Normal / Light'} Mode`);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;

  if (theme === 'light') {
    // Sun icon for Light Mode
    icon.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) toggleBtn.setAttribute('title', 'Switch to Dark Mode');
  } else {
    // Moon icon for Dark Mode
    icon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) toggleBtn.setAttribute('title', 'Switch to Normal / Light Mode');
  }
}

// ===================================================================
// 2. SMOOTH SCROLL REVEAL ANIMATIONS
// ===================================================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, no need to keep observing
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
}

// ===================================================================
// 3. TOAST NOTIFICATIONS
// ===================================================================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  
  if (!toast || !toastText) return;
  
  toastText.textContent = message;
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Copy to clipboard helper
function copyText(text, successMessage = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage);
    }).catch(() => {
      fallbackCopyText(text, successMessage);
    });
  } else {
    fallbackCopyText(text, successMessage);
  }
}

function fallbackCopyText(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage);
  } catch (err) {
    showToast('Please copy: ' + text);
  }
  document.body.removeChild(textArea);
}

// ===================================================================
// 4. CERTIFICATE LIGHTBOX MODAL
// ===================================================================
let currentCertId = '';

function openCertModal(imageSrc, title, issuer, certId) {
  const modal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalIssuer = document.getElementById('modal-issuer');
  const modalDesc = document.getElementById('modal-desc');
  const modalId = document.getElementById('modal-id');
  const copyBtn = document.getElementById('modal-copy-btn');

  if (!modal) return;

  modalImg.src = imageSrc;
  modalTitle.textContent = title;
  modalIssuer.textContent = issuer + ' Verified Credential';
  modalDesc.textContent = 'Completed by Kaipu Srujan Reddy • Official Credential';
  modalId.textContent = 'ID: ' + certId;
  currentCertId = certId;

  copyBtn.onclick = () => {
    copyText(certId, 'Credential ID copied to clipboard!');
  };

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal(event) {
  const modal = document.getElementById('cert-modal');
  if (event.target === modal) {
    closeCertModalDirect();
  }
}

function closeCertModalDirect() {
  const modal = document.getElementById('cert-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCertModalDirect();
  }
});

// ===================================================================
// 5. PROJECT SCREENSHOT SWITCHER
// ===================================================================
function switchProjectShot(imgSrc, activeTabId) {
  const img = document.getElementById('project-screenshot-img');
  if (img) {
    img.style.opacity = '0.4';
    setTimeout(() => {
      img.src = imgSrc;
      img.style.opacity = '1';
    }, 150);
  }
  const tabs = document.querySelectorAll('.frame-tab-btn');
  tabs.forEach(tab => tab.classList.remove('active'));
  const activeTab = document.getElementById(activeTabId);
  if (activeTab) {
    activeTab.classList.add('active');
  }
}

// ===================================================================
// 6. COMPLETE CONTACT FORM (EMAIL & WHATSAPP)
// ===================================================================
function handleContactSubmit(event, channel = 'email') {
  event.preventDefault();

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const phoneInput = document.getElementById('form-phone');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');
  const statusBox = document.getElementById('form-status');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const subject = subjectInput ? subjectInput.value.trim() : '';
  const message = messageInput.value.trim();

  // Basic Validation
  if (!name) {
    showError(statusBox, 'Please enter your name.');
    nameInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showError(statusBox, 'Please enter a valid email address.');
    emailInput.focus();
    return;
  }

  if (!subject) {
    showError(statusBox, 'Please select a subject / purpose for your inquiry.');
    subjectInput.focus();
    return;
  }

  if (!message || message.length < 8) {
    showError(statusBox, 'Please write a message with at least 8 characters.');
    messageInput.focus();
    return;
  }

  const recipientEmail = 'srujanreddykaipu480@gmail.com';
  const recipientPhone = '919398202668';

  if (channel === 'whatsapp') {
    // Format WhatsApp message
    const waText = 
      `*Inquiry for Kaipu Srujan Reddy*\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      (phone ? `*Phone:* ${phone}\n` : '') +
      `*Subject:* ${subject}\n\n` +
      `*Message:*\n${message}`;

    const waUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(waText)}`;

    statusBox.className = 'form-status-msg success';
    statusBox.innerHTML = `
      <strong>✓ Message Prepared!</strong> Launching WhatsApp chat with <strong>Kaipu Srujan Reddy (+91 9398202668)</strong>.
      <div style="margin-top: 0.6rem;">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
          Click here if WhatsApp didn't open automatically
        </a>
      </div>
    `;

    window.open(waUrl, '_blank');
    showToast('Opening WhatsApp chat...');

  } else {
    // Format Email message
    const mailSubject = `[Portfolio] ${subject} - from ${name}`;
    const mailBody = 
      `Hello Kaipu Srujan Reddy,\n\n` +
      `Sender Name: ${name}\n` +
      `Sender Email: ${email}\n` +
      (phone ? `Sender Phone: ${phone}\n` : '') +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}\n\n` +
      `---\nSent via Portfolio Contact Form (Jain University)`;

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    statusBox.className = 'form-status-msg success';
    statusBox.innerHTML = `
      <strong>✓ Ready to send to ${recipientEmail}!</strong>
      <p style="margin: 0.4rem 0 0.8rem; font-size: 0.82rem; color: var(--text-muted);">
        Opening your default email app. You can also send directly via Gmail Web or reset the form.
      </p>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <a href="${gmailWebUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          Send via Gmail Web
        </a>
        <a href="${mailtoUrl}" class="btn btn-outline btn-sm">
          Launch Default Mail App
        </a>
        <button type="button" class="btn btn-outline btn-sm" onclick="resetContactForm()">
          Send Another
        </button>
      </div>
    `;

    // Attempt default mail client
    window.location.href = mailtoUrl;
    showToast('Opening email client...');
  }
}

function showError(statusBox, message) {
  statusBox.className = 'form-status-msg error';
  statusBox.innerHTML = `<strong>✕ Error:</strong> ${message}`;
}

function resetContactForm() {
  const form = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  if (form) form.reset();
  if (statusBox) {
    statusBox.style.display = 'none';
    statusBox.className = 'form-status-msg';
  }
  showToast('Form reset.');
}

// ===================================================================
// INITIALIZATION
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollReveal();
  console.log('Kaipu Srujan Reddy portfolio ready with Theme Switcher, Smooth Animations, and Complete Contact Form.');
});
