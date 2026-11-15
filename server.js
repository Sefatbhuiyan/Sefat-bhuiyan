const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./reviews-db');

// Initialize reviews database on server start
db.initDb();

const PORT = process.env.PORT || 8000;
const ROOT_DIR = __dirname;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Sefat@Admin2026!';
const JWT_SECRET = process.env.JWT_SECRET || 'sefat-portfolio-secret-key-2026-secure';

// In-Memory Rate Limiting
const rateLimitMap = new Map();
function isRateLimited(key, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }
  record.count++;
  rateLimitMap.set(key, record);
  return record.count > maxRequests;
}

// Security: Simple Signed Admin Tokens
function generateAdminToken() {
  const payload = {
    role: 'admin',
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [data, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  if (sig !== expectedSig) return false;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) return false;
    return payload.role === 'admin';
  } catch (e) {
    return false;
  }
}

// XSS Sanitization Helper
function sanitizeInput(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Parse JSON Body Helper
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { // 1MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', err => reject(err));
  });
}

// Send JSON Helper
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(JSON.stringify(data));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const clientIp = req.socket.remoteAddress || 'unknown-ip';

  // ==========================================
  // API ROUTE 1: GET /api/reviews (Public approved only)
  // ==========================================
  if (pathname === '/api/reviews' && req.method === 'GET') {
    try {
      const reviews = db.getApprovedReviews();
      const stats = db.getReviewStats();
      return sendJson(res, 200, {
        success: true,
        reviews,
        stats
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: 'Failed to retrieve reviews.' });
    }
  }

  // ==========================================
  // API ROUTE 2: POST /api/reviews (Public review submission)
  // ==========================================
  if (pathname === '/api/reviews' && req.method === 'POST') {
    if (isRateLimited(`submit-${clientIp}`, 5, 10 * 60 * 1000)) {
      return sendJson(res, 429, {
        success: false,
        error: 'Too many submissions from this device. Please wait a few minutes before submitting another review.'
      });
    }

    try {
      const body = await parseJsonBody(req);
      const { full_name, email, phone_number, rating, review_text, consent, language } = body;

      // Validation
      if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2 || full_name.trim().length > 80) {
        return sendJson(res, 400, { success: false, error: 'Full name is required (2–80 characters).' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.length > 120) {
        return sendJson(res, 400, { success: false, error: 'A valid email address is required.' });
      }

      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phone_number || typeof phone_number !== 'string' || !phoneRegex.test(phone_number.trim())) {
        return sendJson(res, 400, { success: false, error: 'A valid international phone number is required (7–25 digits).' });
      }

      const numRating = Number(rating);
      if (!numRating || numRating < 1 || numRating > 5 || !Number.isInteger(numRating)) {
        return sendJson(res, 400, { success: false, error: 'Please select a star rating between 1 and 5.' });
      }

      if (!review_text || typeof review_text !== 'string' || review_text.trim().length < 10 || review_text.trim().length > 1500) {
        return sendJson(res, 400, { success: false, error: 'Review text must be between 10 and 1,500 characters.' });
      }

      if (!consent) {
        return sendJson(res, 400, { success: false, error: 'You must agree to the privacy consent to submit.' });
      }

      // Sanitize inputs
      const cleanName = sanitizeInput(full_name.trim());
      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phone_number.trim();
      const cleanText = sanitizeInput(review_text.trim());
      const cleanLang = sanitizeInput((language || 'en').trim());

      const created = db.createReview({
        full_name: cleanName,
        email: cleanEmail,
        phone_number: cleanPhone,
        rating: numRating,
        review_text: cleanText,
        language: cleanLang
      });

      return sendJson(res, 201, {
        success: true,
        message: 'Thank you for sharing your experience! Your review has been submitted successfully and will appear publicly once approved by the administrator.',
        id: created.id
      });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message || 'Submission failed.' });
    }
  }

  // ==========================================
  // API ROUTE 3: POST /api/admin/login
  // ==========================================
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    if (isRateLimited(`login-${clientIp}`, 5, 15 * 60 * 1000)) {
      return sendJson(res, 429, {
        success: false,
        error: 'Too many failed login attempts. Please wait 15 minutes before trying again.'
      });
    }

    try {
      const body = await parseJsonBody(req);
      const { password } = body;

      if (!password || password !== ADMIN_PASSWORD) {
        return sendJson(res, 401, { success: false, error: 'Invalid admin credentials.' });
      }

      const token = generateAdminToken();
      return sendJson(res, 200, {
        success: true,
        token,
        message: 'Authentication successful.'
      });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: 'Login request failed.' });
    }
  }

  // ==========================================
  // API ROUTE 4: GET /api/admin/reviews (Protected)
  // ==========================================
  if (pathname === '/api/admin/reviews' && req.method === 'GET') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!verifyAdminToken(token)) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized: Admin authentication required.' });
    }

    try {
      const filter = urlObj.searchParams.get('status') || 'all';
      const data = db.getAllReviewsAdmin(filter);
      return sendJson(res, 200, {
        success: true,
        ...data
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: 'Failed to retrieve admin reviews.' });
    }
  }

  // ==========================================
  // API ROUTE 5: PATCH /api/admin/reviews/:id (Protected)
  // ==========================================
  if (pathname.startsWith('/api/admin/reviews/') && req.method === 'PATCH') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!verifyAdminToken(token)) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized: Admin authentication required.' });
    }

    const reviewId = pathname.replace('/api/admin/reviews/', '').split('/')[0];
    try {
      const body = await parseJsonBody(req);
      const { status } = body;

      if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
        return sendJson(res, 400, { success: false, error: 'Invalid status. Allowed: approved, rejected, pending.' });
      }

      const updated = db.updateReviewStatus(reviewId, status);
      if (!updated) {
        return sendJson(res, 404, { success: false, error: 'Review not found.' });
      }

      return sendJson(res, 200, {
        success: true,
        message: `Review #${reviewId} has been marked as ${status}.`,
        review: updated
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message || 'Failed to update review status.' });
    }
  }

  // ==========================================
  // API ROUTE 6: DELETE /api/admin/reviews/:id (Protected)
  // ==========================================
  if (pathname.startsWith('/api/admin/reviews/') && req.method === 'DELETE') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!verifyAdminToken(token)) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized: Admin authentication required.' });
    }

    const reviewId = pathname.replace('/api/admin/reviews/', '').split('/')[0];
    try {
      const success = db.deleteReview(reviewId);
      return sendJson(res, 200, {
        success: true,
        message: `Review #${reviewId} was permanently deleted.`
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: 'Failed to delete review.' });
    }
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support HTTP Range Requests for smooth HTML5 video streaming
    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      });
      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`🚀 Sefat Bhuiyan Portfolio Server is Live!`);
  console.log(`🔗 Local URL:    http://localhost:${PORT}`);
  console.log(`🔗 Network URL:  http://127.0.0.1:${PORT}`);
  console.log(`🔒 Admin Auth:   Protected endpoint active`);
  console.log(`========================================\n`);
});
