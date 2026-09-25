/* ========================== CÔNG VIỆC CỦA TÔI ==========================
   Task-first: người dùng chọn việc, bấm "Thực hiện" → khung 3 bước
   (Chuẩn bị → Làm với AI → Kiểm tra). Prompt/Skill/Agent chỉ là công cụ
   phía sau, hiển thị bằng tên thân thiện. */
AIM.views.work = (function () {
  const U = AIM.ui, L = AIM.logic, C = AIM.config, S = AIM.store, H = AIM.hub;
  const { esc, nf, hrs } = U;
  let f = { q: '', group: '', need: false };

  const matches = (u, q) => !q || AIM.copilot.norm([u.task, u.pain, u.aiStep, u.next].join(' ')).includes(AIM.copilot.norm(q));
  function list(scope) {
    const all = S.all('useCases');
    const base = scope === 'hub' ? all : scope === 'team' ? H.groupTasks() : H.myTasks();
    return base.filter(u => matches(u, f.q) && (!f.group || u.groupId === f.group) && (!f.need || H.needsAction(u))).sort(H.prioritySort);
  }

  function render(el, params) {
    const scope = ['mine', 'team', 'hub'].includes(params.scope) ? params.scope : 'mine';
    const groups = scope === 'hub' ? S.all('groups') : S.all('groups').filter(g => H.myGroups().includes(g.id) || H.myTasks().some(u => u.groupId === g.id));
    el.innerHTML = `<div class="wk-bar">
        <div class="seg" role="group" aria-label="Phạm vi">${[['mine', 'Của tôi'], ['team', 'Nhóm của tôi'], ['hub', 'Toàn Hub PVEP']].map(([k, l]) => `<button data-sc="${k}" class="${k === scope ? 'active' : ''}">${l}</button>`).join('')}</div>
        <input type="search" id="wkQ" placeholder="Tìm việc: tờ trình, đề cương, báo cáo…" value="${esc(f.q)}" aria-label="Tìm công việc">
        <select id="wkG" aria-label="Nhóm công việc"><option value="">Tất cả nhóm</option>${groups.map(g => U.opt(g.id, g.name, f.group)).join('')}</select>
        <label class="fchk"><input type="checkbox" id="wkN"${f.need ? ' checked' : ''}> Chỉ việc cần xử lý</label>
      </div><div id="wkList"></div>`;
    const draw = () => {
      const rows = list(scope);
      const need = rows.filter(H.needsAction), rest = rows.filter(u => !H.needsAction(u));
      const sec = (t, n, arr) => arr.length ? `<div class="blk-h"><div><h3>${t}</h3><p>${n}</p></div></div><div class="tks">${arr.map(AIM.views.home.tile).join('')}</div>` : '';
      U.$('#wkList', el).innerHTML = rows.length
        ? (scope === 'hub' ? sec('Tất cả công việc có ứng dụng AI', `${rows.length} việc · ${esc(C.unitName)}`, rows)
          : sec('Cần xử lý', `${need.length} việc sắp đến hạn, quá hạn hoặc ưu tiên cao`, need) + `<div class="blk-gap"></div>` + sec('Các việc khác', `${rest.length} việc`, rest))
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
    const k = H.kind(x.type), stc = C.statuses[x.status] || {};
    const cp = t => { copies.push(t); return copies.length - 1; };
    const refs = x.type === 'skill' ? (x.steps || []) : [];
    let body = '';
    if (x.type === 'prompt') body = `<pre class="cp-code">${esc(x.instruction)}</pre>
        <div class="btn-row"><button class="btn primary sm" data-copy="${cp(x.instruction)}">Sao chép câu lệnh</button><a class="btn sm" href="${esc(C.assistant.copilotUrl)}" target="_blank" rel="noopener">Mở ${esc((C.tools[S.get('useCases', x.useCaseId)?.tool] || C.tools.chat).label)} ↗</a></div>`;
    else if (x.type === 'skill') body = `<ol class="run-steps">${refs.map(s => { const m = s.match(/PR-\d+/); const pr = m && S.get('library', m[0]);
        return `<li>${esc(s)}${pr && pr.instruction ? ` <button class="linkish" data-copy="${cp(pr.instruction)}">sao chép ${esc(pr.id)}</button>` : ''}</li>`; }).join('')}</ol>
        <div class="btn-row"><button class="btn sm" data-lib="${esc(x.id)}">Xem hướng dẫn đầy đủ</button></div>`;
    else {
      const url = /^https:\/\//.test(x.launchUrl || '') ? x.launchUrl : '';
      body = `<div class="kv2">${x.trigger ? `<span>Tự chạy khi</span><div>${esc(x.trigger)}</div>` : ''}${x.dataScope ? `<span>Dữ liệu</span><div>${esc(x.dataScope)}</div>` : ''}</div>
        <div class="btn-row">${url && x.status !== 'Draft' ? `<a class="btn primary sm" href="${esc(url)}" target="_blank" rel="noopener">Mở trợ lý ↗</a>` : `<span class="pill-note">${x.status === 'Draft' ? 'Đang xây dựng — chưa mở cho người dùng' : 'Bản thử nghiệm — liên hệ ' + esc(U.pname(x.builderId))}</span>`}<button class="btn sm" data-lib="${esc(x.id)}">Chi tiết</button></div>`;
    }
    return `<div class="run-tool t-${x.type}"><div class="rt-h"><span class="rt-k">${esc(k.label)} <em>${esc(k.tech)} · ${esc(x.id)}</em></span><span class="st" style="color:${stc.color};background:${stc.bg}"><i style="background:${stc.color}"></i>${esc(U.stLabel(x.status))}</span></div>
      <h4>${esc(x.name)}</h4><p>${esc(x.purpose)}</p>${body}</div>`;
  }

  function run(id) {
    const u = S.get('useCases', id); if (!u) return;
    const tools = H.toolsFor(u.id), copies = [];
    const inputs = [...new Set(tools.map(x => x.input).filter(Boolean))];
    const guards = [...new Set(tools.map(x => x.guardrails).filter(Boolean))];
    const resp = S.get('tips', 'TP-18');
    const g = U.group(u.groupId), d = L.dueState(u.deadline, u.status === 'Approved');
    const generic = AIM.copilot.genericPrompt(u.aiStep || u.task);
    const body = `
      <div class="run-top" style="--c:${g.color}"><div class="tk-ic" aria-hidden="true">${H.gIcon(u.groupId)}</div>
        <div><div class="run-ai"><b>AI giúp:</b> ${esc(u.aiStep)}</div>
        <div class="run-save">${hrs(u.before)} giờ → <b>${hrs(u.after)} giờ</b>/lần · ${esc(C.frequencies[u.freq]?.label || '')} · tiết kiệm ước tính ${nf(L.savedHours(u), 1)} giờ/tháng</div></div></div>
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
      sub: `<span>${esc(g.name)}</span>${U.status(u.status)}${d ? `<span class="tk-due ${d.key}">${esc(d.label)}</span>` : ''}<span class="faint">PIC: ${esc(U.pname(u.ownerId))}</span>`,
      body, foot: `<button class="btn" data-full>Hồ sơ đầy đủ</button><span style="flex:1"></span><button class="btn" data-close>Đóng</button><button class="btn primary" data-done>Đã thực hiện xong</button>`,
      onMount: p => p.addEventListener('click', e => {
        const c = e.target.closest('[data-copy]'); if (c) return U.copy(copies[+c.dataset.copy]);
        const lb = e.target.closest('[data-lib]'); if (lb) return AIM.lib.open(lb.dataset.lib);
        if (e.target.closest('[data-full]')) return AIM.views.usecases.open(u.id);
        if (e.target.closest('[data-askcp]')) { U.close(); return AIM.copilot.panelOpen(u.task); }
        if (e.target.closest('[data-done]')) { H.logRun(u.id); U.close(); U.toast('Đã ghi nhận: ' + u.task); if (AIM.app.current().key === 'home') AIM.app.refresh(); }
      })
    });
  }

  /* ---------- Chọn nhanh một việc để bắt đầu ---------- */
  function pick() {
    const mine = H.myTasks().sort(H.prioritySort);
    const rows = (arr) => arr.map(u => `<button class="li" data-pick="${u.id}"><span class="tk-ic sm" style="--c:${U.group(u.groupId).color}">${H.gIcon(u.groupId)}</span><span><b>${esc(u.task)}</b><small>${esc(U.group(u.groupId).short)} · ${esc(U.stLabel(u.status))}</small></span><em>→</em></button>`).join('');
    const p = U.modal({
      title: 'Bắt đầu một công việc', sub: '<span>Chọn việc đang làm — Hub sẽ đưa sẵn cách làm với AI</span>',
      body: `<input type="search" id="pkQ" class="pk-q" placeholder="Gõ tên công việc…" aria-label="Tìm công việc"><div class="lst" id="pkL">${rows(mine.length ? mine : S.all('useCases'))}</div>`,
      foot: '<button class="btn" data-close>Đóng</button>',
      onMount: pn => {
        pn.addEventListener('input', e => { if (e.target.id !== 'pkQ') return; const q = e.target.value; U.$('#pkL', pn).innerHTML = rows((q ? S.all('useCases') : mine).filter(u => matches(u, q)).sort(H.prioritySort)) || '<div class="empty-note">Không tìm thấy. Thử hỏi Copilot.</div>'; });
        pn.addEventListener('click', e => { const b = e.target.closest('[data-pick]'); if (b) run(b.dataset.pick); });
      }
    });
    return p;
  }

  return { title: 'Công việc của tôi', render, run, pick };
})();
