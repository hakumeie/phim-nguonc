<header>
    <div class="header-container">
        <div class="logo"><a href="/">NgUoNC</a></div>
        <div class="search">
            <div class="search-input">
                <input id="search-input" placeholder="Tìm kiếm phim..." />
                <button id="search-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <button class="hamburger" id="open-drawer"><i class="fa-solid fa-bars"></i></button>
        </div>
    </div>
</header>

<aside class="drawer" id="drawer" inert>
    <div class="drawer-header">
    <strong>Menu</strong>
    <button id="close-drawer">✕</button>
    </div>
    <nav class="drawer-nav">
        <ul>
            <li><a href="danh-sach.php?type=tv-shows">TV shows</a></li>
            <li><a href="danh-sach.php?type=phim-le">Phim lẻ</a></li>
            <li><a href="danh-sach.php?type=phim-bo">Phim bộ</a></li>
            <li><a href="danh-sach.php?type=dang-chieu">Đang chiếu</a></li>
            <li class="accordion-group">
                <button class="accordion" data-target="genres">Thể loại</button>
                <div class="panel" id="genres"></div>
            </li>
            <li class="accordion-group">
                <button class="accordion" data-target="countries">Quốc gia</button>
                <div class="panel" id="countries"></div>
            </li>
            <li class="accordion-group">
                <button class="accordion" data-target="years">Năm</button>
                <div class="panel" id="years"></div>
            </li>
            <li><a href="gioi-thieu.php">Giới thiệu</a></li>
        </ul>
    </nav>
</aside>
<div id="overlay" class="overlay"></div>