/* ========================== TIPS & TRICKS ==========================
   Mẹo dùng Copilot theo từng ứng dụng, kèm câu lệnh mẫu sao chép được. */
AIM.views.tips = (function () {
  const U = AIM.ui, C = AIM.config, S = AIM.store;
  const { esc } = U;
  let f = { q: '', area: '' };

  const AREAS = () => C.tipAreas;
  const areaLabel = k => (AREAS().find(a => a[0] === k) || [, k])[1];
  const used = () => AREAS().filter(([k]) => S.all('tips').some(t => t.area === k));

  function list() {
    const q = f.q.trim().toLowerCase();
    return S.all('tips').filter(t =>
      (!f.area || t.area === f.area) &&
      (!q || [t.title, t.why, (t.how || []).join(' '), t.sample].join(' ').toLowerCase().includes(q)));
  }

  function card(t) {
    return `<div class="tipc" data-id="${t.id}">
      <div class="top"><span class="area">${esc(areaLabel(t.area))}</span><span class="lv">${esc(t.level || '')}</span>
        <button class="btn sm edit-only" data-edit="${t.id}">Sửa</button></div>
      <h4>${esc(t.title)}</h4>
      <p class="why">${esc(t.why)}</p>
      <ul class="how">${(t.how || []).map(h => `<li>${esc(h)}</li>`).join('')}</ul>
      ${t.avoid ? `<div class="avoid"><b>Tránh:</b> ${esc(t.avoid)}</div>` : ''}
      ${t.source && t.source !== 'Ban KSNB' ? `<div class="src">Nguồn: ${esc(t.source)}</div>` : ''}
      ${t.sample ? `<div class="sample"><div class="sh">Câu lệnh mẫu<button class="btn sm" data-copy="${t.id}">Sao chép</button></div>
        <pre>${esc(t.sample)}</pre></div>` : ''}
    </div>`;
  }

  function grid() {
    const rows = list();
    U.$('#tipCount').textContent = `${rows.length} mẹo${f.area ? ' · ' + areaLabel(f.area) : ''}`;
    U.$('#tipGrid').innerHTML = rows.length ? rows.map(card).join('') : '<div class="empty">Không có mẹo phù hợp</div>';
  }

  function render(el) {
    el.innerHTML = `
      <div class="phd"><div><h2>Mẹo dùng Copilot</h2><div class="meta" id="tipCount"></div></div>
        <div class="acts"><button class="btn primary edit-only" id="tipAdd">+ Thêm mẹo</button></div></div>
      <div class="toolbar">
        <input type="search" data-f="q" placeholder="Tìm mẹo, câu lệnh mẫu..." value="${esc(f.q)}">
      </div>
      <div class="chips" id="tipChips">
        <button data-a="" class="${f.area ? '' : 'on'}">Tất cả</button>
        ${used().map(([k, l]) => `<button data-a="${k}" class="${f.area === k ? 'on' : ''}">${esc(l)}</button>`).join('')}
      </div>
      <div class="tipgrid" id="tipGrid"></div>`;
    grid();
    el.addEventListener('input', e => { if (e.target.dataset.f) { f.q = e.target.value; grid(); } });
    el.addEventListener('click', e => {
      const ch = e.target.closest('#tipChips button');
      if (ch) { f.area = ch.dataset.a; U.$$('#tipChips button', el).forEach(b => b.classList.toggle('on', b === ch)); return grid(); }
      const cp = e.target.closest('[data-copy]'); if (cp) return U.copy(S.get('tips', cp.dataset.copy).sample);
      const ed = e.target.closest('[data-edit]'); if (ed) return edit(S.get('tips', ed.dataset.edit));
      if (e.target.closest('#tipAdd')) return edit(null);
    });
  }

  function edit(t) {
    const isNew = !t;
    const base = t || { id: S.nextId('tips', 'TP-'), area: 'general', level: 'Cơ bản', source: 'Ban KSNB' };
    const fs = [
      { k: 'title', label: 'Tiêu đề', req: true, span: 2 },
      { k: 'area', label: 'Áp dụng cho', type: 'select', options: AREAS() },
      { k: 'level', label: 'Mức độ', type: 'select', options: [['Cơ bản', 'Cơ bản'], ['Nâng cao', 'Nâng cao']] },
      { k: 'why', label: 'Vì sao nên làm', type: 'textarea', rows: 2, span: 2 },
      { k: 'howText', label: 'Cách làm (mỗi dòng một bước)', type: 'textarea', rows: 4, span: 2 },
      { k: 'avoid', label: 'Lỗi cần tránh', type: 'textarea', rows: 2, span: 2 },
      { k: 'sample', label: 'Câu lệnh mẫu', type: 'textarea', rows: 4, span: 2, mono: true },
      { k: 'source', label: 'Nguồn', span: 2 }
    ];
    const val = { ...base, howText: (base.how || []).join('\n') };
    const p = U.modal({ wide: true, title: isNew ? 'Thêm mẹo' : 'Sửa ' + esc(base.id), body: U.form(fs, val),
      foot: `${isNew ? '' : '<button class="btn danger l" data-del>Xóa</button>'}<button class="btn" data-close>Hủy</button><button class="btn primary" data-save>Lưu</button>` });
    p.querySelector('[data-save]').onclick = async () => {
      const obj = U.readForm(p, fs, base);
      if (!obj.title.trim()) return p.querySelector('[name="title"]').focus();
      obj.how = (obj.howText || '').split('\n').map(x => x.trim()).filter(Boolean); delete obj.howText;
      U.close(); await S.save('tips', obj); U.toast('Đã lưu');
    };
    const del = p.querySelector('[data-del]');
    if (del) del.onclick = async () => { if (confirm('Xóa mẹo ' + base.id + '?')) { U.close(); await S.remove('tips', base.id); U.toast('Đã xóa'); } };
  }

  return { title: 'Mẹo dùng Copilot', menu: 'Mẹo dùng Copilot', count: () => S.all('tips').length, render };
})();
