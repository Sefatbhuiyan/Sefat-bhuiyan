const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const JSON_PATH = path.join(DATA_DIR, 'reviews.json');

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
    rating: 5,
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

function initDb() {
  try {
    if (!fs.existsSync(JSON_PATH)) {
      fs.writeFileSync(JSON_PATH, JSON.stringify(DEFAULT_SEEDS, null, 2), 'utf8');
      console.log('✓ Reviews Database initialized with seed data at:', JSON_PATH);
    } else {
      console.log('✓ Reviews Database ready at:', JSON_PATH);
    }
  } catch (err) {
    console.error('Failed to initialize reviews JSON database:', err.message);
  }
}

function readReviews() {
  try {
    if (!fs.existsSync(JSON_PATH)) return DEFAULT_SEEDS;
    const content = fs.readFileSync(JSON_PATH, 'utf8');
    const parsed = JSON.parse(content || '[]');
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SEEDS;
  } catch (err) {
    return DEFAULT_SEEDS;
  }
}

function writeReviews(data) {
  try {
    const tempPath = `${JSON_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, JSON_PATH);
    return true;
  } catch (err) {
    console.error('Error writing reviews:', err);
    return false;
  }
}

function getApprovedReviews(isAdmin = false) {
  const all = readReviews();
  if (isAdmin) return all;
  return all.filter(r => !r.hidden);
}

function getReviewStats() {
  const publicReviews = getApprovedReviews(false);
  const total = publicReviews.length;
  if (total === 0) {
    return {
      totalApproved: 0,
      averageRating: 5.0,
      fiveStarCount: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
  const sum = publicReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
  const avg = (sum / total).toFixed(1);
  const fiveStars = publicReviews.filter(r => Number(r.rating) === 5).length;
  const fourStars = publicReviews.filter(r => Number(r.rating) === 4).length;

  return {
    totalApproved: total,
    averageRating: parseFloat(avg),
    fiveStarCount: fiveStars,
    fourStarCount: fourStars
  };
}

function createReview({ full_name, role_company, rating, review_text }) {
  const list = readReviews();
  const newId = list.length > 0 ? Math.max(...list.map(r => Number(r.id) || 0)) + 1 : 101;
  const initial = (full_name || 'C').trim().charAt(0).toUpperCase();
  const gradIndex = (list.length % 6) + 1;
  const now = new Date().toISOString().split('T')[0];

  const review = {
    id: newId,
    full_name: full_name.trim(),
    role_company: (role_company || 'Verified Client').trim(),
    rating: Number(rating) || 5,
    review_text: review_text.trim(),
    hidden: false,
    created_at: now,
    avatar_initial: initial,
    avatar_bg: `avatar-grad-${gradIndex}`,
    verified: true
  };

  list.unshift(review);
  writeReviews(list);
  return review;
}

function toggleHide(id) {
  const list = readReviews();
  const idx = list.findIndex(r => String(r.id) === String(id));
  if (idx === -1) return null;
  list[idx].hidden = !list[idx].hidden;
  writeReviews(list);
  return list[idx];
}

function deleteReview(id) {
  const list = readReviews();
  const filtered = list.filter(r => String(r.id) !== String(id));
  if (filtered.length === list.length) return false;
  writeReviews(filtered);
  return true;
}

module.exports = {
  initDb,
  readReviews,
  getApprovedReviews,
  getReviewStats,
  createReview,
  toggleHide,
  deleteReview
};
