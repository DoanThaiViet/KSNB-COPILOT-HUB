/* ========================== KHO TRI THỨC · SKILL & AGENT ==========================
   Thẻ ngắn gọn: Tên – Khi nào dùng – Cần có – Kết quả – Sao chép prompt.
   Skill mở được SKILL.md; Agent có phần giải thích "Agent là gì" bằng ví dụ đời thường
   và luồng 7 bước có 2 cửa kiểm soát (bằng chứng, cán bộ duyệt).
   Mặc định lọc "Dành cho tôi" theo nhóm công việc và việc được giao của cán bộ đang xem. */
AIM.kb = (function () {
  const U = AIM.ui, S = AIM.store, H = AIM.hub;
  const { esc } = U;

  /* Markdown tối giản cho SKILL.md / agent.md (tiêu đề, danh sách, trích dẫn, đậm) */
  function md(src) {
    const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>');
    let html = '', list = null;
    const close = () => { if (list) { html += `</${list}>`; list = null; } };
    String(src || '').replace(/^---[\s\S]*?---\s*/, '').split('\n').forEach(line => {
      let m;
      if ((m = line.match(/^(#{1,3})\s+(.*)/))) { close(); html += `<h${m[1].length + 2}>${inline(m[2])}</h${m[1].length + 2}>`; }
      else if ((m = line.match(/^\s*-\s+(.*)/))) { if (list !== 'ul') { close(); html += '<ul>'; list = 'ul'; } html += `<li>${inline(m[1])}</li>`; }
      else if ((m = line.match(/^\s*\d+\.\s+(.*)/))) { if (list !== 'ol') { close(); html += '<ol>'; list = 'ol'; } html += `<li>${inline(m[1])}</li>`; }
      else if ((m = line.match(/^>\s?(.*)/))) { close(); html += `<blockquote>${inline(m[1])}</blockquote>`; }
      else if (line.trim()) { close(); html += `<p>${inline(line)}</p>`; }
      else close();
    });
    close();
    return html;
  }
  function openDoc(id) {
    const x = S.get('library', id); if (!x) return;
    U.modal({ wide: true, title: esc(x.file || x.id), sub: `<span>${esc(x.name)}</span>`,
      body: `<div class="mdoc">${x.doc ? md(x.doc) : '<p>Mục này chưa có tệp SKILL.md.</p>'}</div>`,
      foot: `${x.instruction ? '<button class="btn primary" data-cp>Sao chép prompt</button>' : ''}<button class="btn" data-close>Đóng</button>`,
      onMount: p => p.addEventListener('click', e => { if (e.target.closest('[data-cp]')) U.copy(x.instruction); }) });
  }

  /* Dành cho tôi: cùng nhóm công việc hoặc gắn với việc tôi được giao */
  const forMe = x => { const u = S.get('useCases', x.useCaseId); return H.myGroups().includes(x.groupId) || (u && H.isMine(u)); };
  const TAGS = ['HĐTV/PYK', 'Thẩm quyền', 'Chỉ đạo', 'KTGS', 'KTNB', 'QTRR', 'Tài chính', 'Dự án dầu khí', 'Đấu thầu', 'Pháp lý/OECD', 'Thư ký HĐTV', 'Kế hoạch', 'Kỹ thuật', 'Dashboard/CĐS'];
  const GTAG = { g1: 'HĐTV/PYK', g2: 'Pháp lý/OECD', g3: 'KTGS', g4: 'KTNB', g5: 'QTRR', g6: 'Kế hoạch', g7: 'Tài chính', g8: 'Dự án dầu khí', g9: 'Đấu thầu', g10: 'Kỹ thuật' };
  const tagOf = x => x.tag || GTAG[x.groupId] || U.group(x.groupId).short;
  const evBadge = '<span class="ev-badge" data-tip="Không suy diễn · thiếu hồ sơ không đồng nghĩa chưa thực hiện · mọi kết luận có nguồn">Evidence-first</span>';

  /* Thanh lọc dùng chung */
  function filters(type, st) {
    const list = S.all('library').filter(x => x.type === type && x.status !== 'Deprecated');
    const tags = TAGS.filter(t => list.some(x => tagOf(x) === t));
    return `<div class="kb-bar"><div class="seg" role="group" aria-label="Phạm vi"><button data-kscope="me" class="${st.scope === 'me' ? 'active' : ''}">Dành cho tôi <em>${list.filter(forMe).length}</em></button><button data-kscope="all" class="${st.scope === 'all' ? 'active' : ''}">Tất cả <em>${list.length}</em></button></div>
      <input type="search" data-kq placeholder="Tìm: soát tờ trình, chuẩn bị KTGS, hồ sơ rủi ro…" value="${esc(st.q)}" aria-label="Tìm">
      <div class="kb-tags"><button data-ktag="" class="${!st.tag ? 'on' : ''}">Mọi nghiệp vụ</button>${tags.map(t => `<button data-ktag="${esc(t)}" class="${st.tag === t ? 'on' : ''}">${esc(t)}</button>`).join('')}</div></div>`;
  }
  function pick(type, st) {
    const q = AIM.copilot.norm(st.q);
    return S.all('library').filter(x => x.type === type && x.status !== 'Deprecated' && (st.scope === 'all' || forMe(x)) && (!st.tag || tagOf(x) === st.tag)
      && (!q || AIM.copilot.norm([x.id, x.name, x.alias, x.purpose, x.input, x.output, tagOf(x)].join(' ')).includes(q)))
      .sort((a, b) => forMe(b) - forMe(a) || String(a.id).localeCompare(String(b.id)));
  }
  function wire(el, type, st, draw) {
    el.addEventListener('input', e => { if (e.target.matches('[data-kq]')) { st.q = e.target.value; draw(true); } });
    el.addEventListener('click', e => {
      const s = e.target.closest('[data-kscope]'); if (s) { st.scope = s.dataset.kscope; return draw(); }
      const t = e.target.closest('[data-ktag]'); if (t) { st.tag = t.dataset.ktag; return draw(); }
      const c = e.target.closest('[data-cp]'); if (c) { const x = S.get('library', c.dataset.cp); return x && U.copy(x.instruction); }
      const d = e.target.closest('[data-doc]'); if (d) return openDoc(d.dataset.doc);
      const o = e.target.closest('[data-open]'); if (o) return AIM.views.kbagents.open(o.dataset.open);
      const r = e.target.closest('[data-run]'); if (r) return AIM.views.work.run(r.dataset.run);
    });
  }
  const initScope = type => S.all('library').some(x => x.type === type && x.status !== 'Deprecated' && forMe(x)) ? 'me' : 'all';

  return { md, openDoc, forMe, tagOf, evBadge, filters, pick, wire, initScope };
})();

/* ---------------------------- TAB SKILL ---------------------------- */
AIM.views.kbskills = (function () {
  const U = AIM.ui, S = AIM.store, H = AIM.hub, K = AIM.kb;
  const { esc } = U;
  const st = { scope: null, q: '', tag: '' };
  const clip = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; };

  function card(x) {
    const u = S.get('useCases', x.useCaseId), me = K.forMe(x);
    return `<article class="kb-card">
      <div class="kb-top"><span class="kb-tag">${esc(K.tagOf(x))}</span>${me ? '<span class="kb-me">Nhóm của bạn</span>' : ''}<span class="sp"></span></div>
      <h4>${esc(x.name)}</h4>
      <dl class="kb-dl"><dt>Khi nào dùng</dt><dd>${esc(clip(x.purpose, 150))}</dd>
        <dt>Cần có</dt><dd>${esc(clip(x.input, 140) || '–')}</dd>
        <dt>Kết quả</dt><dd>${esc(clip(x.output, 150) || '–')}</dd>
        ${(x.steps || []).length ? `<dt>Các bước</dt><dd>${x.steps.length} bước chuẩn</dd>` : ''}</dl>
      <div class="kb-foot">${x.instruction ? `<button class="btn primary sm" data-cp="${esc(x.id)}">Sao chép prompt</button>` : ''}
        <button class="btn sm" data-doc="${esc(x.id)}">${x.doc ? 'Xem SKILL.md' : 'Xem các bước'}</button>
        ${u ? `<button class="btn sm ghost" data-run="${esc(u.id)}" title="${esc(u.task)}">Dùng cho việc →</button>` : ''}<span class="sp"></span><span class="faint">${esc(x.id)}</span></div>
    </article>`;
  }
  function render(el) {
    if (!st.scope) st.scope = K.initScope('skill');
    el.innerHTML = `<div class="kb-intro"><div><b>Skill là “cách làm chuẩn”</b> cho một việc lặp lại: các bước cố định, đầu vào – đầu ra rõ ràng, dùng lại cho cả Ban.
        Dùng khi việc cần nhiều thao tác theo đúng trình tự; việc đơn lẻ thì dùng Prompt.</div>${K.evBadge}</div>
      <div id="kbF"></div><div id="kbL"></div>`;
    const draw = typing => {
      if (!typing) U.$('#kbF', el).innerHTML = K.filters('skill', st);
      const list = K.pick('skill', st);
      U.$('#kbL', el).innerHTML = list.length ? `<div class="kb-grid">${list.map(card).join('')}</div>` : '<div class="empty-note">Không có Skill phù hợp. Thử “Tất cả” hoặc đổi từ khóa.</div>';
    };
    draw(); K.wire(el, 'skill', st, draw);
  }
  return { title: 'Skill', menu: 'Skill', count: () => S.all('library').filter(x => x.type === 'skill' && x.status !== 'Deprecated').length, render };
})();

/* ---------------------------- TAB AGENT (dễ hiểu) ---------------------------- */
AIM.views.kbagents = (function () {
  const U = AIM.ui, S = AIM.store, K = AIM.kb;
  const { esc } = U;
  const st = { scope: null, q: '', tag: '' };
  /* 7 bước chuẩn của mọi Agent, gọi bằng tiếng Việt; 2 bước là cửa kiểm soát */
  const STEPS = [
    ['Tiếp nhận', 'Xác định hồ sơ, mục tiêu, kết quả cần có, hạn chính thức'],
    ['Kiểm tra hồ sơ', 'Đủ tài liệu bắt buộc chưa, đúng phiên bản chưa'],
    ['Thực hiện', 'Gọi lần lượt các Skill nghiệp vụ'],
    ['Chốt bằng chứng', 'Không cho kết luận vượt quá bằng chứng', 'gate'],
    ['Cán bộ duyệt', 'Dừng lại chờ cán bộ xác nhận điểm quyết định, kiến nghị, phát hành', 'gate'],
    ['Xuất kết quả', 'Tóm tắt điều hành + bảng chi tiết + danh sách việc cần làm'],
    ['Ghi nhớ', 'Lưu checklist đã được cán bộ xác nhận để lần sau dùng lại']
  ];
  const STATES = { 'New': 'Mới tiếp nhận', 'In review': 'Đang rà soát', 'Need evidence': 'Thiếu bằng chứng', 'Need human decision': 'Chờ cán bộ quyết định', 'Draft ready': 'Có bản dự thảo', 'Approved': 'Đã duyệt', 'Closed': 'Đóng hồ sơ' };
  const stLabel = x => x.status === 'Draft' ? 'Đang thiết kế' : x.status === 'Testing' ? 'Chạy thử' : U.stLabel(x.status);

  function explainer() {
    return `<section class="ag-explain">
      <div class="ag-x-h"><h3>Agent là gì? Hiểu trong 30 giây</h3>${K.evBadge}</div>
      <div class="ag-cmp">
        <div><em>Prompt</em><b>Hỏi một câu – nhận một câu trả lời</b><p>Như nhờ đồng nghiệp soạn giúp một đoạn văn. Dùng ngay, xong là hết.</p><small>Ví dụ: tóm tắt tờ trình này</small></div>
        <div><em>Skill</em><b>Làm theo “công thức” chuẩn</b><p>Như quy trình nghiệp vụ có sẵn các bước. Cán bộ tự chạy từng bước, lần nào cũng ra kết quả đồng nhất.</p><small>Ví dụ: rà soát tờ trình 4 bước</small></div>
        <div class="hl"><em>Agent</em><b>“Thư ký chuyên trách” theo cả quy trình</b><p>Theo một hồ sơ qua nhiều ngày, tự gọi các Skill, nhớ hồ sơ đang ở bước nào — và <u>dừng lại xin cán bộ duyệt</u> trước mọi điểm quan trọng.</p><small>Ví dụ: theo đoàn KTGS từ quyết định đến theo dõi kiến nghị</small></div>
      </div>
      <h4>Một Agent làm việc thế nào</h4>
      <ol class="ag-flow">${STEPS.map(([t, d, g], i) => `<li class="${g ? 'gate' : ''}"><span>${g ? '🛡' : i + 1}</span><b>${t}</b><small>${d}</small></li>`).join('')}</ol>
      <div class="ag-rules"><div><b>Khi nào dùng Agent</b><p>Việc nhiều bước, kéo dài qua nhiều hồ sơ, cần biết đang ở trạng thái nào.</p></div>
        <div><b>Khi nào KHÔNG dùng</b><p>Việc chỉ làm một lần (tóm tắt, soạn một đoạn) → dùng Skill hoặc Prompt.</p></div>
        <div><b>Ai chịu trách nhiệm</b><p>AI chỉ chuẩn bị phân tích và dự thảo. Cán bộ phụ trách xác nhận trước khi phát hành.</p></div></div>
    </section>`;
  }
  function card(x) {
    const flow = x.flow || (x.steps || []).slice(0, 5);
    const sk = (x.skills || []).map(id => S.get('library', id)).filter(Boolean);
    return `<article class="ag-card">
      <div class="kb-top"><span class="kb-tag">${esc(K.tagOf(x))}</span>${K.forMe(x) ? '<span class="kb-me">Nhóm của bạn</span>' : ''}<span class="sp"></span></div>
      <h4>${esc(x.name)}</h4>${x.alias ? `<div class="faint ag-alias">${esc(x.alias)}</div>` : ''}
      <p class="ag-what">${esc(x.purpose)}</p>
      ${flow.length ? `<div class="ag-chain">${flow.map(s => `<span>${esc(s)}</span>`).join('<i>→</i>')}</div>` : x.trigger ? `<div class="ag-trig"><b>Tự chạy khi:</b> ${esc(x.trigger)}</div>` : ''}
      ${sk.length ? `<div class="ag-sk"><small>Dùng các Skill:</small>${sk.map(s => `<button data-doc="${esc(s.id)}" title="${esc(s.name)}">${esc(s.name)}</button>`).join('')}</div>` : ''}
      <div class="kb-foot"><button class="btn primary sm" data-open="${esc(x.id)}">Xem Agent chạy thế nào</button><span class="sp"></span><span class="faint">${esc(x.id)}</span></div>
    </article>`;
  }
  function open(id) {
    const x = S.get('library', id); if (!x) return;
    const sk = (x.skills || []).map(i => S.get('library', i)).filter(Boolean);
    const states = x.states || Object.keys(STATES);
    U.modal({ wide: true, title: esc(x.name), sub: `<span class="faint">${esc(x.alias || x.id)}</span>`,
      body: `<p class="ag-what">${esc(x.purpose)}</p>
        <h4 class="ag-h">Luồng xử lý</h4><ol class="ag-flow v">${(x.steps && x.steps.length ? x.steps : STEPS.map(s => s[0] + ': ' + s[1])).map((s, i) => { const gate = /gate/i.test(s);
          return `<li class="${gate ? 'gate' : ''}"><span>${gate ? '🛡' : i + 1}</span><b>${esc(STEPS[i] ? STEPS[i][0] : '')}</b><small>${esc(s.replace(/^[A-Za-z ]+:\s*/, '').replace(/^./, c => c.toUpperCase()))}</small></li>`; }).join('')}</ol>
        <h4 class="ag-h">Hồ sơ đi qua các trạng thái</h4><div class="ag-states">${states.map(s => `<span>${esc(STATES[s] || s)}</span>`).join('<i>→</i>')}</div>
        ${sk.length ? `<h4 class="ag-h">Các Skill được gọi</h4><div class="lst">${sk.map(s => `<button class="li" data-doc="${esc(s.id)}"><span><b>${esc(s.name)}</b><small>${esc(s.id)} · ${esc(s.purpose)}</small></span><em>SKILL.md →</em></button>`).join('')}</div>` : ''}
        ${x.guardrails ? `<h4 class="ag-h">Giới hạn</h4><p>${esc(x.guardrails)}</p>` : ''}
        ${x.status === 'Draft' ? '<p class="note-warn">Agent chưa kết nối hệ thống nên chưa chạy tự động. Trong lúc chờ, dùng các Skill bên trên theo đúng thứ tự.</p>' : ''}`,
      foot: `${x.doc ? '<button class="btn" data-mdoc>Xem tệp mô tả</button>' : ''}<button class="btn primary" data-close>Đóng</button>`,
      onMount: p => p.addEventListener('click', e => { const d = e.target.closest('[data-doc]'); if (d) K.openDoc(d.dataset.doc); if (e.target.closest('[data-mdoc]')) K.openDoc(x.id); }) });
  }
  function render(el) {
    if (!st.scope) st.scope = K.initScope('agent');
    el.innerHTML = explainer() + '<div id="kbF"></div><div id="kbL"></div>';
    const draw = typing => {
      if (!typing) U.$('#kbF', el).innerHTML = K.filters('agent', st);
      const list = K.pick('agent', st);
      U.$('#kbL', el).innerHTML = list.length ? `<div class="kb-grid">${list.map(card).join('')}</div>` : '<div class="empty-note">Không có Agent phù hợp. Thử “Tất cả”.</div>';
    };
    draw(); K.wire(el, 'agent', st, draw);
  }
  return { title: 'Agent', menu: 'Agent', count: () => S.all('library').filter(x => x.type === 'agent' && x.status !== 'Deprecated').length, render, open };
})();
