/* =========================================================================
   LOGIC NGHIỆP VỤ (thuần tính toán, không đụng DOM)
   Mọi chỉ số hiển thị đều suy ra từ dữ liệu gốc tại đây.
   ========================================================================= */
AIM.logic = (function () {
  const C = AIM.config, S = () => AIM.store;
  const LEVEL_ORDER = ['usecase', 'prompt', 'skill', 'agent'];

  const today = () => { const d = C.asOf ? new Date(C.asOf) : new Date(); d.setHours(0, 0, 0, 0); return d; };
  const parse = s => { if (!s) return null; const d = new Date(s + 'T00:00:00'); return isNaN(d) ? null : d; };
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const daysBetween = (a, b) => Math.round((b - a) / 86400000);

  /* ---------- Ứng dụng AI ---------- */
  const savedPerRun = uc => Math.max(0, (+uc.before || 0) - (+uc.after || 0));
  const savedHours = uc => savedPerRun(uc) * (+uc.perMonth || 0);           // giờ/tháng
  const savedPct = uc => (+uc.before ? savedPerRun(uc) / uc.before * 100 : 0);

  function criteria(uc) {
    const t = C.thresholds, c = uc.crit || {};
    return {
      repeat: (+uc.perMonth || 0) >= t.repeatPerMonth,
      multi: !!c.multi, stable: !!c.stable, io: !!c.io,
      benefit: savedHours(uc) >= t.benefitHours
    };
  }
  function recommendedLevel(uc) {
    const cr = criteria(uc);
    const rule = C.levelRules.find(r => r.need.every(k => cr[k]));
    return rule ? rule.level : 'prompt';
  }
  const libFor = ucId => S().all('library').filter(x => x.useCaseId === ucId);

  /* Cấp hiện tại = sản phẩm cao nhất đã dùng được (Testing hoặc Approved) */
  function currentLevel(uc) {
    let lv = 0;
    libFor(uc.id).forEach(x => { if (x.status === 'Testing' || x.status === 'Approved') lv = Math.max(lv, LEVEL_ORDER.indexOf(x.type)); });
    return LEVEL_ORDER[lv];
  }
  /* Cấp đang hướng tới = cao nhất trong thư viện, kể cả bản Draft đang xây */
  function targetLevel(uc) {
    let lv = 0;
    libFor(uc.id).forEach(x => { if (x.status !== 'Deprecated') lv = Math.max(lv, LEVEL_ORDER.indexOf(x.type)); });
    return LEVEL_ORDER[Math.max(lv, LEVEL_ORDER.indexOf(currentLevel(uc)))];
  }
  /* Đang xây Agent nhưng chưa đủ tiêu chí → cần xem lại */
  const agentMismatch = uc => targetLevel(uc) === 'agent' && recommendedLevel(uc) !== 'agent';
  const agentCandidate = uc => recommendedLevel(uc) === 'agent';
  const levelIndex = lv => LEVEL_ORDER.indexOf(lv);

  /* ---------- Chuỗi trưởng thành ---------- */
  function funnel() {
    const ucs = S().all('useCases');
    const withType = t => ucs.filter(u => libFor(u.id).some(x => x.type === t && x.status !== 'Deprecated')).length;
    return {
      task: ucs.length,
      pain: ucs.filter(u => (u.pain || '').trim()).length,
      usecase: ucs.length,
      prompt: withType('prompt'),
      skill: withType('skill'),
      agent: withType('agent')
    };
  }

  /* ---------- Kế hoạch / lộ trình ---------- */
  function milestoneProgress(m) {
    const d = m.deliverables || [];
    return d.length ? d.filter(x => x.done).length / d.length * 100 : 0;
  }
  function milestonePlanned(m) {
    const s = parse(m.start), e = parse(m.end), t = today();
    if (!s || !e) return 0;
    if (t <= s) return 0;
    if (t >= e) return 100;
    return (t - s) / (e - s) * 100;
  }
  function milestoneState(m) {
    const act = milestoneProgress(m), plan = milestonePlanned(m);
    if (act >= 100) return { key: 'done', label: 'Hoàn thành', color: '#00843d' };
    if (plan <= 0) return { key: 'upcoming', label: 'Chưa đến kỳ', color: '#94a3b8' };
    if (plan >= 100) return { key: 'late', label: 'Quá hạn', color: '#d8584e' };
    if (plan - act > C.thresholds.lateGapPct) return { key: 'behind', label: 'Chậm so kế hoạch', color: '#E0982A' };
    return { key: 'ontrack', label: 'Đúng tiến độ', color: '#00843d' };
  }
  function planCompletion() {
    const ms = S().all('milestones');
    if (!ms.length) return { actual: 0, planned: 0 };
    const w = m => (m.deliverables || []).length || 1;
    const tw = ms.reduce((a, m) => a + w(m), 0);
    return {
      actual: ms.reduce((a, m) => a + milestoneProgress(m) * w(m), 0) / tw,
      planned: ms.reduce((a, m) => a + milestonePlanned(m) * w(m), 0) / tw
    };
  }

  /* ---------- Hạn ---------- */
  function dueState(dateStr, finished) {
    const d = parse(dateStr);
    if (!d || finished) return null;
    const n = daysBetween(today(), d);
    if (n < 0) return { key: 'over', label: 'Quá hạn ' + (-n) + ' ngày', color: '#d8584e' };
    if (n <= C.thresholds.dueSoonDays) return { key: 'soon', label: 'Còn ' + n + ' ngày', color: '#b7791f' };
    return null;
  }

  /* ---------- Cán bộ ---------- */
  const statusWeight = st => C.statusWeight[st] || 0;
  function personStats(pid) {
    const ucs = S().all('useCases').filter(u => (u.ownerIds || [u.ownerId]).includes(pid));
    const lib = S().all('library');
    const tasks = lib.filter(x => x.builderId === pid && x.status !== 'Deprecated');   // sản phẩm AI đang phụ trách
    const active = tasks;
    const leading = S().all('useCases').filter(u => u.leadId === pid);
    const leadIds = new Set(leading.map(u => u.id));
    return {
      leading,
      leadProducts: lib.filter(x => leadIds.has(x.useCaseId) && x.status !== 'Deprecated'),
      leadSaved: leading.reduce((a, u) => a + savedHours(u), 0),
      useCases: ucs,
      prompts: lib.filter(x => x.type === 'prompt' && x.builderId === pid),
      reviews: lib.filter(x => x.reviewerId === pid),
      skillsAgents: lib.filter(x => x.type !== 'prompt' && x.builderId === pid && x.status !== 'Deprecated'),
      tasks,
      saved: ucs.reduce((a, u) => a + savedHours(u), 0),
      progress: active.length ? active.reduce((a, x) => a + statusWeight(x.status), 0) / active.length * 100 : null
    };
  }
  const hasUseCase = pid => S().all('useCases').some(u => (u.ownerIds || [u.ownerId]).includes(pid));
  const owners = uc => (uc.ownerIds && uc.ownerIds.length ? uc.ownerIds : [uc.ownerId]).filter(Boolean);

  /* ---------- Tổng hợp dashboard ---------- */
  function summary() {
    const ppl = S().all('people'), ucs = S().all('useCases'), lib = S().all('library').filter(x => x.status !== 'Deprecated');
    const byStatus = {}; C.useCaseStatuses.forEach(s => { byStatus[s] = ucs.filter(u => u.status === s).length; });
    const byType = {}; Object.keys(C.types).forEach(t => { byType[t] = lib.filter(x => x.type === t).length; });
    return {
      people: ppl.length,
      withUseCase: ppl.filter(p => hasUseCase(p.id)).length,
      useCases: ucs.length,
      byStatus, byType,
      saved: ucs.reduce((a, u) => a + savedHours(u), 0),
      savedApproved: ucs.filter(u => u.status === 'Approved').reduce((a, u) => a + savedHours(u), 0),
      plan: planCompletion()
    };
  }

  return {
    today, parse, iso, daysBetween,
    savedPerRun, savedHours, savedPct, criteria, recommendedLevel, currentLevel, targetLevel,
    agentMismatch, agentCandidate, levelIndex, libFor, LEVEL_ORDER,
    funnel, milestoneProgress, milestonePlanned, milestoneState, planCompletion,
    dueState, personStats, hasUseCase, owners, statusWeight, summary
  };
})();
