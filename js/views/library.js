/* ========================== THƯ VIỆN AI — PHẦN DÙNG CHUNG + TAB PROMPT ==========================
   AIM.lib: chi tiết, thêm/sửa, bộ lọc dùng chung cho cả ba tab Prompt, Skill, Agent.
   AIM.views.prompts: tab Prompt Library.
   Tab Skills và Agents nằm ở js/views/skills.js và js/views/agents.js. */
AIM.lib = (function () {
  const U = AIM.ui, L = AIM.logic, C = AIM.config, S = AIM.store;
  const { esc, nf } = U;

  const ucOf = x => S.get('useCases', x.useCaseId);
  const ucName = id => { const u = S.get('useCases', id); return u ? u.task : '–'; };
  const benefit = x => { const u = ucOf(x); return u ? L.savedHours(u) : 0; };

  /* Bộ lọc dùng chung cho từng tab (mỗi loại giữ bộ lọc riêng) */
  function filterBar(type, f) {
    return `<div class="toolbar">
      <input type="search" data-f="q" placeholder="Tìm theo tên, mục đích, nội dung..." value="${esc(f.q)}">
      <select data-f="domain">${U.opt('', 'Mọi lĩnh vực của Tổng Công ty', f.domain)}${U.domainOpts().map(([v, l]) => U.opt(v, l, f.domain)).join('')}</select>
      <select data-f="group">${U.opt('', 'Mọi nhóm công việc', f.group)}${U.groupOpts().map(([v, l]) => U.opt(v, l, f.group)).join('')}</select>
      <select data-f="aud">${U.opt('', 'Mọi đối tượng dùng', f.aud)}${Object.entries(C.audiences).map(([k, v]) => U.opt(k, v.label, f.aud)).join('')}</select>
      <select data-f="status">${U.opt('', 'Mọi trạng thái', f.status)}${C.libraryStatuses.map(s => U.opt(s, U.stLabel(s), f.status)).join('')}</select>
      <select data-f="builder">${U.opt('', 'Mọi người xây dựng', f.builder)}${U.peopleOpts().map(([v, l]) => U.opt(v, l, f.builder)).join('')}</select>
    </div>`;
  }
  function items(type, f) {
    /* Vai trò Lãnh đạo thì mặc định xem phần dành cho lãnh đạo */
    if (!f.aud && !AIM.app.canEdit()) f = { ...f, aud: 'lead' };
    const q = (f.q || '').trim().toLowerCase();
    return S.all('library').filter(x => x.type === type &&
      (!q || [x.id, x.name, x.purpose, x.instruction, U.pname(x.builderId)].join(' ').toLowerCase().includes(q)) &&
      (!f.group || x.groupId === f.group) && (!f.status || x.status === f.status) && (!f.builder || x.builderId === f.builder) &&
      (!f.domain || x.domainId === f.domain) && (!f.aud || x.audience === f.aud || x.audience === 'both'))
      .sort((a, b) => (a.status === 'Deprecated') - (b.status === 'Deprecated') || a.id.localeCompare(b.id));
  }
  /* Dải trạng thái: Draft → Testing → Approved */
  function pipeline(list) {
    const tot = list.length || 1;
    return `<div class="pipe">${C.libraryStatuses.map(s => {
      const n = list.filter(x => x.status === s).length;
      return `<div class="pi"><b style="color:${C.statuses[s].color}">${n}</b><span>${U.stLabel(s)}</span>
        <i style="background:${C.statuses[s].color};width:${n / tot * 100}%"></i></div>`;
    }).join('')}</div>`;
  }

  function open(id) {
    const x = S.get('library', id); if (!x) return;
    const uc = ucOf(x);
    const extra = x.type === 'skill' && x.steps ? `<div class="dsec">Các bước</div><ol class="steps">${x.steps.map(t => `<li>${esc(t)}</li>`).join('')}</ol>` :
      x.type === 'agent' ? `<div class="dsec">Phạm vi hoạt động</div><dl class="dl">
        <dt>Kích hoạt khi</dt><dd>${esc(x.trigger || '–')}</dd>
        <dt>Dữ liệu sử dụng</dt><dd>${esc(x.dataScope || '–')}</dd>
        <dt>Giới hạn</dt><dd>${esc(x.guardrails || '–')}</dd></dl>` : '';
    const crit = uc && x.type === 'agent' ? `<div class="dsec">Đối chiếu 05 tiêu chí của ứng dụng AI</div>${AIM.views.usecases.critList(uc)}
      ${L.agentCandidate(uc) ? '' : '<div class="recbox warn" style="margin-top:10px">Ứng dụng AI liên kết chưa đủ 05 tiêu chí. Cần rà soát lại trước khi mở rộng phạm vi Agent.</div>'}` : '';
    const p = U.modal({
      wide: true,
      title: esc(x.name),
      sub: `${U.type(x.type)}<span class="faint">${esc(x.id)} · ${esc(x.version)}</span>${U.status(x.status)}${U.grp(x.groupId)}`,
      body: `
        <dl class="dl">
          <dt>Đối tượng dùng</dt><dd>${U.aud(x.audience)}</dd>
          <dt>Lĩnh vực Tổng Công ty</dt><dd>${esc(U.domain(x.domainId).name)}</dd>
          <dt>Mục đích</dt><dd>${esc(x.purpose)}</dd>
          <dt>Ứng dụng AI liên quan</dt><dd>${x.useCaseId ? `<a data-uc="${x.useCaseId}" style="cursor:pointer">${esc(x.useCaseId)} · ${esc(ucName(x.useCaseId))}</a>` : '–'}</dd>
          ${uc ? `<dt>Công cụ</dt><dd>${esc((C.tools[uc.tool] || {}).label || '–')}</dd>
          <dt>Lợi ích ước tính</dt><dd><b>${nf(benefit(x), 1)}</b> giờ/tháng</dd>` : ''}
          <dt>Dữ liệu đầu vào cần chuẩn bị</dt><dd>${esc(x.input)}</dd>
          <dt>Kết quả mong muốn</dt><dd>${esc(x.output)}</dd>
          <dt>Người xây dựng</dt><dd>${esc(U.pname(x.builderId))}</dd>
          <dt>Người rà soát</dt><dd>${esc(U.pname(x.reviewerId))}</dd>
          ${x.leadId ? `<dt>Lãnh đạo phụ trách</dt><dd>${esc(U.pname(x.leadId))}</dd>` : ''}
          ${x.deadline ? `<dt>Hạn hoàn thành</dt><dd>${U.due(x.deadline, x.status === 'Approved')}</dd>` : ''}
          <dt>Ngày cập nhật</dt><dd>${U.date(x.updated)}</dd>
        </dl>
        ${extra}
        <div class="dsec" style="display:flex;align-items:center;justify-content:space-between">${x.type === 'prompt' ? 'Nội dung prompt' : 'Nội dung hướng dẫn'}
          <button class="btn sm" data-copy>Sao chép</button></div>
        <pre class="prompt">${esc(x.instruction)}</pre>
        ${crit}`,
      foot: `<button class="btn danger edit-only l" data-del>Xóa</button><button class="btn" data-close>Đóng</button><button class="btn primary edit-only" data-edit>Sửa</button>`
    });
    p.addEventListener('click', async e => {
      if (e.target.closest('[data-copy]')) return U.copy(x.instruction);
      if (e.target.closest('[data-edit]')) return edit(x, x.type);
      if (e.target.closest('[data-del]')) { if (confirm('Xóa ' + x.id + '?')) { U.close(); await S.remove('library', x.id); U.toast('Đã xóa'); } return; }
      const u = e.target.closest('[data-uc]'); if (u) return AIM.views.usecases.open(u.dataset.uc);
    });
  }

  function edit(x, type) {
    const isNew = !x;
    const prefix = { prompt: 'PR-', skill: 'SK-', agent: 'AG-' };
    const t = x ? x.type : type;
    const n = S.all('library').filter(i => i.type === t)
      .reduce((m, i) => Math.max(m, parseInt(i.id.replace(/\D/g, ''), 10) || 0), 0) + 1;
    const base = x || { id: prefix[t] + String(n).padStart(2, '0'), type: t, status: 'Draft', version: 'v0.1',
      updated: AIM.logic.iso(AIM.logic.today()), groupId: 'g1', domainId: 'd12', audience: 'both', useCaseId: '', leadId: '', deadline: '' };
    const fs = [
      { k: 'name', label: 'Tên', req: true, span: 2 },
      { k: 'type', label: 'Loại', type: 'select', options: Object.entries(C.types).map(([k, v]) => [k, v.label]) },
      { k: 'status', label: 'Trạng thái', type: 'select', options: U.statusOpts(C.libraryStatuses) },
      { k: 'groupId', label: 'Nhóm công việc (Ban KSNB)', type: 'select', options: U.groupOpts() },
      { k: 'domainId', label: 'Lĩnh vực của Tổng Công ty', type: 'select', options: U.domainOpts() },
      { k: 'audience', label: 'Đối tượng dùng', type: 'select', options: Object.entries(C.audiences).map(([k, v]) => [k, v.label]) },
      { k: 'useCaseId', label: 'Ứng dụng AI liên quan', type: 'select', options: [['', '–']].concat(S.all('useCases').map(u => [u.id, u.id + ' · ' + u.task])) },
      { k: 'purpose', label: 'Mục đích', type: 'textarea', rows: 2, span: 2 },
      { k: 'input', label: 'Dữ liệu đầu vào cần chuẩn bị', type: 'textarea', rows: 2 },
      { k: 'output', label: 'Kết quả mong muốn', type: 'textarea', rows: 2 },
      { k: 'instruction', label: 'Nội dung prompt / hướng dẫn', type: 'textarea', rows: 9, span: 2, mono: true }
    ];
    if (t === 'skill') fs.push({ k: 'stepsText', label: 'Các bước (mỗi dòng một bước)', type: 'textarea', rows: 4, span: 2 });
    if (t === 'agent') fs.push(
      { k: 'trigger', label: 'Kích hoạt khi', type: 'textarea', rows: 2 },
      { k: 'dataScope', label: 'Dữ liệu sử dụng', type: 'textarea', rows: 2 },
      { k: 'guardrails', label: 'Giới hạn', type: 'textarea', rows: 2, span: 2 });
    fs.push(
      { k: 'builderId', label: 'Người xây dựng', type: 'select', options: U.peopleOpts() },
      { k: 'reviewerId', label: 'Người rà soát', type: 'select', options: U.peopleOpts() },
      { k: 'leadId', label: 'Lãnh đạo phụ trách', type: 'select', options: [['', '–']].concat(U.peopleOpts(p => p.isLead)) },
      { k: 'deadline', label: 'Hạn hoàn thành', type: 'date' },
      { k: 'version', label: 'Phiên bản' },
      { k: 'updated', label: 'Ngày cập nhật', type: 'date' });

    const val = { ...base, stepsText: (base.steps || []).join('\n') };
    const p = U.modal({ wide: true, title: isNew ? 'Thêm ' + C.types[t].label : 'Sửa ' + esc(base.id), body: U.form(fs, val),
      foot: `<button class="btn" data-close>Hủy</button><button class="btn primary" data-save>Lưu</button>` });
    p.querySelector('[data-save]').onclick = async () => {
      const obj = U.readForm(p, fs, base);
      if (!obj.name.trim()) return p.querySelector('[name="name"]').focus();
      if (obj.stepsText != null) { obj.steps = obj.stepsText.split('\n').map(t => t.trim()).filter(Boolean); delete obj.stepsText; }
      U.close(); await S.save('library', obj); U.toast('Đã lưu');
    };
  }

  /* Gắn sự kiện chung cho một màn hình thư viện */
  function wire(el, f, redraw, type) {
    el.addEventListener('input', e => { const k = e.target.dataset.f; if (k) { f[k] = e.target.value; redraw(); } });
    el.addEventListener('click', e => {
      const cp = e.target.closest('[data-copy]'); if (cp) { e.stopPropagation(); return U.copy(S.get('library', cp.dataset.copy).instruction); }
      if (e.target.closest('[data-add]')) return edit(null, type);
      const c = e.target.closest('[data-id]'); if (c && c.dataset.id) return open(c.dataset.id);
      const u = e.target.closest('[data-uc]'); if (u) { e.stopPropagation(); return AIM.views.usecases.open(u.dataset.uc); }
    });
  }

  /* Gom danh sách theo lĩnh vực công việc của Tổng Công ty */
  function byDomain(list, cardFn) {
    const groups = C.domains.map(d => ({ d, items: list.filter(x => x.domainId === d.id) })).filter(g => g.items.length);
    const rest = list.filter(x => !C.domains.some(d => d.id === x.domainId));
    if (rest.length) groups.push({ d: { id: '', name: 'Chưa phân loại lĩnh vực', short: '–' }, items: rest });
    return groups.map(g => `<div class="dsect"><div class="dsh"><h3>${esc(g.d.name)}</h3><span>${g.items.length}</span></div>
      <div class="libgrid">${g.items.map(cardFn).join('')}</div></div>`).join('');
  }

  return { ucOf, ucName, benefit, items, filterBar, pipeline, byDomain, open, edit, wire };
})();

