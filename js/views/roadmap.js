/* ========================== ROADMAP ========================== */
AIM.views.roadmap = (function () {
  const U = AIM.ui, L = AIM.logic, S = AIM.store;
  const { esc, pct } = U;
  const MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  /* Trục thời gian: từ đầu tháng của mốc sớm nhất đến cuối tháng của mốc muộn nhất */
  function range(ms) {
    const s = new Date(Math.min(...ms.map(m => L.parse(m.start))));
    const e = new Date(Math.max(...ms.map(m => L.parse(m.end))));
    const a = new Date(s.getFullYear(), s.getMonth(), 1), b = new Date(e.getFullYear(), e.getMonth() + 1, 1);
    const months = []; for (let d = new Date(a); d < b; d.setMonth(d.getMonth() + 1)) months.push(new Date(d));
    return { a, b, months, x: d => Math.max(0, Math.min(100, (d - a) / (b - a) * 100)) };
  }

  function render(el) {
    const ms = S.all('milestones');
    if (!ms.length) { el.innerHTML = '<div class="empty">Chưa có mốc kế hoạch</div>'; return; }
    const R = range(ms), t = L.today(), pc = L.planCompletion();
    const dels = ms.flatMap(m => m.deliverables || []);
    const next = ms.filter(m => L.milestoneProgress(m) < 100).sort((a, b) => a.end.localeCompare(b.end))[0];
    const tx = R.x(t);

    el.innerHTML = `
      <div class="phd"><div><h2>Lộ trình triển khai</h2><div class="meta">Kế hoạch triển khai AI · ${U.date(ms[0].start)} – ${U.date(ms[ms.length - 1].end)}</div></div></div>
      <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
        <div class="kpi"><div class="l">Hoàn thành kế hoạch</div><div class="v">${pct(pc.actual)}</div>
          <div class="s">${U.bar(pc.actual, 'linear-gradient(90deg,#006838,#00a651)', pc.planned)}<div style="margin-top:5px">Kế hoạch đến nay: <b>${pct(pc.planned)}</b></div></div></div>
        <div class="kpi"><div class="l">Mốc đã hoàn thành</div><div class="v">${ms.filter(m => L.milestoneProgress(m) >= 100).length}<small> / ${ms.length}</small></div></div>
        <div class="kpi"><div class="l">Sản phẩm đầu ra đã xong</div><div class="v">${dels.filter(d => d.done).length}<small> / ${dels.length}</small></div></div>
        <div class="kpi"><div class="l">Mốc kế tiếp</div><div class="v" style="font-size:26px">${next ? U.date(next.end) : '–'}</div>
          <div class="s">${next ? esc(next.name) : 'Đã hoàn thành toàn bộ'}</div></div>
      </div>
      <div class="rm">
        <div class="rmhead"><div>Mốc</div><div class="rmmonths">${R.months.map(d => `<span>${MONTHS[d.getMonth()]}</span>`).join('')}</div><div>Thực tế / Kế hoạch</div></div>
        ${ms.map(m => {
          const s = R.x(L.parse(m.start)), e = R.x(L.parse(m.end)), act = L.milestoneProgress(m), plan = L.milestonePlanned(m), st = L.milestoneState(m);
          return `<div class="rmrow" data-id="${m.id}">
            <div class="rmname"><div class="d">${U.date(m.end)}</div><div class="n">${esc(m.name)}</div></div>
            <div class="rmtrack">
              <div class="rmgrid">${R.months.map(() => '<span></span>').join('')}</div>
              <div class="rmplan" style="left:${s}%;width:${e - s}%" data-tip="<b>Kế hoạch</b>: ${U.date(m.start)} – ${U.date(m.end)}<br>Đến ngày tham chiếu: ${pct(plan)}"></div>
              <div class="rmact" style="left:${s}%;width:${(e - s) * act / 100}%;background:${st.key === 'behind' || st.key === 'late' ? 'linear-gradient(90deg,#c9861f,#E0982A)' : ''}" data-tip="<b>Thực tế</b>: ${pct(act)} sản phẩm đầu ra${m.actualEnd ? '<br>Hoàn thành ngày ' + U.date(m.actualEnd) : ''}"></div>
              <div class="rmdiamond" style="left:${e}%" data-tip="Mốc ${U.date(m.end)}"></div>
            </div>
            <div class="rmstat"><div class="p"><b style="color:${st.color}">${pct(act)}</b><span class="faint">KH ${pct(plan)}</span></div>
              ${U.bar(act, st.color, plan)}<div style="margin-top:5px;font-weight:600;color:${st.color}">${st.label}</div></div>
          </div>`;
        }).join('')}
        <div class="rmtoday" data-l="Hôm nay ${U.shortDate(L.iso(t))}" style="left:calc(300px + (100% - 450px) * ${tx / 100})"></div>
      </div>
      ${U.legend([{ name: 'Kế hoạch', color: '#d7deea' }, { name: 'Thực tế (tỷ lệ sản phẩm đầu ra đã xong)', color: '#00843d' }, { name: 'Chậm so kế hoạch', color: '#E0982A' }, { name: 'Ngày tham chiếu', color: '#d8584e' }])}`;

    el.addEventListener('click', e => { const r = e.target.closest('.rmrow'); if (r) open(r.dataset.id); });
  }

  function open(id) {
    const m = S.get('milestones', id); if (!m) return;
    const ro = !AIM.app.canEdit(), st = L.milestoneState(m);
    const p = U.modal({
      title: esc(m.name),
      sub: `<span>${U.date(m.start)} – ${U.date(m.end)}</span><span style="color:${st.color};font-weight:700">${st.label}</span><span>Đầu mối: ${esc(U.pname(m.ownerId))}</span>`,
      body: `<div class="compare" style="margin-bottom:16px">
          <div><span>Thực tế</span><b style="color:${st.color}">${pct(L.milestoneProgress(m))}</b></div>
          <div><span>Kế hoạch đến nay</span><b>${pct(L.milestonePlanned(m))}</b></div>
          <div><span>Ngày hoàn thành</span><b style="font-size:16px">${m.actualEnd ? U.date(m.actualEnd) : '–'}</b></div></div>
        <div class="dsec">Sản phẩm đầu ra</div>
        <div class="mlist">${m.deliverables.map((d, i) => `<label class="${d.done ? 'done' : ''}"><input type="checkbox" data-i="${i}"${d.done ? ' checked' : ''}${ro ? ' disabled' : ''}>${esc(d.t)}</label>`).join('')}</div>`,
      foot: ro ? '<button class="btn" data-close>Đóng</button>' : '<button class="btn" data-close>Hủy</button><button class="btn primary" data-save>Lưu</button>'
    });
    const save = p.querySelector('[data-save]');
    if (save) save.onclick = async () => {
      const deliverables = m.deliverables.map((d, i) => ({ ...d, done: p.querySelector(`[data-i="${i}"]`).checked }));
      const allDone = deliverables.every(d => d.done);
      const actualEnd = allDone ? (m.actualEnd || L.iso(L.today())) : '';
      U.close(); await S.save('milestones', { ...m, deliverables, actualEnd }); U.toast('Đã cập nhật tiến độ');
    };
  }

  return { title: 'Lộ trình triển khai', menu: 'Lộ trình', render };
})();
