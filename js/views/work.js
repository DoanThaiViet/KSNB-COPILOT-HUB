/* ========================== CÔNG VIỆC CỦA TÔI ==========================
   Task-first: người dùng chọn việc, bấm "Thực hiện" → khung 3 bước
   (Chuẩn bị → Làm với AI → Kiểm tra). Prompt/Skill/Agent chỉ là công cụ
   phía sau, hiển thị bằng tên thân thiện. */
AIM.views.work = (function () {
  const U = AIM.ui, L = AIM.logic, C = AIM.config, S = AIM.store, H = AIM.hub;
  const { esc, nf, hrs } = U;
  let f = { q: '', group: '', need: false };
  const clip = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; };

  const matches = (u, q) => !q || AIM.copilot.norm([u.task, u.pain, u.aiStep, u.next].join(' ')).includes(AIM.copilot.norm(q));
  function list(scope) {
    if (scope === 'mine') return H.allMine().filter(u => matches(u, f.q) && (!f.group || u.groupId === f.group) && (!f.need || H.toolsFor(u.id).length > 0));
    const base = scope === 'hub' ? S.all('useCases') : H.groupTasks();
    return base.filter(u => matches(u, f.q) && (!f.group || u.groupId === f.group) && (!f.need || H.needsAction(u))).sort(H.prioritySort);
  }

  function render(el, params) {
    const scope = ['mine', 'team', 'hub'].includes(params.scope) ? params.scope : 'mine';
    const groups = scope === 'hub' ? S.all('groups') : S.all('groups').filter(g => H.myGroups().includes(g.id) || H.allMine().some(u => u.groupId === g.id));
    el.innerHTML = `<div class="wk-bar">
        <div class="seg" role="group" aria-label="Phạm vi">${[['mine', 'Của tôi'], ['team', 'Nhóm của tôi'], ['hub', 'Toàn Hub PVEP']].map(([k, l]) => `<button data-sc="${k}" class="${k === scope ? 'active' : ''}">${l}</button>`).join('')}</div>
        <input type="search" id="wkQ" placeholder="Tìm việc: tờ trình, đề cương, báo cáo…" value="${esc(f.q)}" aria-label="Tìm công việc">
        <select id="wkG" aria-label="Nhóm công việc"><option value="">Tất cả nhóm</option>${groups.map(g => U.opt(g.id, g.name, f.group)).join('')}</select>
        <label class="fchk"><input type="checkbox" id="wkN"${f.need ? ' checked' : ''}> Chỉ việc đã có công cụ AI</label>
      </div><div id="wkList"></div>`;
    const draw = () => {
      const rows = list(scope);
      const sec = (t, n, arr) => arr.length ? `<div class="blk-h"><div><h3>${t}</h3><p>${n}</p></div></div><div class="tks">${arr.map(AIM.views.home.tile).join('')}</div><div class="blk-gap"></div>` : '';
      let html;
      if (scope === 'mine') {
        const grp = k => rows.filter(u => k === 'uc' ? !u.assign : u.assign === k);
        html = sec('Việc chung của Ban', 'Mọi cán bộ (trừ Tổ thư ký) đều tham gia', grp('common'))
          + sec('Nhiệm vụ theo chức năng', `${grp('duty').length} nhiệm vụ · theo bảng rà soát BM01 của Ban`, grp('duty'))
          + sec('Ứng dụng AI được giao', `${grp('uc').length} việc · xếp theo hạn và mức ưu tiên`, grp('uc'));
      } else html = sec(scope === 'hub' ? 'Tất cả công việc có ứng dụng AI' : 'Công việc của nhóm', `${rows.length} việc · ${esc(C.unitName)}`, rows);
      U.$('#wkList', el).innerHTML = rows.length ? html
        : `<div class="empty-note">Không có công việc phù hợp. <button class="linkish" data-sc="hub">Xem toàn Hub</button></div>`;
    };
    draw();
    el.addEventListener('input', e => { if (e.target.id === 'wkQ') { f.q = e.target.value; draw(); } });
    el.addEventListener('change', e => { if (e.target.id === 'wkG') f.group = e.target.value; if (e.target.id === 'wkN') f.need = e.target.checked; draw(); });
    el.addEventListener('click', e => {
      const s = e.target.closest('[data-sc]'); if (s) { f.group = ''; return AIM.app.go('work', s.dataset.sc === 'mine' ? null : { scope: s.dataset.sc }); }
      const r = e.target.closest('[data-run]'); if (r) run(r.dataset.run);
    });
  }

  /* ---------- Khung thực hiện 3 bước ---------- */
  function toolCard(x, copies) {
    const k = H.kind(x.type);
    const cp = t => { copies.push(t); return copies.length - 1; };
    const refs = x.type === 'skill' ? (x.steps || []) : [];
    let body = '';
    if (x.type === 'prompt') body = `<pre class="cp-code">${esc(x.instruction)}</pre>
        <div class="btn-row"><button class="btn primary sm" data-copy="${cp(x.instruction)}">Sao chép câu lệnh</button><a class="btn sm" href="${esc(C.assistant.copilotUrl)}" target="_blank" rel="noopener">Mở ${esc((C.tools[S.get('useCases', x.useCaseId)?.tool] || C.tools.chat).label)} ↗</a></div>`;
    else if (x.type === 'skill') body = `<ol class="run-steps">${refs.map(s => { const m = s.match(/PR-\d+/); const pr = m && S.get('library', m[0]);
        return `<li>${esc(s)}${pr && pr.instruction ? ` <button class="linkish" data-copy="${cp(pr.instruction)}">sao chép ${esc(pr.id)}</button>` : ''}</li>`; }).join('')}</ol>
        <div class="btn-row">${x.instruction && x.doc ? `<button class="btn primary sm" data-copy="${cp(x.instruction)}">Sao chép prompt</button>` : ''}<button class="btn sm" ${x.doc ? 'data-doc' : 'data-lib'}="${esc(x.id)}">${x.doc ? 'Xem SKILL.md' : 'Xem hướng dẫn đầy đủ'}</button></div>`;
    else {
      const url = /^https:\/\//.test(x.launchUrl || '') ? x.launchUrl : '';
      body = `<div class="kv2">${x.trigger ? `<span>Tự chạy khi</span><div>${esc(x.trigger)}</div>` : ''}${x.dataScope ? `<span>Dữ liệu</span><div>${esc(x.dataScope)}</div>` : ''}</div>
        <div class="btn-row">${url && x.status !== 'Draft' ? `<a class="btn primary sm" href="${esc(url)}" target="_blank" rel="noopener">Mở trợ lý ↗</a>` : '<span class="pill-note">Chưa mở cho người dùng — làm theo các Skill tương ứng</span>'}<button class="btn sm" ${x.flow ? 'data-agent' : 'data-lib'}="${esc(x.id)}">${x.flow ? 'Agent chạy thế nào' : 'Chi tiết'}</button></div>`;
    }
    return `<div class="run-tool t-${x.type}"><div class="rt-h"><span class="rt-k">${esc(k.label)} <em>${esc(k.tech)} · ${esc(x.id)}</em></span></div>
      <h4>${esc(x.name)}</h4><p>${esc(x.purpose)}</p>${body}</div>`;
  }

  function run(id) {
    const u = H.findTask(id); if (!u) return;
    const tools = H.toolsFor(u.id), copies = [];
    const inputs = [...new Set(tools.map(x => x.input).filter(Boolean))];
    const guards = [...new Set(tools.map(x => x.guardrails).filter(Boolean))];
    const resp = S.get('tips', 'TP-18');
    const g = U.group(u.groupId), d = L.dueState(u.deadline, u.status === 'Approved');
    const generic = AIM.copilot.genericPrompt(u.aiStep || u.task);
    const body = `
      <div class="run-top" style="--c:${g.color}"><div class="tk-ic" aria-hidden="true">${H.gIcon(u.groupId)}</div>
        <div>${u.assign === 'duty'
          ? `<div class="run-ai"><b>Kết quả cần có:</b> ${esc(clip(u.aiStep, 150))}</div>
             <details class="run-more"><summary>Xem mô tả đầy đủ nhiệm vụ</summary>${u.full ? `<p><b>Nhiệm vụ:</b> ${esc(u.full)}</p>` : ''}<p><b>Sản phẩm đầu ra:</b> ${esc(u.aiStep)}</p></details>`
          : `<div class="run-ai"><b>AI giúp:</b> ${esc(u.aiStep)}</div>`}
        <div class="run-save">${u.assign ? esc([H.roleLabel(u.assign), u.tag, u.freq && (u.qty ? u.qty + ' lần · ' : '') + u.freq.toLowerCase(), u.note].filter(Boolean).join(' · ')) : `${hrs(u.before)} giờ → <b>${hrs(u.after)} giờ</b>/lần · ${esc(C.frequencies[u.freq]?.label || '')} · tiết kiệm ước tính ${nf(L.savedHours(u), 1)} giờ/tháng`}</div></div></div>
      <ol class="run">
        <li><div class="run-n">1</div><div><h4>Chuẩn bị đầu vào</h4>
          ${inputs.length ? `<ul>${inputs.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : `<p>Tài liệu gốc của công việc: ${esc(u.current || 'hồ sơ liên quan')}.</p>`}
          <p class="faint">Chỉ dùng tài liệu trong phạm vi được phép truy cập.</p></div></li>
        <li><div class="run-n">2</div><div><h4>Thực hiện với AI</h4>
          ${tools.length ? tools.map(x => toolCard(x, copies)).join('') : `<p>Chưa có công cụ dựng sẵn cho việc này. Dùng câu lệnh khung:</p><pre class="cp-code">${esc(generic)}</pre>
            <div class="btn-row"><button class="btn primary sm" data-copy="${copies.push(generic) - 1}">Sao chép câu lệnh</button><button class="btn sm" data-askcp>Hỏi Copilot về việc này</button></div>`}</div></li>
        <li><div class="run-n">3</div><div><h4>Kiểm tra trước khi dùng</h4>
          <ul>${guards.map(t => `<li>${esc(t)}</li>`).join('')}${(resp ? resp.how : []).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div></li>
      </ol>`;
    U.drawer({
      title: esc(u.task),
      sub: u.assign ? `<span>${esc(u.tag || g.name)}</span><span class="tk-role r-${u.assign}">${esc(H.roleLabel(u.assign))}</span>`
        : `<span>${esc(g.name)}</span>${d ? `<span class="tk-due ${d.key}">${esc(d.label)}</span>` : ''}<span class="faint">PIC: ${esc(U.pname(u.ownerId))}</span>`,
      body, foot: `${u.assign ? '' : '<button class="btn" data-full>Hồ sơ đầy đủ</button>'}<span style="flex:1"></span><button class="btn" data-close>Đóng</button><button class="btn primary" data-done>Đã thực hiện xong</button>`,
      onMount: p => p.addEventListener('click', e => {
        const c = e.target.closest('[data-copy]'); if (c) return U.copy(copies[+c.dataset.copy]);
        const lb = e.target.closest('[data-lib]'); if (lb) return AIM.lib.open(lb.dataset.lib);
        const dc = e.target.closest('[data-doc]'); if (dc) return AIM.kb.openDoc(dc.dataset.doc);
        const ag = e.target.closest('[data-agent]'); if (ag) return AIM.views.kbagents.open(ag.dataset.agent);
        if (e.target.closest('[data-full]')) return AIM.views.usecases.open(u.id);
        if (e.target.closest('[data-askcp]')) { U.close(); return AIM.copilot.panelOpen(u.task); }
        if (e.target.closest('[data-done]')) { H.logRun(u.id); U.close(); U.toast('Đã ghi nhận: ' + u.task); if (AIM.app.current().key === 'home') AIM.app.refresh(); }
      })
    });
  }

  /* ---------- Chọn nhanh một việc để bắt đầu ---------- */
  function pick() {
    const mine = H.allMine();
    const rows = (arr) => arr.map(u => `<button class="li" data-pick="${u.id}"><span class="tk-ic sm" style="--c:${U.group(u.groupId).color}">${H.gIcon(u.groupId)}</span><span><b>${esc(u.task)}</b><small>${esc(u.assign ? (u.tag || H.roleLabel(u.assign)) + (u.freq ? ' · ' + u.freq : '') : U.group(u.groupId).short)}</small></span><em>→</em></button>`).join('');
    const p = U.modal({
      title: 'Bắt đầu một công việc', sub: '<span>Chọn việc đang làm — Hub sẽ đưa sẵn cách làm với AI</span>',
      body: `<input type="search" id="pkQ" class="pk-q" placeholder="Gõ tên công việc…" aria-label="Tìm công việc"><div class="lst" id="pkL">${rows(mine.length ? mine : S.all('useCases'))}</div>`,
      foot: '<button class="btn" data-close>Đóng</button>',
      onMount: pn => {
        pn.addEventListener('input', e => { if (e.target.id !== 'pkQ') return; const q = e.target.value; U.$('#pkL', pn).innerHTML = rows((q ? [...mine, ...S.all('useCases').filter(u => !mine.includes(u))] : mine).filter(u => matches(u, q))) || '<div class="empty-note">Không tìm thấy. Thử hỏi Copilot.</div>'; });
        pn.addEventListener('click', e => { const b = e.target.closest('[data-pick]'); if (b) run(b.dataset.pick); });
      }
    });
    return p;
  }

  return { title: 'Công việc của tôi', render, run, pick };
})();
