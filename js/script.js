document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('dragstart', event => event.preventDefault());
document.addEventListener('keydown', event => {
    if (event.ctrlKey && (event.key === 'c' || event.key === 'x' || event.key === 'u' || event.key === 's')) {
        event.preventDefault();
    }
});

// =========================================================================
// =========================================================================

document.getElementById('search-btn').addEventListener('click', () => {
    const input = document.getElementById('search-input');
    if (window.innerWidth <= 440) {
        const currentDisplay = window.getComputedStyle(input).display;
        input.style.display = (currentDisplay === 'none') ? 'block' : 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');
    const openBtn = document.getElementById('open-drawer');
    const closeBtn = document.getElementById('close-drawer');

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('active');
        drawer.removeAttribute('inert');
        document.body.style.overflow = 'hidden';
        closeBtn?.focus();
    }

    function closeDrawer() {
        if (drawer.contains(document.activeElement)) {
            openBtn?.focus();
        }
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        drawer.setAttribute('inert', '');
        document.body.style.overflow = '';
    }

    openBtn?.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    overlay?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeDrawer();
    });
    document.querySelectorAll('.accordion').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = document.getElementById(btn.dataset.target);
            const isOpen = btn.classList.contains('active');

            btn.classList.toggle('active', !isOpen);
            if (panel) {
                panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
            }
        });
    });
});

const GENRES = [
    ["Hành Động", "hanh-dong"],
    ["Phiêu Lưu", "phieu-luu"],
    ["Hoạt Hình", "hoat-hinh"],
    ["Hài", "phim-hai"],
    ["Hình Sự", "hinh-su"],
    ["Tài Liệu", "tai-lieu"],
    ["Chính Kịch", "chinh-kich"],
    ["Gia Đình", "gia-dinh"],
    ["Giả Tưởng", "gia-tuong"],
    ["Lịch Sử", "lich-su"],
    ["Kinh Dị", "kinh-di"],
    ["Nhạc", "phim-nhac"],
    ["Bí Ẩn", "bi-an"],
    ["Lãng Mạn", "lang-man"],
    ["Khoa Học Viễn Tưởng", "khoa-hoc-vien-tuong"],
    ["Gây Cấn", "gay-can"],
    ["Chiến Tranh", "chien-tranh"],
    ["Tâm Lý", "tam-ly"],
    ["Tình Cảm", "tinh-cam"],
    ["Cổ Trang", "co-trang"],
    ["Miền Tây", "mien-tay"],
    ["Phim 18+", "phim-18"]
];
const COUNTRIES = [
    ["Âu Mỹ", "au-my"],
    ["Anh", "anh"],
    ["Trung Quốc", "trung-quoc"],
    ["Indonesia", "indonesia"],
    ["Việt Nam", "viet-nam"],
    ["Pháp", "phap"],
    ["Hồng Kông", "hong-kong"],
    ["Hàn Quốc", "han-quoc"],
    ["Nhật Bản", "nhat-ban"],
    ["Thái Lan", "thai-lan"],
    ["Đài Loan", "dai-loan"],
    ["Nga", "nga"],
    ["Hà Lan", "ha-lan"],
    ["Philippines", "philippines"],
    ["Ấn Độ", "an-do"],
    ["Quốc gia khác", "quoc-gia-khac"]
];
const currentYear = new Date().getFullYear();
const years = Array.from({
    length: currentYear - 2004 + 1
}, (_, i) => 2004 + i).reverse().map(y => [String(y), String(y)]);

function getCategoryUrl(elId, slug) {
    if (elId === 'genres') return `the-loai.php?genre=${encodeURIComponent(slug)}`;
    if (elId === 'countries') return `quoc-gia.php?country=${encodeURIComponent(slug)}`;
    if (elId === 'years') return `nam-phat-hanh.php?year=${encodeURIComponent(slug)}`;
    return '#';
}

function renderList(el, items) {
    if (!el) return;
    el.innerHTML = '';
    items.forEach(([name, slug]) => {
        const a = document.createElement('a');
        a.href = getCategoryUrl(el.id, slug);
        a.textContent = name;
        a.dataset.slug = slug;
        el.appendChild(a);
    });
}
renderList(document.getElementById('genres'), GENRES);
renderList(document.getElementById('countries'), COUNTRIES);
renderList(document.getElementById('years'), years);

// ========================================================================
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const searchWrapper = document.querySelector('.search');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    if (!searchInput || !searchBtn) return;
    const MOBILE_BREAKPOINT = 440;
    const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
    const goSearch = () => {
        const keyword = searchInput.value.trim();
        if (keyword !== '') {
            window.location.href = `/tim-kiem.php?keyword=${encodeURIComponent(keyword)}`;
        }
    };
    searchBtn.addEventListener('click', () => {
        const isVisible = searchWrapper.classList.contains('show-search');
        if (!isMobile() || isVisible) {
            goSearch();
        }
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            goSearch();
        }
    });
});

const SCROLL_FACTOR = 0.5;
 
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    window.scrollBy({
        top: e.deltaY * SCROLL_FACTOR,
        left: e.deltaX * SCROLL_FACTOR,
        behavior: 'auto'
    });
}, { passive: false });