/* ========================== PEOPLE ==========================
   Thể hiện mức độ tham gia và đóng góp; không xếp hạng cá nhân.
   Thứ tự mặc định: lãnh đạo trước, sau đó theo tên. */
AIM.views.people = (function () {
  const U = AIM.ui, L = AIM.logic, C = AIM.config, S = AIM.store;
  const { esc, nf, pct } = U;
  let f = { q: '', group: '', unit: '' }, lastPk = '{}';

  const usageBars = k => { const sc = (C.usage[k] || C.usage.none).score; return `<span class="ulvl">${[1, 2, 3].map(i => `<i style="background:${i <= sc ? C.usage[k].color : ''}"></i>`).join('')}</span>`; };

  function card(p) {
    const st = L.personStats(p.id);
    return `<div class="pc" data-id="${p.id}">
      <div class="hd">${U.avatar(p.id, 42)}<div><h4>${esc(p.name)}</h4><div>${esc(p.title)}${p.unit ? ' · ' + esc(p.unit) : ''}</div></div></div>
      ${p.field ? `<div class="pfield">Lĩnh vực: ${esc(p.field)}</div>` : ''}
      <div class="grps">${(p.groups || []).map(U.grp).join('')}</div>
      ${p.isLead ? `<div class="stats" data-tip="Số liệu các ứng dụng AI do ${esc(p.name)} phụ trách">
        <div><b>${st.leading.length}</b><span>UC phụ trách</span></div>
        <div><b>${st.leadProducts.length}</b><span>Sản phẩm AI</span></div>
        <div><b>${st.reviews.length}</b><span>Rà soát</span></div>
        <div><b>${nf(st.leadSaved)}</b><span>Giờ/tháng</span></div>
      </div>` : `<div class="stats">
        <div><b>${st.useCases.length}</b><span>Ứng dụng AI</span></div>
        <div><b>${st.prompts.length}</b><span>Prompt</span></div>
        <div><b>${st.skillsAgents.length}</b><span>Skill/Agent</span></div>
        <div><b>${nf(st.saved)}</b><span>Giờ/tháng</span></div>
      </div>`}
      <div class="ft">
        <span>Sử dụng AI</span><span class="upill">${usageBars(p.usage)}${esc(C.usage[p.usage].label)} <span class="faint" style="font-weight:500">· ${p.activeDays || 0}/30 ngày</span></span>
        <span>Nhiệm vụ AI</span>${st.progress == null ? '<span class="faint">Chưa có nhiệm vụ đang triển khai</span>'
          : `<span style="display:flex;align-items:center;gap:8px" data-tip="Bình quân mức hoàn thành của ${st.tasks.length} sản phẩm AI đang phụ trách">${U.bar(st.progress)}<b style="font-size:12px">${pct(st.progress)}</b></span>`}
      </div>
    </div>`;
  }

  function list() {
    const q = f.q.trim().toLowerCase();
    return S.all('people').filter(p => (!q || (p.name + ' ' + p.title + ' ' + (p.field || '')).toLowerCase().includes(q)) && (!f.group || (p.groups || []).includes(f.group)) && (!f.unit || p.unit === f.unit))
      .sort((a, b) => (!!b.isLead - !!a.isLead) || (a.isLead ? 0 : a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0], 'vi')));
  }
  function grid() { U.$('#pGrid').innerHTML = list().map(card).join('') || '<div class="empty">Không có cán bộ phù hợp</div>'; }

  function render(el, params) {
    const pk = JSON.stringify(params || {});
    if (pk !== lastPk) { lastPk = pk; f = { q: '', group: (params && params.group) || '', unit: '' }; }
    const ppl = S.all('people');
    const using = ppl.filter(p => p.usage === 'daily' || p.usage === 'weekly').length;
    el.innerHTML = `
      <div class="phd"><div><h2>Cán bộ</h2><div class="meta">${ppl.length} cán bộ · ${ppl.filter(p => L.hasUseCase(p.id)).length} người đã có ứng dụng AI · ${[...new Set(ppl.map(p => p.unit).filter(Boolean))].length} phòng · mức độ sử dụng Copilot chưa khảo sát</div></div></div>
      <div class="toolbar">
        <input type="search" data-f="q" placeholder="Tìm cán bộ..." value="${esc(f.q)}">
        <select data-f="unit">${U.opt('', 'Mọi phòng', f.unit)}${[...new Set(ppl.map(p => p.unit).filter(Boolean))].map(u => U.opt(u, u, f.unit)).join('')}</select>
        <select data-f="group">${U.opt('', 'Mọi nhóm công việc', f.group)}${U.groupOpts().map(([v, l]) => U.opt(v, l, f.group)).join('')}</select>
        <span class="sp"></span>
        ${U.legend(Object.values(C.usage).map(u => ({ name: u.label, color: u.color })))}
      </div>
      <div class="pgrid" id="pGrid"></div>`;
    U.$('.toolbar .legend', el).style.marginTop = 0;
    grid();
    el.addEventListener('input', e => { const k = e.target.dataset.f; if (k) { f[k] = e.target.value; grid(); } });
    el.addEventListener('click', e => { const c = e.target.closest('.pc'); if (c) open(c.dataset.id); });
  }

  function open(id) {
    const p = S.get('people', id); if (!p) return;
    const st = L.personStats(id);
    const row = (attrs, left, mid, right) => `<a ${attrs}>${left}<span class="sp">${mid}</span>${right}</a>`;
    const d = U.drawer({
      title: esc(p.name),
      sub: `<span>${esc(p.title)}</span>${(p.groups || []).map(U.grp).join('')}`,
      body: `
        <div class="compare" style="grid-template-columns:repeat(4,1fr)">
          <div><span>Ứng dụng AI</span><b>${st.useCases.length}</b></div>
          <div><span>Prompt</span><b>${st.prompts.length}</b></div>
          <div><span>Skill/Agent</span><b>${st.skillsAgents.length}</b></div>
          <div><span>Giờ/tháng</span><b class="gain">${nf(st.saved)}</b></div>
        </div>
        <dl class="dl" style="margin-top:14px">
          <dt>Tần suất sử dụng AI</dt><dd class="upill">${usageBars(p.usage)}${esc(C.usage[p.usage].label)} · ${p.activeDays || 0}/30 ngày có sử dụng Copilot</dd>
          <dt>Tiến độ nhiệm vụ AI</dt><dd>${st.progress == null ? '<span class="faint">Chưa có nhiệm vụ đang triển khai</span>' : `<span style="display:flex;align-items:center;gap:8px;max-width:260px">${U.bar(st.progress)}<b>${pct(st.progress)}</b></span>`}</dd>
          <dt>Rà soát cho đồng nghiệp</dt><dd>${st.reviews.length} mục thư viện</dd>
        </dl>
        ${st.leading.length ? `<div class="dsec">Ứng dụng AI phụ trách (lãnh đạo)</div>
        <div class="linked">${st.leading.map(u => row(`data-uc="${u.id}"`, U.grp(u.groupId), esc(u.task), U.status(u.status))).join('')}</div>` : ''}
        <div class="dsec">Ứng dụng AI đang thực hiện</div>
        ${st.useCases.length ? `<div class="linked">${st.useCases.map(u => row(`data-uc="${u.id}"`, U.grp(u.groupId), esc(u.task), U.status(u.status))).join('')}</div>` : '<div class="faint" style="font-size:12.5px">Chưa có ứng dụng AI</div>'}
        <div class="dsec">Đóng góp vào thư viện AI</div>
        ${st.prompts.concat(st.skillsAgents).length ? `<div class="linked">${st.prompts.concat(st.skillsAgents).map(x => row(`data-lib="${x.id}"`, U.type(x.type), esc(x.name), U.status(x.status))).join('')}</div>` : '<div class="faint" style="font-size:12.5px">Chưa có đóng góp</div>'}
        <div class="dsec">Mục đang rà soát cho đồng nghiệp</div>
        ${st.reviews.length ? `<div class="linked">${st.reviews.map(x => row(`data-lib="${x.id}"`, U.type(x.type), esc(x.name), U.status(x.status))).join('')}</div>` : '<div class="faint" style="font-size:12.5px">Chưa có mục nào</div>'}`,
      foot: `<button class="btn" data-close>Đóng</button><button class="btn primary edit-only" data-edit>Cập nhật</button>`
    });
    d.addEventListener('click', e => {
      const u = e.target.closest('[data-uc]'); if (u) return AIM.views.usecases.open(u.dataset.uc);
      const l = e.target.closest('[data-lib]'); if (l) return AIM.lib.open(l.dataset.lib);
      if (e.target.closest('[data-edit]')) edit(p);
    });
  }

  function edit(p) {
    const fs = [
      { k: 'name', label: 'Họ tên', req: true },
      { k: 'unit', label: 'Phòng' },
      { k: 'field', label: 'Lĩnh vực chính' },
      { k: 'title', label: 'Chức danh' },
      { k: 'usage', label: 'Tần suất sử dụng AI', type: 'select', options: Object.entries(C.usage).map(([k, v]) => [k, v.label]) },
      { k: 'activeDays', label: 'Số ngày có sử dụng Copilot / 30 ngày', type: 'number', min: 0 },
      { k: 'isLead', label: 'Lãnh đạo Ban', type: 'check', span: 2 }
    ];
    const groups = S.all('groups');
    const m = U.modal({
      title: 'Cập nhật ' + esc(p.name),
      body: U.form(fs, p) + `<div class="fsec" style="margin-top:14px">Nhóm công việc phụ trách</div>
        <div class="frm" style="margin-top:8px">${groups.map(g => `<label class="fchk"><input type="checkbox" data-g="${g.id}"${(p.groups || []).includes(g.id) ? ' checked' : ''}> ${esc(g.name)}</label>`).join('')}</div>`,
      foot: `<button class="btn" data-close>Hủy</button><button class="btn primary" data-save>Lưu</button>`
    });
    m.querySelector('[data-save]').onclick = async () => {
      const obj = U.readForm(m, fs, p);
      obj.groups = U.$$('[data-g]', m).filter(x => x.checked).map(x => x.dataset.g);
      U.close(); await S.save('people', obj); U.toast('Đã lưu');
    };
  }

  return { title: 'Cán bộ', menu: 'Cán bộ', count: () => S.all('people').length, render, open };
})();