/* ---------------------------- TAB PROMPT LIBRARY ---------------------------- */
AIM.views.prompts = (function () {
  const U = AIM.ui, C = AIM.config, S = AIM.store, LIB = AIM.lib;
  const { esc } = U;
  let f = { q: '', group: '', status: '', builder: '', domain: '', aud: '' };

  function card(x) {
    const uc = LIB.ucOf(x);
    const g = U.group(x.groupId);
    const preview = (x.instruction || '').split('\n').slice(0, 4).join('\n');
    return `<div class="pcard${x.status === 'Deprecated' ? ' dep' : ''}" data-id="${x.id}" style="--g:${g.color}">
      <div class="ph">
        <span class="pid">${esc(x.id)}</span>
        <h4>${esc(x.name)}</h4>
        <div class="pmeta">${U.status(x.status)}${U.aud(x.audience)}<span class="faint">${esc(x.version)}</span></div>
      </div>
      <p class="ppur">${esc(x.purpose)}</p>
      <div class="pv"><pre>${esc(preview)}</pre><button class="btn sm" data-copy="${x.id}">Sao chép</button></div>
      <div class="pf">
        <span class="chipdot" style="--c:${g.color}">${esc(g.short)}</span>
        ${uc ? `<span class="faint">${esc((C.tools[uc.tool] || {}).label || '')}</span>` : ''}
        <span class="sp"></span>
        ${U.avatar(x.builderId, 20)}<span>${esc(U.pname(x.builderId))}</span>
      </div>
    </div>`;
  }

  function grid() {
    const list = LIB.items('prompt', f);
    U.$('#libWrap').innerHTML = list.length ? `<div class="libgrid">${list.map(card).join('')}</div>` : '<div class="empty">Chưa có prompt phù hợp</div>';
  }
  let lastPk = '{}';
  function render(el, params) {
    const pk = JSON.stringify(params || {});
    if (pk !== lastPk) { lastPk = pk; if (params && params.q) f = { ...f, q: params.q }; }
    const all = S.all('library').filter(x => x.type === 'prompt');
    el.innerHTML = `
      <div class="phd"><div><h2>Thư viện Prompt</h2><div class="meta">${all.length} prompt</div></div>
        <div class="acts"><button class="btn primary edit-only" data-add>+ Thêm Prompt</button></div></div>
      ${LIB.pipeline(all)}
      ${LIB.filterBar('prompt', f)}
      <div id="libWrap"></div>`;
    grid();
    LIB.wire(el, f, grid, 'prompt');
  }
  return { title: 'Thư viện Prompt', menu: 'Thư viện Prompt', count: () => S.all('library').filter(x => x.type === 'prompt' && x.status !== 'Deprecated').length, render };
})();
