<?php require_once 'includes/auth.php'; ?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <?php include 'includes/head.php'; ?>
    <title>Đang tải...</title>
    <link rel="stylesheet" href="styles/phim.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <main class="container">
        <div id="player-wrapper">
            <div id="player-title">Đang tải...</div>
            <div id="player-container">
                <iframe id="player-iframe" src="" allowfullscreen allow="autoplay; fullscreen"></iframe>
            </div>

            <div id="player-controls">
                <button id="btn-prev" title="Tập trước">
                    <i class="fa-solid fa-backward-step"></i>
                    <span>Tập Trước</span>
                </button>
                <button id="btn-dark" title="Tắt đèn">
                    <i class="fa-solid fa-moon"></i>
                    <span>Tắt đèn</span>
                </button>
                <button id="btn-next" title="Tập sau">
                    <i class="fa-solid fa-forward-step"></i>
                    <span>Tập Sau</span>
                </button>
                <button id="btn-report" title="Báo lỗi phim">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span>Báo lỗi phim</span>
                </button>
                <button id="btn-reload" title="Tải lại trang">
                    <i class="fa-solid fa-rotate-right"></i>
                    <span>Tải lại trang</span>
                </button>
            </div>
        </div>

        <div id="episodes-wrapper">
            <div id="server-tabs"></div>
            <div id="episode-list"></div>
        </div>

        <div id="film-info">
            <img id="film-poster" src="" alt="">
            <div id="film-meta">
                <h1 id="film-name"></h1>
                <p id="film-original-name"></p>
                <table id="film-details">
                    <tbody></tbody>
                </table>
                <p id="film-desc"></p>
            </div>
        </div>
    </main>

    <div id="overlay-dark"></div>

    <?php include 'includes/footer.php'; ?>
    <script src="js/script.js"></script>
    <script src="js/phim.js"></script>
</body>
</html>