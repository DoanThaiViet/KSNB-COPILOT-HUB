/* ========================== TRANG CHỦ THEO PERSONA ==========================
   Hero trả lời 3 câu hỏi: Tôi cần làm gì? Việc nào cần chú ý? AI giúp tôi ở đâu?
   Cùng khung, nội dung đổi theo persona:
     Nhân sự  → việc của tôi + gợi ý AI + hướng dẫn ngắn
     PIC      → tiến độ nhóm + use case chưa triển khai + người cần hỗ trợ
     Lãnh đạo → hiệu quả + rủi ro + việc cần quyết định + top use case
     Điều phối→ hàng đợi rà soát thư viện + chất lượng dữ liệu + quản trị dữ liệu
   Mọi con số suy ra từ dữ liệu; chỗ nào chưa có số liệu thì nói rõ. */
AIM.views.home = (function () {
  const U = AIM.ui, L = AIM.logic, C = AIM.config, S = AIM.store, H = AIM.hub;
  const { esc, nf, pct } = U;
  const clip = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; };

  /* ---------- 4 KPI có giá trị ra quyết định ---------- */
  function kpiData() {
    const ppl = S.all('people'), ucs = S.all('useCases');
    const surveyed = ppl.filter(p => p.usage && p.usage !== 'unknown');
    const active = ppl.filter(p => p.usage === 'daily' || p.usage === 'weekly');
    const approved = ucs.filter(u => u.status === 'Approved');
    const withUc = ppl.filter(p => L.hasUseCase(p.id)).length;
    return {
      usage: surveyed.length
        ? { v: pct(active.length / ppl.length * 100), s: `${active.length}/${ppl.length} cán bộ dùng hằng ngày/hằng tuần`, tip: 'Theo khảo sát mức độ sử dụng Copilot' }
        : { v: 'Chưa khảo sát', s: `Tạm tính: ${withUc}/${ppl.length} cán bộ đã được giao ứng dụng AI (${pct(withUc / (ppl.length || 1) * 100)})`, warn: true, tip: 'Chưa có số liệu khảo sát mức độ sử dụng. Chỉ số tạm tính là tỷ lệ cán bộ đã được giao ít nhất một ứng dụng AI, không phản ánh tần suất dùng.' },
      running: { v: approved.length, s: `trên tổng ${ucs.length} use case của Ban`, tip: 'Ứng dụng AI đã duyệt, đang dùng trong công việc' },
      hours: { v: nf(approved.reduce((a, u) => a + L.savedHours(u), 0)), unit: 'giờ/tháng', s: `Tiềm năng khi triển khai hết: ${nf(ucs.reduce((a, u) => a + L.savedHours(u), 0))} giờ/tháng`, tip: '(giờ trước − giờ sau) × số lần/tháng, chỉ cộng ứng dụng AI đã duyệt. Số khai báo, là ước tính.' },
      runs: { v: nf(approved.reduce((a, u) => a + (+u.perMonth || 0), 0)), unit: 'lượt/tháng', s: 'Lượt công việc có AI hỗ trợ mỗi tháng', tip: 'Tổng số lần thực hiện/tháng của các ứng dụng AI đã duyệt' }
    };
  }
  function kpis(compact) {
    const k = kpiData(), nav = AIM.app.canGov() ? ' go" data-nav="dashboard' : '';
    const card = (label, o, icon) => `<div class="k4${o.warn ? ' warn' : ''}${nav}" data-tip="${esc(o.tip)}"><div class="k4-i" aria-hidden="true">${icon}</div>
      <div><div class="k4-l">${esc(label)}</div><div class="k4-v">${esc(o.v)}${o.unit ? `<small>${esc(o.unit)}</small>` : ''}</div><div class="k4-s">${esc(o.s)}</div></div></div>`;
    return `<div class="k4s${compact ? ' compact' : ''}">
      ${card('Tỷ lệ nhân sự sử dụng', k.usage, '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c.6-3.4 3-5.4 6-5.4s5.4 2 6 5.4"/><path d="M16 11l2 2 4-4"/></svg>')}
      ${card('Use case đang vận hành', k.running, '<svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg>')}
      ${card('Giờ công ước tính tiết kiệm', k.hours, '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>')}
      ${card('Công việc hoàn thành với AI', k.runs, '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z"/></svg>')}
    </div>`;
  }

  /* ---------- Thẻ công việc ---------- */
  function tile(u) {
    const g = U.group(u.groupId), tools = H.toolsFor(u.id), d = L.dueState(u.deadline, u.status === 'Approved');
    const best = tools[0];
    return `<article class="tk" style="--c:${g.color}">
      <div class="tk-ic" aria-hidden="true">${H.gIcon(u.groupId)}</div>
      <div class="tk-b"><h4>${esc(u.task)}</h4><p>${esc(clip(u.aiStep, 92))}</p>
        <div class="tk-m">${u.assign === 'common' ? '<span class="tk-role r-common">Việc chung của Ban</span>' : u.assign ? `<span class="tk-role r-duty">${esc(u.tag)}</span>${u.freq ? `<span class="tk-freq">${esc(u.freq)}</span>` : ''}` : '<span class="tk-role r-uc">Ứng dụng AI được giao</span>'}${d ? `<span class="tk-due ${d.key}">${esc(d.label)}</span>` : ''}${best ? `<span class="tk-tool">${esc(H.kind(best.type).label)}</span>` : ''}</div></div>
      <button class="btn primary sm tk-go" data-run="${esc(u.id)}" aria-label="Thực hiện: ${esc(u.task)}">Thực hiện</button>
    </article>`;
  }
  const tiles = list => `<div class="tks">${list.map(tile).join('')}</div>`;

  /* ---------- Gợi ý AI chủ động ---------- */
  function recs(tasks, max = 3) {
    const out = [], seen = new Set();
    /* Ưu tiên Skill (cách làm chuẩn) gắn với việc; bỏ qua Agent còn ở mức thiết kế */
    tasks.forEach(u => {
      H.toolsFor(u.id).filter(x => x.type !== 'prompt' && x.status !== 'Draft').forEach(x => {
        if (seen.has(x.id) || out.length >= max) return; seen.add(x.id);
        out.push({ u, x, why: `Bạn đang làm <b>${esc(u.task)}</b>`, what: `${esc(H.kind(x.type).label.toLowerCase())} <b>${esc(x.name)}</b>` });
      });
    });
    tasks.forEach(u => {
      if (out.length >= max) return;
      const x = H.toolsFor(u.id).find(t => t.type === 'prompt');
      if (x && !seen.has(x.id)) { seen.add(x.id); out.push({ u, x, why: `Bạn đang làm <b>${esc(u.task)}</b>`, what: `câu lệnh mẫu <b>${esc(x.name)}</b>` }); }
    });
    if (!out.length) return '';
    return `<div class="recs" style="--img:url('${esc(H.visual('assistant'))}')">
      <div class="recs-h"><span class="cp-orb" aria-hidden="true"></span><div><h3>Gợi ý cho bạn</h3><p>AI đề xuất công cụ phù hợp với việc đang làm</p></div></div>
      <div class="recs-l">${out.map(r => `<button class="rec" data-run="${esc(r.u.id)}"><span>${r.why}</span><span class="rec-arrow">→ thử ${r.what}</span></button>`).join('')}</div></div>`;
  }

  /* ---------- Hero ---------- */
  function hero(p, line, ctas, aside) {
    const r = H.role();
    const groups = (p && p.groups || []).map(g => U.group(g).name);
    return `<section class="hero-cc" style="--img:url('${esc(H.visual('home'))}')">
      <div class="hero-in">
        <div class="hero-eyebrow"><span>Không gian của tôi · ${esc(C.roles[r].label)}</span>
          <button class="linkish" data-identity>Đổi vai trò</button></div>
        <h2>Chào anh/chị ${esc(p ? p.name : '')}</h2>
        <div class="hero-role">${esc(p ? p.title : '')}${p && p.unit ? ' · ' + esc(p.unit) : ''}${groups.length ? `<span class="hero-grps">${groups.slice(0, 4).map(g => `<i>${esc(g)}</i>`).join('')}</span>` : ''}</div>
        <p class="hero-line">${line}</p>
        <form class="hero-ask" id="heroAsk" role="search"><span class="cp-orb sm" aria-hidden="true"></span>
          <input id="heroQ" placeholder="Hỏi Copilot hoặc tìm nhanh: “rà soát tờ trình”, “so sánh văn bản”…" aria-label="Hỏi Copilot">
          <button class="btn primary" type="submit">Hỏi</button></form>
        <div class="hero-ctas">${ctas}</div>
      </div>
      ${aside ? `<div class="hero-aside">${aside}</div>` : ''}
    </section>`;
  }
  const cta = (label, attrs, cls = '') => `<button class="cta ${cls}" ${attrs}>${label}</button>`;
  const head = (t, note, act) => `<div class="blk-h"><div><h3>${esc(t)}</h3>${note ? `<p>${note}</p>` : ''}</div>${act || ''}</div>`;
  const scopeSeg = () => `<div class="seg scope-seg" role="group" aria-label="Phạm vi"><button data-scope="mine" class="${H.scope() === 'mine' ? 'active' : ''}">Của tôi</button><button data-scope="hub" class="${H.scope() === 'hub' ? 'active' : ''}" data-tip="Hiện có dữ liệu của ${esc(C.unitName)}">Toàn Hub PVEP</button></div>`;
  const featured = () => [...S.all('useCases')].filter(u => u.status !== 'Draft').sort((a, b) => (b.status === 'Approved') - (a.status === 'Approved') || L.savedHours(b) - L.savedHours(a)).slice(0, 6);

  function workBlock(mine, title) {
    const hub = H.scope() === 'hub';
    const list = hub ? featured() : mine.slice(0, 6);   // mine đã xếp theo thứ tự ưu tiên (H.allMine)
    return `<section class="blk" id="myWork">${head(hub ? 'Công việc tiêu biểu toàn Hub' : title,
        hub ? 'Ứng dụng AI xếp theo giờ tiết kiệm' : `${mine.length} việc · việc chung của Ban, ứng dụng AI được giao và nhiệm vụ theo phân công`,
        `<div class="blk-acts">${scopeSeg()}<button class="btn sm ghost" data-nav="work${hub ? '?scope=hub' : ''}">Xem tất cả →</button></div>`)}
      ${list.length ? tiles(list) : `<div class="empty-note">Chưa có công việc được giao cho cán bộ này. <button class="linkish" data-scope="hub">Xem công việc tiêu biểu toàn Hub</button></div>`}</section>`;
  }
  const myHours = tasks => tasks.reduce((a, u) => a + (u.status === 'Approved' ? L.savedHours(u) : 0), 0);
  const asideStat = (v, l, s) => `<div class="glass"><div class="g-v">${v}</div><div class="g-l">${esc(l)}</div>${s ? `<div class="g-s">${s}</div>` : ''}</div>`;

  /* ================= Persona: Nhân sự ================= */
  function staff(el, p) {
    const mine = H.allMine(), ucs = mine.filter(u => !u.assign);
    const need = ucs.filter(H.needsAction);
    const helpers = new Set(mine.flatMap(u => H.toolsFor(u.id).filter(x => x.status !== 'Draft').map(x => x.id)));   // công cụ dùng được cho việc của tôi
    const runs = H.myRuns(), recent = Object.keys(runs).map(H.findTask).filter(Boolean).slice(0, 4);
    el.innerHTML = hero(p,
      `Bạn có <b>${mine.length}</b> nhiệm vụ · <b>${need.length}</b> việc sắp đến hạn · <b>${helpers.size}</b> công cụ AI hỗ trợ`,
      cta('<span>▶</span> Bắt đầu một công việc', 'data-start', 'primary') + cta('✦ Hỏi Copilot', 'data-ask') + cta('Xem công việc của tôi', 'data-nav="work"'),
      asideStat(nf(myHours(ucs)) + '<small> giờ/tháng</small>', 'Tiết kiệm ước tính của tôi', `từ ${ucs.length} ứng dụng AI được giao`))
    + workBlock(mine, 'Công việc của tôi')
    + recs(mine)
    + (recent.length ? `<section class="blk">${head('Tiếp tục gần đây', 'Những việc bạn đã thực hiện với AI trên máy này')}<div class="chips">${recent.map(u => `<button class="chip" data-run="${u.id}">${esc(u.task)}<em>${runs[u.id]} lần</em></button>`).join('')}</div></section>` : '')
    + `<section class="blk">${head('Dùng AI trong 3 bước', 'Không cần học trước Prompt, Skill hay Agent')}
        <div class="steps3"><div><b>1</b><h4>Chọn việc</h4><p>Mở “Công việc của tôi”, chọn đúng việc đang làm.</p></div>
        <div><b>2</b><h4>Bấm Thực hiện</h4><p>Hub đưa sẵn câu lệnh hoặc quy trình. Sao chép sang Copilot.</p></div>
        <div><b>3</b><h4>Kiểm tra lại</h4><p>Đối chiếu số liệu, căn cứ với tài liệu gốc trước khi dùng.</p></div></div></section>`
    + `<section class="blk">${head('Hiệu quả toàn Hub', `Số liệu chung của ${esc(C.unitName)}`)}${kpis(true)}</section>`;
  }

  /* ================= Persona: PIC ================= */
  function pic(el, p) {
    const mine = H.myTasks().filter(u => L.owners(u).includes(p.id));
    const primary = S.all('useCases').filter(u => u.ownerId === p.id);
    const gtasks = H.groupTasks();
    const drafts = gtasks.filter(u => u.status === 'Draft').sort(H.prioritySort);
    const members = S.all('people').filter(x => x.id !== p.id && (x.groups || []).some(g => H.myGroups().includes(g)));
    const needHelp = members.map(x => {
      const n = S.all('useCases').filter(u => L.owners(u).includes(x.id)).length;
      const reason = !n ? 'Chưa được giao ứng dụng AI' : x.usage === 'none' ? 'Chưa sử dụng Copilot' : x.usage === 'unknown' ? 'Chưa khảo sát mức độ sử dụng' : x.usage === 'occasional' ? 'Chỉ dùng thỉnh thoảng' : '';
      return { x, n, reason, w: !n ? 3 : x.usage === 'none' ? 2 : 1 };
    }).filter(r => r.reason).sort((a, b) => b.w - a.w || a.n - b.n);
    const behind = gtasks.filter(H.needsAction);
    el.innerHTML = hero(p,
      `Bạn là đầu mối <b>${primary.length}</b> ứng dụng AI · nhóm có <b>${behind.length}</b> việc cần chú ý · <b>${needHelp.filter(r => r.w >= 2).length}</b> người cần hỗ trợ`,
      cta('<span>▶</span> Cập nhật công việc', 'data-nav="work"', 'primary') + cta('✦ Hỏi Copilot', 'data-ask') + cta('Xem tiến độ nhóm', 'data-scroll="team"'),
      asideStat(pct(gtasks.length ? gtasks.filter(u => u.status === 'Approved').length / gtasks.length * 100 : 0), 'Use case nhóm đã vận hành', `${gtasks.length} use case trong ${H.myGroups().length} nhóm`))
    + workBlock(mine, 'Việc tôi phụ trách')
    + `<div class="grid2">
        <section class="blk card-blk" id="team">${head('Tiến độ nhóm', 'Theo trạng thái ứng dụng AI · bấm để lọc')}${U.stackBars(H.myGroups().map(gid => ({
          label: U.group(gid).name, attrs: `data-nav="usecases?group=${gid}"`,
          parts: [{ v: S.all('useCases').filter(u => u.groupId === gid).length, color: '#00843d', name: 'Use case' }] })), { labelWidth: 160, unit: 'use case' })}</section>
        <section class="blk card-blk">${head('Use case chưa triển khai', `${drafts.length} việc còn ở dự thảo`)}
          <div class="lst">${drafts.slice(0, 6).map(u => `<button class="li" data-uc="${u.id}"><span><b>${esc(u.task)}</b><small>${esc(U.group(u.groupId).short)} · ${esc(u.next || 'Chưa có bước tiếp theo')}</small></span>${U.prio(u.priority)}</button>`).join('') || '<div class="empty-note">Không còn use case dự thảo.</div>'}</div></section>
      </div>
      <section class="blk card-blk">${head('Người cần hỗ trợ', 'Thành viên trong nhóm của bạn · ưu tiên người chưa được giao việc')}
        <div class="ppl">${needHelp.slice(0, 8).map(r => `<button class="pp" data-person="${r.x.id}">${U.avatar(r.x.id, 34)}<span><b>${esc(r.x.name)}</b><small>${esc(r.reason)}</small></span></button>`).join('') || '<div class="empty-note">Mọi thành viên đã tham gia.</div>'}</div>
        ${S.all('people').every(x => x.usage === 'unknown') ? '<p class="note-warn">Chưa có khảo sát mức độ sử dụng Copilot — nên thực hiện để xác định đúng người cần hỗ trợ.</p>' : ''}</section>`
    + recs(mine)
    + `<section class="blk">${head('Hiệu quả toàn Hub', '')}${kpis(true)}</section>`;
  }

  /* ================= Persona: Lãnh đạo Ban ================= */
  function lead(el, p) {
    const ucs = S.all('useCases'), lib = S.all('library');
    const act = [];
    ucs.filter(u => u.leadId === p.id && u.status !== 'Approved').forEach(u => { const d = L.dueState(u.deadline, false); if (d) act.push({ w: d.key === 'over' ? 3 : 2, t: u.task, s: `${d.label} · PIC ${U.pname(u.ownerId)}`, tag: d.key === 'over' ? 'Quá hạn' : 'Sắp đến hạn', cls: d.key, attr: `data-uc="${u.id}"` }); });
    lib.filter(x => x.leadId === p.id && x.status === 'Testing').forEach(x => act.push({ w: 2, t: x.name, s: `${H.kind(x.type).label} · người rà soát ${U.pname(x.reviewerId)}`, tag: 'Chờ duyệt dùng', cls: 'soon', attr: `data-lib="${x.id}"` }));
    ucs.filter(u => u.leadId === p.id && L.agentMismatch(u)).forEach(u => act.push({ w: 2, t: u.task, s: 'Đang xây Agent nhưng chưa đủ 5 tiêu chí', tag: 'Xem lại cấp độ', cls: 'soon', attr: `data-uc="${u.id}"` }));
    act.sort((a, b) => b.w - a.w);
    const over = ucs.filter(u => L.dueState(u.deadline, u.status === 'Approved')?.key === 'over');
    const mism = ucs.filter(L.agentMismatch);
    const ms = S.all('milestones').map(m => ({ m, st: L.milestoneState(m) })).filter(r => ['late', 'behind'].includes(r.st.key));
    const unknown = S.all('people').filter(x => x.usage === 'unknown').length;
    const noRev = lib.filter(x => x.status === 'Testing' && !x.reviewerId).length;
    const risks = [
      unknown && { lv: 'med', t: 'Chưa đo được mức độ sử dụng thực tế', s: `${unknown}/${S.all('people').length} cán bộ chưa khảo sát · chỉ số adoption đang là tạm tính`, nav: 'people' },
      over.length && { lv: 'high', t: `${over.length} ứng dụng AI quá hạn`, s: over.slice(0, 2).map(u => u.task).join(' · '), nav: 'usecases' },
      ms.length && { lv: ms.some(r => r.st.key === 'late') ? 'high' : 'med', t: `${ms.length} mốc lộ trình chậm`, s: ms.map(r => r.m.name + ' (' + r.st.label.toLowerCase() + ')').join(' · '), nav: 'roadmap' },
      mism.length && { lv: 'med', t: `${mism.length} Agent đang xây khi chưa đủ tiêu chí`, s: 'Rủi ro đầu tư tự động hóa khi quy trình chưa ổn định', nav: 'agents' },
      noRev && { lv: 'med', t: `${noRev} nội dung chưa có người rà soát`, s: 'Thiếu kiểm soát 4 mắt trước khi dùng rộng', nav: 'prompts' }
    ].filter(Boolean);
    const top = [...ucs].sort((a, b) => L.savedHours(b) - L.savedHours(a)).slice(0, 5);
    const maxH = Math.max(1, ...top.map(L.savedHours));
    const k = kpiData();
    el.innerHTML = hero(p,
      `Có <b>${act.length}</b> việc cần Lãnh đạo xem xét · <b>${risks.filter(r => r.lv === 'high').length}</b> rủi ro mức cao · hiệu quả đã vận hành <b>${k.hours.v}</b> giờ/tháng`,
      cta('<span>▶</span> Xem việc cần quyết định', 'data-scroll="act"', 'primary') + cta('✦ Hỏi Copilot', 'data-ask') + cta('Mở Điều hành', 'data-nav="dashboard"'),
      asideStat(k.running.v + '<small> / ' + ucs.length + '</small>', 'Use case đang vận hành', esc(k.running.s)))
    + `<section class="blk">${kpis()}</section>
      <div class="grid2">
        <section class="blk card-blk" id="act">${head('Việc cần quyết định', `Phụ trách của ${esc(p.name)}`)}
          <div class="lst">${act.slice(0, 7).map(a => `<button class="li" ${a.attr}><span><b>${esc(a.t)}</b><small>${esc(a.s)}</small></span><em class="tag ${a.cls}">${esc(a.tag)}</em></button>`).join('') || '<div class="empty-note">Không có việc đến hạn hay chờ duyệt.</div>'}</div></section>
        <section class="blk card-blk">${head('Rủi ro triển khai', 'Góc nhìn kiểm soát · bấm để xem chi tiết')}
          <div class="lst">${risks.map(r => `<button class="li risk ${r.lv}" data-nav="${r.nav}"><i aria-hidden="true"></i><span><b>${esc(r.t)}</b><small>${esc(r.s)}</small></span><em class="tag ${r.lv === 'high' ? 'over' : 'soon'}">${r.lv === 'high' ? 'Cao' : 'Trung bình'}</em></button>`).join('') || '<div class="empty-note">Chưa ghi nhận rủi ro.</div>'}</div></section>
      </div>
      <div class="grid2">
        <section class="blk card-blk">${head('Top use case hiệu quả', 'Giờ tiết kiệm ước tính/tháng')}
          <div class="topl">${top.map((u, i) => `<button class="tl" data-uc="${u.id}"><b>${i + 1}</b><span>${esc(u.task)}<small>${esc(U.group(u.groupId).short)}</small></span><i><u style="width:${L.savedHours(u) / maxH * 100}%"></u></i><em>${nf(L.savedHours(u), 1)}</em></button>`).join('')}</div></section>
        <section class="blk card-blk">${head('Mức độ tham gia theo nhóm', 'Cán bộ đã được giao ứng dụng AI / thành viên nhóm')}
          ${U.stackBars(S.all('groups').map(g => { const mem = S.all('people').filter(x => (x.groups || []).includes(g.id)); const n = mem.filter(x => L.hasUseCase(x.id)).length;
            return { label: g.name, attrs: `data-nav="people?group=${g.id}"`, parts: [{ v: n, color: '#00843d', name: 'Đã tham gia' }, { v: mem.length - n, color: '#dfe5ec', name: 'Chưa tham gia' }], valueLabel: `${n}/${mem.length}` }; }), { labelWidth: 150, unit: 'người' })}</section>
      </div>`;
  }

  /* ================= Persona: Điều phối / Admin ================= */
  function admin(el, p) {
    const lib = S.all('library'), ucs = S.all('useCases');
    const by = st => lib.filter(x => x.status === st).length;
    const queue = lib.filter(x => x.status === 'Testing').sort((a, b) => String(a.deadline || '9999').localeCompare(String(b.deadline || '9999')));
    const checks = [
      { t: 'Nội dung thử nghiệm chưa có người rà soát', n: lib.filter(x => x.status === 'Testing' && !x.reviewerId).length, nav: 'prompts' },
      { t: 'Công cụ AI chưa gắn với công việc', n: lib.filter(x => x.status !== 'Deprecated' && !S.get('useCases', x.useCaseId)).length, nav: 'prompts' },
      { t: 'Agent chưa có đường dẫn sử dụng', n: lib.filter(x => x.type === 'agent' && x.status !== 'Deprecated' && !x.launchUrl).length, nav: 'agents' },
      { t: 'Use case chưa có thời hạn', n: ucs.filter(u => !u.deadline).length, nav: 'usecases' },
      { t: 'Use case chưa có công cụ AI nào', n: ucs.filter(u => !H.toolsFor(u.id).length).length, nav: 'usecases' },
      { t: 'Cán bộ chưa khảo sát mức độ sử dụng', n: S.all('people').filter(x => x.usage === 'unknown').length, nav: 'people' }
    ];
    el.innerHTML = hero(p,
      `Thư viện có <b>${queue.length}</b> nội dung chờ rà soát · <b>${by('Draft')}</b> bản dự thảo · <b>${checks.filter(c => c.n).length}</b> điểm dữ liệu cần làm sạch`,
      cta('<span>▶</span> Mở hàng đợi rà soát', 'data-scroll="queue"', 'primary') + cta('✦ Hỏi Copilot', 'data-ask') + cta('Quản trị dữ liệu', 'data-scroll="data"'),
      asideStat(lib.filter(x => x.status !== 'Deprecated').length, 'Nội dung trong thư viện', ['prompt', 'skill', 'agent'].map(t => `${lib.filter(x => x.type === t && x.status !== 'Deprecated').length} ${H.kind(t).tech}`).join(' · ')))
    + `<section class="blk"><div class="libst">${[['Approved', 'Đã duyệt'], ['Testing', 'Chờ rà soát / thử nghiệm'], ['Draft', 'Dự thảo'], ['Deprecated', 'Ngừng dùng']].map(([s, l]) => `<div style="--c:${C.statuses[s].color}"><b>${by(s)}</b><span>${l}</span></div>`).join('')}</div></section>
      <div class="grid2">
        <section class="blk card-blk" id="queue">${head('Hàng đợi rà soát', 'Nội dung thử nghiệm · xếp theo hạn')}
          <div class="lst">${queue.map(x => `<button class="li" data-lib="${x.id}"><span><b>${esc(x.name)}</b><small>${esc(H.kind(x.type).tech)} · ${esc(x.id)} · rà soát: ${esc(x.reviewerId ? U.pname(x.reviewerId) : 'chưa phân công')}</small></span>${U.due(x.deadline)}</button>`).join('') || '<div class="empty-note">Không có nội dung chờ rà soát.</div>'}</div></section>
        <section class="blk card-blk">${head('Kiểm tra chất lượng dữ liệu', 'Số mục cần xử lý')}
          <div class="lst">${checks.map(c => `<button class="li chk${c.n ? '' : ' ok'}" data-nav="${c.nav}"><span><b>${esc(c.t)}</b></span><em class="tag ${c.n ? 'soon' : 'ok'}">${c.n ? c.n : 'Đạt'}</em></button>`).join('')}</div></section>
      </div>
      <section class="blk card-blk" id="data">${head('Dữ liệu của Hub', `Nguồn: ${S.mode() === 'rest' ? 'API/database' : 'bộ nhớ trình duyệt (bản demo)'} · ${C.unitName}`)}
        <div class="btn-row">${AIM.app.canEdit() ? '<button class="btn" data-export>Xuất JSON</button><button class="btn" data-import>Nạp JSON</button><button class="btn danger" data-reset>Khôi phục dữ liệu mẫu</button>' : ''}
        <input type="file" id="homeImport" accept=".json" hidden></div>
        <p class="faint" style="margin-top:8px">Khi chuyển sang database: đổi <code>AIM.config.data.mode</code> sang <code>'rest'</code> (xem js/store.js).</p></section>
      <section class="blk">${head('Hiệu quả toàn Hub', '')}${kpis(true)}</section>`;
  }

  function render(el) {
    const p = H.person();
    ({ cv: staff, pic, ld: lead, admin })[H.role()](el, p);
    el.addEventListener('submit', e => { if (e.target.id === 'heroAsk') { e.preventDefault(); const q = U.$('#heroQ', el).value.trim(); AIM.copilot.panelOpen(q || undefined); U.$('#heroQ', el).value = ''; } });
    el.addEventListener('change', e => { if (e.target.id === 'homeImport' && e.target.files[0]) { AIM.app.importFile(e.target.files[0]); e.target.value = ''; } });
    el.addEventListener('click', e => {
      const t = e.target;
      const sc = t.closest('[data-scope]'); if (sc) { H.setScope(sc.dataset.scope); return AIM.app.refresh(); }
      const run = t.closest('[data-run]'); if (run) return AIM.views.work.run(run.dataset.run);
      if (t.closest('[data-start]')) return AIM.views.work.pick();
      if (t.closest('[data-ask]')) return AIM.copilot.panelOpen();
      if (t.closest('[data-identity]')) return AIM.app.openIdentity();
      const s = t.closest('[data-scroll]'); if (s) { const x = document.getElementById(s.dataset.scroll); x && x.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      const uc = t.closest('[data-uc]'); if (uc) return AIM.views.usecases.open(uc.dataset.uc);
      const lb = t.closest('[data-lib]'); if (lb) return AIM.lib.open(lb.dataset.lib);
      const ps = t.closest('[data-person]'); if (ps) return AIM.views.people.open(ps.dataset.person);
      if (t.closest('[data-export]')) return AIM.app.exportData();
      if (t.closest('[data-import]')) return U.$('#homeImport', el).click();
      if (t.closest('[data-reset]')) return AIM.app.resetData();
      const n = t.closest('[data-nav]');
      if (n) { const [k, q] = n.dataset.nav.split('?'); AIM.app.go(k, q ? Object.fromEntries(new URLSearchParams(q)) : null); }
    });
  }

  return { title: 'Trang chủ', render, kpis, tile, recs };
})();
