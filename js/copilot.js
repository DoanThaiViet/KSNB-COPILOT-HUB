/* =========================================================================
   TRA CỨU NHANH + HỎI ĐÁP (AIM.copilot)
   - search(q): tìm không dấu trên công việc, công cụ AI, mẹo, sản phẩm mẫu,
     cán bộ, trang và câu hỏi thường gặp.
   - ask(q): trả lời bằng nội dung có sẵn trong Hub, luôn kèm nguồn.
     Có endpoint trong AIM.config.assistant thì gửi câu hỏi + ngữ cảnh lên
     backend; lỗi thì tự lùi về trả lời tại chỗ.
   - Giao diện: ô tra cứu trên thanh đầu trang (Ctrl+K, phím /) và khung
     "Hỏi Copilot" trượt từ phải (nút nổi góc dưới).
   ========================================================================= */
AIM.copilot = (function () {
  const C = AIM.config, S = AIM.store, U = AIM.ui, H = AIM.hub;
  const { esc } = U;

  /* ---------- Chuẩn hóa tiếng Việt ---------- */
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const STOP = new Set('va cua cho la co the nao gi toi lam voi trong den tu mot cac nhung duoc de ve thi nay hay sao nhu o khi da dang se can phai bang theo tai minh ban anh chi em hoi giup xin vui long ra vao len'.split(' '));
  const toks = s => norm(s).split(' ').filter(t => t.length > 1 && !STOP.has(t));
  const bigrams = a => a.slice(1).map((t, i) => a[i] + ' ' + t);

  /* ---------- Câu hỏi thường gặp: câu trả lời dựng từ dữ liệu của Hub, không tự suy diễn ---------- */
  const tip = id => S.get('tips', id);
  const tipHTML = t => t ? `<p><b>${esc(t.title)}.</b> ${esc(t.why)}</p>${(t.how || []).length ? `<ul>${t.how.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}` : '';
  const FAQ = [
    { id: 'start', q: 'Bắt đầu dùng Hub từ đâu? Tôi mới dùng thì làm gì trước?',
      a: () => `<p>Ba bước, không cần học trước Prompt, Skill hay Agent:</p><ol>
        <li>Mở <b>Công việc của tôi</b>, chọn đúng việc đang làm.</li>
        <li>Bấm <b>Thực hiện</b>: Hub đưa sẵn câu lệnh mẫu hoặc quy trình, chỉ cần sao chép sang Copilot.</li>
        <li>Đối chiếu kết quả với tài liệu gốc trước khi dùng.</li></ol>`,
      acts: [['page', 'work', 'Mở Công việc của tôi']] },
    { id: 'kinds', q: 'Prompt Skill Agent khác nhau thế nào? Khi nào dùng Agent?',
      a: () => `<ul><li><b>Câu lệnh mẫu (Prompt)</b>: dùng một lần cho một yêu cầu, sao chép vào Copilot Chat/Word/Excel.</li>
        <li><b>Quy trình nhiều bước (Skill)</b>: chuỗi câu lệnh theo thứ tự cố định, dùng lại cho cả Ban.</li>
        <li><b>Trợ lý tự động (Agent)</b>: như một “thư ký chuyên trách” theo cả quy trình nhiều bước, tự gọi các Skill và dừng lại chờ cán bộ duyệt ở điểm quan trọng. Chỉ xây khi công việc đủ ${C.agentCriteria.length} tiêu chí: ${C.agentCriteria.map(c => esc(c.label.toLowerCase()) + (c.rule ? ' (' + esc(c.rule.toLowerCase()) + ')' : '')).join('; ')}.</li></ul>`,
      acts: [['page', 'kbagents', 'Agent là gì? Xem minh họa']] },
    { id: 'data', q: 'Có được đưa tài liệu nội bộ, tài liệu mật lên Copilot không? Bảo mật dữ liệu',
      a: () => tipHTML(tip('TP-19')) + `<p class="faint">Nguồn: mẹo ${esc('TP-19')} của Ban KSNB. Quy định bảo mật cụ thể áp dụng theo văn bản hiện hành của Tổng Công ty.</p>`,
      acts: [['tip', 'TP-19', 'Xem mẹo TP-19'], ['tip', 'TP-31', 'Bốn điều không nên làm']] },
    { id: 'resp', q: 'Ai chịu trách nhiệm nội dung AI tạo ra? Có dùng thẳng kết quả Copilot không?',
      a: () => tipHTML(tip('TP-18')), acts: [['tip', 'TP-18', 'Xem mẹo TP-18']] },
    { id: 'prompt', q: 'Viết câu lệnh prompt thế nào cho tốt? Cách đặt câu lệnh',
      a: () => tipHTML(tip('TP-01')) + (tip('TP-01') && tip('TP-01').sample ? `<div class="cp-code">${esc(tip('TP-01').sample)}</div>` : ''),
      copy: () => (tip('TP-01') || {}).sample, acts: [['page', 'tips', 'Mở Mẹo dùng Copilot']] },
    { id: 'saved', q: 'Giờ công tiết kiệm được tính thế nào? Cách tính hiệu quả',
      a: () => `<p>Giờ tiết kiệm/tháng = (giờ làm trước khi có AI − giờ làm khi có AI) × số lần thực hiện/tháng.</p>
        <p>Số giờ do đầu mối khai báo khi mô tả ứng dụng AI, là <b>ước tính</b>, chưa đo thực tế. Chỉ số “đã vận hành” chỉ cộng ứng dụng AI đã duyệt.</p>` },
    { id: 'propose', q: 'Đề xuất ứng dụng AI mới như thế nào? Thêm use case mới',
      a: () => { const m = S.all('milestones')[0]; const who = m ? U.pname(m.ownerId) : 'đầu mối điều phối';
        return `<p>Mô tả công việc, vướng mắc hiện tại và số giờ thực hiện; đầu mối sẽ đánh giá cấp độ phù hợp (Prompt → Skill → Agent).</p>
        <p>Cán bộ có quyền nhập: <b>Công việc của tôi → Danh mục ứng dụng AI → Thêm</b>. Hoặc gửi đề xuất cho <b>${esc(who)}</b> (đầu mối kế hoạch triển khai).</p>`; },
      acts: [['page', 'usecases', 'Mở Danh mục ứng dụng AI']] }
  ];

  /* ---------- Chỉ mục tìm kiếm ---------- */
  const KINDS = {
    task:   { label: 'Công việc',        icon: '◧' },
    tool:   { label: 'Công cụ AI',        icon: '✦' },
    tip:    { label: 'Mẹo dùng Copilot',  icon: '✧' },
    sample: { label: 'Sản phẩm tạo bởi Copilot', icon: '▣' },
    faq:    { label: 'Câu hỏi thường gặp', icon: '?' },
    person: { label: 'Cán bộ',            icon: '◉' },
    page:   { label: 'Trang',             icon: '→' }
  };
  let index = null;
  function build() {
    const docs = [];
    const add = (kind, id, title, sub, text) => {
      const tt = toks(title), xt = toks(text);
      docs.push({ kind, id, title, sub, nt: norm(title), nx: norm(title + ' ' + sub + ' ' + text), tt: new Set(tt), xt: new Set(xt), bg: new Set(bigrams([...tt, ...xt])) });
    };
    S.all('useCases').forEach(u => add('task', u.id, u.task, U.group(u.groupId).name + ' · ' + U.stLabel(u.status), [u.pain, u.aiStep, u.next, u.current].join(' ')));
    S.all('library').filter(x => x.status !== 'Deprecated').forEach(x => add('tool', x.id, x.name, H.kind(x.type).label + ' · ' + x.id + ' · ' + U.stLabel(x.status), [x.purpose, x.input, x.output, x.instruction, (x.steps || []).join(' ')].join(' ')));
    S.all('tips').forEach(t => add('tip', t.id, t.title, (C.tipAreas.find(a => a[0] === t.area) || [, ''])[1], [t.why, (t.how || []).join(' '), t.sample, t.avoid].join(' ')));
    ((AIM.views.samples || {}).samples || []).forEach(s => add('sample', s.id, s.title, s.madeBy, [s.source, s.time].join(' ')));
    S.all('people').forEach(p => add('person', p.id, p.name, p.title + (p.unit ? ' · ' + p.unit : ''), (p.groups || []).map(g => U.group(g).name).join(' ')));
    FAQ.forEach(f => add('faq', f.id, f.q.split('?')[0] + '?', 'Hỏi Copilot', f.q));
    AIM.app.pages().forEach(pg => add('page', pg.key, pg.label, pg.section, pg.keywords || ''));
    return docs;
  }
  S.subscribe(() => { index = null; });

  function score(d, qt, qb, qn) {
    let s = 0;
    qt.forEach(t => {
      if (d.tt.has(t)) s += 3;
      else if (d.xt.has(t)) s += 1;
      else if (t.length > 2 && (d.nt.includes(t))) s += 1.5;
    });
    qb.forEach(b => { if (d.bg.has(b)) s += 2; });
    if (qn.length > 2 && d.nt.includes(qn)) s += 8;
    else if (qn.length > 3 && d.nx.includes(qn)) s += 3;
    return s;
  }
  function search(q, o = {}) {
    const qn = norm(q); if (!qn) return [];
    const qt = toks(q).length ? toks(q) : qn.split(' '), qb = bigrams(qt);
    if (!index || index.role !== H.role()) { index = build(); index.role = H.role(); }   // trang Điều hành chỉ vào chỉ mục khi persona được xem
    const need = Math.min(qt.length, 2);   // ít nhất một phần từ khóa phải khớp
    return index
      .filter(d => !o.kinds || o.kinds.includes(d.kind))
      .map(d => ({ d, s: score(d, qt, qb, qn) }))
      .filter(x => x.s >= need && x.s > 0)
      .sort((a, b) => b.s - a.s || a.d.title.localeCompare(b.d.title, 'vi'))
      .slice(0, o.limit || 30)
      .map(x => ({ ...x.d, score: x.s }));
  }

  /* ---------- Mở một kết quả ---------- */
  function openTip(id) {
    const t = tip(id); if (!t) return;
    U.modal({ title: esc(t.title), sub: `<span>${esc((C.tipAreas.find(a => a[0] === t.area) || [, ''])[1])}</span><span class="faint">${esc(t.level || '')} · ${esc(t.source || '')}</span>`,
      body: `<div class="cp-tip">${tipHTML(t)}${t.sample ? `<h4>Câu lệnh mẫu</h4><div class="cp-code">${esc(t.sample)}</div>` : ''}${t.avoid ? `<p class="cp-avoid"><b>Tránh:</b> ${esc(t.avoid)}</p>` : ''}</div>`,
      foot: `${t.sample ? '<button class="btn primary" data-copy-tip>Sao chép câu lệnh</button>' : ''}<button class="btn" data-close>Đóng</button>`,
      onMount: p => p.addEventListener('click', e => { if (e.target.closest('[data-copy-tip]')) U.copy(t.sample); }) });
  }
  function open(kind, id) {
    if (kind === 'task') return AIM.views.work.run(id);
    if (kind === 'tool') { const x = S.get('library', id); if (x && x.type === 'agent' && x.flow) return AIM.views.kbagents.open(id); if (x && x.doc) return AIM.kb.openDoc(id); return AIM.lib.open(id); }
    if (kind === 'tip') return openTip(id);
    if (kind === 'sample') return AIM.views.samples.open(id);
    if (kind === 'person') return AIM.views.people.open(id);
    if (kind === 'page') { panelClose(); return AIM.app.go(id); }
    if (kind === 'faq') { const f = FAQ.find(x => x.id === id); return ask(f ? f.q.split('?')[0] + '?' : ''); }
  }

  /* ---------- Trả lời ---------- */
  const clip = (s, n = 180) => { s = String(s || ''); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; };
  const srcChip = d => `<button class="cp-src" data-cp-open="${d.kind}:${esc(d.id)}"><i>${KINDS[d.kind].icon}</i>${esc(clip(d.title, 60))}</button>`;
  const actBtn = ([k, id, label]) => `<button class="btn sm" data-cp-open="${k}:${esc(id)}">${esc(label)}</button>`;
  let copyBuf = [];
  const copyBtn = (text, label = 'Sao chép câu lệnh') => { if (!text) return ''; copyBuf.push(text); return `<button class="btn sm primary" data-cp-copy="${copyBuf.length - 1}">${esc(label)}</button>`; };
  const copilotBtn = () => `<a class="btn sm" href="${esc(C.assistant.copilotUrl)}" target="_blank" rel="noopener">Mở Copilot Chat ↗</a>`;

  function genericPrompt(q) {
    return `Bạn là chuyên viên ${C.unitName} của ${C.org}. Nhiệm vụ: ${q.trim().replace(/[?.]+$/, '')}.
Yêu cầu:
1. Chỉ dùng tài liệu tôi đính kèm hoặc trỏ tới; nội dung không có trong tài liệu thì ghi "Chưa đủ căn cứ trong hồ sơ".
2. Trình bày dạng bảng hoặc danh sách đánh số, mỗi ý ghi rõ nguồn (tên văn bản, điều, khoản hoặc trang).
3. Cuối cùng liệt kê các điểm cần tôi kiểm tra lại trước khi sử dụng.`;
  }

  function localAnswer(q) {
    const hits = search(q, { limit: 12 });
    const top = hits[0];
    const faq = hits.find(h => h.kind === 'faq');
    if (faq && faq.score >= Math.max(5, (top ? top.score : 0) * 0.8)) {
      const f = FAQ.find(x => x.id === faq.id);
      const linked = new Set((f.acts || []).map(a => a[1]));
      const rel = hits.filter(h => h.kind !== 'faq' && h.kind !== 'page' && !linked.has(h.id)).slice(0, 3);
      return { html: f.a() + `<div class="cp-acts">${f.copy ? copyBtn(f.copy()) : ''}${(f.acts || []).map(actBtn).join('')}</div>`, sources: rel };
    }
    const main = hits.find(h => ['tool', 'task', 'tip', 'sample'].includes(h.kind));
    if (!main) {
      return { html: `<p>Chưa tìm thấy nội dung phù hợp trong Hub cho câu hỏi này.</p>
        <p>Có thể hỏi trực tiếp Copilot Chat với câu lệnh khung dưới đây (đã có sẵn nguyên tắc chỉ dùng tài liệu được cung cấp):</p>
        <div class="cp-code">${esc(genericPrompt(q))}</div><div class="cp-acts">${copyBtn(genericPrompt(q))}${copilotBtn()}</div>`, sources: hits.slice(0, 3), miss: true };
    }
    let html = '';
    if (main.kind === 'tool') {
      const x = S.get('library', main.id), k = H.kind(x.type), uc = S.get('useCases', x.useCaseId);
      html = `<p>Phù hợp nhất: <b>${esc(k.label)}</b> “${esc(x.name)}” <span class="faint">(${esc(x.id)} · ${esc(U.stLabel(x.status))})</span>.</p>
        <p>${esc(x.purpose)}</p>
        ${x.input ? `<p><b>Cần chuẩn bị:</b> ${esc(x.input)}</p>` : ''}${x.output ? `<p><b>Kết quả:</b> ${esc(x.output)}</p>` : ''}
        ${x.type === 'prompt' && x.instruction ? `<div class="cp-code">${esc(clip(x.instruction, 420))}</div>` : ''}
        ${x.type !== 'prompt' && (x.steps || []).length ? `<ol>${x.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}
        ${x.status !== 'Approved' ? `<p class="cp-warn">Nội dung đang ở trạng thái ${esc(U.stLabel(x.status).toLowerCase())}: dùng thử và đối chiếu kỹ kết quả.</p>` : ''}
        <div class="cp-acts">${x.type === 'prompt' ? copyBtn(x.instruction) : ''}${uc ? actBtn(['task', uc.id, 'Thực hiện công việc này']) : ''}${actBtn(['tool', x.id, 'Xem chi tiết'])}</div>`;
    } else if (main.kind === 'task') {
      const u = S.get('useCases', main.id), tools = H.toolsFor(u.id);
      html = `<p>Công việc liên quan: <b>${esc(u.task)}</b> <span class="faint">(${esc(U.group(u.groupId).name)})</span>.</p>
        <p><b>AI hỗ trợ:</b> ${esc(u.aiStep)}</p>
        <p>${tools.length ? `Đã có ${tools.length} công cụ: ${tools.map(t => esc(H.kind(t.type).label.toLowerCase()) + ' “' + esc(t.name) + '”').join('; ')}.` : 'Chưa có công cụ dựng sẵn; có thể dùng câu lệnh khung.'}</p>
        <div class="cp-acts">${actBtn(['task', u.id, 'Thực hiện'])}${tools.length ? '' : copyBtn(genericPrompt(u.aiStep))}</div>`;
    } else if (main.kind === 'tip') {
      const t = tip(main.id);
      html = tipHTML(t) + (t.sample ? `<div class="cp-code">${esc(t.sample)}</div>` : '') + `<div class="cp-acts">${copyBtn(t.sample)}${actBtn(['tip', t.id, 'Xem đầy đủ'])}</div>`;
    } else {
      html = `<p>Sản phẩm mẫu liên quan: <b>${esc(main.title)}</b> <span class="faint">(${esc(main.sub)})</span>.</p><div class="cp-acts">${actBtn(['sample', main.id, 'Xem sản phẩm mẫu'])}</div>`;
    }
    return { html, sources: hits.filter(h => h !== main && h.kind !== 'page').slice(0, 4) };
  }

  async function answer(q) {
    const cfg = C.assistant || {};
    if (!cfg.endpoint) return localAnswer(q);
    const ctx = search(q, { limit: 8 });
    try {
      const r = await fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, persona: H.role(), context: ctx.map(d => ({ kind: d.kind, id: d.id, title: d.title, text: d.nx.slice(0, 1200) })) }) });
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      const src = (j.sources || []).map(id => ctx.find(d => d.id === id)).filter(Boolean);
      return { html: `<p>${esc(j.answer || '').replace(/\n/g, '<br>')}</p>`, sources: src.length ? src : ctx.slice(0, 3) };
    } catch (e) {
      const a = localAnswer(q); a.html = `<p class="cp-warn">Không kết nối được máy chủ trợ lý; trả lời từ kho tri thức trên máy.</p>` + a.html; return a;
    }
  }

  /* ---------- Khung Hỏi Copilot ---------- */
  let panel, log = [];
  const SUGGEST = {
    cv:    ['Bắt đầu dùng Hub từ đâu?', 'Câu lệnh so sánh hai văn bản', 'Lập đề cương kiểm tra giám sát', 'Có được đưa tài liệu nội bộ lên Copilot không?'],
    pic:   ['Đề xuất ứng dụng AI mới như thế nào?', 'Khi nào dùng Agent?', 'Giờ công tiết kiệm được tính thế nào?', 'Rà soát tờ trình HĐTV'],
    ld:    ['Giờ công tiết kiệm được tính thế nào?', 'Ai chịu trách nhiệm nội dung AI tạo ra?', 'Bản tin đầu ngày cho Lãnh đạo', 'Theo dõi chỉ đạo'],
    admin: ['Khi nào dùng Agent?', 'Có được đưa tài liệu nội bộ lên Copilot không?', 'Đề xuất ứng dụng AI mới như thế nào?', 'Hỏi đáp kho quy chế nội bộ']
  };
  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement('aside');
    panel.className = 'cp-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Hỏi Copilot');
    panel.innerHTML = `<div class="cp-head"><div class="cp-orb" aria-hidden="true"></div><div><h3>Hỏi Copilot PVEP</h3>
        <small>Trả lời từ kho tri thức của Hub · luôn kèm nguồn</small></div><button class="x" data-cp-close aria-label="Đóng">×</button></div>
      <div class="cp-log" id="cpLog" aria-live="polite"></div>
      <form class="cp-form" id="cpForm"><textarea id="cpIn" rows="2" placeholder="Hỏi về công việc, câu lệnh, quy định dùng Copilot…" aria-label="Câu hỏi"></textarea>
        <button class="btn primary" type="submit" aria-label="Gửi">Gửi</button></form>
      <div class="cp-note">${C.assistant.endpoint ? 'Đã kết nối máy chủ trợ lý nội bộ.' : 'Chế độ tra cứu tại chỗ: không gửi câu hỏi ra ngoài.'} Kết quả cần đối chiếu tài liệu gốc.</div>`;
    document.body.appendChild(panel);
    panel.addEventListener('submit', e => { e.preventDefault(); const t = U.$('#cpIn', panel); const q = t.value.trim(); if (q) { t.value = ''; ask(q); } });
    panel.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'cpIn') { e.preventDefault(); U.$('#cpForm', panel).requestSubmit(); }
      if (e.key === 'Escape') panelClose();
    });
    panel.addEventListener('click', onAct);
    return panel;
  }
  function onAct(e) {
    if (e.target.closest('[data-cp-close]')) return panelClose();
    const c = e.target.closest('[data-cp-copy]'); if (c) return U.copy(copyBuf[+c.dataset.cpCopy]);
    const o = e.target.closest('[data-cp-open]'); if (o) { const [k, ...r] = o.dataset.cpOpen.split(':'); return open(k, r.join(':')); }
    const s = e.target.closest('[data-cp-ask]'); if (s) return ask(s.dataset.cpAsk);
  }
  function drawLog() {
    const el = U.$('#cpLog', panel);
    const p = H.person();
    const intro = `<div class="cp-msg bot"><p>Chào anh/chị${p ? ' ' + esc(H.firstName(p.name)) : ''}. Có thể hỏi về cách làm một công việc, tìm câu lệnh mẫu, hoặc nguyên tắc dùng Copilot an toàn.</p>
      <div class="cp-sugs">${(SUGGEST[H.role()] || SUGGEST.cv).map(s => `<button data-cp-ask="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>`;
    el.innerHTML = intro + log.map(m => m.who === 'me' ? `<div class="cp-msg me">${esc(m.text)}</div>`
      : `<div class="cp-msg bot">${m.html}${m.sources && m.sources.length ? `<div class="cp-srcs"><span>Nguồn trong Hub</span>${m.sources.map(srcChip).join('')}</div>` : ''}</div>`).join('')
      + (log.busy ? '<div class="cp-msg bot cp-typing"><i></i><i></i><i></i></div>' : '');
    el.scrollTop = el.scrollHeight;
  }
  function panelOpen(q) {
    ensurePanel(); drawLog();
    requestAnimationFrame(() => panel.classList.add('in'));
    document.body.classList.add('cp-on');
    if (q) ask(q); else setTimeout(() => U.$('#cpIn', panel).focus(), 60);
  }
  function panelClose() { if (!panel) return; panel.classList.remove('in'); document.body.classList.remove('cp-on'); const f = U.$('.cp-fab'); f && f.focus(); }
  async function ask(q) {
    if (!q) return;
    ensurePanel();
    if (!panel.classList.contains('in')) { panel.classList.add('in'); document.body.classList.add('cp-on'); }
    log.push({ who: 'me', text: q }); log.busy = true; drawLog();
    const a = await answer(q);
    await new Promise(r => setTimeout(r, 250));
    log.busy = false; log.push({ who: 'bot', ...a }); drawLog();
    if (log.length > 40) log = log.slice(-40);
  }

  /* ---------- Ô tra cứu nhanh trên đầu trang ---------- */
  function mountQuickSearch(input) {
    const box = document.createElement('div');
    box.className = 'qs-pop'; box.setAttribute('role', 'listbox'); box.id = 'qsPop';
    input.parentNode.appendChild(box);
    input.setAttribute('aria-controls', 'qsPop'); input.setAttribute('aria-autocomplete', 'list');
    let items = [], sel = 0;
    const hide = () => { box.classList.remove('in'); input.setAttribute('aria-expanded', 'false'); };
    function draw() {
      const q = input.value.trim();
      if (!q) { hide(); return; }
      const hits = search(q, { limit: 40 });
      const groups = {};
      hits.forEach(h => { (groups[h.kind] = groups[h.kind] || []).length < 3 && groups[h.kind].push(h); });
      items = [];
      let html = '';
      ['task', 'tool', 'faq', 'tip', 'sample', 'page', 'person'].forEach(k => {
        if (!groups[k]) return;
        html += `<div class="qs-g">${KINDS[k].label}</div>` + groups[k].map(h => { items.push(h); return `<button class="qs-i" role="option" data-i="${items.length - 1}"><i>${KINDS[k].icon}</i><span><b>${esc(h.title)}</b><small>${esc(h.sub)}</small></span></button>`; }).join('');
      });
      items.push({ kind: 'ask', q });
      html += `<button class="qs-i qs-ask" role="option" data-i="${items.length - 1}"><i>✦</i><span><b>Hỏi Copilot: “${esc(q)}”</b><small>Trả lời kèm nguồn trong Hub</small></span></button>`;
      box.innerHTML = (hits.length ? '' : '<div class="qs-empty">Không có kết quả khớp. Thử hỏi Copilot.</div>') + html;
      sel = 0; mark(); box.classList.add('in'); input.setAttribute('aria-expanded', 'true');
    }
    const mark = () => U.$$('.qs-i', box).forEach((b, i) => b.classList.toggle('sel', i === sel));
    function pick(i) {
      const it = items[i]; if (!it) return;
      hide(); input.blur();
      if (it.kind === 'ask') { input.value = ''; return panelOpen(it.q); }
      open(it.kind, it.id);
    }
    input.addEventListener('input', draw);
    input.addEventListener('focus', () => input.value.trim() && draw());
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(sel); }
      else if (e.key === 'Escape') { hide(); input.blur(); }
    });
    box.addEventListener('mousedown', e => { const b = e.target.closest('[data-i]'); if (b) { e.preventDefault(); pick(+b.dataset.i); } });
    input.addEventListener('blur', () => setTimeout(hide, 120));
    document.addEventListener('keydown', e => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); input.focus(); input.select(); }
    });
  }

  function mountFab() {
    const b = document.createElement('button');
    b.className = 'cp-fab'; b.type = 'button';
    b.innerHTML = '<span class="cp-orb" aria-hidden="true"></span><span>Hỏi Copilot</span>';
    b.onclick = () => (panel && panel.classList.contains('in') ? panelClose() : panelOpen());
    document.body.appendChild(b);
  }

  return { norm, search, ask, open, openTip, panelOpen, panelClose, mountQuickSearch, mountFab, KINDS, FAQ, genericPrompt };
})();
