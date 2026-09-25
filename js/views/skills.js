/* ========================== TAB SKILLS ==========================
   Skill = chuỗi bước chuẩn hóa cho một ứng dụng AI, dùng lại được cho cả Ban. */
AIM.views.skills = (function () {
  const U = AIM.ui, L = AIM.logic, C = AIM.config, S = AIM.store, LIB = AIM.lib;
  const { esc, nf } = U;
  let f = { q: '', group: '', status: '', builder: '', domain: '' };

  function card(x) {
    const uc = LIB.ucOf(x);
    const steps = x.steps || [];
    return `<div class="lib sk${x.status === 'Deprecated' ? ' dep' : ''}" data-id="${x.id}">
      <div class="skbar"></div>
      <div class="ah"><div><span class="pid">${esc(x.id)} · ${esc(x.version)}</span><h4>${esc(x.name)}</h4></div>
        <div class="pmeta">${U.status(x.status)}${U.aud(x.audience)}</div></div>
      <p class="ppur">${esc(x.purpose)}</p>
      ${steps.length ? `<ol class="stepline">${steps.map(t => `<li><span>${esc(t)}</span></li>`).join('')}</ol>` : ''}
      <div class="skgain"><b>${nf(LIB.benefit(x), 1)}</b> giờ/tháng<span>${esc(uc ? (C.tools[uc.tool] || {}).label : '')}</span></div>
      <div class="pf">
        ${uc ? `<a data-uc="${uc.id}" style="cursor:pointer">${esc(uc.task)}</a>` : ''}
        <span class="sp"></span>
        <span class="faint">${x.deadline ? 'hạn ' + U.date(x.deadline) : ''}</span>
        ${U.avatar(x.builderId, 20)}<span>${esc(U.pname(x.builderId))}</span>
        <button class="btn sm" data-copy="${x.id}">Sao chép</button>
      </div>
    </div>`;
  }

  function grid() {
    const list = LIB.items('skill', f);
    U.$('#libWrap').innerHTML = list.length ? `<div class="libgrid">${list.map(card).join('')}</div>` : '<div class="empty">Chưa có skill phù hợp</div>';
  }

  let lastPk = '{}';
  function render(el, params) {
    const pk = JSON.stringify(params || {});
    if (pk !== lastPk) { lastPk = pk; if (params && params.q) f = { ...f, q: params.q }; }
    const all = S.all('library').filter(x => x.type === 'skill');
    el.innerHTML = `
      <div class="phd"><div><h2>Skill</h2><div class="meta">${all.length} skill · ${all.filter(x => x.status === 'Approved').length} đã duyệt · tiết kiệm ${nf(all.filter(x => x.status !== 'Deprecated').reduce((a, x) => a + LIB.benefit(x), 0))} giờ/tháng</div></div>
        <div class="acts"><button class="btn primary edit-only" data-add>+ Thêm Skill</button></div></div>
      ${LIB.pipeline(all)}
      ${LIB.filterBar('skill', f)}
      <div id="libWrap"></div>`;
    grid();
    LIB.wire(el, f, grid, 'skill');
  }

  return { title: 'Skill', menu: 'Skill', count: () => S.all('library').filter(x => x.type === 'skill' && x.status !== 'Deprecated').length, render };
})();
