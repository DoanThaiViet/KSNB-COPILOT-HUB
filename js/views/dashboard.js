/* ========================== DASHBOARD ========================== */
AIM.views.dashboard = (function () {
  const U = AIM.ui, L = AIM.logic, C = AIM.config, S = AIM.store;
  const { esc, nf, hrs, pct } = U;
  let adoptMode = 'group';

  function kpis(sm) {
    const leads = S.all('people').filter(p => p.isLead).length;
    const st = C.statuses, bs = sm.byStatus, tot = sm.useCases || 1;
    const stack = C.useCaseStatuses.map(s => `<i style="width:${bs[s] / tot * 100}%;background:${st[s].color}" data-tip="${U.stLabel(s)}: ${bs[s]} ứng dụng AI"></i>`).join('');
    const t = C.types;
    return `<div class="kpis">
      <div class="kpi go" data-nav="people"><div class="l">Tổng số cán bộ</div><div class="v">${sm.people}</div>
        <div class="s">${leads} lãnh đạo · ${sm.people - leads} chuyên viên</div></div>
      <div class="kpi go" data-nav="people"><div class="l">Cán bộ đã có AI ứng dụng AI</div><div class="v">${sm.withUseCase}<small> / ${sm.people}</small></div>
        <div class="s"><b>${pct(sm.withUseCase / (sm.people || 1) * 100)}</b> cán bộ tham gia</div></div>
      <div class="kpi go" data-nav="usecases"><div class="l">Tổng số ứng dụng AI</div><div class="v">${sm.useCases}</div>
        <div class="s"><div class="kstack" style="margin:0 0 6px">${stack}</div>
        <div style="display:flex;flex-wrap:wrap;gap:0 8px">${C.useCaseStatuses.map(s => `<span style="white-space:nowrap"><b style="color:${st[s].color}">${pct(bs[s] / tot * 100)}</b> ${U.stLabel(s)}</span>`).join('')}</div></div></div>
      <div class="kpi go" data-nav="prompts"><div class="l">Prompt · Skill · Agent</div>
        <div class="tri">${Object.keys(t).map(k => `<div><b style="color:${t[k].color}">${sm.byType[k]}</b><span>${t[k].label}</span></div>`).join('')}</div>
        <div class="s">Không tính mục đã ngừng dùng</div></div>
      <div class="kpi"><div class="l">Thời gian tiết kiệm ước tính</div><div class="v">${nf(sm.saved)}<small> giờ/tháng</small></div>
        <div class="s">Ước tính theo khai báo của đầu mối</div></div>
      <div class="kpi go" data-nav="roadmap"><div class="l">Tỷ lệ hoàn thành kế hoạch</div><div class="v">${pct(sm.plan.actual)}</div>
        <div class="s">${U.bar(sm.plan.actual, 'linear-gradient(90deg,#006838,#00a651)', sm.plan.planned)}
        <div style="margin-top:5px">Kế hoạch đến nay: <b>${pct(sm.plan.planned)}</b></div></div></div>
    </div>`;
  }

  function adoption() {
    const us = C.usage, keys = Object.keys(us);
    const ppl = S.all('people');
    let rows;
    if (adoptMode === 'group') {
      rows = S.all('groups').map(g => {
        const mem = ppl.filter(p => (p.groups || []).includes(g.id));
        return { label: g.name, attrs: `data-nav="people?group=${g.id}"`,
          parts: keys.map(k => ({ v: mem.filter(p => p.usage === k).length, color: us[k].color, name: us[k].label })),
          valueLabel: mem.length + ' người' };
      });
      return U.stackBars(rows, { labelWidth: 170, unit: 'người' }) + U.legend(keys.map(k => ({ name: us[k].label, color: us[k].color })));
    }
    const order = S.all('groups').map(g => g.id);
    rows = [...ppl].sort((a, b) => (order.indexOf((a.groups || [])[0]) - order.indexOf((b.groups || [])[0])) || a.name.localeCompare(b.name, 'vi'))
      .map(p => ({ label: p.name, sub: U.group((p.groups || [])[0]).short, attrs: `data-person="${p.id}"`,
        parts: [{ v: p.activeDays || 0, color: us[p.usage].color, name: 'Ngày có sử dụng / 30 ngày (' + us[p.usage].label + ')' }],
        valueLabel: (p.activeDays || 0) + '/30' }));
    return U.stackBars(rows, { max: 30, labelWidth: 170, compact: true, unit: 'ngày' }) + U.legend(keys.map(k => ({ name: us[k].label, color: us[k].color })));
  }

  function byType() {
    const lib = S.all('library'), T = C.types, keys = Object.keys(T);
    const active = lib.filter(x => x.status !== 'Deprecated');
    const d = U.donut(keys.map(k => ({ v: active.filter(x => x.type === k).length, color: T[k].color, name: T[k].label, attrs: `data-nav="${k === 'prompt' ? 'prompts' : k + 's'}"` })), { center: active.length, label: 'sản phẩm AI' });
    const sts = C.libraryStatuses;
    const max = Math.max(1, ...keys.map(k => lib.filter(x => x.type === k).length));
    return `<div class="typebox">${d}<div class="typelist">${keys.map(k => {
      const items = lib.filter(x => x.type === k);
      return `<div class="row" data-nav="${k === 'prompt' ? 'prompts' : k + 's'}"><b>${T[k].label}</b>
        <div class="sbt">${items.length ? `<i style="width:${items.length / max * 100}%;background:${T[k].color}" data-tip="${T[k].label}: ${items.length}"></i>` : ''}</div>
        <span style="text-align:right;font-weight:700">${items.length}</span></div>`;
    }).join('')}</div></div>`;
  }

  function byGroup() {
    const ucs = S.all('useCases');
    const rows = S.all('groups').map(g => ({
      label: g.name, attrs: `data-nav="usecases?group=${g.id}"`,
      parts: [{ v: ucs.filter(u => u.groupId === g.id).length, color: '#00843d', name: 'Ứng dụng AI' }]
    }));
    return U.stackBars(rows, { labelWidth: 170, unit: 'ứng dụng AI' });
  }

  function top() {
    const ucs = [...S.all('useCases')].sort((a, b) => L.savedHours(b) - L.savedHours(a)).slice(0, 8);
    const rows = ucs.map(u => ({
      label: u.task, sub: U.group(u.groupId).short + ' · ' + U.hrs(u.before) + ' → ' + U.hrs(u.after) + ' giờ/lần · ' + C.frequencies[u.freq].label.toLowerCase(),
      attrs: `data-uc="${u.id}"`,
      parts: [{ v: L.savedHours(u), color: '#00843d', name: 'Tiết kiệm' }],
      valueLabel: nf(L.savedHours(u), 1)
    }));
    return U.stackBars(rows, { labelWidth: 250, fmt: v => nf(v, 1), unit: 'giờ/tháng' });
  }

  function byTool() {
    const ucs = S.all('useCases');
    const rows = Object.entries(C.tools).map(([k, t]) => ({
      label: t.label, attrs: `data-nav="usecases?tool=${k}"`,
      parts: [{ v: ucs.filter(u => u.tool === k).length, color: '#00843d', name: 'Ứng dụng AI' }]
    })).filter(r => r.parts.some(p => p.v > 0));
    return U.stackBars(rows, { labelWidth: 190, unit: 'ứng dụng AI' });
  }

  function roadmap() {
    return `<div class="sbars">${S.all('milestones').map(m => {
      const a = L.milestoneProgress(m), p = L.milestonePlanned(m), st = L.milestoneState(m);
      return `<div class="sbr go" data-nav="roadmap" style="grid-template-columns:260px 1fr 150px">
        <div class="sbl">${esc(m.name)}<small>${U.date(m.end)}</small></div>
        <div data-tip="Thực tế ${pct(a)} · Kế hoạch đến nay ${pct(p)}">${U.bar(a, st.color, p)}</div>
        <div class="sbv"><span style="color:${st.color}">${pct(a)}</span> <span class="faint" style="font-weight:600;font-size:11.5px">· ${st.label}</span></div></div>`;
    }).join('')}</div>${U.legend([{ name: 'Thực tế', color: '#00843d' }, { name: 'Kế hoạch đến ngày tham chiếu', color: '#cfd8e3' }])}`;
  }

  function render(el) {
    const sm = L.summary();
    el.innerHTML = `
      <div class="phd"><div><h2>Tổng quan triển khai AI</h2><div class="meta">${esc(C.unitName)} · ${S.all('groups').length} nhóm công việc · ${sm.useCases} ứng dụng AI</div></div></div>
      ${kpis(sm)}
      <div class="grid g21 mb">
        <div class="card"><div class="ctitle"><h3>Mức độ sử dụng AI</h3>
          <div class="seg" id="adoptSeg"><button data-m="group" class="${adoptMode === 'group' ? 'active' : ''}">Theo nhóm</button><button data-m="person" class="${adoptMode === 'person' ? 'active' : ''}">Theo cán bộ</button></div></div>
          <div id="adoptBox">${adoption()}</div></div>
        <div class="card"><div class="ctitle"><h3>Prompt · Skill · Agent</h3><small>theo trạng thái</small></div>${byType()}</div>
      </div>
      <div class="grid g12 mb">
        <div class="card"><div class="ctitle"><h3>Ứng dụng AI theo nhóm công việc</h3><small>bấm để lọc</small></div>${byGroup()}</div>
        <div class="card"><div class="ctitle"><h3>Ứng dụng AI tạo hiệu quả cao nhất</h3><small>giờ tiết kiệm/tháng</small></div>${top()}</div>
      </div>
      <div class="grid g12">
        <div class="card"><div class="ctitle"><h3>Ứng dụng AI theo công cụ AI</h3><small>bấm để lọc</small></div>${byTool()}</div>
        <div class="card"><div class="ctitle"><h3>Lộ trình triển khai</h3><small>thực tế so với kế hoạch</small></div>${roadmap()}</div>
      </div>`;

    el.addEventListener('click', e => {
      const seg = e.target.closest('#adoptSeg button');
      if (seg) { adoptMode = seg.dataset.m; U.$$('#adoptSeg button', el).forEach(b => b.classList.toggle('active', b === seg)); U.$('#adoptBox', el).innerHTML = adoption(); return; }
      const uc = e.target.closest('[data-uc]'); if (uc) return AIM.views.usecases.open(uc.dataset.uc);
      const ps = e.target.closest('[data-person]'); if (ps) return AIM.views.people.open(ps.dataset.person);
      const n = e.target.closest('[data-nav]');
      if (n) { const [k, q] = n.dataset.nav.split('?'); AIM.app.go(k, q ? Object.fromEntries(new URLSearchParams(q)) : null); }
    });
  }

  return { title: 'Tổng quan', menu: 'Tổng quan', render };
})();
