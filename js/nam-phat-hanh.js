document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('new-films');
    const template = document.getElementById('card-template');
    const paginationContainer = document.getElementById('pagination');
    if (!gridContainer || !template) return;
    const params = new URLSearchParams(window.location.search);
    const year = params.get('year');
    if (!year) return;
    const ITEMS_PER_VIRTUAL_PAGE_MULTIPLIER = 2;
    const getPageFromURL = () => {
        const p = Number(params.get('page'));
        return p && p > 0 ? p : 1;
    };

    let page = getPageFromURL();
    let totalPages = 1;
    const heading = document.querySelector('#lists h3');
    if (heading) heading.textContent = `Năm ${year}`;
    document.title = `Năm ${year}`;

    const renderFilms = (items) => {
        gridContainer.innerHTML = '';
        if (!items || items.length === 0) {
            gridContainer.innerHTML = '<p>Không thấy phim.</p>';
            return;
        }
        items.forEach(film => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.card-link').href = `phim.php?name=${encodeURIComponent(film.slug)}`;
            clone.querySelector('.thumb').src = film.thumb_url;
            clone.querySelector('.thumb').alt = film.name;
            clone.querySelector('.card-title').textContent = film.name;
            clone.querySelector('.card-meta').textContent = `${film.quality} | ${film.language}`;
            gridContainer.appendChild(clone);
        });
    };

    const getData = async (currentYear, currentPage) => {
        try {
            const encoded = encodeURIComponent(currentYear);
            const realPage1 = currentPage * 2 - 1;
            const realPage2 = currentPage * 2;
            const [res1, res2] = await Promise.all([
                fetch(`/api/config.php?action=nam-phat-hanh&year=${encoded}&page=${realPage1}`),
                fetch(`/api/config.php?action=nam-phat-hanh&year=${encoded}&page=${realPage2}`)
            ]);
            if (!res1.ok) throw new Error('Lỗi');
            const data1 = await res1.json();
            let items2 = [];
            if (res2.ok) {
                const data2 = await res2.json();
                items2 = data2.items || [];
            }
            const items = [...(data1.items || []), ...items2];
            renderFilms(items);
            const totalRealPages = data1.paginate ? data1.paginate.total_page : 1;
            totalPages = Math.ceil(totalRealPages / ITEMS_PER_VIRTUAL_PAGE_MULTIPLIER);
            renderPagination();
        } catch (error) {
            console.error('Lỗi:', error);
            gridContainer.innerHTML = '<p>Có lỗi xảy ra, vui lòng thử lại.</p>';
        }
    };

    // ============================================================
    // ============================================================

    const updateURL = (p) => {
        const url = new URL(window.location.href);
        if (p === 1) {
            url.searchParams.delete('page');
        } else {
            url.searchParams.set('page', p);
        }
        history.pushState({ page: p }, '', url);
    };
 
    let isLoading = false;
    const goToPage = async (p) => {
        const target = Math.min(Math.max(1, p), totalPages);
        if (target === page || isLoading) return;
        isLoading = true;
        if (paginationContainer) paginationContainer.style.opacity = '0.5';
        page = target;
        updateURL(page);
        await getData(year, page);
        isLoading = false;
        if (paginationContainer) paginationContainer.style.opacity = '1';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', () => {
        page = getPageFromURL();
        getData(year, page);
    });
 
    const createPageBtn = (label, targetPage, { active = false, disabled = false } = {}) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'page-btn';
        btn.textContent = label;
        if (active) btn.classList.add('active');
        if (disabled) btn.disabled = true;
        btn.addEventListener('click', () => goToPage(targetPage));
        return btn;
    };
 
    const createEllipsis = () => {
        const wrapper = document.createElement('span');
        wrapper.className = 'page-ellipsis';
        wrapper.textContent = '...';
        wrapper.addEventListener('click', () => {
            if (wrapper.querySelector('input')) return;
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.max = String(totalPages);
            input.className = 'page-jump-input';
            input.placeholder = '...';
            wrapper.textContent = '';
            wrapper.appendChild(input);
            input.focus();
            const commit = () => {
                const value = Number(input.value);
                if (value >= 1 && value <= totalPages) {
                    goToPage(value);
                } else {
                    wrapper.textContent = '...';
                }
            };
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    commit();
                } else if (e.key === 'Escape') {
                    wrapper.textContent = '...';
                }
            });
            input.addEventListener('blur', () => {
                if (wrapper.contains(input)) {
                    wrapper.textContent = '...';
                }
            });
        });
        return wrapper;
    };
 
    const renderPagination = () => {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;
        paginationContainer.appendChild(
            createPageBtn('‹', page - 1, { disabled: page === 1 })
        );
 
        const showSet = new Set([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages]);
        const pages = [...showSet].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);
        let prev = 0;
        pages.forEach(p => {
            if (p - prev > 1) {
                paginationContainer.appendChild(createEllipsis());
            }
            paginationContainer.appendChild(
                createPageBtn(String(p), p, { active: p === page })
            );
            prev = p;
        });
        paginationContainer.appendChild(
            createPageBtn('›', page + 1, { disabled: page === totalPages })
        );
    };
    getData(year, page);
});