/* ========================== TRỢ LÝ AI · HỎI COPILOT ==========================
   Cửa vào hỏi đáp: ô hỏi lớn, câu hỏi thường gặp, trợ lý/quy trình phù hợp
   với việc của tôi. Khung chat dùng chung AIM.copilot (nút nổi góc phải). */
AIM.views.assistant = (function () {
  const U = AIM.ui, C = AIM.config, S = AIM.store, H = AIM.hub;
  const { esc } = U;

  function render(el) {
    const mineIds = new Set(H.myTasks().map(u => u.id));
    const helpers = S.all('library').filter(x => x.type !== 'prompt' && x.status !== 'Deprecated')
      .sort((a, b) => mineIds.has(b.useCaseId) - mineIds.has(a.useCaseId) || H.ready(b) - H.ready(a) || (b.type === 'agent') - (a.type === 'agent'));
    el.innerHTML = `
      <div class="as-grid">
        <section class="as-ask card-blk">
          <div class="blk-h"><div><h3>Hỏi Copilot</h3><p>Hỏi bằng ngôn ngữ tự nhiên. Trả lời lấy từ kho tri thức của Hub, luôn kèm nguồn để đối chiếu.</p></div></div>
          <form id="asF" class="hero-ask big"><span class="cp-orb sm" aria-hidden="true"></span><input id="asQ" placeholder="Ví dụ: Làm sao rà soát thẩm quyền của một tờ trình?" aria-label="Câu hỏi"><button class="btn primary" type="submit">Hỏi</button></form>
          <h4 class="as-sub">Câu hỏi thường gặp</h4>
          <div class="faq-grid">${AIM.copilot.FAQ.map(f => `<button data-ask="${esc(f.q.split('?')[0] + '?')}"><b>${esc(f.q.split('?')[0])}?</b></button>`).join('')}</div>
          <p class="note-mode">${C.assistant.endpoint ? 'Đã kết nối máy chủ trợ lý nội bộ.' : '<b>Chế độ tra cứu tại chỗ</b>: câu hỏi không gửi ra ngoài; trợ lý chọn câu lệnh, quy trình, mẹo phù hợp nhất trong Hub. Khi có máy chủ trợ lý (Copilot Studio/API nội bộ), điền <code>assistant.endpoint</code> trong js/config.js.'}</p>
        </section>
        <section class="card-blk">
          <div class="blk-h"><div><h3>Trợ lý & quy trình cho việc của bạn</h3><p>Ưu tiên công cụ gắn với công việc được giao</p></div></div>
          <div class="lst">${helpers.slice(0, 7).map(x => { const k = H.kind(x.type); const mine = mineIds.has(x.useCaseId);
            return `<button class="li" data-lib="${esc(x.id)}"><span class="ah-ic t-${x.type}" aria-hidden="true">${AIM.icons[x.type + 's']}</span><span><b>${esc(x.name)}</b><small>${esc(k.label)}${mine ? ' · <u>việc của bạn</u>' : ''}</small></span><em>→</em></button>`; }).join('')}</div>
        </section>
      </div>`;
    el.addEventListener('submit', e => { if (e.target.id === 'asF') { e.preventDefault(); const q = U.$('#asQ', el).value.trim(); if (q) { AIM.copilot.panelOpen(q); U.$('#asQ', el).value = ''; } } });
    el.addEventListener('click', e => {
      const a = e.target.closest('[data-ask]'); if (a) return AIM.copilot.panelOpen(a.dataset.ask);
      const l = e.target.closest('[data-lib]'); if (l) return AIM.lib.open(l.dataset.lib);
    });
  }
  return { title: 'Hỏi Copilot', render };
})();

