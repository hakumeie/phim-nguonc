let API_ROOT = '';

function qs(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

document.addEventListener('DOMContentLoaded', async () => {
  // load config.json to allow changing API_ROOT without editing code
  try{
    const cfgRes = await fetch('config.json');
    if(cfgRes.ok){
      const cfg = await cfgRes.json();
      if(cfg.API_ROOT) API_ROOT = cfg.API_ROOT.replace(/\/+$/,'');
    }
  }catch(e){/* ignore, use defaults */}

  const cardTemplate = document.getElementById('card-template');

  // drawer & header
  const drawer = document.getElementById('drawer');
  const openBtn = document.getElementById('open-drawer');
  const closeBtn = document.getElementById('close-drawer');
  if (openBtn && drawer) openBtn.addEventListener('click', () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); });
  if (closeBtn && drawer) closeBtn.addEventListener('click', () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); });

  // accordions
  const accordions = Array.from(document.getElementsByClassName('accordion'));
  accordions.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      accordions.forEach(b => { const p = document.getElementById(b.dataset.target); if (p && p !== target) p.style.display = 'none'; });
      if (target) target.style.display = target.style.display === 'block' ? 'none' : 'block';
    });
  });

  // static lists
  const GENRES = [
    ["Hành Động","hanh-dong"],["Phiêu Lưu","phieu-luu"],["Hoạt Hình","hoat-hinh"],["Hài","phim-hai"],["Hình Sự","hinh-su"],["Tài Liệu","tai-lieu"],["Chính Kịch","chinh-kich"],["Gia Đình","gia-dinh"],["Giả Tưởng","gia-tuong"],["Lịch Sử","lich-su"],["Kinh Dị","kinh-di"],["Nhạc","phim-nhac"],["Bí Ẩn","bi-an"],["Lãng Mạn","lang-man"],["Khoa Học Viễn Tưởng","khoa-hoc-vien-tuong"],["Gây Cấn","gay-can"],["Chiến Tranh","chien-tranh"],["Tâm Lý","tam-ly"],["Tình Cảm","tinh-cam"],["Cổ Trang","co-trang"],["Miền Tây","mien-tay"],["Phim 18+","phim-18"]
  ];
  const COUNTRIES = [["Âu Mỹ","au-my"],["Anh","anh"],["Trung Quốc","trung-quoc"],["Indonesia","indonesia"],["Việt Nam","viet-nam"],["Pháp","phap"],["Hồng Kông","hong-kong"],["Hàn Quốc","han-quoc"],["Nhật Bản","nhat-ban"],["Thái Lan","thai-lan"],["Đài Loan","dai-loan"],["Nga","nga"],["Hà Lan","ha-lan"],["Philippines","philippines"],["Ấn Độ","an-do"],["Quốc gia khác","quoc-gia-khac"]];
  const years = Array.from({length:2026-2004+1},(_,i)=>2004+i).reverse().map(y=>[String(y),String(y)]);

  function renderList(el, items){ if(!el) return; el.innerHTML=''; items.forEach(([name,slug])=>{ const a=document.createElement('a'); a.href = `category.html?category=${encodeURIComponent(slug)}`; a.textContent=name; a.dataset.slug=slug; el.appendChild(a); }); }
  renderList(document.getElementById('genres'), GENRES);
  renderList(document.getElementById('countries'), COUNTRIES);
  renderList(document.getElementById('years'), years);

  // search
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  function doSearch(){
    const q = searchInput.value.trim();
    if(!q) return;
    window.location.href = `search.html?keyword=${encodeURIComponent(q)}`;
  }
  if (searchBtn && searchInput){
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') doSearch(); });
  }
  if(searchInput){
    const currentSearch = qs('keyword');
    if(currentSearch) searchInput.value = currentSearch;
  }

  // close drawer when clicking a menu item
  if(drawer){
    drawer.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click', ()=>{
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // helpers
  function createCard(item){
    if(!cardTemplate) return document.createElement('div');
    const tpl = cardTemplate.content.cloneNode(true);
    const img = tpl.querySelector('img.thumb');
    img.src = item.thumb_url || item.poster_url || 'https://via.placeholder.com/400x600?text=No+Image';
    img.alt = item.name;
    tpl.querySelector('.card-title').textContent = item.name;
    tpl.querySelector('.card-meta').textContent = `${item.quality || ''} · ${item.language || ''} · ${item.total_episodes>1? 'Series':'Movie'}`;
    tpl.querySelector('.card-desc').textContent = item.description || '';
    const watchButton = tpl.querySelector('.watch-now');
    if(watchButton){
      watchButton.addEventListener('click', ()=>{ window.location.href = `watch.html?slug=${encodeURIComponent(item.slug)}`; });
    }
    return tpl;
  }

  // mock fetches
  async function fetchNewFilms(page=1){
    if(!API_ROOT){
      const items = Array.from({length:10},(_,i)=>({
        name:`Phim mẫu ${i+1 + (page-1)*10}`,
        slug:`phim-mau-${i+1 + (page-1)*10}`,
        original_name:`Sample ${i+1}`,
        thumb_url:`https://picsum.photos/seed/${page}-${i}/400/600`,
        poster_url:`https://picsum.photos/seed/poster-${page}-${i}/1200/400`,
        description:'Mô tả ngắn mẫu. Dùng để demo layout.',
        total_episodes: Math.random()>0.6?1:Math.floor(Math.random()*12)+1,
        current_episode: 'Tập 1',
        time:'45m',
        quality:'HD',
        language: Math.random()>0.5?'Vietsub':'Lồng Tiếng',
        director: null,
        casts: 'Diễn viên A, Diễn viên B'
      }));
      return {status:'success',paginate:{current_page:page,total_page:12,total_items:120,items_per_page:10},items}
    }
    try{
      const res = await fetch(`${API_ROOT}/api/films/phim-moi-cap-nhat?page=${page}`);
      const data = await res.json();
      if(data && data.status === 'success') return data;
      return null;
    }catch(err){ return null }
  }

  async function fetchFilm(slug){
    if(!API_ROOT){
      return {status:'success',item:{
        name:`Phim chi tiết (${slug})`,slug,original_name:'Original '+slug,thumb_url:`https://picsum.photos/seed/${slug}/400/600`,poster_url:`https://picsum.photos/seed/poster-${slug}/1200/400`,description:'Mô tả chi tiết mẫu cho demo.',total_episodes:Math.random()>0.6?1:Math.floor(Math.random()*12)+1,time:'45m',quality:'HD',language:'Vietsub',director:'Đạo diễn X',casts:'A, B, C',category:{
          2:{group:{name:'Thể loại'},list:[{name:'Hành Động'}]},
          3:{group:{name:'Năm'},list:[{name:'2025'}]},
          4:{group:{name:'Quốc gia'},list:[{name:'Việt Nam'}]}
        }
      }}
    }
    try{
      const res = await fetch(`${API_ROOT}/api/film/${encodeURIComponent(slug)}`);
      const data = await res.json();
      if(data && data.status === 'success'){
        const movie = data.movie || data.item || data.data || data;
        return {status:'success', item: movie};
      }
      return null;
    }catch(err){ return null }
  }

  async function fetchSearch(keyword,page=1){
    if(!API_ROOT){
      const items = Array.from({length:10},(_,i)=>({
        name:`${keyword} - Kết quả ${i+1 + (page-1)*10}`,
        slug:`search-${keyword}-${i}`,
        thumb_url:`https://picsum.photos/seed/search-${keyword}-${page}-${i}/400/600`,
        poster_url:`https://picsum.photos/seed/poster-search-${keyword}-${page}-${i}/1200/400`,
        description:'Kết quả tìm kiếm mẫu.' ,total_episodes:1,quality:'HD',language:'Vietsub'
      }));
      return {status:'success',paginate:{current_page:page,total_page:6,total_items:60,items_per_page:10},items}
    }
    try{
      const res = await fetch(`${API_ROOT}/api/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
      const data = await res.json();
      if(data && data.status === 'success') return data;
      return null;
    }catch(err){ return null }
  }

  async function fetchCategory(slug,page=1){
    if(!API_ROOT) return null;
    // determine which endpoint to use: year, genre, country, or generic danh-sach
    const isYear = /^[0-9]{4}$/.test(slug) && Number(slug) >= 1900 && Number(slug) <= 2100;
    const genreSlugs = GENRES.map(g=>g[1]);
    const countrySlugs = COUNTRIES.map(c=>c[1]);
    let endpoint = '';
    if(isYear){ endpoint = `${API_ROOT}/api/films/nam-phat-hanh/${encodeURIComponent(slug)}?page=${page}` }
    else if(genreSlugs.includes(slug)){ endpoint = `${API_ROOT}/api/films/the-loai/${encodeURIComponent(slug)}?page=${page}` }
    else if(countrySlugs.includes(slug)){ endpoint = `${API_ROOT}/api/films/quoc-gia/${encodeURIComponent(slug)}?page=${page}` }
    else { endpoint = `${API_ROOT}/api/films/danh-sach/${encodeURIComponent(slug)}?page=${page}` }

    try{
      const res = await fetch(endpoint);
      const data = await res.json();
      if(data && data.status === 'success') return data;
      return null;
    }catch(err){ return null }
  }

  // pagination renderer (reusable)
  function renderPagination(p, onPage){
    const paginationEl = document.getElementById('pagination');
    if(!paginationEl) return;
    paginationEl.innerHTML = '';
    const total = p.total_page; const current = p.current_page;
    function addButton(label, page, active=false){ const btn=document.createElement('button'); btn.textContent=label; if(active) btn.classList.add('active'); btn.addEventListener('click',()=>onPage(page)); paginationEl.appendChild(btn); }
    if(total<=7){ for(let i=1;i<=total;i++) addButton(String(i),i,i===current); }
    else{
      addButton('1',1,current===1);
      if(current>4){ const dots=document.createElement('button'); dots.textContent='...'; dots.addEventListener('click',()=>{ const input=document.createElement('input'); input.type='number'; input.className='page-input'; input.min=1; input.max=total; input.value=current; input.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const v=Number(input.value); if(v>=1&&v<=total) onPage(v); } }); paginationEl.replaceChild(input,dots); input.focus(); }); paginationEl.appendChild(dots); }
      else{ for(let i=2;i<=4;i++) addButton(String(i),i,current===i); }
      const start = Math.max(2,current-1); const end = Math.min(total-1,current+1);
      if(start<end){ for(let i=start;i<=end;i++){ if(i>4 && i<total) addButton(String(i),i,current===i); } }
      if(current < total-3){ const dots2=document.createElement('button'); dots2.textContent='...'; dots2.addEventListener('click',()=>{ const input=document.createElement('input'); input.type='number'; input.className='page-input'; input.min=1; input.max=total; input.value=current; input.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const v=Number(input.value); if(v>=1&&v<=total) onPage(v); } }); paginationEl.replaceChild(input,dots2); input.focus(); }); paginationEl.appendChild(dots2); }
      addButton(String(total),total,current===total);
    }
  }

  // Home / category listing
  const newFilmsEl = document.getElementById('new-films');
  if(newFilmsEl){
    const page = Number(qs('page')) || 1;
    const category = qs('category');
    if(category){ const title = document.getElementById('category-title'); if(title) title.textContent = `Danh sách: ${category}`; }
    async function loadListing(p=1){
      const data = category ? await fetchCategory(category,p) : await fetchNewFilms(p);
      if(!data || data.status!=='success'){
        newFilmsEl.innerHTML = '<p style="color:var(--muted)">Không có dữ liệu.</p>';
        return;
      }
      newFilmsEl.innerHTML=''; data.items.forEach(it=> newFilmsEl.appendChild(createCard(it)));
      renderPagination(data.paginate, loadListing);
    }
    loadListing(page);
  }

  // film detail page
  const filmDetail = document.getElementById('film-detail');
  if(filmDetail){
    const slug = qs('slug');
    async function loadFilm(s){
      const res = await fetchFilm(s);
      if(!res || res.status!=='success') return;
      const item = res.item;
      const poster = document.getElementById('film-poster'); if(poster) poster.src = item.poster_url;
      const thumb = document.getElementById('film-thumb'); if(thumb) thumb.src = item.thumb_url;
      const title = document.getElementById('film-title'); if(title) title.textContent = item.name;
      const sub = document.getElementById('film-sub'); if(sub) sub.textContent = `${item.quality} · ${item.time} · ${item.language}`;
      const orig = document.getElementById('film-original'); if(orig) orig.textContent = item.original_name || '';
      const watchButton = document.getElementById('watch-button'); if(watchButton){ watchButton.addEventListener('click', ()=>{ window.location.href = `watch.html?slug=${encodeURIComponent(item.slug)}`; }); }
      const desc = document.getElementById('film-desc'); if(desc) desc.textContent = item.description || '';
      const metaList = document.getElementById('film-meta-list'); if(metaList){ metaList.innerHTML=''; const fields=[['Đạo diễn',item.director],['Diễn viên',item.casts],['Tập',item.total_episodes],['Trạng thái',item.current_episode]]; fields.forEach(([k,v])=>{ const li=document.createElement('li'); li.textContent = `${k}: ${v ?? '—'}`; metaList.appendChild(li); }); }
      const categoriesEl = document.getElementById('film-categories');
      if(categoriesEl){
        categoriesEl.innerHTML = '';
        const values = item.category ? Object.values(item.category) : [];
        values.forEach(groupItem => {
          if(!groupItem || !groupItem.group || !Array.isArray(groupItem.list)) return;
          const groupName = groupItem.group.name || '';
          const listNames = groupItem.list.map(i=>i.name).filter(Boolean).join(', ');
          if(!groupName || !listNames) return;
          const block = document.createElement('div');
          block.style.marginBottom = '8px';
          block.innerHTML = `<strong>${groupName}:</strong> ${listNames}`;
          categoriesEl.appendChild(block);
        });
      }
    }
    if(slug) loadFilm(slug);
    else {
      const info = document.createElement('p');
      info.textContent = 'Không tìm thấy phim. Vui lòng thử lại với đường link đúng.';
      info.style.color = 'var(--muted)';
      filmDetail.appendChild(info);
    }
  }

  // watch page
  const watchSection = document.getElementById('watch-episodes');
  if(watchSection){
    const slug = qs('slug');
    async function loadWatch(s){
      const res = await fetchFilm(s);
      if(!res || res.status!=='success') return;
      const item = res.item;
      const title = document.getElementById('watch-title'); if(title) title.textContent = item.name;
      const sub = document.getElementById('watch-sub'); if(sub) sub.textContent = `Quality: ${item.quality || 'HD'} · Ngôn ngữ: ${item.language || 'Vietsub'}`;
      const episodeText = document.getElementById('watch-episode-text');
      const episodesList = document.getElementById('watch-episodes-list');
      const player = document.getElementById('watch-player');
      const selectedEpisode = qs('episode');
      const episodeGroups = Array.isArray(item.episodes) ? item.episodes : [];
      const flatEpisodes = [];

      episodeGroups.forEach(group => {
        if(!group || !Array.isArray(group.items)) return;
        group.items.forEach(ep => {
          flatEpisodes.push({
            server: group.server_name || group.server || 'Server',
            ...ep
          });
        });
      });

      let selected = null;
      if(selectedEpisode){
        selected = flatEpisodes.find(ep => ep.slug === selectedEpisode || String(ep.name) === selectedEpisode);
      }
      if(!selected && item.current_episode){
        selected = flatEpisodes.find(ep => String(ep.name).includes(String(item.current_episode)) || String(ep.slug).includes(String(item.current_episode)));
      }
      if(!selected){
        selected = flatEpisodes[0] || null;
      }

      if(flatEpisodes.length){
        watchSection.style.display = 'block';
        episodesList.innerHTML = '';
        const prevBtn = document.getElementById('watch-prev-btn');
        const nextBtn = document.getElementById('watch-next-btn');
        const currentIndex = flatEpisodes.findIndex(ep => ep === selected);

        let serverGroups = episodeGroups.map(group => ({
          server: group.server_name || group.server || 'Server',
          items: Array.isArray(group.items) ? group.items : []
        }));

        serverGroups.forEach((group, groupIndex) => {
          const header = document.createElement('div');
          header.className = 'episode-server';
          header.textContent = group.server;
          episodesList.appendChild(header);

          group.items.forEach((ep, epIndex) => {
            const slugKey = ep.slug || ep.name || `${groupIndex}-${epIndex}`;
            const isSelected = selected && (ep.slug === selected.slug || String(ep.name) === String(selected.name));
            const el = document.createElement('div');
            el.className = 'episode-item' + (isSelected ? ' current' : '');
            el.innerHTML = `<strong>${ep.name || `Tập ${epIndex + 1}`}</strong><span>${ep.time || ''}</span>`;
            el.addEventListener('click', () => {
              window.location.href = `watch.html?slug=${encodeURIComponent(item.slug)}&episode=${encodeURIComponent(slugKey)}`;
            });
            episodesList.appendChild(el);
          });
        });

        if(player){
          player.src = selected.embed || selected.m3u8 || selected.file || 'about:blank';
        }

        if(prevBtn){
          if(currentIndex > 0){
            prevBtn.disabled = false;
            prevBtn.onclick = () => {
              const prevEpisode = flatEpisodes[currentIndex - 1];
              if(prevEpisode) window.location.href = `watch.html?slug=${encodeURIComponent(item.slug)}&episode=${encodeURIComponent(prevEpisode.slug || prevEpisode.name || '')}`;
            };
          } else {
            prevBtn.disabled = true;
          }
        }
        if(nextBtn){
          if(currentIndex >= 0 && currentIndex < flatEpisodes.length - 1){
            nextBtn.disabled = false;
            nextBtn.onclick = () => {
              const nextEpisode = flatEpisodes[currentIndex + 1];
              if(nextEpisode) window.location.href = `watch.html?slug=${encodeURIComponent(item.slug)}&episode=${encodeURIComponent(nextEpisode.slug || nextEpisode.name || '')}`;
            };
          } else {
            nextBtn.disabled = true;
          }
        }

        let nextText = 'Tập tiếp theo: —';
        if(currentIndex >= 0 && currentIndex < flatEpisodes.length - 1){
          const nextEpisode = flatEpisodes[currentIndex + 1];
          nextText = `Tập tiếp theo: ${nextEpisode.name || nextEpisode.slug || `Tập ${currentIndex + 2}`}`;
        }
        if(episodeText) episodeText.textContent = nextText;
      } else {
        watchSection.style.display = 'block';
        episodesList.innerHTML = '<div class="episode-item current">Không có dữ liệu tập phim chi tiết.</div>';
        if(player) player.src = 'about:blank';
        if(episodeText) episodeText.textContent = 'Tập tiếp theo: —';
      }
    }
    if(slug) loadWatch(slug);
  }

  // search page
  const searchResults = document.getElementById('search-results');
  if(searchResults){
    const keyword = qs('keyword') || '';
    const keyEl = document.getElementById('search-key'); if(keyEl) keyEl.textContent = keyword;
    async function loadSearch(p=1){
      const data = await fetchSearch(keyword,p);
      if(!data || data.status!=='success') return;
      searchResults.innerHTML=''; data.items.forEach(it=> searchResults.appendChild(createCard(it)));
      renderPagination(data.paginate, loadSearch);
    }
    loadSearch(Number(qs('page')) || 1);
  }

});
