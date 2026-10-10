<?php
// includes/auth.php
// Include file này ở đầu MỌI trang PHP cần bảo vệ.
// Nếu chưa có session hợp lệ → redirect về trang chủ (scareware).
session_start();
// Kiểm tra query string bí mật để cấp quyền truy cập
if (isset($_GET['login']) && isset($_GET['pass'])) {
    if ($_GET['login'] === 'Kaiyou' && $_GET['pass'] === '1') {
        $_SESSION['auth'] = true;
        // Redirect về trang chủ sạch (bỏ query string khỏi URL)
        header('Location: /');
        exit;
    }
}
// Nếu chưa có session → redirect về trang chủ để hiện scareware
if (empty($_SESSION['auth'])) {
    header('Location: /');
    exit;
}