/* ========================== KHO TRI THỨC · TRA CỨU NHANH ========================== */
AIM.views.knowledge = (function () {
  const U = AIM.ui, C = AIM.config, S = AIM.store, H = AIM.hub, CP = () => AIM.copilot;
  const { esc } = U;
  let q = '', kind = '';
  const POPULAR = ['rà soát tờ trình', 'so sánh văn bản', 'đề cương kiểm tra', 'báo cáo tuần', 'Excel bất thường', 'tóm tắt cuộc họp', 'hiệu lực văn bản'];

  function results() {
    const hits = CP().search(q, { limit: 60 }).filter(h => h.kind !== 'page' && (!kind || h.kind === kind));
    if (!hits.length) return `<div class="empty-note">Chưa có nội dung khớp “${esc(q)}”. <button class="linkish" data-ask="${esc(q)}">Hỏi Copilot</button></div>`;
    return `<div class="kr-meta">${hits.length} kết quả</div><div class="kr">${hits.map(h => `<button class="kr-i" data-open="${h.kind}:${esc(h.id)}"><i class="k-${h.kind}">${CP().KINDS[h.kind].icon}</i>
      <span><em>${esc(CP().KINDS[h.kind].label)}</em><b>${esc(h.title)}</b><small>${esc(h.sub)}</small></span></button>`).join('')}</div>`;
  }
  function home() {
    const lib = S.all('library').filter(x => x.status !== 'Deprecated');
    const cats = [
      ['prompts', 'Câu lệnh mẫu', `${lib.filter(x => x.type === 'prompt').length} câu lệnh đã chuẩn hóa`, 'prompts'],
      ['samples', 'Sản phẩm tạo bởi Copilot', `${(AIM.views.samples.samples || []).length} sản phẩm đầu ra minh họa`, 'samples'],
      ['tips', 'Mẹo dùng Copilot', `${S.all('tips').length} mẹo theo Word, Excel, Outlook…`, 'tips'],
      ['agents', 'Agent', `${lib.filter(x => x.type === 'agent').length} trợ lý tự động`, 'agents']
    ];
    return `<div class="kcats">${cats.map(([ic, t, s, nav]) => `<button class="kcat" data-nav="${nav}" data-sec="knowledge"><span class="kcat-ic" aria-hidden="true">${AIM.icons[ic]}</span><b>${esc(t)}</b><small>${esc(s)}</small><em>→</em></button>`).join('')}</div>
      <div class="blk"><div class="blk-h"><div><h3>Câu hỏi thường gặp</h3><p>Trả lời dựng từ nội dung đã được Ban KSNB kiểm duyệt</p></div></div>
        <div class="faq">${CP().FAQ.map(f => `<details><summary>${esc(f.q.split('?')[0])}?</summary><div class="faq-a">${f.a()}</div></details>`).join('')}</div></div>`;
  }
  function render(el) {
    el.innerHTML = `<div class="ks">
        <div class="ks-box"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
          <input type="search" id="ksQ" placeholder="Tìm câu lệnh, quy trình, mẹo, sản phẩm mẫu… (gõ không dấu cũng được)" value="${esc(q)}" aria-label="Tra cứu nhanh"></div>
        <div class="ks-pop">${POPULAR.map(p => `<button data-q="${esc(p)}">${esc(p)}</button>`).join('')}</div>
        <div class="seg ks-kinds" role="group" aria-label="Loại nội dung">${[['', 'Tất cả'], ['task', 'Công việc'], ['tool', 'Công cụ AI'], ['tip', 'Mẹo'], ['sample', 'Sản phẩm mẫu'], ['faq', 'Hỏi đáp']].map(([k, l]) => `<button data-k="${k}" class="${k === kind ? 'active' : ''}">${l}</button>`).join('')}</div>
      </div><div id="ksR"></div>`;
    const draw = () => { U.$('#ksR', el).innerHTML = q.trim() ? results() : home(); };
    draw();
    el.addEventListener('input', e => { if (e.target.id === 'ksQ') { q = e.target.value; draw(); } });
    el.addEventListener('click', e => {
      const p = e.target.closest('[data-q]'); if (p) { q = p.dataset.q; U.$('#ksQ', el).value = q; return draw(); }
      const k = e.target.closest('[data-k]'); if (k) { kind = k.dataset.k; U.$$('[data-k]', el).forEach(b => b.classList.toggle('active', b === k)); return draw(); }
      const o = e.target.closest('[data-open]'); if (o) { const [a, ...b] = o.dataset.open.split(':'); return CP().open(a, b.join(':')); }
      const a = e.target.closest('[data-ask]'); if (a) return CP().panelOpen(a.dataset.ask);
      const n = e.target.closest('[data-nav]'); if (n) return AIM.app.go(n.dataset.nav, null, n.dataset.sec);
    });
  }
  return { title: 'Tra cứu nhanh', render };
})();
