/* ========================== TAB AGENTS ==========================
   Agent chỉ đặt ra khi ứng dụng AI đủ 05 tiêu chí; màn này luôn hiển thị
   việc đối chiếu tiêu chí để tránh tự động hóa khi chưa đủ điều kiện. */
AIM.views.agents = (function () {
  const U = AIM.ui, L = AIM.logic, C = AIM.config, S = AIM.store, LIB = AIM.lib;
  const { esc, nf } = U;
  let f = { q: '', group: '', status: '', builder: '', domain: '' }, view = 'graph';

  function dots(uc) {
    const cr = uc ? L.criteria(uc) : {};
    const n = C.agentCriteria.filter(c => cr[c.key]).length;
    return `<span class="dots5" data-tip="${C.agentCriteria.map(c => (cr[c.key] ? '✓ ' : '· ') + esc(c.label)).join('<br>')}">
      ${C.agentCriteria.map(c => `<i class="${cr[c.key] ? 'on' : ''}"></i>`).join('')}
      <b>${n}/5 tiêu chí</b></span>`;
  }

  function card(x) {
    const uc = LIB.ucOf(x);
    const ok = uc ? L.agentCandidate(uc) : false;
    return `<div class="acard${x.status === 'Deprecated' ? ' dep' : ''}" data-id="${x.id}">
      <div class="ah">
        <div><span class="pid">${esc(x.id)} · ${esc(x.version)}</span><h4>${esc(x.name)}</h4></div>
        <div class="pmeta">${U.status(x.status)}${U.aud(x.audience)}</div>
      </div>
      <p class="ppur">${esc(x.purpose)}</p>
      <div class="aflow">
        <div class="anode"><em>Kích hoạt</em><span>${esc(x.trigger || '–')}</span></div>
        <div class="aarrow">→</div>
        <div class="anode mid"><em>Dữ liệu agent dùng</em><span>${esc(x.dataScope || x.input || '–')}</span></div>
        <div class="aarrow">→</div>
        <div class="anode"><em>Kết quả</em><span>${esc(x.output || '–')}</span></div>
      </div>
      <div class="aguard"><em>Giới hạn</em>${esc(x.guardrails || '–')}</div>
      <div class="af">
        ${dots(uc)}
        <span class="agflag ${ok ? 'ok' : 'no'}">${ok ? 'Đủ điều kiện tự động hóa' : 'Chưa đủ điều kiện'}</span>
        <span class="sp"></span>
        <span class="agben"><b>${nf(LIB.benefit(x), 1)}</b> giờ/tháng</span>
      </div>
      <div class="pf">
        ${uc ? `<a data-uc="${uc.id}" style="cursor:pointer">${esc(uc.task)}</a>` : ''}
        <span class="sp"></span>${U.avatar(x.builderId, 20)}<span>${esc(U.pname(x.builderId))}</span>
        <button class="btn sm" data-copy="${x.id}">Sao chép</button>
      </div>
    </div>`;
  }

  /* ---- Sơ đồ mạng lưới: lĩnh vực → ứng dụng AI → agent ---- */
  function graph() {
    const list = LIB.items('agent', f);
    if (!list.length) return '<div class="empty">Chưa có agent phù hợp</div>';
    const rows = list.map(x => ({ x, uc: LIB.ucOf(x), dom: U.domain(x.domainId) }));
    const H = 150, top = 40;
    const h = rows.length * H + top + 30;
    const cx = [130, 470, 830], W = 980;
    const node = (x, y, w, hh, cls, html) =>
      `<foreignObject x="${x - w / 2}" y="${y - hh / 2}" width="${w}" height="${hh}"><div class="gn ${cls}">${html}</div></foreignObject>`;
    const link = (x1, y1, x2, y2, col) =>
      `<path d="M${x1} ${y1} C${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}" stroke="${col}" fill="none" stroke-width="2" opacity=".55"/>`;

    let svg = '', links = '';
    rows.forEach((r, i) => {
      const y = top + i * H + H / 2;
      const col = C.groupPalette[C.domains.findIndex(d => d.id === r.x.domainId) % C.groupPalette.length];
      const stc = (C.statuses[r.x.status] || {}).color;
      links += link(cx[0] + 100, y, cx[1] - 150, y, col) + link(cx[1] + 150, y, cx[2] - 150, y, stc);
      svg += node(cx[0], y, 200, 56, 'dom', `<span style="--c:${col}">${esc(r.dom.short)}</span><em>${esc(r.dom.name)}</em>`);
      svg += node(cx[1], y, 300, 86, 'uc', r.uc
        ? `<em>ỨNG DỤNG AI</em><b>${esc(r.uc.task)}</b><i>${esc((C.tools[r.uc.tool] || {}).label || '')} · ${nf(L.savedHours(r.uc), 1)} giờ/tháng</i>`
        : '<em>Chưa gắn ứng dụng</em>');
      svg += node(cx[2], y, 300, 96, 'ag" data-id="' + r.x.id,
        `<em style="color:${stc}">${esc(r.x.id)} · ${esc(U.stLabel(r.x.status))}</em><b>${esc(r.x.name)}</b>
         <span class="gd">${C.agentCriteria.map(c => `<i class="${L.criteria(r.uc || { crit: {} })[c.key] ? 'on' : ''}"></i>`).join('')} ${r.uc ? C.agentCriteria.filter(c => L.criteria(r.uc)[c.key]).length : 0}/5</span>`);
    });
    return `<div class="gwrap"><svg viewBox="0 0 ${W} ${h}" width="100%" height="${h}" class="gsvg">
      <text x="${cx[0]}" y="22" class="gh">LĨNH VỰC</text>
      <text x="${cx[1]}" y="22" class="gh">ỨNG DỤNG AI</text>
      <text x="${cx[2]}" y="22" class="gh">AGENT</text>
      ${links}${svg}</svg></div>`;
  }

  function grid() {
    const list = LIB.items('agent', f);
    U.$('#libWrap').innerHTML = view === 'graph' ? graph()
      : (list.length ? `<div class="libgrid">${list.map(card).join('')}</div>` : '<div class="empty">Chưa có agent phù hợp</div>');
  }

  let lastPk = '{}';
  function render(el, params) {
    const pk = JSON.stringify(params || {});
    if (pk !== lastPk) { lastPk = pk; if (params && params.q) f = { ...f, q: params.q }; }
    const all = S.all('library').filter(x => x.type === 'agent');
    const has = new Set(all.filter(x => x.status !== 'Deprecated').map(x => x.useCaseId));
    const cand = S.all('useCases').filter(u => L.agentCandidate(u) && !has.has(u.id));
    el.innerHTML = `
      <div class="phd"><div><h2>Agent</h2><div class="meta">${all.length} agent · ${all.filter(x => x.status === 'Testing').length} đang thử nghiệm · ${cand.length} ứng dụng AI đủ điều kiện chưa có agent</div></div>
        <div class="acts">
          <div class="seg" id="vwSeg"><button data-v="graph" class="${view === 'graph' ? 'active' : ''}">Sơ đồ</button><button data-v="list" class="${view === 'list' ? 'active' : ''}">Danh sách</button></div>
          <button class="btn primary edit-only" data-add>+ Thêm Agent</button></div></div>
      ${LIB.pipeline(all)}
      ${LIB.filterBar('agent', f)}
      <div id="libWrap" class="wide"></div>`;
    grid();
    LIB.wire(el, f, grid, 'agent');
    el.addEventListener('click', e => {
      const v = e.target.closest('#vwSeg button');
      if (v) { view = v.dataset.v; U.$$('#vwSeg button', el).forEach(b => b.classList.toggle('active', b === v)); grid(); }
    });
  }

  return { title: 'Agent', menu: 'Agent', count: () => S.all('library').filter(x => x.type === 'agent' && x.status !== 'Deprecated').length, render };
})();
