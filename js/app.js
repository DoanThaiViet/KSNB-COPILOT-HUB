/* =========================================================================
   KHỞI ĐỘNG · ĐIỀU HƯỚNG · VAI TRÒ
   Mỗi màn hình tự đăng ký vào AIM.views[key] = { title, icon, count(), render(el, params) }.
   Địa chỉ dạng #/usecases?group=g1 để drill-down và chia sẻ đường dẫn.
   ========================================================================= */
AIM.views = AIM.views || {};
AIM.app = (function () {
  const { $, esc } = AIM.ui, C = AIM.config;
  const ORDER = ['dashboard', 'usecases', 'prompts', 'skills', 'agents', 'samples', 'tips', 'roadmap', 'people'];
  const ROLE_KEY = 'aim.role';
  let current = { key: 'dashboard', params: {} };

  const DEFAULT_ROLE = 'cv';
  const role = () => {
    let r; try { r = localStorage.getItem(ROLE_KEY); } catch (e) { r = null; }
    return C.roles[r] ? r : DEFAULT_ROLE;      // vai trò cũ không còn thì quay về mặc định
  };
  const canEdit = () => !!(C.roles[role()] || {}).canEdit;

  function setRole(r) {
    try { localStorage.setItem(ROLE_KEY, r); } catch (e) {}
    document.body.classList.toggle('ro', !canEdit());
    $('#roleswitch').innerHTML = Object.entries(C.roles).map(([k, v]) =>
      `<button data-role="${k}" class="${k === r ? 'active' : ''}">${esc(v.label)}</button>`).join('');
    render();
  }

  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '');
    const [key, qs] = h.split('?');
    const params = Object.fromEntries(new URLSearchParams(qs || ''));
    return { key: AIM.views[key] ? key : 'dashboard', params };
  }
  function go(key, params) {
    const qs = params ? new URLSearchParams(params).toString() : '';
    location.hash = '#/' + key + (qs ? '?' + qs : '');
  }

  function renderMenu() {
    $('#menu').innerHTML = ORDER.map(k => {
      const v = AIM.views[k]; const n = v.count ? v.count() : null;
      return `<button data-go="${k}" class="${k === current.key ? 'active' : ''}" title="${esc(v.title)}">${AIM.icons[k] || ''}<span>${esc(v.menu || v.title)}</span>${n != null ? `<em class="cnt">${n}</em>` : ''}</button>`;
    }).join('');
  }
  function render() {
    current = parseHash();
    renderMenu();
    const el = $('#main');
    el.innerHTML = '';
    const sec = document.createElement('section');
    sec.className = 'view';
    el.appendChild(sec);
    AIM.views[current.key].render(sec, current.params);
    const f = document.createElement('footer');
    f.className = 'foot';
    f.innerHTML = `<span>${esc(C.org)} · dữ liệu hiện có của ${esc(C.unitName)}</span><span>Dữ liệu mẫu</span>`;
    el.appendChild(f);
  }
  /* Vẽ lại màn hình hiện tại mà giữ vị trí cuộn và trạng thái lọc (lọc lưu trong module của từng màn) */
  function refresh() {
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
  }

  async function start() {
    AIM.ui.initTip();
    $('.brand h1').textContent = C.appName;
    document.title = C.appName + ' · ' + C.tagline;
    $('#unitName').textContent = C.tagline.toUpperCase();
    const t = AIM.logic.today();
    $('#asof').innerHTML = `Ngày tham chiếu: <b>${AIM.ui.date(AIM.logic.iso(t))}</b>`;
    await AIM.store.init();


    $('#menu').addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });
    $('#roleswitch').addEventListener('click', e => { const b = e.target.closest('[data-role]'); if (b) setRole(b.dataset.role); });
    const bind = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
    bind('#btnExport', () => AIM.ui.download('ai-adoption-' + new Date().toISOString().slice(0, 10) + '.json', AIM.store.exportJSON()));
    bind('#btnImport', () => $('#fileImport').click());
    const fi = $('#fileImport');
    if (fi) fi.onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { await AIM.store.importJSON(await f.text()); AIM.ui.toast('Đã nạp dữ liệu'); }
      catch (err) { alert('Không nạp được tệp: ' + err.message); }
      e.target.value = '';
    };
    bind('#btnReset', async () => {
      if (!confirm('Khôi phục toàn bộ dữ liệu mẫu? Các thay đổi đã nhập sẽ bị thay thế.')) return;
      await AIM.store.resetDemo(); AIM.ui.toast('Đã khôi phục dữ liệu mẫu');
    });
    AIM.store.subscribe(() => refresh());
    window.addEventListener('hashchange', () => { AIM.ui.close(); render(); window.scrollTo(0, 0); });
    setRole(role());
  }

  return { start, go, canEdit, refresh, current: () => current };
})();

/* Biểu tượng nét mảnh cho sidebar */
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
