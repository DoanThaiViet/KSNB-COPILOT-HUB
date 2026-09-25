/* =========================================================================
   CẤU HÌNH DÙNG CHUNG
   Mọi danh mục, nhãn, màu và ngưỡng nghiệp vụ đặt ở đây để không rải
   hằng số trong code giao diện. Đổi ngưỡng/tiêu chí chỉ sửa file này.
   ========================================================================= */
window.AIM = window.AIM || {};
AIM.views = AIM.views || {};   // mỗi file js/views/*.js tự đăng ký vào đây

AIM.config = {
  appName: 'COPILOT HUB PVEP',
  tagline: 'Trung tâm ứng dụng Copilot toàn Tổng Công ty',
  org: 'Tổng Công ty Thăm dò Khai thác Dầu khí',
  unitName: 'Ban Kiểm soát nội bộ',              // đơn vị đang có dữ liệu trong app

  /* Nguồn dữ liệu: 'local' = localStorage (demo) · 'rest' = API/database.
     Khi có backend: đổi mode sang 'rest' và điền baseUrl. Xem js/store.js. */
  data: {
    mode: 'local',
    storageKey: 'aim.v1',
    schemaVersion: 13,
    rest: { baseUrl: '/api', headers: {} }
  },

  /* Ngày tham chiếu để tính tiến độ kế hoạch. null = ngày hiện tại. */
  asOf: null,

  statuses: {
    Draft:      { label: 'Dự thảo',    color: '#94a3b8', bg: '#f1f5f9' },
    Testing:    { label: 'Thử nghiệm',  color: '#b7791f', bg: '#fdf3e1' },
    Approved:   { label: 'Đã duyệt',    color: '#00843d', bg: '#e3f3e9' },
    Deprecated: { label: 'Ngừng dùng',  color: '#8a94a6', bg: '#eef0f3' }
  },
  useCaseStatuses: ['Draft', 'Testing', 'Approved'],
  libraryStatuses: ['Draft', 'Testing', 'Approved', 'Deprecated'],

  priorities: {
    'Cao':        { color: '#d8584e', rank: 3 },
    'Trung bình': { color: '#E0982A', rank: 2 },
    'Thấp':       { color: '#94a3b8', rank: 1 }
  },

  /* Tần suất công việc: perMonth là số lần/tháng mặc định khi chọn tần suất */
  frequencies: {
    daily:     { label: 'Hằng ngày', perMonth: 20 },
    weekly:    { label: 'Hằng tuần', perMonth: 4 },
    monthly:   { label: 'Hằng tháng', perMonth: 1 },
    quarterly: { label: 'Hằng quý', perMonth: 0.33 },
    adhoc:     { label: 'Theo phát sinh', perMonth: 2 }
  },

  /* Mức cải thiện chất lượng (thang 1–5) */
  quality: ['', 'Không đáng kể', 'Nhỏ', 'Rõ rệt', 'Đáng kể', 'Rất lớn'],

  /* Tần suất sử dụng Copilot/AI của cán bộ */
  usage: {
    daily:      { label: 'Hằng ngày',    color: '#006838', score: 3 },
    weekly:     { label: 'Hằng tuần',    color: '#3aa36b', score: 2 },
    occasional: { label: 'Thỉnh thoảng', color: '#a7d3b8', score: 1 },
    none:       { label: 'Chưa sử dụng', color: '#dfe5ec', score: 0 },
    unknown:    { label: 'Chưa khảo sát', color: '#e7ebf0', score: 0 }
  },

  /* Loại sản phẩm AI */
  types: {
    prompt: { label: 'Prompt', plural: 'Thư viện Prompt', color: '#00843d', menu: 'Thư viện Prompt' },
    skill:  { label: 'Skill',  plural: 'Skill',          color: '#0a7e8c', menu: 'Skill' },
    agent:  { label: 'Agent',  plural: 'Agent',          color: '#2e3192', menu: 'Agent' }
  },

  /* Chuỗi trưởng thành: Business Task → Pain Point → AI Use Case → Prompt → Skill → Agent */
  maturity: [
    { key: 'task',    label: 'Công việc',     color: '#cfd8e3' },
    { key: 'pain',    label: 'Vướng mắc',    color: '#9fb3c8' },
    { key: 'usecase', label: 'Ứng dụng AI',  color: '#3a78c2' },
    { key: 'prompt',  label: 'Prompt',        color: '#00843d' },
    { key: 'skill',   label: 'Skill',         color: '#0a7e8c' },
    { key: 'agent',   label: 'Agent',         color: '#2e3192' }
  ],

  /* Tiêu chí đề xuất Agent. Hai tiêu chí đầu/cuối tính từ số liệu,
     ba tiêu chí giữa do đầu mối đánh giá khi mô tả ứng dụng AI. */
  agentCriteria: [
    { key: 'repeat', label: 'Lặp lại thường xuyên',            auto: true,  rule: 'Từ 4 lần/tháng trở lên' },
    { key: 'multi',  label: 'Có nhiều bước',                    auto: false },
    { key: 'stable', label: 'Logic/workflow ổn định',           auto: false },
    { key: 'io',     label: 'Dữ liệu vào/ra tương đối chuẩn hóa', auto: false },
    { key: 'benefit',label: 'Lợi ích đủ lớn để tự động hóa',    auto: true,  rule: 'Tiết kiệm từ 8 giờ/tháng trở lên' }
  ],
  thresholds: { repeatPerMonth: 4, benefitHours: 8, lateGapPct: 10, dueSoonDays: 14 },

  /* Quy tắc đề xuất cấp độ, xét từ trên xuống, gặp quy tắc đủ điều kiện đầu tiên thì dừng */
  levelRules: [
    { level: 'agent',  need: ['repeat', 'multi', 'stable', 'io', 'benefit'] },
    { level: 'skill',  need: ['repeat', 'stable', 'io'] },
    { level: 'prompt', need: [] }
  ],

  /* Mức hoàn thành theo trạng thái sản phẩm, dùng tính tiến độ nhiệm vụ AI của cán bộ */
  statusWeight: { Draft: 0.3, Testing: 0.65, Approved: 1 },

  /* Đối tượng sử dụng sản phẩm AI */
  audiences: {
    lead:  { label: 'Lãnh đạo',   color: '#2e3192' },
    staff: { label: 'Chuyên viên', color: '#0a7e8c' },
    both:  { label: 'Dùng chung',  color: '#5b6577' }
  },

  /* Nhóm mẹo ở tab Tips & Tricks */
  tipAreas: [
    ['general', 'Cách đặt câu lệnh'],
    ['chat',    'Copilot Chat'],
    ['word',    'Copilot trong Word'],
    ['excel',   'Copilot trong Excel'],
    ['outlook', 'Copilot trong Outlook'],
    ['teams',   'Copilot trong Teams'],
    ['ppt',     'Copilot trong PowerPoint'],
    ['agentst', 'Agent có sẵn của Copilot'],
    ['files',   'OneDrive - Tệp tài liệu'],
    ['sp',      'Agent trên SharePoint'],
    ['safety',  'An toàn và trách nhiệm']
  ],

  /* Lĩnh vực công việc của Tổng Công ty — dùng phân loại Skill và Agent.
     Danh mục tạm, sửa lại theo cơ cấu thực tế của PVEP. */
  domains: [
    { id: 'd1',  name: 'Thăm dò - Khai thác',                short: 'TDKT' },
    { id: 'd2',  name: 'Kỹ thuật - Công nghệ mỏ',            short: 'Kỹ thuật mỏ' },
    { id: 'd3',  name: 'Đầu tư - Dự án',                     short: 'Đầu tư' },
    { id: 'd4',  name: 'Tài chính - Kế toán',                short: 'Tài chính' },
    { id: 'd5',  name: 'Kế hoạch - Tổng hợp',                short: 'Kế hoạch' },
    { id: 'd6',  name: 'Thương mại dầu khí',                 short: 'Thương mại' },
    { id: 'd7',  name: 'Đấu thầu - Hợp đồng',                short: 'Đấu thầu' },
    { id: 'd8',  name: 'Tổ chức nhân sự - Đào tạo',          short: 'Nhân sự' },
    { id: 'd9',  name: 'An toàn - Sức khỏe - Môi trường',    short: 'ATSKMT' },
    { id: 'd10', name: 'Pháp chế - Quản trị doanh nghiệp',   short: 'Pháp chế' },
    { id: 'd11', name: 'Chuyển đổi số - Công nghệ thông tin', short: 'CĐS - CNTT' },
    { id: 'd12', name: 'Kiểm soát nội bộ - Quản trị rủi ro', short: 'KSNB - QTRR' },
    { id: 'd13', name: 'Văn phòng - Hành chính',             short: 'Văn phòng' }
  ],

  /* Công cụ AI dùng cho ứng dụng AI. Nhóm Copilot theo ứng dụng Microsoft 365. */
  tools: {
    chat:    { label: 'Copilot Chat',        note: 'Hỏi đáp, soạn thảo, tóm tắt trên trình duyệt hoặc ứng dụng Microsoft 365' },
    word:    { label: 'Copilot trong Word',  note: 'Soạn, rà soát, so sánh phiên bản văn bản' },
    excel:   { label: 'Copilot trong Excel', note: 'Phân tích bảng số liệu, lập công thức, lọc dòng bất thường' },
    outlook: { label: 'Copilot trong Outlook', note: 'Tóm tắt chuỗi thư, soạn thư trả lời' },
    teams:   { label: 'Copilot trong Teams', note: 'Tóm tắt cuộc họp, trích việc cần làm' },
    ppt:     { label: 'Copilot trong PowerPoint', note: 'Dựng slide từ tài liệu Word' },
    sp:      { label: 'Agent trên SharePoint', note: 'Hỏi đáp trên kho tài liệu của Ban, dựng bằng Copilot Studio hoặc agent SharePoint' },
    other:   { label: 'Công cụ AI khác',     note: 'Trợ lý AI ngoài Microsoft 365' }
  },

  roles: {
    ld: { label: 'Lãnh đạo',   canEdit: false },   // chỉ xem
    cv: { label: 'Chuyên viên', canEdit: true }    // nhập và sửa dữ liệu
  },

  groupPalette: ['#2e3192', '#00843d', '#0a7e8c', '#E0982A', '#6b5ca5', '#3a78c2', '#8a6d3b', '#c0504d', '#4a7c59', '#7a5c8a']
};
