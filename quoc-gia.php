<?php require_once 'includes/auth.php'; ?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <?php include 'includes/head.php'; ?>
    <title>Phim Nhật Bản</title>
    <link rel="stylesheet" href="styles/list.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <main class="container">
        <section class="lists" id="lists">
            <h3>Phim Nhật</h3>
            <div class="grid" id="new-films"></div>
            <div class="pagination" id="pagination"></div>
        </section>
    </main>

    <template id="card-template">
        <a class="card-link" href="">
            <article class="card">
                <img class="thumb" src="" alt="">
                <div class="card-body">
                    <h3 class="card-title"></h3>
                    <p class="card-meta"></p>
                </div>
            </article>
        </a>
    </template>
    <?php include 'includes/footer.php'; ?>
    <script src="js/quoc-gia.js"></script>
</body>
</html>