/**
 * SEFAT BHUIYAN — CLIENT REVIEWS & MODERATION SYSTEM
 * Futuristic 3D Interactive Client Reviews, Star Ratings,
 * Client Submission Modal, and Secret Admin Moderation Panel.
 *
 * Resilient multi-deployment support:
 * 1. Static / Jamstack / GitHub Pages / Vercel (localStorage fallback)
 * 2. Node.js REST API (/api/reviews, /api/reviews/moderate)
 * 3. WordPress Theme Integration (wp-reviews-integration.php)
 */

(() => {
  'use strict';

  // Config & Constants
  const STORAGE_KEY = 'sefat_portfolio_reviews_v2';
  const ADMIN_SESSION_KEY = 'sefat_admin_session_active';
  const ADMIN_PASSWORD_STANDARD = 'Sefat@Admin2026';
  const ADMIN_PASSWORD_ALT = 'Sefat@Admin2026!';

  // Default Seed Reviews
  const DEFAULT_SEEDS = [
    {
      id: 101,
      full_name: 'Sarah Jenkins',
      role_company: 'Head of Growth @ AlphaBrand UK',
      rating: 5,
      review_text: "Sefat's digital marketing strategy completely transformed our Meta Ads ROAS from 1.8x to over 4.2x in under 60 days. His visual creativity combined with technical audience targeting is world-class.",
      hidden: false,
      created_at: '2026-11-12',
      avatar_initial: 'S',
      avatar_bg: 'avatar-grad-1',
      verified: true
    },
    {
      id: 102,
      full_name: 'তানভীর আহমেদ',
      role_company: 'Founder & CEO @ TechBazaar BD',
      rating: 5,
      review_text: 'অসাধারণ কাজ! ফেসবুক এবং ইন্সটাগ্রাম পেইজের ব্র্যান্ডিং ও অ্যাড ক্যাম্পেইনের জন্য সিফাত ভাইয়ের কোনো তুলনা হয় না। আমাদের সেলস দ্বিগুণেরও বেশি বৃদ্ধি পেয়েছে।',
      hidden: false,
      created_at: '2026-11-08',
      avatar_initial: 'ত',
      avatar_bg: 'avatar-grad-2',
      verified: true
    },
    {
      id: 103,
      full_name: 'Marcus Vance',
      role_company: 'Creative Director @ Vance Studio, USA',
      rating: 5,
      review_text: 'Exceptional graphic design skills! He crafted a comprehensive set of social banners, carousel ads, and brand assets with speed, precision, and modern aesthetic elegance. Highly recommended!',
      hidden: false,
      created_at: '2026-10-29',
      avatar_initial: 'M',
      avatar_bg: 'avatar-grad-3',
      verified: true
    },
    {
      id: 104,
      full_name: 'عمر الخالد (Omar Al-Khaled)',
      role_company: 'E-commerce Director, Dubai, UAE',
      rating: 5,
      review_text: 'تجربة ممتازة واحترافية عالية في تصميم الإعلانات وإدارة الحملات الممولة. زادت مبيعات المتجر بشكل ملحوظ خلال أول شهر. شكراً سيفات!',
      hidden: false,
      created_at: '2026-10-18',
      avatar_initial: 'ع',
      avatar_bg: 'avatar-grad-4',
      verified: true
    },
    {
      id: 105,
      full_name: 'Elena Rostova',
      role_company: 'Brand Strategist @ DigitalWave EU',
      rating: 4,
      review_text: 'Fast turnaround and brilliant attention to detail. Sefat provided creative variations and revisions until everything looked flawless. A true professional.',
      hidden: false,
      created_at: '2026-10-05',
      avatar_initial: 'E',
      avatar_bg: 'avatar-grad-5',
      verified: true
    },
    {
      id: 106,
      full_name: 'মাহমুদুল হাসান',
      role_company: 'Marketing Lead @ Apex Lifestyle',
      rating: 5,
      review_text: 'ডিজাইন সেন্স এবং আধুনিক ট্রেন্ড বোঝার ক্ষমতা সিফাত ভাইয়ের দারুণ। প্রতিটি ডেলিভারি সময়মতো পেয়েছি এবং ক্লায়েন্ট রেসপন্স ছিল অবিশ্বাস্য!',
      hidden: false,
      created_at: '2026-09-22',
      avatar_initial: 'ম',
      avatar_bg: 'avatar-grad-6',
      verified: true
    }
  ];

  const RATING_FEEDBACK = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good Quality & Results',
    4: 'Great Experience! ★★★★',
    5: 'Exceptional Work! ★★★★★'
  };

  // State
  let reviewsState = [];
  let currentFilter = 'all';
  let isAdminActive = false;
  let selectedRating = 5;

  // DOM Elements
  const container = document.getElementById('reviewsContainer');
  const avgRatingScoreEl = document.getElementById('statAvgRatingScore');
  const avgClientsTextEl = document.getElementById('statAvgClientsText');
  const filterTabs = document.querySelectorAll('#reviewFilterTabs .review-tab-btn');
  const countAllEl = document.getElementById('countAllReviews');
  const count5StarEl = document.getElementById('count5StarReviews');
  const count4StarEl = document.getElementById('count4StarReviews');

  // Admin Banner
  const adminActiveBanner = document.getElementById('adminActiveBanner');
  const exitAdminModeBtn = document.getElementById('exitAdminModeBtn');

  // Submit Modal Elements
  const openReviewModalBtn = document.getElementById('openReviewModalBtn');
  const reviewSubmitModal = document.getElementById('reviewSubmitModal');
  const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');
  const clientReviewForm = document.getElementById('clientReviewForm');
  const fullNameInput = document.getElementById('reviewFullName');
  const roleCompanyInput = document.getElementById('reviewRoleCompany');
  const starBtns = document.querySelectorAll('#interactiveStarRating .star-rating-btn');
  const selectedRatingInput = document.getElementById('selectedRatingInput');
  const ratingFeedbackText = document.getElementById('ratingFeedbackText');
  const reviewTextInput = document.getElementById('reviewContentText');
  const charCountVal = document.getElementById('charCountVal');
  const formAlert = document.getElementById('reviewFormAlert');
  const submitBtn = document.getElementById('submitReviewBtn');
  const submitBtnSpinner = document.getElementById('submitBtnSpinner');

  // Admin Password Modal Elements
  const openAdminModalBtn = document.getElementById('openAdminModalBtn');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const closeAdminLoginBtn = document.getElementById('closeAdminLoginBtn');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPasswordInput = document.getElementById('adminSecurityPassword');
  const togglePassBtn = document.getElementById('toggleAdminPassVisibility');
  const adminLoginAlert = document.getElementById('adminLoginAlert');

  // Toast Notification
  const reviewToast = document.getElementById('reviewToast');
  const reviewToastMsg = document.getElementById('reviewToastMsg');

  // ==========================================
  // HELPERS
  // ==========================================
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr.replace(' ', 'T'));
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  }

  function renderStars(rating) {
    const num = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= num) {
        stars += '<span class="star active" style="color: #facc15;">★</span>';
      } else {
        stars += '<span class="star" style="color: rgba(255,255,255,0.2);">★</span>';
      }
    }
    return stars;
  }

  function showToast(msg) {
    if (!reviewToast) return;
    if (reviewToastMsg) reviewToastMsg.textContent = msg;
    reviewToast.removeAttribute('hidden');
    reviewToast.classList.add('active');
    setTimeout(() => {
      reviewToast.classList.remove('active');
      setTimeout(() => reviewToast.setAttribute('hidden', ''), 300);
    }, 4000);
  }

  // ==========================================
  // DATA PERSISTENCE (localStorage + Backend)
  // ==========================================
  function loadLocalReviews() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    }
    // Seed default reviews if empty
    saveLocalReviews(DEFAULT_SEEDS);
    return DEFAULT_SEEDS;
  }

  function saveLocalReviews(reviews) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn('localStorage save error:', e);
    }
  }

  async function fetchReviewsFromServer() {
    try {
      const url = isAdminActive ? '/api/reviews?key=admin' : '/api/reviews';
      const headers = {};
      if (isAdminActive) {
        headers['x-admin-password'] = ADMIN_PASSWORD_STANDARD;
      }
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          reviewsState = data.reviews;
          saveLocalReviews(reviewsState);
          renderReviews();
          return;
        }
      }
    } catch (err) {
      // Offline or static host — rely seamlessly on localStorage
    }
    // Fallback to localStorage
    reviewsState = loadLocalReviews();
    renderReviews();
  }

  // ==========================================
  // RENDER & 3D CARD INTERACTIONS
  // ==========================================
  function calculateMetrics() {
    const visibleReviews = isAdminActive
      ? reviewsState
      : reviewsState.filter(r => !r.hidden);

    const publicReviews = reviewsState.filter(r => !r.hidden);
    const totalCount = publicReviews.length;

    let avg = 5.0;
    if (totalCount > 0) {
      const sum = publicReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      avg = (sum / totalCount).toFixed(1);
    }

    if (avgRatingScoreEl) avgRatingScoreEl.textContent = avg;
    if (avgClientsTextEl) avgClientsTextEl.textContent = `• ${totalCount}+ Happy Clients`;

    // Filter counts
    const count5 = visibleReviews.filter(r => Number(r.rating) === 5).length;
    const count4 = visibleReviews.filter(r => Number(r.rating) === 4).length;

    if (countAllEl) countAllEl.textContent = visibleReviews.length;
    if (count5StarEl) count5StarEl.textContent = count5;
    if (count4StarEl) count4StarEl.textContent = count4;
  }

  function renderReviews() {
    if (!container) return;
    calculateMetrics();

    // Filter list
    let list = isAdminActive ? [...reviewsState] : reviewsState.filter(r => !r.hidden);

    if (currentFilter === '5') {
      list = list.filter(r => Number(r.rating) === 5);
    } else if (currentFilter === '4') {
      list = list.filter(r => Number(r.rating) === 4);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="reviews-empty-state">
          <div class="empty-state-puck">★</div>
          <h3 class="empty-state-title">No Reviews Found</h3>
          <p class="empty-state-desc">There are no reviews matching this rating filter yet. Be the first to write a review!</p>
          <button type="button" class="btn btn-primary" onclick="document.getElementById('openReviewModalBtn')?.click()">
            Write the First Review ✦
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map((review) => {
      const isHidden = Boolean(review.hidden);
      const initial = review.avatar_initial || (review.full_name || 'C').trim().charAt(0).toUpperCase();
      const avatarBg = review.avatar_bg || 'avatar-grad-1';
      const roleText = review.role_company || 'Verified Client';

      return `
        <article
          class="testimonial testimonial-3d review-card-3d ${isHidden ? 'review-card-hidden' : ''}"
          data-review-id="${review.id}"
          data-rating="${review.rating}"
        >
          <div class="testimonial-glow" aria-hidden="true"></div>

          <div class="testimonial-top">
            <div class="testimonial-rating" aria-label="${review.rating} out of 5 stars">
              ${renderStars(review.rating)}
            </div>
            <div class="review-date-badge">${formatDate(review.created_at)}</div>
          </div>

          <p class="review-text-content">${escapeHtml(review.review_text)}</p>

          <div class="person">
            <div class="avatar avatar-3d ${avatarBg}">
              <span>${escapeHtml(initial)}</span>
              <span class="avatar-ring" aria-hidden="true"></span>
            </div>
            <div class="person-meta">
              <b class="person-name">
                <span class="person-name-text">${escapeHtml(review.full_name)}</span>
                <span class="verified-badge" aria-label="Verified Client" title="Verified Client">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </span>
              </b>
              <div class="person-role">
                ${escapeHtml(roleText)}
              </div>
            </div>
          </div>

          <!-- Secret Admin Moderation Actions (Visible only when Admin is Active) -->
          ${isAdminActive ? `
            <div class="admin-card-controls">
              ${isHidden ? '<span class="hidden-pill-badge">🔒 Hidden from Public</span>' : ''}
              <button
                type="button"
                class="card-admin-btn btn-toggle-hide ${isHidden ? 'active' : ''}"
                data-id="${review.id}"
                title="${isHidden ? 'Unhide review (Make public)' : 'Hide review from visitors'}"
                aria-label="${isHidden ? 'Unhide review' : 'Hide review'}"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  ${isHidden
                    ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
                    : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'}
                </svg>
                <span>${isHidden ? 'Unhide' : 'Hide'}</span>
              </button>
              <button
                type="button"
                class="card-admin-btn btn-delete"
                data-id="${review.id}"
                data-name="${escapeHtml(review.full_name)}"
                title="Permanently delete review"
                aria-label="Delete review"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          ` : ''}

          <span class="testimonial-sheen" aria-hidden="true"></span>
        </article>
      `;
    }).join('');

    initCard3DTilt();
    attachCardActionHandlers();
  }

  // 3D Tilt Effect on Review Cards
  function initCard3DTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = container.querySelectorAll('.review-card-3d');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Attach card admin action buttons (Hide / Unhide / Delete)
  function attachCardActionHandlers() {
    if (!isAdminActive) return;

    // Toggle Hide
    container.querySelectorAll('.btn-toggle-hide').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        await handleToggleHideReview(id);
      });
    });

    // Delete
    container.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name') || 'this review';
        if (confirm(`Are you sure you want to permanently delete the review from "${name}"? This action cannot be undone.`)) {
          await handleDeleteReview(id);
        }
      });
    });
  }

  // ==========================================
  // MODAL CONTROLS (Open / Close)
  // ==========================================
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      modalEl.classList.add('active');
    }, 10);
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    setTimeout(() => {
      modalEl.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }, 280);
  }

  // Close modals on Escape key or clicking backdrop
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (reviewSubmitModal && !reviewSubmitModal.hasAttribute('hidden')) closeModal(reviewSubmitModal);
      if (adminLoginModal && !adminLoginModal.hasAttribute('hidden')) closeModal(adminLoginModal);
    }
  });

  [reviewSubmitModal, adminLoginModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // ==========================================
  // INTERACTIVE 5-STAR RATING SELECTOR
  // ==========================================
  function updateStarRatingUI(val) {
    selectedRating = Number(val) || 5;
    if (selectedRatingInput) selectedRatingInput.value = selectedRating;
    if (ratingFeedbackText) ratingFeedbackText.textContent = RATING_FEEDBACK[selectedRating] || `${selectedRating} Stars`;

    starBtns.forEach((btn, idx) => {
      const starNum = idx + 1;
      if (starNum <= selectedRating) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  starBtns.forEach((btn, idx) => {
    const starNum = idx + 1;

    // Hover preview
    btn.addEventListener('mouseenter', () => {
      starBtns.forEach((b, i) => {
        b.classList.toggle('hover-active', i <= idx);
      });
      if (ratingFeedbackText) {
        ratingFeedbackText.textContent = RATING_FEEDBACK[starNum] || `${starNum} Stars`;
      }
    });

    // Reset hover
    btn.addEventListener('mouseleave', () => {
      starBtns.forEach((b) => b.classList.remove('hover-active'));
      if (ratingFeedbackText) {
        ratingFeedbackText.textContent = RATING_FEEDBACK[selectedRating] || `${selectedRating} Stars`;
      }
    });

    // Click to select
    btn.addEventListener('click', () => {
      updateStarRatingUI(starNum);
    });
  });

  // Dynamic Character Counter
  if (reviewTextInput && charCountVal) {
    reviewTextInput.addEventListener('input', () => {
      const len = reviewTextInput.value.length;
      charCountVal.textContent = len;
      if (len > 600) {
        charCountVal.style.color = '#f43f5e';
      } else if (len >= 15) {
        charCountVal.style.color = '#34d399';
      } else {
        charCountVal.style.color = 'var(--muted)';
      }
    });
  }

  // ==========================================
  // SUBMISSION FORM HANDLER
  // ==========================================
  if (openReviewModalBtn) {
    openReviewModalBtn.addEventListener('click', () => {
      if (formAlert) {
        formAlert.setAttribute('hidden', '');
        formAlert.className = 'review-form-alert';
      }
      updateStarRatingUI(5);
      openModal(reviewSubmitModal);
      setTimeout(() => fullNameInput && fullNameInput.focus(), 150);
    });
  }

  if (closeReviewModalBtn) {
    closeReviewModalBtn.addEventListener('click', () => closeModal(reviewSubmitModal));
  }

  if (clientReviewForm) {
    clientReviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = (fullNameInput ? fullNameInput.value : '').trim();
      const roleCompany = (roleCompanyInput ? roleCompanyInput.value : '').trim();
      const rating = Number(selectedRatingInput ? selectedRatingInput.value : 5) || 5;
      const reviewText = (reviewTextInput ? reviewTextInput.value : '').trim();

      // Form validation
      if (!fullName || fullName.length < 2) {
        showFormAlert('Please provide your full name (at least 2 characters).', 'error');
        if (fullNameInput) fullNameInput.focus();
        return;
      }

      if (!roleCompany || roleCompany.length < 2) {
        showFormAlert('Please enter your role, company, or country.', 'error');
        if (roleCompanyInput) roleCompanyInput.focus();
        return;
      }

      if (!reviewText || reviewText.length < 15) {
        showFormAlert('Review description must be at least 15 characters long.', 'error');
        if (reviewTextInput) reviewTextInput.focus();
        return;
      }

      if (reviewText.length > 600) {
        showFormAlert('Review description cannot exceed 600 characters.', 'error');
        if (reviewTextInput) reviewTextInput.focus();
        return;
      }

      // Optimistic New Review Object
      const newId = Date.now();
      const initial = fullName.charAt(0).toUpperCase();
      const gradIdx = (reviewsState.length % 6) + 1;
      const todayStr = new Date().toISOString().split('T')[0];

      const newReview = {
        id: newId,
        full_name: fullName,
        role_company: roleCompany,
        rating: rating,
        review_text: reviewText,
        hidden: false,
        created_at: todayStr,
        avatar_initial: initial,
        avatar_bg: `avatar-grad-${gradIdx}`,
        verified: true
      };

      // Set Loading UI
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnSpinner) submitBtnSpinner.removeAttribute('hidden');

      // 1. Optimistic Update in State & localStorage
      reviewsState.unshift(newReview);
      saveLocalReviews(reviewsState);
      renderReviews();

      // 2. Transmit to server in background
      try {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            role_company: roleCompany,
            rating: rating,
            review_text: reviewText
          })
        });
      } catch (err) {
        // Offline / static deployment: review is already saved in localStorage
      }

      // Reset & Close Modal
      clientReviewForm.reset();
      updateStarRatingUI(5);
      if (charCountVal) charCountVal.textContent = '0';
      if (submitBtn) submitBtn.disabled = false;
      if (submitBtnSpinner) submitBtnSpinner.setAttribute('hidden', '');

      closeModal(reviewSubmitModal);
      showToast('🎉 Thank you! Your review has been published.');
    });
  }

  function showFormAlert(msg, type = 'error') {
    if (!formAlert) return;
    formAlert.textContent = msg;
    formAlert.className = `review-form-alert alert-${type}`;
    formAlert.removeAttribute('hidden');
  }

  // ==========================================
  // SECRET ADMIN MODERATION SYSTEM
  // ==========================================
  function setAdminMode(active) {
    isAdminActive = active;
    if (active) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      if (adminActiveBanner) adminActiveBanner.removeAttribute('hidden');
      if (openAdminModalBtn) openAdminModalBtn.classList.add('admin-unlocked');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      if (adminActiveBanner) adminActiveBanner.setAttribute('hidden', '');
      if (openAdminModalBtn) openAdminModalBtn.classList.remove('admin-unlocked');
    }
    renderReviews();
  }

  // Open Admin Password Modal
  if (openAdminModalBtn) {
    openAdminModalBtn.addEventListener('click', () => {
      if (isAdminActive) {
        // Already active, scroll to banner
        if (adminActiveBanner) adminActiveBanner.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (adminLoginAlert) adminLoginAlert.setAttribute('hidden', '');
      if (adminPasswordInput) adminPasswordInput.value = '';
      openModal(adminLoginModal);
      setTimeout(() => adminPasswordInput && adminPasswordInput.focus(), 150);
    });
  }

  if (closeAdminLoginBtn) {
    closeAdminLoginBtn.addEventListener('click', () => closeModal(adminLoginModal));
  }

  // Toggle Password Visibility Eye Button
  if (togglePassBtn && adminPasswordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = adminPasswordInput.type === 'password';
      adminPasswordInput.type = isPass ? 'text' : 'password';
      const eyeOpen = togglePassBtn.querySelector('.eye-open-icon');
      const eyeClosed = togglePassBtn.querySelector('.eye-closed-icon');
      if (eyeOpen && eyeClosed) {
        eyeOpen.classList.toggle('sr-only', isPass);
        eyeClosed.classList.toggle('sr-only', !isPass);
      }
    });
  }

  // Handle Admin Password Verification
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredPassword = (adminPasswordInput ? adminPasswordInput.value : '').trim();

      const validPasswords = [ADMIN_PASSWORD_STANDARD, ADMIN_PASSWORD_ALT];
      const isCorrect = validPasswords.includes(enteredPassword);

      if (!isCorrect) {
        if (adminLoginAlert) {
          adminLoginAlert.textContent = 'Incorrect admin security password. Please try again.';
          adminLoginAlert.removeAttribute('hidden');
        }
        if (adminPasswordInput) {
          adminPasswordInput.value = '';
          adminPasswordInput.focus();
        }
        return;
      }

      // Success
      closeModal(adminLoginModal);
      setAdminMode(true);
      showToast('🛡️ Admin Mode Activated! You can now Hide/Unhide or Delete reviews.');

      // Refresh from server in case server has hidden reviews
      await fetchReviewsFromServer();
    });
  }

  // Exit Admin Mode Button
  if (exitAdminModeBtn) {
    exitAdminModeBtn.addEventListener('click', () => {
      setAdminMode(false);
      showToast('🔒 Exited Admin Mode. Regular visitor view restored.');
    });
  }

  // Toggle Hide / Unhide Action
  async function handleToggleHideReview(id) {
    const idx = reviewsState.findIndex(r => String(r.id) === String(id));
    if (idx === -1) return;

    reviewsState[idx].hidden = !reviewsState[idx].hidden;
    saveLocalReviews(reviewsState);
    renderReviews();

    const isNowHidden = reviewsState[idx].hidden;
    showToast(isNowHidden ? '🔒 Review is now hidden from public visitors.' : '👁️ Review is now visible to the public.');

    // Sync with server if running
    try {
      await fetch('/api/reviews/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: ADMIN_PASSWORD_STANDARD,
          action: 'toggle_hide',
          id: id
        })
      });
    } catch (err) {
      // Handled locally
    }
  }

  // Delete Review Action
  async function handleDeleteReview(id) {
    reviewsState = reviewsState.filter(r => String(r.id) !== String(id));
    saveLocalReviews(reviewsState);
    renderReviews();

    showToast('🗑️ Review permanently deleted.');

    // Sync with server if running
    try {
      await fetch('/api/reviews/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: ADMIN_PASSWORD_STANDARD,
          action: 'delete',
          id: id
        })
      });
    } catch (err) {
      // Handled locally
    }
  }

  // ==========================================
  // FILTER TABS
  // ==========================================
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter') || 'all';
      renderReviews();
    });
  });

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    // Check if admin session was previously unlocked in this browser tab
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
      setAdminMode(true);
    }

    // Load initial reviews & render
    reviewsState = loadLocalReviews();
    renderReviews();

    // Fetch latest from server
    fetchReviewsFromServer();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
