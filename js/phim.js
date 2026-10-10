document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('name');
    if (!slug) return;

    // ============================================================
    // ============================================================
    const playerIframe   = document.getElementById('player-iframe');
    const playerTitle    = document.getElementById('player-title');
    const serverTabs     = document.getElementById('server-tabs');
    const episodeList    = document.getElementById('episode-list');
    const filmPoster     = document.getElementById('film-poster');
    const filmName       = document.getElementById('film-name');
    const filmOriginal   = document.getElementById('film-original-name');
    const filmDesc       = document.getElementById('film-desc');
    const filmDetails    = document.getElementById('film-details').querySelector('tbody');
    const btnPrev        = document.getElementById('btn-prev');
    const btnNext        = document.getElementById('btn-next');
    const btnDark        = document.getElementById('btn-dark');
    const btnReport      = document.getElementById('btn-report');
    const btnReload      = document.getElementById('btn-reload');
    const overlayDark    = document.getElementById('overlay-dark');

    let episodes = [];    
    let currentEpIndex = 0;
    let currentServer = 0;
    let allServers = []; 
    let isDark = false;

    // ============================================================
    // ============================================================
    let movie;
    try {
        const res = await fetch(`/api/config.php?action=film-detail&slug=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error('Loi');
        const data = await res.json();
        movie = data.movie;
    } catch (e) {
        playerTitle.textContent = 'Không thể tải thông tin phim.';
        return;
    }

    document.title = `${movie.name} | Xem phim`;

    // ============================================================
    // ============================================================
    filmPoster.src = movie.thumb_url;
    filmPoster.alt = movie.name;
    filmName.textContent = movie.name;
    filmOriginal.textContent = movie.original_name || '';
    filmDesc.textContent = movie.description || '';

    const details = [
        ['Trạng thái',  movie.current_episode],
        ['Số tập',      movie.total_episodes],
        ['Thời lượng',  movie.time],
        ['Chất lượng',  movie.quality],
        ['Ngôn ngữ',    movie.language],
    ];

    if (movie.category) {
        Object.values(movie.category).forEach(cat => {
            const names = cat.list.map(i => i.name).join(', ');
            details.push([cat.group.name, names]);
        });
    }

    filmDetails.innerHTML = details
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td class="detail-label">${k}</td><td>${v}</td></tr>`)
        .join('');

    // ============================================================
    // ============================================================
    allServers = movie.episodes || [];

    const selectServer = (serverIdx) => {
        currentServer = serverIdx;
        episodes = allServers[serverIdx]?.items || [];

        document.querySelectorAll('.server-tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === serverIdx);
        });

        episodeList.innerHTML = '';
        episodes.forEach((ep, idx) => {
            const btn = document.createElement('button');
            btn.className = 'ep-btn';
            btn.textContent = `Tập ${ep.name}`;
            btn.addEventListener('click', () => selectEpisode(idx));
            episodeList.appendChild(btn);
        });

        if (episodes.length > 0) selectEpisode(0);
    };

    const selectEpisode = (idx) => {
        currentEpIndex = idx;
        const ep = episodes[idx];
        if (!ep) return;

        const url = new URL(window.location.href);
        url.searchParams.set('ep', ep.slug);
        history.pushState({}, '', url);

        playerIframe.src = ep.embed;
        playerTitle.textContent = `${movie.name} — Tập ${ep.name}`;
        document.title = `Tập ${ep.name} | ${movie.name}`;

        document.querySelectorAll('.ep-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === idx);
        });

        btnPrev.disabled = idx === 0;
        btnNext.disabled = idx === episodes.length - 1;
    };

    allServers.forEach((server, idx) => {
        const tab = document.createElement('button');
        tab.className = 'server-tab';
        tab.textContent = server.server_name;
        tab.addEventListener('click', () => selectServer(idx));
        serverTabs.appendChild(tab);
    });

    if (allServers.length > 0) selectServer(0);
    const epSlug = params.get('ep');
    if (epSlug) {
        const epIdx = episodes.findIndex(e => e.slug === epSlug);
        if (epIdx !== -1) selectEpisode(epIdx);
    }

    // ============================================================
    // ============================================================
    btnPrev.addEventListener('click', () => {
        if (currentEpIndex > 0) selectEpisode(currentEpIndex - 1);
    });

    btnNext.addEventListener('click', () => {
        if (currentEpIndex < episodes.length - 1) selectEpisode(currentEpIndex + 1);
    });

    btnDark.addEventListener('click', () => {
        isDark = !isDark;
        overlayDark.classList.toggle('active', isDark);
        btnDark.classList.toggle('active', isDark);
        btnDark.querySelector('span').textContent = isDark ? 'Bật đèn' : 'Tắt đèn';
        btnDark.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });

    overlayDark.addEventListener('click', () => {
        isDark = false;
        overlayDark.classList.remove('active');
        btnDark.classList.remove('active');
        btnDark.querySelector('span').textContent = 'Tắt đèn';
        btnDark.querySelector('i').className = 'fa-solid fa-moon';
    });

    btnReport.addEventListener('click', () => {
        window.location.href = '/gioi-thieu.php';
    });

    btnReload.addEventListener('click', () => {
        const src = playerIframe.src;
        playerIframe.src = '';
        setTimeout(() => { playerIframe.src = src; }, 200);
    });
});