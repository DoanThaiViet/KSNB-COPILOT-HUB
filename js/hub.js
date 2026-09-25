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
  const toolsFor = ucId => S().all('library')
    .filter(x => x.useCaseId === ucId && x.status !== 'Deprecated')
    .sort((a, b) => ready(b) - ready(a) || L().levelIndex(b.type) - L().levelIndex(a.type) || (b.status === 'Approved') - (a.status === 'Approved'));   // dùng được trước, cấp cao trước

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
    logRun, myRuns, visual, firstName, gIcon
  };
})();
