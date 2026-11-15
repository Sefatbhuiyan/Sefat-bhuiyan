const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'reviews.db');
const JSON_BACKUP_PATH = path.join(DATA_DIR, 'reviews.json');

let db = null;
let useJsonFallback = false;

// Initialize Database (SQLite with JSON persistence fallback)
function initDb() {
  try {
    const { DatabaseSync } = require('node:sqlite');
    db = new DatabaseSync(DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        rating INTEGER NOT NULL,
        review_text TEXT NOT NULL,
        language TEXT DEFAULT 'en',
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT DEFAULT (datetime('now', 'localtime'))
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
    `);
    console.log('✓ SQLite Database initialized successfully at:', DB_PATH);
  } catch (err) {
    console.warn('Notice: node:sqlite not available, using atomic JSON database fallback:', err.message);
    useJsonFallback = true;
    if (!fs.existsSync(JSON_BACKUP_PATH)) {
      fs.writeFileSync(JSON_BACKUP_PATH, JSON.stringify([], null, 2), 'utf8');
    }
  }
}

// JSON Fallback Helpers
function readJsonDb() {
  try {
    if (!fs.existsSync(JSON_BACKUP_PATH)) return [];
    const content = fs.readFileSync(JSON_BACKUP_PATH, 'utf8');
    return JSON.parse(content || '[]');
  } catch (e) {
    return [];
  }
}

function writeJsonDb(data) {
  const tempPath = `${JSON_BACKUP_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempPath, JSON_BACKUP_PATH);
}

// 1. Submit a new review (always pending)
function createReview({ full_name, email, phone_number, rating, review_text, language = 'en' }) {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (!useJsonFallback && db) {
    const stmt = db.prepare(`
      INSERT INTO reviews (full_name, email, phone_number, rating, review_text, language, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `);
    const result = stmt.run(full_name, email, phone_number, Number(rating), review_text, language, now, now);
    return {
      id: Number(result.lastInsertRowid),
      full_name,
      rating: Number(rating),
      review_text,
      language,
      status: 'pending',
      created_at: now
    };
  } else {
    const list = readJsonDb();
    const newId = list.length > 0 ? Math.max(...list.map(r => r.id || 0)) + 1 : 1;
    const review = {
      id: newId,
      full_name,
      email,
      phone_number,
      rating: Number(rating),
      review_text,
      language,
      status: 'pending',
      created_at: now,
      updated_at: now
    };
    list.unshift(review);
    writeJsonDb(list);
    return {
      id: newId,
      full_name,
      rating: Number(rating),
      review_text,
      language,
      status: 'pending',
      created_at: now
    };
  }
}

// 2. Get public approved reviews (Strictly omits email and phone)
function getApprovedReviews() {
  if (!useJsonFallback && db) {
    const stmt = db.prepare(`
      SELECT id, full_name, rating, review_text, language, created_at
      FROM reviews
      WHERE status = 'approved'
      ORDER BY id DESC
    `);
    const rows = stmt.all();
    return rows.map(r => ({
      ...r,
      avatar_initial: (r.full_name || 'C').trim().charAt(0).toUpperCase(),
      verified: true
    }));
  } else {
    const list = readJsonDb();
    return list
      .filter(r => r.status === 'approved')
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .map(r => ({
        id: r.id,
        full_name: r.full_name,
        rating: r.rating,
        review_text: r.review_text,
        language: r.language || 'en',
        created_at: r.created_at,
        avatar_initial: (r.full_name || 'C').trim().charAt(0).toUpperCase(),
        verified: true
      }));
  }
}

// 3. Calculate dynamic review statistics (Approved reviews only)
function getReviewStats() {
  const approved = getApprovedReviews();
  const total = approved.length;
  if (total === 0) {
    return {
      totalApproved: 0,
      averageRating: 0.0,
      fiveStarCount: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const sum = approved.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  const avg = (sum / total).toFixed(1);
  const fiveStar = approved.filter(r => Number(r.rating) === 5).length;

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  approved.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    distribution[star] = (distribution[star] || 0) + 1;
  });

  return {
    totalApproved: total,
    averageRating: parseFloat(avg),
    fiveStarCount: fiveStar,
    distribution
  };
}

// 4. Admin: Get all reviews with status & contact details
function getAllReviewsAdmin(filter = 'all') {
  let reviews = [];
  if (!useJsonFallback && db) {
    let query = 'SELECT * FROM reviews';
    if (filter && filter !== 'all') {
      const stmt = db.prepare('SELECT * FROM reviews WHERE status = ? ORDER BY id DESC');
      reviews = stmt.all(filter);
    } else {
      const stmt = db.prepare('SELECT * FROM reviews ORDER BY id DESC');
      reviews = stmt.all();
    }
  } else {
    const list = readJsonDb();
    reviews = list.sort((a, b) => (b.id || 0) - (a.id || 0));
    if (filter && filter !== 'all') {
      reviews = reviews.filter(r => r.status === filter);
    }
  }

  // Calculate admin summary metrics
  const allList = useJsonFallback || !db ? readJsonDb() : db.prepare('SELECT * FROM reviews').all();
  const total = allList.length;
  const pending = allList.filter(r => r.status === 'pending').length;
  const approved = allList.filter(r => r.status === 'approved').length;
  const rejected = allList.filter(r => r.status === 'rejected').length;
  const approvedReviews = allList.filter(r => r.status === 'approved');
  const avg = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + Number(r.rating), 0) / approvedReviews.length).toFixed(1)
    : '0.0';

  return {
    reviews,
    metrics: {
      total,
      pending,
      approved,
      rejected,
      averageRating: parseFloat(avg)
    }
  };
}

// 5. Admin: Update review status ('approved' | 'rejected')
function updateReviewStatus(id, newStatus) {
  const allowed = ['approved', 'rejected', 'pending'];
  if (!allowed.includes(newStatus)) {
    throw new Error('Invalid status. Allowed: ' + allowed.join(', '));
  }
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (!useJsonFallback && db) {
    const stmt = db.prepare('UPDATE reviews SET status = ?, updated_at = ? WHERE id = ?');
    stmt.run(newStatus, now, Number(id));
    const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(Number(id));
    return updated;
  } else {
    const list = readJsonDb();
    const idx = list.findIndex(r => Number(r.id) === Number(id));
    if (idx === -1) return null;
    list[idx].status = newStatus;
    list[idx].updated_at = now;
    writeJsonDb(list);
    return list[idx];
  }
}

// 6. Admin: Delete review
function deleteReview(id) {
  if (!useJsonFallback && db) {
    const stmt = db.prepare('DELETE FROM reviews WHERE id = ?');
    stmt.run(Number(id));
    return true;
  } else {
    const list = readJsonDb();
    const filtered = list.filter(r => Number(r.id) !== Number(id));
    writeJsonDb(filtered);
    return true;
  }
}

module.exports = {
  initDb,
  createReview,
  getApprovedReviews,
  getReviewStats,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview
};

