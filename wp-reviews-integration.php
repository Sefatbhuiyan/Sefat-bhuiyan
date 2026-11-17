<?php
/**
 * Plugin Name: Sefat Bhuiyan — Client Reviews & Moderation System
 * Description: High-performance, 3D interactive Client Reviews & Secret Admin Moderation System for WordPress.
 * Version: 2.0.0
 * Author: Sefat Bhuiyan
 * Text Domain: sefat-reviews
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class SefatReviewsSystem {

    const OPTION_KEY = 'sefat_portfolio_reviews_data';
    const ADMIN_PASSWORD_HASH = '$2y$10$eO...'; // Or verified via wp_check_password / custom constant
    const DEFAULT_PASS = 'Sefat@Admin2026';

    public function __construct() {
        add_action('init', [$this, 'init_default_reviews']);
        
        // Public & Admin AJAX Submissions
        add_action('wp_ajax_nopriv_sefat_submit_review', [$this, 'ajax_submit_review']);
        add_action('wp_ajax_sefat_submit_review', [$this, 'ajax_submit_review']);
        
        // Admin Moderation AJAX Actions
        add_action('wp_ajax_nopriv_sefat_moderate_review', [$this, 'ajax_moderate_review']);
        add_action('wp_ajax_sefat_moderate_review', [$this, 'ajax_moderate_review']);

        // Public reviews retrieval
        add_action('wp_ajax_nopriv_sefat_get_reviews', [$this, 'ajax_get_reviews']);
        add_action('wp_ajax_sefat_get_reviews', [$this, 'ajax_get_reviews']);

        // WordPress Dashboard Admin Menu
        add_action('admin_menu', [$this, 'register_admin_menu']);
        add_action('admin_post_sefat_admin_action', [$this, 'handle_dashboard_actions']);
    }

    /**
     * Seed initial reviews if empty
     */
    public function init_default_reviews() {
        if (false === get_option(self::OPTION_KEY)) {
            $seeds = [
                [
                    'id' => 101,
                    'full_name' => 'Sarah Jenkins',
                    'role_company' => 'Head of Growth @ AlphaBrand UK',
                    'rating' => 5,
                    'review_text' => "Sefat's digital marketing strategy completely transformed our Meta Ads ROAS from 1.8x to over 4.2x in under 60 days. His visual creativity combined with technical audience targeting is world-class.",
                    'hidden' => false,
                    'created_at' => '2026-11-12',
                    'avatar_initial' => 'S',
                    'avatar_bg' => 'avatar-grad-1',
                    'verified' => true
                ],
                [
                    'id' => 102,
                    'full_name' => 'তানভীর আহমেদ',
                    'role_company' => 'Founder & CEO @ TechBazaar BD',
                    'rating' => 5,
                    'review_text' => 'অসাধারণ কাজ! ফেসবুক এবং ইন্সটাগ্রাম পেইজের ব্র্যান্ডিং ও অ্যাড ক্যাম্পেইনের জন্য সিফাত ভাইয়ের কোনো তুলনা হয় না। আমাদের সেলস দ্বিগুণেরও বেশি বৃদ্ধি পেয়েছে।',
                    'hidden' => false,
                    'created_at' => '2026-11-08',
                    'avatar_initial' => 'ত',
                    'avatar_bg' => 'avatar-grad-2',
                    'verified' => true
                ],
                [
                    'id' => 103,
                    'full_name' => 'Marcus Vance',
                    'role_company' => 'Creative Director @ Vance Studio, USA',
                    'rating' => 5,
                    'review_text' => 'Exceptional graphic design skills! He crafted a comprehensive set of social banners, carousel ads, and brand assets with speed, precision, and modern aesthetic elegance. Highly recommended!',
                    'hidden' => false,
                    'created_at' => '2026-10-29',
                    'avatar_initial' => 'M',
                    'avatar_bg' => 'avatar-grad-3',
                    'verified' => true
                ],
                [
                    'id' => 104,
                    'full_name' => 'عمر الخالد (Omar Al-Khaled)',
                    'role_company' => 'E-commerce Director, Dubai, UAE',
                    'rating' => 5,
                    'review_text' => 'تجربة ممتازة واحترافية عالية في تصميم الإعلانات وإدارة الحملات الممولة. زادت مبيعات المتجر بشكل ملحوظ خلال أول شهر. شكراً سيفات!',
                    'hidden' => false,
                    'created_at' => '2026-10-18',
                    'avatar_initial' => 'ع',
                    'avatar_bg' => 'avatar-grad-4',
                    'verified' => true
                ],
                [
                    'id' => 105,
                    'full_name' => 'Elena Rostova',
                    'role_company' => 'Brand Strategist @ DigitalWave EU',
                    'rating' => 4,
                    'review_text' => 'Fast turnaround and brilliant attention to detail. Sefat provided creative variations and revisions until everything looked flawless. A true professional.',
                    'hidden' => false,
                    'created_at' => '2026-10-05',
                    'avatar_initial' => 'E',
                    'avatar_bg' => 'avatar-grad-5',
                    'verified' => true
                ],
                [
                    'id' => 106,
                    'full_name' => 'মাহমুদুল হাসান',
                    'role_company' => 'Marketing Lead @ Apex Lifestyle',
                    'rating' => 5,
                    'review_text' => 'ডিজাইন সেন্স এবং আধুনিক ট্রেন্ড বোঝার ক্ষমতা সিফাত ভাইয়ের দারুণ। প্রতিটি ডেলিভারি সময়মতো পেয়েছি এবং ক্লায়েন্ট রেসপন্স ছিল অবিশ্বাস্য!',
                    'hidden' => false,
                    'created_at' => '2026-09-22',
                    'avatar_initial' => 'ম',
                    'avatar_bg' => 'avatar-grad-6',
                    'verified' => true
                ]
            ];
            update_option(self::OPTION_KEY, $seeds);
        }
    }

    /**
     * Get reviews list helper
     */
    public function get_reviews($include_hidden = false) {
        $reviews = get_option(self::OPTION_KEY, []);
        if (!is_array($reviews)) $reviews = [];
        if (!$include_hidden) {
            $reviews = array_values(array_filter($reviews, function($r) {
                return empty($r['hidden']);
            }));
        }
        return $reviews;
    }

    /**
     * AJAX: Get Reviews
     */
    public function ajax_get_reviews() {
        $is_admin = !empty($_REQUEST['admin_pass']) && $this->verify_admin_password($_REQUEST['admin_pass']);
        $reviews = $this->get_reviews($is_admin);
        
        $total = count($reviews);
        $sum = array_reduce($reviews, function($acc, $r) { return $acc + (int)$r['rating']; }, 0);
        $avg = $total > 0 ? round($sum / $total, 1) : 5.0;

        wp_send_json_success([
            'reviews' => $reviews,
            'stats' => [
                'totalApproved' => $total,
                'averageRating' => $avg
            ],
            'isAdmin' => $is_admin
        ]);
    }

    /**
     * AJAX: Submit Review
     */
    public function ajax_submit_review() {
        $full_name = sanitize_text_field($_POST['full_name'] ?? '');
        $role_company = sanitize_text_field($_POST['role_company'] ?? '');
        $rating = intval($_POST['rating'] ?? 5);
        $review_text = sanitize_textarea_field($_POST['review_text'] ?? '');

        if (mb_strlen($full_name) < 2 || mb_strlen($full_name) > 80) {
            wp_send_json_error(['error' => 'Full Name is required (2-80 characters).']);
        }
        if (mb_strlen($role_company) < 2 || mb_strlen($role_company) > 100) {
            wp_send_json_error(['error' => 'Role / Company / Country is required (2-100 characters).']);
        }
        if ($rating < 1 || $rating > 5) {
            wp_send_json_error(['error' => 'Rating must be between 1 and 5.']);
        }
        if (mb_strlen($review_text) < 15 || mb_strlen($review_text) > 600) {
            wp_send_json_error(['error' => 'Review description must be between 15 and 600 characters.']);
        }

        $reviews = get_option(self::OPTION_KEY, []);
        $new_id = !empty($reviews) ? max(array_column($reviews, 'id')) + 1 : 101;
        $initial = mb_strtoupper(mb_substr(trim($full_name), 0, 1));
        $grad_idx = (count($reviews) % 6) + 1;

        $new_review = [
            'id' => $new_id,
            'full_name' => $full_name,
            'role_company' => $role_company,
            'rating' => $rating,
            'review_text' => $review_text,
            'hidden' => false,
            'created_at' => current_time('Y-m-d'),
            'avatar_initial' => $initial,
            'avatar_bg' => 'avatar-grad-' . $grad_idx,
            'verified' => true
        ];

        array_unshift($reviews, $new_review);
        update_option(self::OPTION_KEY, $reviews);

        wp_send_json_success([
            'message' => 'Review published successfully!',
            'review' => $new_review
        ]);
    }

    /**
     * AJAX: Moderate Review (toggle_hide / delete)
     */
    public function ajax_moderate_review() {
        $password = $_POST['password'] ?? '';
        $action = sanitize_key($_POST['action_type'] ?? '');
        $id = intval($_POST['id'] ?? 0);

        if (!$this->verify_admin_password($password)) {
            wp_send_json_error(['error' => 'Invalid administrative security password.']);
        }

        $reviews = get_option(self::OPTION_KEY, []);
        $found_index = -1;
        foreach ($reviews as $idx => $r) {
            if ((int)$r['id'] === $id) {
                $found_index = $idx;
                break;
            }
        }

        if ($found_index === -1) {
            wp_send_json_error(['error' => 'Review not found.']);
        }

        if ($action === 'toggle_hide') {
            $reviews[$found_index]['hidden'] = !empty($reviews[$found_index]['hidden']) ? false : true;
            update_option(self::OPTION_KEY, $reviews);
            wp_send_json_success([
                'action' => 'toggle_hide',
                'review' => $reviews[$found_index],
                'message' => $reviews[$found_index]['hidden'] ? 'Review hidden from public.' : 'Review unhidden.'
            ]);
        } elseif ($action === 'delete') {
            array_splice($reviews, $found_index, 1);
            update_option(self::OPTION_KEY, $reviews);
            wp_send_json_success([
                'action' => 'delete',
                'id' => $id,
                'message' => 'Review permanently deleted.'
            ]);
        }

        wp_send_json_error(['error' => 'Unknown action.']);
    }

    /**
     * Verify Admin Security Password
     */
    private function verify_admin_password($pass) {
        if (current_user_can('manage_options')) return true;
        $allowed = [self::DEFAULT_PASS, self::DEFAULT_PASS . '!'];
        if (defined('SEFAT_ADMIN_PASSWORD')) $allowed[] = SEFAT_ADMIN_PASSWORD;
        return in_array(trim($pass), $allowed, true);
    }

    /**
     * Register Admin Dashboard Menu Page
     */
    public function register_admin_menu() {
        add_menu_page(
            __('Client Reviews', 'sefat-reviews'),
            __('Client Reviews', 'sefat-reviews'),
            'manage_options',
            'sefat-client-reviews',
            [$this, 'render_admin_dashboard_page'],
            'dashicons-star-filled',
            26
        );
    }

    /**
     * Render WP Dashboard Page
     */
    public function render_admin_dashboard_page() {
        $reviews = $this->get_reviews(true);
        ?>
        <div class="wrap">
            <h1><span class="dashicons dashicons-star-filled" style="color:#facc15;font-size:28px;margin-right:8px;"></span> Client Reviews &amp; Moderation</h1>
            <p>Manage, hide/unhide, or delete portfolio client reviews directly from WordPress.</p>
            
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th width="60">ID</th>
                        <th width="180">Client Name</th>
                        <th width="200">Role / Company</th>
                        <th width="100">Rating</th>
                        <th>Review Content</th>
                        <th width="110">Date</th>
                        <th width="120">Status</th>
                        <th width="160">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($reviews)): ?>
                        <tr><td colspan="8">No client reviews found.</td></tr>
                    <?php else: foreach ($reviews as $r): ?>
                        <tr>
                            <td>#<?php echo esc_html($r['id']); ?></td>
                            <td><strong><?php echo esc_html($r['full_name']); ?></strong></td>
                            <td><?php echo esc_html($r['role_company']); ?></td>
                            <td><span style="color:#f59e0b;font-weight:bold;"><?php echo str_repeat('★', (int)$r['rating']); ?></span> (<?php echo esc_html($r['rating']); ?>)</td>
                            <td><?php echo nl2br(esc_html($r['review_text'])); ?></td>
                            <td><?php echo esc_html($r['created_at']); ?></td>
                            <td>
                                <?php if (!empty($r['hidden'])): ?>
                                    <span class="dashicons dashicons-hidden" style="color:#ef4444;"></span> <span style="color:#ef4444;font-weight:bold;">Hidden</span>
                                <?php else: ?>
                                    <span class="dashicons dashicons-visibility" style="color:#10b981;"></span> <span style="color:#10b981;font-weight:bold;">Public</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <a href="<?php echo wp_nonce_url(admin_url('admin-post.php?action=sefat_admin_action&do=toggle_hide&id=' . $r['id']), 'sefat_review_action'); ?>" class="button button-small">
                                    <?php echo !empty($r['hidden']) ? 'Unhide' : 'Hide'; ?>
                                </a>
                                <a href="<?php echo wp_nonce_url(admin_url('admin-post.php?action=sefat_admin_action&do=delete&id=' . $r['id']), 'sefat_review_action'); ?>" class="button button-small button-link-delete" onclick="return confirm('Permanently delete this review?');" style="color:#dc2626;">
                                    Delete
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    /**
     * Handle WP Dashboard direct actions
     */
    public function handle_dashboard_actions() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        check_admin_referer('sefat_review_action');

        $do = sanitize_key($_GET['do'] ?? '');
        $id = intval($_GET['id'] ?? 0);
        $reviews = get_option(self::OPTION_KEY, []);

        foreach ($reviews as $idx => $r) {
            if ((int)$r['id'] === $id) {
                if ($do === 'toggle_hide') {
                    $reviews[$idx]['hidden'] = empty($reviews[$idx]['hidden']);
                } elseif ($do === 'delete') {
                    array_splice($reviews, $idx, 1);
                }
                break;
            }
        }

        update_option(self::OPTION_KEY, $reviews);
        wp_safe_redirect(admin_url('admin.php?page=sefat-client-reviews'));
        exit;
    }
}

new SefatReviewsSystem();
