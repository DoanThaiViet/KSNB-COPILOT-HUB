/* =========================================================================
   KHỞI ĐỘNG · ĐIỀU HƯỚNG · PERSONA
   Kiến trúc thông tin theo hành vi người dùng (role-first + task-first):
     5 khu vực chính, mỗi khu vực gom các màn hình cũ thành tab con.
   Mỗi màn hình tự đăng ký vào AIM.views[key] = { title, render(el, params) }.
   Địa chỉ dạng #/usecases?group=g1 vẫn giữ nguyên để drill-down và chia sẻ.
   ========================================================================= */
AIM.views = AIM.views || {};
AIM.app = (function () {
  const { $, esc } = AIM.ui, C = AIM.config, H = AIM.hub;

  /* Khu vực → tab con. gov: chỉ hiện với persona có quyền xem điều hành */
  const SECTIONS = [
    { key: 'home', label: 'Trang chủ', tabs: [['home', 'Trang chủ']] },
    { key: 'work', label: 'Công việc của tôi', desc: 'Chọn đúng việc đang làm, bấm Thực hiện: Hub đưa sẵn câu lệnh, quy trình hoặc trợ lý phù hợp.',
      tabs: [['work', 'Việc của tôi'], ['usecases', 'Danh mục ứng dụng AI']] },
    { key: 'assistant', label: 'Trợ lý AI', desc: 'Hỏi nhanh, hoặc dùng trợ lý tự động (Agent) và quy trình nhiều bước (Skill) đã được Ban xây dựng.',
      tabs: [['assistant', 'Hỏi Copilot'], ['agents', 'Trợ lý tự động (Agent)'], ['skills', 'Quy trình (Skill)']] },
    { key: 'knowledge', label: 'Kho tri thức', desc: 'Prompt dùng ngay, Skill làm theo cách chuẩn, Agent theo cả quy trình — cùng mẹo dùng Copilot và sản phẩm do Copilot tạo.',
      tabs: [['knowledge', 'Tra cứu nhanh'], ['prompts', 'Prompt'], ['kbskills', 'Skill'], ['kbagents', 'Agent'], ['tips', 'Mẹo dùng Copilot'], ['samples', 'Sản phẩm tạo bởi Copilot']],
      /* Mục con hiện ngay dưới menu để biết kho gồm những gì */
      sub: [['prompts', 'Prompt'], ['kbskills', 'Skill'], ['kbagents', 'Agent'], ['tips', 'Mẹo dùng Copilot'], ['samples', 'Sản phẩm tạo bởi Copilot']] },
    { key: 'govern', label: 'Điều hành', gov: true, desc: 'Mức độ sử dụng, hiệu quả, lộ trình và nhân sự — dành cho Lãnh đạo, PIC và điều phối.',
      tabs: [['dashboard', 'Tổng quan triển khai'], ['roadmap', 'Lộ trình'], ['people', 'Nhân sự & mức độ tham gia']] }
  ];
  const KEYWORDS = { kbskills: 'skill quy trinh sop skill.md', kbagents: 'agent tro ly tu dong la gi', usecases: 'use case danh sach', prompts: 'prompt thu vien cau lenh', agents: 'agent tro ly', skills: 'skill quy trinh', tips: 'meo tips', dashboard: 'kpi thong ke bao cao', roadmap: 'lo trinh ke hoach', people: 'can bo nhan su adoption' };
  const ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    work: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>',
    assistant: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>',
    knowledge: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 20a2 2 0 0 0 2 2h13v-4"/><path d="M9 8h6M9 11h4"/></svg>',
    govern: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>'
  };
  let current = { key: 'home', params: {} };
  let prefSection = null;   // một màn hình (vd. Agent) có thể thuộc 2 khu vực: giữ khu vực người dùng vừa chọn

  const canEdit = () => !!H.roleCfg().canEdit;
  const canGov = () => !!H.roleCfg().governance;
  const has = (s, key) => s.tabs.some(t => t[0] === key);
  const sectionOf = key => SECTIONS.find(s => s.key === prefSection && has(s, key)) || SECTIONS.find(s => has(s, key)) || SECTIONS[0];
  const visibleSections = () => SECTIONS.filter(s => !s.gov || canGov());
  /* Danh sách trang cho ô tra cứu */
  const pages = () => visibleSections().flatMap(s => s.tabs.map(([k, l]) => ({ key: k, label: l, section: s.label, keywords: KEYWORDS[k] || '' })));

  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '');
    const [key, qs] = h.split('?');
    const params = Object.fromEntries(new URLSearchParams(qs || ''));
    return { key: AIM.views[key] ? key : 'home', params };
  }
  function go(key, params, sec) {
    if (sec) prefSection = sec;
    const qs = params ? new URLSearchParams(params).toString() : '';
    const h = '#/' + key + (qs ? '?' + qs : '');
    if (location.hash === h) render(); else location.hash = h;
  }

  function renderMenu() {
    const sec = sectionOf(current.key);
    $('#menu').innerHTML = visibleSections().map(s =>
      `<button data-go="${s.tabs[0][0]}" data-sec="${s.key}" class="${s === sec ? 'active' : ''}" title="${esc(s.label)}"${s === sec && current.key === s.tabs[0][0] ? ' aria-current="page"' : ''}>${ICONS[s.key]}<span>${esc(s.label)}</span>${s.gov ? '<em class="cnt gov">QL</em>' : ''}</button>`
      + (s.sub ? `<div class="msub">${s.sub.map(([k, l]) => { const on = s === sec && current.key === k, v = AIM.views[k], n = v && v.count ? v.count() : null;
          return `<button data-go="${k}" data-sec="${s.key}" class="${on ? 'on' : ''}"${on ? ' aria-current="page"' : ''}><span>${esc(l)}</span>${n != null ? `<em class="cnt">${n}</em>` : ''}</button>`; }).join('')}</div>` : '')).join('');
  }
  function renderIdentity() {
    const p = H.person(), r = H.role();
    $('#who').innerHTML = `<button class="who-btn" id="whoBtn" aria-haspopup="dialog" aria-expanded="false">
        <span class="av">${esc(AIM.ui.initials(p && p.name))}</span>
        <span class="who-t"><b>${esc(p ? p.name : 'Chọn cán bộ')}</b><small>${esc(C.roles[r].label)}</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>`;
  }
  function openIdentity() {
    const r = H.role(), p = H.person();
    const pool = AIM.store.all('people').filter(x => !C.roles[r].leadOnly || x.isLead);
    const b = $('#whoBtn'); b && b.setAttribute('aria-expanded', 'true');
    AIM.ui.modal({
      title: 'Không gian làm việc', sub: '<span>Chọn vai trò để thấy đúng việc của mình. Đây là tùy chọn hiển thị trên máy này, không phải phân quyền.</span>',
      body: `<div class="persona-grid">${Object.entries(C.roles).map(([k, v]) => `<button class="persona${k === r ? ' on' : ''}" data-persona="${k}" aria-pressed="${k === r}">
          <b>${esc(v.label)}</b><small>${esc(v.note)}</small></button>`).join('')}</div>
        <div class="who-pick"><div class="who-pick-h"><b>Chọn cán bộ${C.roles[r].leadOnly ? ' (Lãnh đạo Ban)' : ''}</b>
          <input type="search" id="whoQ" placeholder="Gõ tên hoặc phòng…" aria-label="Tìm cán bộ" autocomplete="off"></div>
          <div class="who-list" id="whoList" role="listbox" aria-label="Cán bộ">${pool.map(x => `<button class="who-i${p && x.id === p.id ? ' on' : ''}" data-pid="${x.id}" role="option" aria-selected="${!!(p && x.id === p.id)}"
            data-key="${esc(AIM.copilot.norm(x.name + ' ' + x.title + ' ' + (x.unit || '')))}"><span class="av">${esc(AIM.ui.initials(x.name))}</span>
            <span><b>${esc(x.name)}</b><small>${esc(x.title)}${x.unit ? ' · ' + esc(x.unit) : ''}</small></span></button>`).join('')}</div></div>`,
      foot: '<button class="btn primary" data-close>Xong</button>',
      onMount: pn => {
        pn.addEventListener('click', e => { const k = e.target.closest('[data-persona]'); if (k) { setRole(k.dataset.persona); openIdentity(); } });
        pn.addEventListener('click', e => {
          const w = e.target.closest('[data-pid]'); if (!w) return;
          H.setPerson(w.dataset.pid); renderIdentity(); render();
          AIM.ui.$$('.who-i', pn).forEach(x => { const on = x === w; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
          AIM.ui.toast('Đang xem với tư cách: ' + w.querySelector('b').textContent);
        });
        pn.addEventListener('input', e => { if (e.target.id !== 'whoQ') return; const q = AIM.copilot.norm(e.target.value);
          AIM.ui.$$('.who-i', pn).forEach(x => { x.hidden = !!q && !x.dataset.key.includes(q); }); });
        const cur = AIM.ui.$('.who-i.on', pn); cur && cur.scrollIntoView({ block: 'nearest' });
      }
    });
  }
  function setRole(r) {
    H.setRole(r);
    document.body.classList.toggle('ro', !canEdit());
    document.body.dataset.persona = H.role();
    renderIdentity();
    if (sectionOf(current.key).gov && !canGov()) go('home'); else render();
  }

  /* Đầu khu vực: ảnh minh họa + mô tả + tab con */
  function sectionHead(sec, key) {
    const img = H.visual(sec.key);
    return `<div class="sec-hero${img ? '' : ' noimg'}"${img ? ` style="--img:url('${esc(img)}')"` : ''}>
        <div class="sec-copy"><div class="eyebrow">${esc(C.appName)}</div><h2>${esc(sec.label)}</h2><p>${esc(sec.desc || '')}</p></div></div>
      ${sec.tabs.length > 1 ? `<nav class="subtabs" aria-label="${esc(sec.label)}">${sec.tabs.map(([k, l]) => `<button data-go="${k}" data-sec="${sec.key}" class="${k === key ? 'active' : ''}"${k === key ? ' aria-current="page"' : ''}>${esc(l)}</button>`).join('')}</nav>` : ''}`;
  }

  function render() {
    current = parseHash();
    let sec = sectionOf(current.key);
    if (sec.gov && !canGov()) { current = { key: 'home', params: {} }; sec = SECTIONS[0]; history.replaceState(null, '', '#/home'); AIM.ui.toast('Mục Điều hành dành cho Lãnh đạo, PIC và điều phối'); }
    renderMenu();
    const el = $('#main');
    el.innerHTML = '';
    if (sec.key !== 'home') { const hd = document.createElement('div'); hd.className = 'sec-top'; hd.innerHTML = sectionHead(sec, current.key); el.appendChild(hd); }
    const view = document.createElement('section');
    view.className = 'view v-' + current.key + (sec.key !== 'home' ? ' in-sec' : '');
    el.appendChild(view);
    AIM.views[current.key].render(view, current.params);
    const f = document.createElement('footer');
    f.className = 'foot';
    f.innerHTML = `<span>${esc(C.org)} · dữ liệu hiện có của ${esc(C.unitName)}</span><span>Dữ liệu mẫu · số giờ tiết kiệm là ước tính</span>`;
    el.appendChild(f);
  }
  function refresh() { const y = window.scrollY; render(); window.scrollTo(0, y); }

  async function start() {
    AIM.ui.initTip();
    $('.brand h1').textContent = C.appName;
    document.title = C.appName + ' · ' + C.tagline;
    $('#unitName').textContent = C.tagline.toUpperCase();
    await AIM.store.init();

    document.addEventListener('click', e => {
      const b = e.target.closest('#menu [data-go], .subtabs [data-go]'); if (b) { prefSection = b.dataset.sec || null; go(b.dataset.go); }
      if (e.target.closest('#whoBtn')) openIdentity();
    });
    AIM.copilot.mountQuickSearch($('#qs'));
    AIM.copilot.mountFab();
    AIM.store.subscribe(() => refresh());
    window.addEventListener('hashchange', () => { AIM.ui.close(); render(); window.scrollTo(0, 0); });
    setRole(H.role());
  }

  /* Dữ liệu: xuất/nạp/khôi phục — dùng ở trang chủ Điều phối */
  async function importFile(file) {
    try { await AIM.store.importJSON(await file.text()); AIM.ui.toast('Đã nạp dữ liệu'); }
    catch (err) { alert('Không nạp được tệp: ' + err.message); }
  }
  const exportData = () => AIM.ui.download('copilot-hub-' + new Date().toISOString().slice(0, 10) + '.json', AIM.store.exportJSON());
  async function resetData() {
    if (!confirm('Khôi phục toàn bộ dữ liệu mẫu? Các thay đổi đã nhập sẽ bị thay thế.')) return;
    await AIM.store.resetDemo(); AIM.ui.toast('Đã khôi phục dữ liệu mẫu');
  }

  return { start, go, canEdit, canGov, refresh, pages, openIdentity, setRole, importFile, exportData, resetData, current: () => current };
})();

/* Biểu tượng nét mảnh dùng lại trong các màn hình cũ */
AIM.icons = {
  dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  usecases: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  prompts: '<svg viewBox="0 0 24 24"><path d="M5 4h4v16H5zM11 4h4v16h-4z"/><path d="M17.5 4.5l3 .8-3.6 14.5-3-.8z"/></svg>',
  skills: '<svg viewBox="0 0 24 24"><path d="M4 7h5l2 3 3-6 2 4h4"/><path d="M4 17h16"/></svg>',
  agents: '<svg viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5"/></svg>',
  samples: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  tips: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2.9 1.9v.2h5.2v-.2c0-.7.3-1.4.9-1.9A6 6 0 0 0 12 3z"/></svg>',
  roadmap: '<svg viewBox="0 0 24 24"><path d="M3 7h9M7 12h11M5 17h8"/><circle cx="15" cy="7" r="2"/><circle cx="20" cy="12" r="1.5"/><circle cx="16" cy="17" r="2"/></svg>',
  people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3-5.4 6-5.4s5.4 2 6 5.4"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14.6c2.4.2 4 1.9 4.5 4.6"/></svg>'
};

document.addEventListener('DOMContentLoaded', () => AIM.app.start());
