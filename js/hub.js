/* =========================================================================
   NGỮ CẢNH NGƯỜI DÙNG (persona + cán bộ + phạm vi Của tôi / Toàn Hub)
   Mọi màn hình hỏi "tôi là ai, việc nào là của tôi" qua AIM.hub.*.
   Lưu trên máy (localStorage) — là lựa chọn hiển thị, không phải phân quyền.
   ========================================================================= */
AIM.hub = (function () {
  const C = AIM.config, S = () => AIM.store, L = () => AIM.logic;
  const KEY = 'aim.hub.v1';
  let st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { st = {}; }
  if (!st.role) { try { const old = localStorage.getItem('aim.role'); if (old) st.role = old; } catch (e) {} }
  st.people = st.people || {}; st.log = st.log || {}; st.scope = st.scope || 'mine';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  const role = () => (C.roles[st.role] ? st.role : 'cv');
  const roleCfg = () => C.roles[role()];
  function setRole(r) { st.role = C.roles[r] ? r : 'cv'; save(); }

  /* Cán bộ đang xem: chọn riêng cho từng persona; thiếu thì dùng người mặc định */
  function person() {
    const want = st.people[role()] || roleCfg().defaultPerson;
    const p = S().get('people', want);
    if (p && (!roleCfg().leadOnly || p.isLead)) return p;
    const pool = S().all('people').filter(x => !roleCfg().leadOnly || x.isLead);
    return pool[0] || null;
  }
  function setPerson(id) { st.people[role()] = id; save(); }
  const scope = () => st.scope === 'hub' ? 'hub' : 'mine';
  function setScope(s) { st.scope = s === 'hub' ? 'hub' : 'mine'; save(); }

  const myGroups = () => (person() || {}).groups || [];
  /* Công việc của tôi: được giao (PIC/đồng thực hiện) hoặc Lãnh đạo phụ trách */
  function isMine(u) {
    const p = person(); if (!p) return false;
    return L().owners(u).includes(p.id) || u.leadId === p.id;
  }
  const myTasks = () => S().all('useCases').filter(isMine);
  const groupTasks = () => S().all('useCases').filter(u => myGroups().includes(u.groupId));

  /* Tên thân thiện, giấu thuật ngữ kỹ thuật với người mới */
  const KIND = {
    prompt: { label: 'Câu lệnh mẫu', tech: 'Prompt', verb: 'Sao chép và dùng' },
    skill:  { label: 'Quy trình nhiều bước', tech: 'Skill', verb: 'Làm theo quy trình' },
    agent:  { label: 'Trợ lý tự động', tech: 'Agent', verb: 'Mở trợ lý' }
  };
  const kind = t => KIND[t] || KIND.prompt;
  const ready = x => x.status === 'Approved' || x.status === 'Testing';
  const toolsFor = ucId => { const a = assignment(ucId); if (a) return a.tools.map(id => S().get('library', id)).filter(x => x && x.status !== 'Deprecated');
    return S().all('library')
    .filter(x => x.useCaseId === ucId && x.status !== 'Deprecated')
    .sort((a, b) => ready(b) - ready(a) || L().levelIndex(b.type) - L().levelIndex(a.type) || (b.status === 'Approved') - (a.status === 'Approved')); };   // dùng được trước, cấp cao trước

  /* ---------- Nhiệm vụ theo chức năng (AIM.bm01) + việc chung của Ban ----------
     Mỗi nhiệm vụ được gắn nghiệp vụ và công cụ AI theo từ khóa trong nhiệm vụ/đầu ra. */
  const RULES = [
    [/kiểm soát viên|NĐDPV|người đại diện/i, 'Tài chính', 'g7', ['KS-17', 'KP-17']],
    [/(thực hiện|theo dõi)[^;]{0,20}kiến nghị/i, 'KTGS', 'g3', ['KS-06', 'KP-06']],
    [/kiểm toán|KTNB|kiểm soát nội bộ|chốt kiểm soát/i, 'KTNB', 'g4', ['KS-07', 'KS-08', 'KS-09', 'KA-03']],
    [/thanh tra|đoàn kiểm tra|KTGS|kiểm tra, giám sát|kiểm tra giám sát/i, 'KTGS', 'g3', ['KS-04', 'KS-05', 'KS-06', 'KA-02']],
    [/họp HĐTV|biên bản|TBKL|Chủ tịch|thư ký/i, 'Thư ký HĐTV', 'g1', ['KS-18', 'KP-18', 'KA-08']],
    [/tờ trình|hồ sơ trình|phiếu ý kiến|PYK/i, 'HĐTV/PYK', 'g1', ['KS-01', 'KP-01', 'KS-02']],
    [/rủi ro|QTRR|KRI|ma trận/i, 'QTRR', 'g5', ['KS-10', 'KS-11', 'KP-10']],
    [/đấu thầu|thương mại|bảo hiểm|hợp đồng/i, 'Đấu thầu', 'g9', ['KS-14', 'KP-14']],
    [/VBQLNB|văn bản|quy chế|quy định|thẩm quyền|OECD|quản trị công ty/i, 'Pháp lý/OECD', 'g2', ['KS-15', 'KS-16', 'KS-02']],
    [/nghị quyết|chỉ đạo|giao ban/i, 'Chỉ đạo', 'g1', ['KS-03', 'KP-03', 'KA-05']],
    [/dashboard|dữ liệu|số hóa|chuyển đổi số|CNTT|đào tạo/i, 'Dashboard/CĐS', 'g6', ['KS-19', 'KP-19', 'KA-09']],
    [/đầu tư|dự án|lô|sản lượng|kỹ thuật|mỏ/i, 'Dự án dầu khí', 'g8', ['KS-13', 'KP-13', 'KA-06']],
    [/tài chính|nợ|vốn|quyết toán|quỹ|SXKD|kế hoạch|chi phí|lương|chiến lược/i, 'Tài chính', 'g7', ['KS-12', 'KP-12']]
  ];
  /* Ưu tiên tên nhiệm vụ (mệnh đề đầu); chỉ khi không khớp mới xét toàn bộ mô tả, tránh gắn nhầm do từ phụ */
  const classify = (...texts) => { for (const t of texts) { const r = RULES.find(x => x[0].test(t)); if (r) return r; } return [null, 'Tổng hợp', 'g6', []]; };
  /* Tên ngắn cho thẻ: mệnh đề đầu của nhiệm vụ, bỏ "Trực tiếp"/"Chủ trì" ở đầu cho gọn */
  const shortName = t => { let x = String(t || '').split(/[;:.]/)[0].replace(/^(trực tiếp|chủ trì|tham gia)\s+/i, '');
    x = x.charAt(0).toUpperCase() + x.slice(1); return x.length > 90 ? x.slice(0, 90).replace(/\s+\S*$/, '') + '…' : x; };
  /* Tổ thư ký (Phòng Tổng hợp) và Thư ký HĐTV không rà soát tờ trình thay Ban */
  const isSecretariat = p => !p || p.unit === 'Phòng Tổng hợp' || /Thư ký/i.test(p.title || '');
  let asgCache = { key: '', list: [] };
  function assignments() {
    const p = person(); if (!p) return [];
    if (asgCache.key === p.id) return asgCache.list;
    const list = [];
    if (!isSecretariat(p)) list.push({ id: 'CM-PYK', assign: 'common', task: 'Xem, cho ý kiến tờ trình TGĐ gửi HĐTV', groupId: 'g1', tag: 'HĐTV/PYK',
      aiStep: 'Rà soát thẩm quyền, căn cứ, số liệu; dự thảo Phiếu ý kiến Ban KSNB.', note: 'Định mức: Lãnh đạo Ban 3 giờ/phiếu · PIC 8 giờ/phiếu',
      tools: ['KS-01', 'KP-01', 'KS-02', 'KP-02', 'KA-01'] });
    ((AIM.bm01 || {})[p.id] || []).forEach((x, i) => { const c = classify(shortName(x.nv), x.nv, x.out);
      list.push({ id: 'AS-' + p.id + '-' + i, assign: 'duty', task: shortName(x.nv), full: x.nv, aiStep: x.out, groupId: c[2], tag: c[1],
        freq: x.freq, qty: x.qty, auto: x.auto, tech: x.tech, tools: c[3] }); });
    asgCache = { key: p.id, list };
    return list;
  }
  const assignment = id => /^(CM|AS)-/.test(id || '') ? assignments().find(a => a.id === id) || null : null;
  const findTask = id => assignment(id) || S().get('useCases', id);
  /* Toàn bộ việc của tôi theo thứ tự ưu tiên hiển thị:
     việc chung → nhiệm vụ theo chức năng (BM01) → ứng dụng AI được giao (hạn, ưu tiên) */
  function allMine() {
    const p = person(); if (!p) return [];
    const a = assignments(), ucs = S().all('useCases').filter(u => L().owners(u).includes(p.id)).sort(prioritySort);
    return [...a.filter(x => x.assign === 'common'), ...a.filter(x => x.assign === 'duty'), ...ucs];
  }
  const roleLabel = r => r === 'common' ? 'Việc chung của Ban' : r === 'duty' ? 'Nhiệm vụ theo chức năng' : '';

  /* Việc "cần xử lý": chưa duyệt và (sắp đến hạn/quá hạn hoặc ưu tiên Cao) */
  function needsAction(u) {
    if (u.status === 'Approved') return false;
    const d = L().dueState(u.deadline, false);
    return !!d || u.priority === 'Cao';
  }
  const prioritySort = (a, b) => {
    const da = L().dueState(a.deadline, a.status === 'Approved'), db = L().dueState(b.deadline, b.status === 'Approved');
    const w = d => !d ? 0 : d.key === 'over' ? 2 : 1;
    return (a.status === 'Approved') - (b.status === 'Approved') || w(db) - w(da)
      || ((C.priorities[b.priority] || {}).rank || 0) - ((C.priorities[a.priority] || {}).rank || 0)
      || String(a.deadline || '9999').localeCompare(String(b.deadline || '9999'));
  };

  /* Nhật ký dùng AI cá nhân (trên máy): số lần "Thực hiện" theo công việc */
  function logRun(ucId) {
    const p = person(); if (!p) return;
    const k = p.id; st.log[k] = st.log[k] || {};
    st.log[k][ucId] = (st.log[k][ucId] || 0) + 1; save();
  }
  const myRuns = () => { const p = person(); return p ? (st.log[p.id] || {}) : {}; };

  /* Giao diện: ảnh nền có lớp phủ, thiếu ảnh thì gradient thương hiệu */
  /* Trả URL tuyệt đối: url() trong biến CSS bị phân giải theo vị trí file CSS, không theo trang */
  const visual = k => C.visuals && C.visuals[k] ? new URL(C.visuals[k], document.baseURI).href : '';
  const firstName = n => (n || '').trim().split(/\s+/).slice(-1)[0] || '';

  /* Biểu tượng theo nhóm công việc */
  const GICON = {
    g1: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
    g2: '<path d="M6 3h9l3 3v15H6z"/><path d="M9 11h6M9 15h6M9 7h3"/>',
    g3: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/><path d="M8 10.5l2 2 3.5-4"/>',
    g4: '<path d="M4 4h16v12H4z"/><path d="M8 20h8M12 16v4"/><path d="M7 12l3-3 2 2 4-4"/>',
    g5: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    g6: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    g7: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    g8: '<path d="M3 20h18M6 20V9l6-5 6 5v11"/><path d="M10 20v-5h4v5"/>',
    g9: '<path d="M4 7h16v12H4z"/><path d="M9 7V5h6v2M4 12h16"/>',
    g10: '<path d="M12 3v6M8 21l4-12 4 12M6 14h12"/><circle cx="12" cy="3" r="1"/>'
  };
  const gIcon = gid => `<svg viewBox="0 0 24 24">${GICON[gid] || GICON.g2}</svg>`;

  return {
    role, roleCfg, setRole, person, setPerson, scope, setScope,
    myGroups, isMine, myTasks, groupTasks, kind, ready, toolsFor, needsAction, prioritySort,
    logRun, myRuns, visual, firstName, gIcon, assignments, assignment, findTask, roleLabel, isSecretariat, allMine
  };
})();
