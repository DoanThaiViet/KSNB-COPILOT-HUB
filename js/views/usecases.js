/* ========================== AI ỨNG DỤNG AIS ========================== */
AIM.views.usecases = (function () {
  const U = AIM.ui, L = AIM.logic, C = AIM.config, S = AIM.store;
  const { esc, nf, hrs, pct } = U;
  const F0 = { q: '', group: '', status: '', priority: '', owner: '', lead: '', level: '', tool: '' };
  let f = { ...F0 }, lastPk = '{}', sort = { k: 'id', dir: 'asc' }, full = false;

  const levelFilters = [
    ['', 'Mọi cấp độ'], ['agent', 'Đủ điều kiện Agent'], ['skill', 'Đề xuất Skill'], ['prompt', 'Đề xuất Prompt'], ['mismatch', 'Hướng tới Agent, chưa đủ tiêu chí']
  ];

  const cols = () => [
    { k: 'task', label: 'Công việc', cls: 'sticky', sort: r => r.task,
      render: r => `<div class="t1"><span class="faint" style="font-weight:600;margin-right:6px">${esc(r.id)}</span>${esc(r.task)}</div><div class="t2">${esc(r.pain)}</div>` },
    { k: 'groupId', label: 'Nhóm công việc', sort: r => U.group(r.groupId).name, render: r => U.grp(r.groupId) },
    { k: 'tool', label: 'Công cụ', sort: r => (C.tools[r.tool] || {}).label || '', render: r => U.tool(r.tool) },
    { k: 'ownerId', label: 'Người thực hiện', sort: r => U.pname(L.owners(r)[0]),
      render: r => { const o = L.owners(r); return `<div class="tt">${U.avatars(o, 24)}<span>${esc(U.pname(o[0]))}${o.length > 1 ? ' +' + (o.length - 1) : ''}</span></div>`; } },
    { k: 'leadId', label: 'LĐ phụ trách', sort: r => U.pname(r.leadId), render: r => esc(U.pname(r.leadId)) },
    { k: 'freq', label: 'Tần suất', sort: r => +r.perMonth, render: r => `${esc(C.frequencies[r.freq]?.label || '')}<div class="faint" style="font-size:11px">${nf(r.perMonth, r.perMonth % 1 ? 2 : 0)} lần/tháng</div>` },
    { k: 'current', label: 'Cách làm hiện tại', full: true, render: r => `<div class="t2" style="color:var(--ink)">${esc(r.current)}</div>` },
    { k: 'aiStep', label: 'AI hỗ trợ ở bước', full: true, render: r => `<div class="t2" style="color:var(--ink)">${esc(r.aiStep)}</div>` },
    { k: 'before', label: 'Trước → Sau (giờ/lần)', cls: 'num', sort: r => +r.before, render: r => `<span class="tt" style="justify-content:flex-end">${hrs(r.before)}<span class="arrow">→</span><b>${hrs(r.after)}</b></span>` },
    { k: 'pct', label: '% tiết kiệm', cls: 'num', sort: r => L.savedPct(r), render: r => `<span class="gain">${pct(L.savedPct(r))}</span>` },
    { k: 'hours', label: 'Giờ/tháng', cls: 'num', sort: r => L.savedHours(r), render: r => nf(L.savedHours(r), 1) },
    { k: 'quality', label: 'Chất lượng', sort: r => +r.quality, render: r => U.dots(+r.quality) },
    { k: 'priority', label: 'Ưu tiên', sort: r => -(C.priorities[r.priority]?.rank || 0), render: r => U.prio(r.priority) },
    { k: 'status', label: 'Trạng thái', sort: r => C.useCaseStatuses.indexOf(r.status), render: r => U.status(r.status) },
    { k: 'level', label: 'Cấp độ hiện tại · đề xuất', sort: r => L.levelIndex(L.recommendedLevel(r)),
      render: r => `<div class="tt">${U.level(L.currentLevel(r))}<span class="arrow">·</span>${U.level(L.recommendedLevel(r))}</div>${L.agentMismatch(r) ? '<span class="flag" data-tip="Đang có Agent cho ứng dụng AI này trong khi chưa đủ 05 tiêu chí">Rà soát cấp độ</span>' : ''}` },
    { k: 'next', label: 'Việc tiếp theo', full: true, render: r => `<div class="t2" style="color:var(--ink)">${esc(r.next)}</div>` },
    { k: 'deadline', label: 'Thời hạn', sort: r => r.deadline || '9999', render: r => U.due(r.deadline) }
  ].filter(c => full || ['task', 'tool', 'ownerId', 'status', 'next', 'deadline'].includes(c.k));

  function filtered() {
    const q = f.q.trim().toLowerCase();
    return S.all('useCases').filter(u =>
      (!q || [u.id, u.task, u.pain, u.aiStep, u.next, L.owners(u).map(U.pname).join(' ')].join(' ').toLowerCase().includes(q)) &&
      (!f.group || u.groupId === f.group) && (!f.status || u.status === f.status) &&
      (!f.priority || u.priority === f.priority) && (!f.owner || L.owners(u).includes(f.owner)) && (!f.lead || u.leadId === f.lead) &&
      (!f.tool || u.tool === f.tool) &&
      (!f.level || (f.level === 'mismatch' ? L.agentMismatch(u) : L.recommendedLevel(u) === f.level)));
  }

  const sel = (k, all, opts) => `<select data-f="${k}">${U.opt('', all, f[k])}${opts.map(([v, l]) => U.opt(v, l, f[k])).join('')}</select>`;

  function table() {
    const cs = cols(), rows = U.sortRows(filtered(), cs, sort.k, sort.dir);
    const tot = rows.reduce((a, u) => a + L.savedHours(u), 0);
    U.$('#ucCount').innerHTML = `${rows.length} ứng dụng AI · tiết kiệm ước tính <b>${nf(tot)}</b> giờ/tháng`;
    U.$('#ucTable').innerHTML = rows.length ? `<table><thead><tr>${cs.map(c =>
      `<th class="${c.cls || ''}${c.sort ? ' s' : ''}${sort.k === c.k ? ' on' : ''}" data-sort="${c.sort ? c.k : ''}">${esc(c.label)}${c.sort ? `<span class="ar">${sort.k === c.k ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}</span>` : ''}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr data-id="${r.id}">${cs.map(c => `<td class="${c.cls || ''}">${c.render(r)}</td>`).join('')}</tr>`).join('')}</tbody></table>`
      : '<div class="empty">Không có ứng dụng AI phù hợp bộ lọc</div>';
  }

  function render(el, params) {
    const pk = JSON.stringify(params || {});
    if (pk !== lastPk) { lastPk = pk; if (pk !== '{}') f = { ...F0, ...params }; }
    el.innerHTML = `
      <div class="phd"><div><h2>Ứng dụng AI</h2><div class="meta" id="ucCount"></div></div>
        <div class="acts"><button class="btn" id="ucCsv">Xuất CSV</button><button class="btn primary edit-only" id="ucAdd">+ Thêm ứng dụng AI</button></div></div>
      <div class="toolbar">
        <input type="search" data-f="q" placeholder="Tìm công việc, vướng mắc, người thực hiện..." value="${esc(f.q)}">
        ${sel('group', 'Mọi nhóm công việc', U.groupOpts())}
        ${sel('tool', 'Mọi công cụ AI', Object.entries(C.tools).map(([k, v]) => [k, v.label]))}
        ${sel('status', 'Mọi trạng thái', U.statusOpts(C.useCaseStatuses))}
        ${sel('priority', 'Mọi mức ưu tiên', Object.keys(C.priorities).map(p => [p, p]))}
        ${sel('owner', 'Mọi người thực hiện', U.peopleOpts())}
        ${sel('lead', 'Mọi lãnh đạo', U.peopleOpts(p => p.isLead))}
        <button class="btn ghost" id="ucClear">Bỏ lọc</button>
        <span class="sp"></span>
        <div class="seg" id="ucView"><button data-v="0" class="${full ? '' : 'active'}">Gọn</button><button data-v="1" class="${full ? 'active' : ''}">Đầy đủ</button></div>
      </div>
      <div class="tblwrap" id="ucTable"></div>`;
    table();

    el.addEventListener('input', e => { const k = e.target.dataset.f; if (k) { f[k] = e.target.value; table(); } });
    el.addEventListener('click', e => {
      const th = e.target.closest('th[data-sort]');
      if (th && th.dataset.sort) { const k = th.dataset.sort; sort = { k, dir: sort.k === k && sort.dir === 'asc' ? 'desc' : 'asc' }; return table(); }
      const tr = e.target.closest('tr[data-id]'); if (tr) return open(tr.dataset.id);
      const v = e.target.closest('#ucView button'); if (v) { full = v.dataset.v === '1'; U.$$('#ucView button', el).forEach(b => b.classList.toggle('active', b === v)); return table(); }
      if (e.target.closest('#ucClear')) { f = { ...F0 }; lastPk = '{}'; history.replaceState(null, '', '#/usecases'); return AIM.app.refresh(); }
      if (e.target.closest('#ucAdd')) return edit(null);
      if (e.target.closest('#ucCsv')) return exportCsv();
    });
  }

  /* ---------- Chi tiết ---------- */
  function ladder(uc) {
    const cur = L.currentLevel(uc), rec = L.recommendedLevel(uc);
    return `<div class="ladder">${L.LEVEL_ORDER.map((lv, i) => {
      const m = C.maturity.find(x => x.key === lv);
      const cls = lv === cur ? 'cur' : lv === rec ? 'rec' : '';
      return `${i ? '<em>→</em>' : ''}<span class="${cls}" style="--c:${m.color}" data-tip="${lv === cur ? 'Cấp hiện tại' : lv === rec ? 'Cấp đề xuất theo tiêu chí' : ''}">${m.label}</span>`;
    }).join('')}</div>`;
  }
  function recText(uc) {
    const cr = L.criteria(uc), rec = L.recommendedLevel(uc);
    const miss = C.agentCriteria.filter(c => !cr[c.key]).map(c => c.label.toLowerCase());
    let t;
    if (rec === 'agent') t = 'Đủ 05 tiêu chí. Có thể xem xét phát triển Agent.';
    else if (rec === 'skill') t = 'Phù hợp chuẩn hóa thành Skill/workflow. Chưa đủ tiêu chí Agent: ' + miss.join('; ') + '.';
    else t = 'Dùng Prompt là phù hợp. Chưa đủ tiêu chí Agent: ' + miss.join('; ') + '.';
    let html = `<div class="recbox">${esc(t)}</div>`;
    if (L.agentMismatch(uc)) html += `<div class="recbox warn" style="margin-top:8px">Đang có Agent cho ứng dụng AI này trong khi chưa đủ 05 tiêu chí. Cần rà soát lại cấp độ.</div>`;
    return html;
  }
  function critList(uc) {
    const cr = L.criteria(uc);
    return `<div class="critlist">${C.agentCriteria.map(c => `<div><span class="ck ${cr[c.key] ? 'y' : 'n'}">${cr[c.key] ? '✓' : '–'}</span>${esc(c.label)}${c.auto ? `<small>${esc(c.rule)}</small>` : '<small>đầu mối đánh giá</small>'}</div>`).join('')}</div>`;
  }
  function linked(uc) {
    const lib = L.libFor(uc.id);
    if (!lib.length) return '<div class="faint" style="font-size:12.5px">Chưa có sản phẩm AI liên quan</div>';
    const tab = { prompt: 'prompts', skill: 'skills', agent: 'agents' };
    return `<div class="linked">${lib.map(x => `<a data-lib="${x.id}">${U.type(x.type)}<span class="sp">${esc(x.name)}</span>${U.status(x.status)}
      <b class="golib" data-golib="${tab[x.type]}" data-q="${esc(x.id)}" data-tip="Mở trong thư viện ${esc((C.types[x.type] || {}).label)}">↗</b></a>`).join('')}</div>`;
  }

  function open(id) {
    const uc = S.get('useCases', id); if (!uc) return;
    const p = U.drawer({
      title: esc(uc.task),
      sub: `<span class="faint">${esc(uc.id)}</span>${U.grp(uc.groupId)}${U.status(uc.status)}${U.prio(uc.priority)}`,
      body: `
        <div class="dsec">Hiệu quả trước và sau AI</div>
        <div class="compare">
          <div><span>Trước AI</span><b>${hrs(uc.before)} <small style="font-size:12px">giờ/lần</small></b></div>
          <div><span>Sau AI</span><b>${hrs(uc.after)} <small style="font-size:12px">giờ/lần</small></b></div>
          <div><span>Tiết kiệm</span><b class="gain">${pct(L.savedPct(uc))}</b></div>
        </div>
        <dl class="dl" style="margin-top:12px">
          <dt>Giờ tiết kiệm/tháng</dt><dd><b>${nf(L.savedHours(uc), 1)}</b> (${nf(uc.perMonth, uc.perMonth % 1 ? 2 : 0)} lần/tháng)</dd>
          <dt>Cải thiện chất lượng</dt><dd>${U.dots(+uc.quality)} <span class="muted" style="margin-left:6px">${esc(C.quality[uc.quality] || '')}</span></dd>
        </dl>
        <div class="dsec">Mô tả công việc</div>
        <dl class="dl">
          <dt>Vướng mắc</dt><dd>${esc(uc.pain)}</dd>
          <dt>Cách làm hiện tại</dt><dd>${esc(uc.current)}</dd>
          <dt>AI/Copilot hỗ trợ</dt><dd>${esc(uc.aiStep)}</dd>
        </dl>
        <div class="dsec">Phân công và tiến độ</div>
        <dl class="dl">
          <dt>Người thực hiện</dt><dd class="plist">${L.owners(uc).map(id => `<a data-person="${id}">${U.avatar(id, 22)}${esc(U.pname(id))}</a>`).join('')}</dd>
          <dt>Lãnh đạo phụ trách</dt><dd>${esc(U.pname(uc.leadId))}</dd>
          <dt>Tần suất</dt><dd>${esc(C.frequencies[uc.freq]?.label || '')}</dd>
          <dt>Công cụ AI</dt><dd>${esc((C.tools[uc.tool] || {}).label || '–')}<div class="faint" style="font-size:11.5px">${esc((C.tools[uc.tool] || {}).note || '')}</div></dd>
          <dt>Việc tiếp theo</dt><dd>${esc(uc.next || '–')}</dd>
          <dt>Thời hạn</dt><dd>${U.due(uc.deadline)}</dd>
        </dl>
        <div class="dsec">Cấp độ trưởng thành</div>
        ${ladder(uc)}${recText(uc)}
        <div style="margin-top:12px">${critList(uc)}</div>
        <div class="dsec">Sản phẩm AI liên quan</div>
        ${linked(uc)}`,
      foot: `<button class="btn danger edit-only l" data-del>Xóa</button><button class="btn" data-close>Đóng</button><button class="btn primary edit-only" data-edit>Sửa</button>`
    });
    p.addEventListener('click', async e => {
      if (e.target.closest('[data-edit]')) return edit(uc);
      if (e.target.closest('[data-del]')) { if (confirm('Xóa ứng dụng AI ' + uc.id + '?')) { U.close(); await S.remove('useCases', uc.id); U.toast('Đã xóa'); } return; }
      const gl = e.target.closest('[data-golib]');
      if (gl) { e.stopPropagation(); U.close(); return AIM.app.go(gl.dataset.golib, { q: gl.dataset.q }); }
      const lb = e.target.closest('[data-lib]'); if (lb) return AIM.lib.open(lb.dataset.lib);
      const ps = e.target.closest('[data-person]'); if (ps) return AIM.views.people.open(ps.dataset.person);
    });
  }

  /* ---------- Thêm/sửa ---------- */
  function fields() {
    return [
      { section: 'Công việc' },
      { k: 'task', label: 'Công việc cụ thể', req: true, span: 2 },
      { k: 'groupId', label: 'Nhóm công việc', type: 'select', options: U.groupOpts() },
      { k: 'tool', label: 'Công cụ AI', type: 'select', options: Object.entries(C.tools).map(([k, v]) => [k, v.label]) },
      { k: 'status', label: 'Trạng thái', type: 'select', options: U.statusOpts(C.useCaseStatuses) },
      { k: 'pain', label: 'Mô tả vướng mắc', type: 'textarea', span: 2 },
      { k: 'current', label: 'Cách thực hiện hiện tại', type: 'textarea', rows: 2 },
      { k: 'aiStep', label: 'AI/Copilot được sử dụng ở bước nào', type: 'textarea', rows: 2 },
      { section: 'Phân công' },
      { k: '__owners', label: 'Người thực hiện', type: 'people', span: 2 },

      { k: 'leadId', label: 'Lãnh đạo phụ trách', type: 'select', options: U.peopleOpts(p => p.isLead) },
      { k: 'priority', label: 'Mức ưu tiên', type: 'select', options: Object.keys(C.priorities).map(p => [p, p]) },
      { k: 'deadline', label: 'Thời hạn', type: 'date' },
      { k: 'next', label: 'Việc tiếp theo', span: 2 },
      { section: 'Hiệu quả' },
      { k: 'freq', label: 'Tần suất công việc', type: 'select', options: Object.entries(C.frequencies).map(([k, v]) => [k, v.label]) },
      { k: 'perMonth', label: 'Số lần/tháng', type: 'number', step: '0.01', min: 0 },
      { k: 'before', label: 'Thời gian trước AI (giờ/lần)', type: 'number', step: '0.1', min: 0 },
      { k: 'after', label: 'Thời gian sau AI (giờ/lần)', type: 'number', step: '0.1', min: 0 },
      { k: 'quality', label: 'Mức cải thiện chất lượng', type: 'select', options: C.quality.map((q, i) => [i, q]).slice(1) },
      { section: 'Tiêu chí nâng cấp (đầu mối đánh giá)' },
      { k: 'crit.multi', label: 'Có nhiều bước', type: 'check' },
      { k: 'crit.stable', label: 'Logic/workflow ổn định', type: 'check' },
      { k: 'crit.io', label: 'Dữ liệu vào/ra tương đối chuẩn hóa', type: 'check', span: 2 }
    ];
  }
  function edit(uc) {
    const isNew = !uc;
    const base = uc || { id: S.nextId('useCases', 'UC-'), groupId: 'g1', status: 'Draft', priority: 'Trung bình', tool: 'chat', freq: 'weekly', perMonth: 4, before: 0, after: 0, quality: 3, crit: {}, ownerIds: [], ownerId: '', leadId: '' };
    const fs = fields();
    const p = U.modal({
      title: isNew ? 'Thêm ứng dụng AI' : 'Sửa ' + esc(base.id), wide: true,
      body: U.form(fs, base),
      foot: `<button class="btn" data-close>Hủy</button><button class="btn primary" data-save>Lưu</button>`
    });
    const freq = p.querySelector('[name="freq"]'), per = p.querySelector('[name="perMonth"]');
    freq.addEventListener('change', () => { per.value = C.frequencies[freq.value].perMonth; });
    p.querySelector('[data-save]').onclick = async () => {
      const obj = U.readForm(p, fs, base);
      if (!obj.task.trim()) { p.querySelector('[name="task"]').focus(); return; }
      obj.quality = +obj.quality;
      obj.ownerIds = U.$$('[data-own]', p).filter(x => x.checked).map(x => x.dataset.own);
      obj.ownerId = obj.ownerIds[0] || '';
      delete obj.__owners;
      U.close(); await S.save('useCases', obj); U.toast(isNew ? 'Đã thêm ứng dụng AI' : 'Đã lưu');
    };
  }

  function exportCsv() {
    const rows = filtered();
    const head = ['Mã', 'Nhóm công việc', 'Công cụ AI', 'Công việc', 'Vướng mắc', 'Người thực hiện', 'Lãnh đạo phụ trách', 'Tần suất', 'Số lần/tháng', 'Cách làm hiện tại', 'AI hỗ trợ ở bước', 'Trước AI (giờ)', 'Sau AI (giờ)', '% tiết kiệm', 'Giờ tiết kiệm/tháng', 'Chất lượng', 'Ưu tiên', 'Trạng thái', 'Cấp hiện tại', 'Cấp đề xuất', 'Việc tiếp theo', 'Thời hạn'];
    const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const lines = rows.map(u => [u.id, U.group(u.groupId).name, (C.tools[u.tool] || {}).label, u.task, u.pain, L.owners(u).map(U.pname).join('; '), U.pname(u.leadId), C.frequencies[u.freq]?.label, u.perMonth, u.current, u.aiStep, u.before, u.after,
      L.savedPct(u).toFixed(0), L.savedHours(u).toFixed(1), u.quality, u.priority, U.stLabel(u.status), L.currentLevel(u), L.recommendedLevel(u), u.next, U.date(u.deadline)].map(q).join(','));
    U.download('ai-use-cases.csv', '﻿' + [head.map(q).join(','), ...lines].join('\r\n'), 'text/csv');
  }

  return { title: 'Ứng dụng AI', menu: 'Ứng dụng AI', count: () => S.all('useCases').length, render, open, edit, critList };
})();
