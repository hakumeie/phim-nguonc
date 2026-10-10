<?php
session_start();
 
if (isset($_GET['login']) && isset($_GET['pass'])) {
    if ($_GET['login'] === 'Kaiyou' && $_GET['pass'] === '1') {
        $_SESSION['auth'] = true;
        header('Location: /');
        exit;
    }
}
 
if (empty($_SESSION['auth'])) {
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cảnh báo</title>
</head>
<body cz-shortcut-listen="true">
    <div style="text-align: center">
        BỘ CÔNG AN<br>
        <b>CỤC AN NINH MẠNG VÀ PHÒNG CHỐNG TỘI PHẠM SỬ DỤNG CÔNG NGHỆ CAO</b>
    </div>
    <div style="text-align: center;">
        <img src="logomin.jpg" alt="Logo">
    </div>
    <div style="text-align: center; font-size: 25px; padding-top: 20px; font-weight: bold;">
        CẢNH BÁO
    </div>
    <div style="text-align: center; font-size: 18px; padding-top: 5px;">
        Việc tham gia đánh bạc là hành vi vi phạm pháp luật,
        <br>
        quy định tại Điều 321, Điều 322 - Bộ luật Hình sự 2015 (SĐBS 2017) nước Cộng hòa Xã hội chủ nghĩa Việt Nam
    </div>
    <div style="text-align: center; font-size: 18px; padding-top: 10px;">
        Cơ quan công an sẽ lưu lại log truy cập này để tập hợp xử lý!
    </div>
    <div style="text-align: center; font-size: 15px; padding-top: 30px;">
        Mọi thông tin tố giác tội phạm có liên quan xin gửi về:
        <br>
        Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao, Lô E2, Dương Đình Nghệ, Cầu Giấy, Hà Nội.
    </div>

<div style="text-align: center; font-size: 15px; padding-top: 5px;">
<img alt="" src="http://www.wieistmeineip.de/ip-address">
</div>
</body>
</html>
<?php
    exit;
}
// Đã đăng nhập → hiện web thật
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <?php include 'includes/head.php'; ?>
    <title>Trang chủ | Phim mới</title>
    <link rel="stylesheet" href="styles/list.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <main class="container">
        <section class="lists" id="lists">
            <h3>Phim mới cập nhật</h3>
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
    <script src="js/phim-moi.js"></script>
</body>
</html>