<?php require_once 'includes/auth.php'; ?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <?php include 'includes/head.php'; ?>
    <title>About me</title>
    <style>
        .container {
            color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-sizing: border-box;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }
        h2 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
        }
        p {
            text-align: left;
            line-height: 1.6;
            color: #cccccc;
        }
        .container ul {
            list-style: none;
            padding: 0;
            width: 100%;
        }
        .container ul li {
            margin-bottom: 1.5rem;
            padding: 2rem;
            border: 3px solid #ffffff;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <main class="container">
        <h2>Giới thiệu về KAI3Z</h2>
        <ul>
            <li>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;KAI3Z hoạt động như một nền tảng trung gian kết nối dữ liệu từ bên thứ ba, cam kết không lưu trữ dữ liệu vi phạm bản quyền trên máy chủ của mình.</p><br>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;Mọi vấn đề liên quan xin liên hệ</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;tele: @hqdkai3z</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;mail: meww3004@gmail.com</p>
            </li>
        </ul>
    </main>
    <?php include 'includes/footer.php'; ?>
</body>
</html>