/**
 * SEFAT BHUIYAN — PORTFOLIO
 * Dynamic Client Review & Rating Management System
 * Full-stack Client Reviews, Star Ratings, Real-time Validation,
 * Multilingual Unicode Support & Secure Admin Moderation Dashboard
 */

(() => {
  'use strict';

  // DOM Selectors
  const reviewsContainer = document.getElementById('reviewsContainer');
  const statAvgRating = document.getElementById('statAvgRating');
  const statTotalApproved = document.getElementById('statTotalApproved');
  const statFiveStars = document.getElementById('statFiveStars');

  // Form Elements
  const toggleFormBtn = document.getElementById('toggleReviewFormBtn');
  const formCard = document.getElementById('reviewFormCard');
  const closeFormBtn = document.getElementById('closeReviewFormBtn');
  const reviewForm = document.getElementById('clientReviewForm');
  const fullNameInput = document.getElementById('reviewFullName');
  const emailInput = document.getElementById('reviewEmail');
  const phoneInput = document.getElementById('reviewPhone');
  const starRatingWrap = document.getElementById('interactiveStarRating');
  const starBtns = document.querySelectorAll('.star-rating-btn');
  const ratingInput = document.getElementById('selectedRatingInput');
  const ratingFeedbackText = document.getElementById('ratingFeedbackText');
  const reviewTextInput = document.getElementById('reviewContentText');
  const charCountVal = document.getElementById('charCountVal');
  const consentCheckbox = document.getElementById('reviewConsent');
  const formAlert = document.getElementById('reviewFormAlert');
  const submitBtn = document.getElementById('submitReviewBtn');
  const submitBtnSpinner = document.getElementById('submitBtnSpinner');
  const submitBtnText = document.getElementById('submitBtnText');

  // Admin Modal Elements
  const openAdminBtn = document.getElementById('openAdminPortalBtn');
  const adminModal = document.getElementById('reviewAdminModal');
  const closeAdminBtn = document.getElementById('closeAdminModalBtn');
  const adminLoginView = document.getElementById('adminLoginView');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const adminLoginAlert = document.getElementById('adminLoginAlert');
  const adminDashboardView = document.getElementById('adminDashboardView');
  const adminReviewsList = document.getElementById('adminReviewsList');
  const adminFilterTabs = document.querySelectorAll('.admin-tab-btn');
  const adminRefreshBtn = document.getElementById('adminRefreshBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');

  // Admin KPI metrics
  const metricTotal = document.getElementById('metricTotalReviews');
  const metricPending = document.getElementById('metricPendingReviews');
  const metricApproved = document.getElementById('metricApprovedReviews');
  const metricRejected = document.getElementById('metricRejectedReviews');
  const pendingBadge = document.getElementById('pendingBadge');

  let currentAdminFilter = 'all';
  let selectedRating = 0;

  const RATING_LABELS = {
    1: '1 Star — Poor',
    2: '2 Stars — Fair',
    3: '3 Stars — Good',
    4: '4 Stars — Very Good',
    5: '5 Stars — Excellent'
  };

  // Helper: Escape HTML to prevent XSS
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Helper: Format Date string
  function formatDate(isoStr) {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr.replace(' ', 'T'));
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return isoStr;
    }
  }

  // Helper: Render Stars HTML
  function renderStars(rating) {
    const num = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= num) {
        html += '<span class="star active" style="color: #facc15;">★</span>';
      } else {
        html += '<span class="star" style="color: rgba(255,255,255,0.2);">★</span>';
      }
    }
    return html;
  }

  // ==========================================
  // 1. PUBLIC REVIEWS LOADER & DISPLAY
  // ==========================================
  async function loadPublicReviews() {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load reviews');
      }

      // Update Statistics Bar
      const stats = data.stats || {};
      if (statAvgRating) statAvgRating.textContent = (stats.averageRating || 0).toFixed(1);
      if (statTotalApproved) statTotalApproved.textContent = stats.totalApproved || 0;
      if (statFiveStars) statFiveStars.textContent = stats.fiveStarCount || 0;

      const reviews = data.reviews || [];
      renderPublicReviews(reviews);
    } catch (err) {
      console.warn('Notice: Review API check:', err.message);
      renderPublicReviews([]);
    }
  }

  function renderPublicReviews(reviews) {
    if (!reviewsContainer) return;

    if (!reviews || reviews.length === 0) {
      reviewsContainer.innerHTML = `
        <div class="reviews-empty-state">
          <div class="empty-state-puck" aria-hidden="true">💬</div>
          <h3 class="empty-state-title">No reviews yet. Be the first to share your experience!</h3>
          <p class="empty-state-desc">Your genuine feedback helps me grow and lets others know what it's like working with me.</p>
          <button type="button" class="btn primary shader-btn" id="emptyStateWriteBtn">
            <span class="label">✍️ Write the First Review</span>
            <span class="shine" aria-hidden="true"></span>
          </button>
        </div>
      `;
      const emptyBtn = document.getElementById('emptyStateWriteBtn');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', openReviewForm);
      }
      return;
    }

    reviewsContainer.innerHTML = reviews.map(r => `
      <article class="testimonial testimonial-3d" data-review-id="${r.id}">
        <div class="testimonial-glow" aria-hidden="true"></div>
        <div class="testimonial-top">
          <div class="quote-puck-3d" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
            </svg>
          </div>
          <div class="testimonial-rating" aria-label="${r.rating} out of 5 stars">
            ${renderStars(r.rating)}
          </div>
        </div>
        <p>${escapeHtml(r.review_text)}</p>
        <div class="person">
          <div class="avatar avatar-3d">
            <span>${escapeHtml(r.avatar_initial || 'C')}</span>
            <span class="avatar-ring" aria-hidden="true"></span>
          </div>
          <div>
            <b class="person-name">
              <span class="person-name-text">${escapeHtml(r.full_name)}</span>
              <span class="verified-badge" aria-label="Verified Client" title="Verified Customer Review">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </span>
            </b>
            <div class="person-role">Verified Client</div>
            <div class="review-date-badge">${formatDate(r.created_at)}</div>
          </div>
        </div>
        <span class="testimonial-sheen" aria-hidden="true"></span>
      </article>
    `).join('');

    // Attach dynamic 3D mousemove tilt & glow spotlight to cards
    attachTestimonialSpotlights();
  }

  function attachTestimonialSpotlights() {
    const cards = document.querySelectorAll('.testimonial.testimonial-3d');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--testi-mouse-x', `${x}px`);
        card.style.setProperty('--testi-mouse-y', `${y}px`);
      });
    });
  }

  // ==========================================
  // 2. INTERACTIVE 5-STAR RATING COMPONENT
  // ==========================================
  function setupStarRating() {
    if (!starBtns || starBtns.length === 0) return;

    starBtns.forEach(btn => {
      const val = parseInt(btn.dataset.value, 10);

      // Hover preview
      btn.addEventListener('mouseenter', () => {
        highlightStars(val);
        if (ratingFeedbackText) {
          ratingFeedbackText.textContent = RATING_LABELS[val] || '';
        }
      });

      // Click selection
      btn.addEventListener('click', () => {
        selectedRating = val;
        if (ratingInput) ratingInput.value = val;
        starBtns.forEach(b => {
          const bVal = parseInt(b.dataset.value, 10);
          b.setAttribute('aria-checked', bVal === val ? 'true' : 'false');
        });
        setActiveStars(selectedRating);
        if (ratingFeedbackText) {
          ratingFeedbackText.textContent = RATING_LABELS[selectedRating] || '';
        }
      });
    });

    if (starRatingWrap) {
      starRatingWrap.addEventListener('mouseleave', () => {
        if (selectedRating > 0) {
          setActiveStars(selectedRating);
          if (ratingFeedbackText) {
            ratingFeedbackText.textContent = RATING_LABELS[selectedRating];
          }
        } else {
          resetStars();
          if (ratingFeedbackText) {
            ratingFeedbackText.textContent = 'Click to select rating';
          }
        }
      });
    }
  }

  function highlightStars(count) {
    starBtns.forEach(btn => {
      const val = parseInt(btn.dataset.value, 10);
      if (val <= count) {
        btn.classList.add('hover-active');
      } else {
        btn.classList.remove('hover-active');
      }
    });
  }

  function setActiveStars(count) {
    starBtns.forEach(btn => {
      const val = parseInt(btn.dataset.value, 10);
      btn.classList.remove('hover-active');
      if (val <= count) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function resetStars() {
    starBtns.forEach(btn => {
      btn.classList.remove('hover-active', 'active');
      btn.setAttribute('aria-checked', 'false');
    });
    selectedRating = 0;
    if (ratingInput) ratingInput.value = '0';
  }

  // ==========================================
  // 3. REVIEW FORM CONTROLS & SUBMISSION
  // ==========================================
  function openReviewForm() {
    if (!formCard) return;
    formCard.hidden = false;
    if (toggleFormBtn) toggleFormBtn.setAttribute('aria-expanded', 'true');
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (fullNameInput) fullNameInput.focus();
  }

  function closeReviewForm() {
    if (!formCard) return;
    formCard.hidden = true;
    if (toggleFormBtn) toggleFormBtn.setAttribute('aria-expanded', 'false');
    hideFormAlert();
  }

  if (toggleFormBtn) {
    toggleFormBtn.addEventListener('click', () => {
      if (formCard.hidden) {
        openReviewForm();
      } else {
        closeReviewForm();
      }
    });
  }

  if (closeFormBtn) {
    closeFormBtn.addEventListener('click', closeReviewForm);
  }

  // Character Counter
  if (reviewTextInput && charCountVal) {
    reviewTextInput.addEventListener('input', () => {
      const len = reviewTextInput.value.length;
      charCountVal.textContent = len;
      const counterEl = document.getElementById('charCounter');
      if (counterEl) {
        if (len < 10) {
          counterEl.style.color = 'var(--muted)';
        } else if (len > 1500) {
          counterEl.style.color = '#f43f5e';
        } else {
          counterEl.style.color = '#34d399';
        }
      }
    });
  }

  function showFormAlert(type, message) {
    if (!formAlert) return;
    formAlert.hidden = false;
    formAlert.className = `review-form-alert alert-${type}`;
    formAlert.innerHTML = `<span>${type === 'success' ? '✓' : '⚠️'}</span> <div>${escapeHtml(message)}</div>`;
  }

  function hideFormAlert() {
    if (!formAlert) return;
    formAlert.hidden = true;
    formAlert.innerHTML = '';
  }

  // Handle Review Submission
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideFormAlert();

      const fullName = (fullNameInput ? fullNameInput.value : '').trim();
      const email = (emailInput ? emailInput.value : '').trim();
      const phone = (phoneInput ? phoneInput.value : '').trim();
      const text = (reviewTextInput ? reviewTextInput.value : '').trim();
      const consent = consentCheckbox ? consentCheckbox.checked : false;

      // Client-side Validation
      if (!fullName || fullName.length < 2) {
        showFormAlert('error', 'Please enter your full name (minimum 2 characters).');
        if (fullNameInput) fullNameInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showFormAlert('error', 'Please enter a valid email address.');
        if (emailInput) emailInput.focus();
        return;
      }

      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phone || !phoneRegex.test(phone)) {
        showFormAlert('error', 'Please enter a valid international phone number.');
        if (phoneInput) phoneInput.focus();
        return;
      }

      if (selectedRating < 1 || selectedRating > 5) {
        showFormAlert('error', 'Please select a star rating (1 to 5 stars).');
        if (starRatingWrap) starRatingWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      if (!text || text.length < 10) {
        showFormAlert('error', 'Review text must be at least 10 characters long.');
        if (reviewTextInput) reviewTextInput.focus();
        return;
      }

      if (text.length > 1500) {
        showFormAlert('error', 'Review text cannot exceed 1,500 characters.');
        if (reviewTextInput) reviewTextInput.focus();
        return;
      }

      if (!consent) {
        showFormAlert('error', 'You must agree to the privacy consent to submit your review.');
        if (consentCheckbox) consentCheckbox.focus();
        return;
      }

      // UI Submitting State
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnSpinner) submitBtnSpinner.hidden = false;
      if (submitBtnText) submitBtnText.textContent = 'Submitting...';

      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            email: email,
            phone_number: phone,
            rating: selectedRating,
            review_text: text,
            consent: true,
            language: 'multilingual'
          })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Submission failed. Please try again.');
        }

        // Success State
        showFormAlert('success', data.message || 'Thank you! Your review has been submitted for approval.');
        reviewForm.reset();
        resetStars();
        if (charCountVal) charCountVal.textContent = '0';

        // Auto close form after 4 seconds
        setTimeout(() => {
          closeReviewForm();
        }, 4000);
      } catch (err) {
        showFormAlert('error', err.message || 'Network error while submitting review.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnSpinner) submitBtnSpinner.hidden = true;
        if (submitBtnText) submitBtnText.textContent = 'Submit My Review';
      }
    });
  }

  // ==========================================
  // 4. ADMIN MODERATION PORTAL (MODAL & DASHBOARD)
  // ==========================================
  function openAdminModal() {
    if (!adminModal) return;
    adminModal.classList.add('active');
    adminModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const token = sessionStorage.getItem('sefat_admin_token');
    if (token) {
      showAdminDashboard();
    } else {
      showAdminLogin();
    }
  }

  function closeAdminModal() {
    if (!adminModal) return;
    adminModal.classList.remove('active');
    adminModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openAdminBtn) {
    openAdminBtn.addEventListener('click', openAdminModal);
  }

  if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', closeAdminModal);
  }

  // Backdrop click closes modal
  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) {
        closeAdminModal();
      }
    });
  }

  // Esc key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminModal && adminModal.classList.contains('active')) {
      closeAdminModal();
    }
  });

  function showAdminLogin() {
    if (adminLoginView) adminLoginView.hidden = false;
    if (adminDashboardView) adminDashboardView.hidden = true;
    if (adminLoginAlert) adminLoginAlert.hidden = true;
    if (adminPasswordInput) {
      adminPasswordInput.value = '';
      setTimeout(() => adminPasswordInput.focus(), 100);
    }
  }

  function showAdminDashboard() {
    if (adminLoginView) adminLoginView.hidden = true;
    if (adminDashboardView) adminDashboardView.hidden = false;
    loadAdminReviews(currentAdminFilter);
  }

  // Admin Login Submission
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pwd = (adminPasswordInput ? adminPasswordInput.value : '').trim();
      if (!pwd) return;

      const submitBtn = document.getElementById('adminLoginSubmitBtn');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd })
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Invalid credentials');
        }

        sessionStorage.setItem('sefat_admin_token', data.token);
        showAdminDashboard();
      } catch (err) {
        if (adminLoginAlert) {
          adminLoginAlert.hidden = false;
          adminLoginAlert.textContent = err.message || 'Login failed.';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Admin Logout
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('sefat_admin_token');
      showAdminLogin();
    });
  }

  // Admin Refresh
  if (adminRefreshBtn) {
    adminRefreshBtn.addEventListener('click', () => {
      loadAdminReviews(currentAdminFilter);
    });
  }

  // Filter Tabs
  adminFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      adminFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentAdminFilter = tab.dataset.filter || 'all';
      loadAdminReviews(currentAdminFilter);
    });
  });

  // Load Admin Reviews
  async function loadAdminReviews(filter = 'all') {
    const token = sessionStorage.getItem('sefat_admin_token');
    if (!token) {
      showAdminLogin();
      return;
    }

    if (adminReviewsList) {
      adminReviewsList.innerHTML = '<div style="text-align: center; color: var(--muted); padding: 30px;">Loading submissions...</div>';
    }

    try {
      const res = await fetch(`/api/admin/reviews?status=${encodeURIComponent(filter)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        sessionStorage.removeItem('sefat_admin_token');
        showAdminLogin();
        return;
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load reviews');
      }

      // Update KPIs
      const m = data.metrics || {};
      if (metricTotal) metricTotal.textContent = m.total || 0;
      if (metricPending) metricPending.textContent = m.pending || 0;
      if (metricApproved) metricApproved.textContent = m.approved || 0;
      if (metricRejected) metricRejected.textContent = m.rejected || 0;
      if (pendingBadge) pendingBadge.textContent = m.pending || 0;

      renderAdminReviewsList(data.reviews || []);
    } catch (err) {
      if (adminReviewsList) {
        adminReviewsList.innerHTML = `<div style="text-align: center; color: #fb7185; padding: 20px;">${escapeHtml(err.message)}</div>`;
      }
    }
  }

  function renderAdminReviewsList(reviews) {
    if (!adminReviewsList) return;

    if (!reviews || reviews.length === 0) {
      adminReviewsList.innerHTML = `
        <div style="text-align: center; color: var(--muted); padding: 48px; border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px;">
          No reviews found in this category.
        </div>
      `;
      return;
    }

    adminReviewsList.innerHTML = reviews.map(r => `
      <div class="admin-review-card" data-admin-id="${r.id}">
        <div class="admin-card-top">
          <div class="admin-card-user">
            <div class="admin-user-avatar">${escapeHtml((r.full_name || 'C').charAt(0).toUpperCase())}</div>
            <div>
              <h4 class="admin-user-name">${escapeHtml(r.full_name)}</h4>
              <div class="admin-user-contacts">
                <span>📧 ${escapeHtml(r.email)}</span>
                <span>📞 ${escapeHtml(r.phone_number)}</span>
                <span>📅 ${formatDate(r.created_at)}</span>
              </div>
            </div>
          </div>
          <div class="admin-card-meta">
            <span class="status-badge status-${r.status}">${r.status}</span>
            <span class="admin-card-rating">${'★'.repeat(r.rating || 5)}</span>
          </div>
        </div>

        <div class="admin-card-body">${escapeHtml(r.review_text)}</div>

        <div class="admin-card-actions">
          ${r.status !== 'approved' ? `
            <button type="button" class="admin-action-btn btn-approve" data-action="approved" data-id="${r.id}">
              ✓ Approve
            </button>
          ` : ''}
          ${r.status !== 'rejected' ? `
            <button type="button" class="admin-action-btn btn-reject" data-action="rejected" data-id="${r.id}">
              ✗ Reject
            </button>
          ` : ''}
          <button type="button" class="admin-action-btn btn-delete" data-action="delete" data-id="${r.id}">
            🗑 Delete
          </button>
        </div>
      </div>
    `).join('');

    // Attach actions
    adminReviewsList.querySelectorAll('.admin-action-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const token = sessionStorage.getItem('sefat_admin_token');

        if (action === 'delete') {
          if (!confirm(`Are you sure you want to permanently delete Review #${id}? This cannot be undone.`)) {
            return;
          }
          await deleteReviewAdmin(id, token);
        } else {
          await updateReviewStatusAdmin(id, action, token);
        }
      });
    });
  }

  async function updateReviewStatusAdmin(id, newStatus, token) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Update failed');
      }
      // Reload admin view and public view
      loadAdminReviews(currentAdminFilter);
      loadPublicReviews();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  }

  async function deleteReviewAdmin(id, token) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Delete failed');
      }
      loadAdminReviews(currentAdminFilter);
      loadPublicReviews();
    } catch (err) {
      alert('Error deleting review: ' + err.message);
    }
  }

  // ==========================================
  // INITIALIZATION ON PAGE LOAD
  // ==========================================
  function init() {
    setupStarRating();
    loadPublicReviews();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

