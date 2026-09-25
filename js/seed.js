/* =========================================================================
   DỮ LIỆU MẪU ĐỂ DEMO
   Tên cán bộ, số liệu thời gian và nội dung prompt là dữ liệu giả lập.
   Cấu trúc bản ghi trùng với schema API dự kiến (xem js/store.js).
   ========================================================================= */
AIM.seed = function () {

  const groups = [
    { id: 'g1',  name: 'Quản trị điều hành',        short: 'Quản trị' },
    { id: 'g2',  name: 'Hệ thống KSNB, văn bản quản lý nội bộ', short: 'Hệ thống' },
    { id: 'g3',  name: 'Kiểm tra giám sát',         short: 'Kiểm tra' },
    { id: 'g4',  name: 'Kiểm toán nội bộ',          short: 'KTNB' },
    { id: 'g5',  name: 'Quản trị rủi ro',           short: 'QTRR' },
    { id: 'g6',  name: 'Kế hoạch',                  short: 'Kế hoạch' },
    { id: 'g7',  name: 'Tài chính - Kế toán',       short: 'TC/KT' },
    { id: 'g8',  name: 'Đầu tư - Quản lý dự án',    short: 'Đầu tư' },
    { id: 'g9',  name: 'Thương mại - Đấu thầu',     short: 'Thương mại' },
    { id: 'g10', name: 'Kỹ thuật - Sản lượng',      short: 'Kỹ thuật' }
  ].map((g, i) => ({ ...g, color: AIM.config.groupPalette[i] }));

  /* Nhân sự Ban KSNB theo danh sách cập nhật ngày 23/09/2026 (25 người).
     usage/activeDays để trống vì chưa khảo sát mức độ sử dụng Copilot. */
  const P = (id, name, title, unit, field, isLead) =>
    ({ id, name, title, unit, field, isLead: !!isLead, groups: [], usage: 'unknown', activeDays: 0 });
  const people = [
    P('p01', 'Nguyễn Thị Cẩm Tú',    'Trưởng ban',                          'Lãnh đạo Ban', 'Pháp lý', 1),
    P('p02', 'Đặng Ngọc Khánh',      'Phó Trưởng ban',                      'Lãnh đạo Ban', 'Tài chính', 1),
    P('p03', 'Vũ Anh Quân',          'Phó Trưởng ban',                      'Lãnh đạo Ban', 'Kế hoạch, quản lý dự án', 1),
    P('p04', 'Văn Kim Hoàng',        'Trưởng phòng, Thư ký HĐTV',           'Lãnh đạo Ban', 'Tổng hợp', true),
    P('p05', 'Lý Quốc Đạt',          'Chuyên viên Phân tích, Thư ký Ban',   'Phòng Phân tích', 'Pháp lý'),
    P('p06', 'Đoàn Thái Việt',       'Phó Trưởng phòng',                    'Phòng Kiểm toán nội bộ', 'Kiểm toán'),
    P('p07', 'Ngô Thị Tuấn Anh',     'Chuyên viên chính',                   'Phòng Kiểm toán nội bộ', 'Tài chính'),
    P('p08', 'Nguyễn Văn Điều',      'Chuyên viên',                         'Phòng Kiểm toán nội bộ', 'Đầu tư'),
    P('p09', 'Lê Thùy Dương',        'Phó Trưởng phòng',                    'Phòng Phân tích', 'Tài chính'),
    P('p10', 'Nguyễn Thị Hải Yến',   'Phó Trưởng phòng',                    'Phòng Phân tích', 'Kế hoạch, quản lý dự án'),
    P('p11', 'Trần Ngọc Ánh',        'Chuyên viên chính',                   'Phòng Phân tích', 'Kế hoạch, quản lý dự án'),
    P('p12', 'Vũ Thúy Quỳnh',        'Chuyên viên',                         'Phòng Phân tích', 'Thương mại'),
    P('p14', 'Nguyễn Bá Minh',       'Kỹ sư Phân tích',                     'Phòng Phân tích', 'Kỹ thuật'),
    P('p15', 'Trần Phương Anh',      'Chuyên viên chính',                   'Phòng Kiểm soát rủi ro', 'Kiểm toán'),
    P('p16', 'Nguyễn Bá Lập',        'Chuyên viên chính',                   'Phòng Kiểm soát rủi ro', 'Kế toán'),
    P('p17', 'Giang Anh Dũng',       'Chuyên viên',                         'Phòng Kiểm soát rủi ro', 'Tài chính'),
    P('p18', 'Chu Nhật Anh',         'Chuyên viên',                         'Phòng Kiểm soát rủi ro', 'Quản trị rủi ro'),
    P('p19', 'Trần Bảo Châu',        'Chuyên viên',                         'Phòng Kiểm soát rủi ro', 'Thương mại'),
    P('p20', 'Vũ Ái Ngọc Bình',      'Chuyên viên',                         'Phòng Kiểm soát rủi ro', 'Pháp lý'),
    P('p21', 'Nguyễn Mỹ Hạnh',       'Chuyên viên',                         'Phòng Tổng hợp', 'Tổng hợp'),
    P('p22', 'Nguyễn Minh Hằng',     'Chuyên viên',                         'Phòng Tổng hợp', 'Tổng hợp'),
    P('p23', 'Nguyễn Thị Phương Anh','Chuyên viên',                         'Phòng Tổng hợp', 'Tổng hợp'),
    P('p24', 'Lương Lê Thu Hằng',    'Thư ký Chủ tịch HĐTV',                'Phòng Tổng hợp', 'Tổng hợp'),
    P('p25', 'Phùng Đình Sơn',       'Chuyên viên, Thư ký HĐTV',            'Phòng Tổng hợp', 'Tổng hợp')
  ];
  const who = n => (people.find(x => x.name === n) || {}).id || '';

  /* Ứng dụng AI. crit = đánh giá của đầu mối cho 03 tiêu chí định tính
     (multi, stable, io); 02 tiêu chí còn lại tính từ số liệu. */
  const U = (id, groupId, task, pain, ownerId, leadId, freq, perMonth, current, aiStep,
             before, after, quality, priority, status, next, deadline, crit) =>
    ({ id, groupId, task, pain, ownerId, leadId, freq, perMonth, current, aiStep,
       before, after, quality, priority, status, next, deadline,
       crit: { multi: crit[0], stable: crit[1], io: crit[2] } });

  const useCases = [
    U('UC-01', 'g1', 'Rà soát tờ trình HĐTV',
      'Tờ trình dài 30-80 trang kèm nhiều phụ lục; phải đối chiếu thẩm quyền theo Điều lệ, Quy chế tài chính và các quy chế chuyên ngành trong thời gian ngắn, dễ sót căn cứ.',
      'p05', 'p01', 'weekly', 8,
      'Đọc thủ công, ghi chú trên bản in, lập bảng vấn đề bằng Word.',
      'Kiểm tra thẩm quyền, căn cứ pháp lý, logic nội dung và lập danh sách vấn đề cần làm rõ.',
      6, 2.5, 4, 'Cao', 'Approved', 'Chuyển thành Skill 04 bước, thử trên 05 tờ trình tháng 10', '2026-10-20', [1, 1, 1]),
    U('UC-02', 'g1', 'Soạn Phiếu ý kiến Ban KSNB',
      'Thể thức, văn phong và trích dẫn nguồn cho từng ý mất nhiều thời gian; mỗi người viết một kiểu.',
      'p04', 'p01', 'weekly', 8,
      'Soạn Word từ mẫu cũ, tự tra lại số hiệu văn bản căn cứ.',
      'Dựng khung PYK theo mẫu, gắn nguồn cho từng ý, rà văn phong trước khi trình.',
      3, 1.2, 4, 'Cao', 'Approved', 'Chuẩn hóa bộ câu mẫu mở/kết, cập nhật Skill v1.1', '2026-10-10', [1, 1, 1]),
    U('UC-03', 'g1', 'Tóm tắt tờ trình trình lãnh đạo',
      'Lãnh đạo cần bản tóm tắt 01 trang trước cuộc họp; hiện tóm tắt không đồng nhất về cấu trúc.',
      'p05', 'p01', 'weekly', 10,
      'Chuyên viên tự tóm tắt, không theo khung cố định.',
      'Tóm tắt theo khung: đề xuất, căn cứ, số liệu chính, điểm cần lưu ý.',
      1.5, 0.5, 3, 'Trung bình', 'Testing', 'Thử khung tóm tắt trên 10 tờ trình, lấy ý kiến lãnh đạo Ban', '2026-10-15', [0, 1, 1]),
    U('UC-04', 'g1', 'Đối chiếu số liệu tờ trình với KH SXKD',
      'Số liệu tờ trình cần khớp với KH SXKD, CTHĐ&NS đã duyệt; dữ liệu nằm rải rác nhiều tệp.',
      'p04', 'p01', 'adhoc', 4,
      'Mở song song các tệp Excel, đối chiếu tay.',
      'Trích bảng số liệu từ tờ trình, lập bảng đối chiếu với số kế hoạch.',
      2.5, 1, 3, 'Trung bình', 'Draft', 'Xác định bộ dữ liệu KH SXKD dùng làm nguồn đối chiếu', '2026-10-31', [1, 0, 0]),

    U('UC-05', 'g2', 'Phân tích hồ sơ KTGS',
      'Hồ sơ đơn vị gửi nhiều, không theo thứ tự checklist; mất thời gian xác định hồ sơ còn thiếu.',
      'p07', 'p02', 'monthly', 2,
      'Đối chiếu checklist bằng Excel, đọc từng hồ sơ.',
      'Đối chiếu checklist, phát hiện hồ sơ thiếu, tổng hợp quan sát theo từng nội dung kiểm tra.',
      16, 7, 4, 'Cao', 'Testing', 'Thử trên hồ sơ đoàn KTGS tháng 10; đo lại thời gian', '2026-10-25', [1, 1, 1]),
    U('UC-06', 'g2', 'Lập đề cương kiểm tra giám sát',
      'Đề cương mỗi đoàn soạn lại từ đầu, chưa tận dụng đề cương các đợt trước.',
      'p06', 'p02', 'monthly', 1,
      'Sao chép đề cương cũ rồi chỉnh sửa.',
      'Dựng đề cương từ mục tiêu kiểm tra, phạm vi và tiền lệ các đợt trước.',
      8, 4, 3, 'Trung bình', 'Approved', 'Đưa prompt vào Thư viện Prompt v1.0', '2026-10-31', [0, 1, 1]),
    U('UC-07', 'g2', 'Tổng hợp quan sát thành dự thảo báo cáo KTGS',
      'Quan sát của thành viên đoàn ở nhiều định dạng, tổng hợp mất 1-2 ngày.',
      'p06', 'p02', 'monthly', 1.5,
      'Trưởng đoàn tổng hợp thủ công.',
      'Gom quan sát theo nội dung, chuẩn hóa câu chữ, dựng khung dự thảo báo cáo.',
      10, 5, 3, 'Trung bình', 'Testing', 'Thống nhất mẫu ghi nhận quan sát cho thành viên đoàn', '2026-11-10', [1, 0, 1]),
    U('UC-08', 'g2', 'Theo dõi thực hiện kiến nghị sau KTGS',
      'Kiến nghị theo dõi trên nhiều bảng tính, khó biết kiến nghị nào quá hạn.',
      'p07', 'p02', 'weekly', 4,
      'Cập nhật bảng Excel theo công văn phản hồi của đơn vị.',
      'Đọc công văn phản hồi, cập nhật tình trạng, lập danh sách kiến nghị đến hạn.',
      5, 2, 3, 'Cao', 'Draft', 'Chuẩn hóa danh mục kiến nghị làm dữ liệu đầu vào chung', '2026-11-15', [1, 1, 1]),

    U('UC-09', 'g3', 'Xây dựng chương trình kiểm toán theo IIA',
      'Chương trình kiểm toán cần bám chuẩn IIA và rủi ro trọng yếu; soạn mất nhiều thời gian.',
      'p08', 'p02', 'monthly', 1,
      'Soạn từ mẫu chung, bổ sung thủ tục theo kinh nghiệm.',
      'Gợi ý thủ tục kiểm toán theo rủi ro và mục tiêu kiểm soát.',
      12, 6, 4, 'Trung bình', 'Testing', 'Rà soát prompt với chuyên gia kiểm toán', '2026-10-30', [1, 0, 1]),
    U('UC-10', 'g3', 'Phân tích dữ liệu chi phí bất thường',
      'Dữ liệu chi phí lớn, lọc giao dịch bất thường bằng tay mất nhiều ngày.',
      'p13', 'p02', 'quarterly', 0.33,
      'Lọc bằng Excel theo ngưỡng.',
      'Gợi ý tiêu chí lọc, giải thích nhóm giao dịch khác biệt để kiểm toán viên xác minh.',
      20, 9, 3, 'Thấp', 'Draft', 'Xác định dữ liệu được phép đưa vào công cụ AI', '2026-11-30', [1, 0, 0]),
    U('UC-11', 'g3', 'Soạn báo cáo kiểm toán nội bộ',
      'Báo cáo cần nhất quán giữa phát hiện, nguyên nhân, kiến nghị; hay phải sửa nhiều vòng.',
      'p08', 'p02', 'monthly', 1,
      'Soạn Word, trưởng đoàn sửa nhiều vòng.',
      'Kiểm tra tính nhất quán phát hiện - bằng chứng - kiến nghị, rà văn phong.',
      8, 4, 4, 'Trung bình', 'Draft', 'Lập bộ câu mẫu theo mẫu báo cáo KTNB', '2026-11-20', [0, 1, 1]),

    U('UC-12', 'g4', 'Cập nhật danh mục rủi ro quý',
      'Danh mục rủi ro tổng hợp từ nhiều đơn vị, định dạng không đồng nhất.',
      'p09', 'p03', 'quarterly', 0.33,
      'Gộp tay các tệp Excel đơn vị gửi.',
      'Chuẩn hóa mô tả rủi ro, gộp trùng, đối chiếu thước đo khả năng/ảnh hưởng.',
      12, 5, 3, 'Trung bình', 'Approved', 'Áp dụng cho kỳ cập nhật quý IV/2026', '2026-12-15', [1, 1, 1]),
    U('UC-13', 'g4', 'Đánh giá rủi ro tờ trình đầu tư theo khẩu vị rủi ro',
      'Cần đối chiếu nội dung tờ trình với tuyên bố khẩu vị rủi ro đã ban hành.',
      'p09', 'p03', 'adhoc', 3,
      'Đọc tờ trình, tự đối chiếu với văn bản khẩu vị rủi ro.',
      'Lập bảng đối chiếu nội dung tờ trình với 04 nhóm khẩu vị rủi ro, ghi rõ điểm cần xác nhận.',
      4, 2, 4, 'Cao', 'Testing', 'Thử trên 03 tờ trình đầu tư tháng 10', '2026-10-28', [1, 1, 0]),
    U('UC-14', 'g4', 'Tra cứu KRI và cảnh báo vượt ngưỡng',
      'Số liệu KRI nằm ở nhiều báo cáo, khó phát hiện sớm chỉ số vượt ngưỡng.',
      'p13', 'p03', 'weekly', 4,
      'Xem báo cáo từng đơn vị.',
      'Trích số liệu KRI từ báo cáo, so với ngưỡng, liệt kê chỉ số cần lưu ý.',
      3, 1, 2, 'Thấp', 'Draft', 'Chốt danh mục KRI và ngưỡng làm dữ liệu đầu vào', '2026-11-30', [1, 0, 0]),

    U('UC-15', 'g5', 'Theo dõi chỉ đạo PVN → PVEP → Đơn vị',
      'Chỉ đạo của Petrovietnam được giao tiếp xuống PVEP và các đơn vị; khó theo dõi đã tiếp nhận, đã giao, đã thực hiện đến đâu.',
      'p10', 'p01', 'weekly', 4,
      'Bảng Excel theo dõi, cập nhật khi có văn bản báo cáo.',
      'Agent đọc văn bản đến/đi, nhận diện chỉ đạo, theo dõi tiếp nhận và thực hiện, nhắc hạn.',
      18, 6, 5, 'Cao', 'Testing', 'Pilot Agent trên luồng chỉ đạo quý IV; chốt quy tắc nhận diện', '2026-12-15', [1, 1, 1]),
    U('UC-16', 'g5', 'Trích xuất nhiệm vụ từ Nghị quyết/TBKL HĐTV',
      'Nghị quyết, thông báo kết luận có nhiều nhiệm vụ lồng trong đoạn văn; trích tay dễ sót.',
      'p10', 'p01', 'weekly', 6,
      'Đọc và nhập tay vào bảng theo dõi.',
      'Trích nhiệm vụ, đơn vị chủ trì, thời hạn thành bảng theo mẫu.',
      3, 0.8, 4, 'Cao', 'Approved', 'Tích hợp vào Agent theo dõi chỉ đạo', '2026-11-15', [0, 1, 1]),
    U('UC-17', 'g5', 'Tổng hợp tình hình thực hiện chỉ đạo hằng tuần',
      'Báo cáo tuần về chỉ đạo phải tổng hợp từ nhiều nguồn cập nhật.',
      'p14', 'p01', 'weekly', 4,
      'Tổng hợp tay từ bảng theo dõi.',
      'Lập danh sách nhiệm vụ đến hạn, quá hạn, đã hoàn thành trong tuần.',
      4, 1, 3, 'Trung bình', 'Testing', 'Dùng chung dữ liệu với UC-15', '2026-11-05', [1, 1, 1]),

    U('UC-18', 'g6', 'Rà soát dự thảo quy chế, quy trình nội bộ',
      'Dự thảo cần đối chiếu với quy định cấp trên và các quy chế liên quan đang có hiệu lực.',
      'p11', 'p03', 'adhoc', 3,
      'Đọc đối chiếu thủ công.',
      'Lập bảng đối chiếu điều khoản, chỉ ra điểm chưa thống nhất với văn bản liên quan.',
      6, 3, 4, 'Trung bình', 'Approved', 'Bổ sung danh mục văn bản còn hiệu lực làm nguồn', '2026-10-31', [1, 0, 1]),
    U('UC-19', 'g6', 'Đối chiếu hiệu lực văn bản dẫn chiếu',
      'Văn bản dẫn chiếu có thể đã hết hiệu lực hoặc bị thay thế.',
      'p11', 'p03', 'weekly', 5,
      'Tra cứu từng văn bản trên kho quy chế.',
      'Liệt kê văn bản dẫn chiếu, đối chiếu danh mục còn/hết hiệu lực.',
      3, 1, 3, 'Trung bình', 'Testing', 'Chuẩn hóa danh mục văn bản quản lý nội bộ làm dữ liệu', '2026-11-10', [1, 1, 1]),
    U('UC-20', 'g6', 'Kiểm tra thể thức văn bản',
      'Lỗi thể thức (số, ký hiệu, nơi nhận, căn lề) lặp lại, phải trả lại nhiều lần.',
      'p14', 'p03', 'daily', 20,
      'Soát bằng mắt theo quy định thể thức.',
      'Kiểm tra thể thức theo quy định, liệt kê lỗi và gợi ý sửa.',
      1, 0.3, 3, 'Thấp', 'Approved', 'Duy trì, cập nhật khi có thay đổi quy định', '2026-12-31', [0, 1, 1]),

    U('UC-21', 'g7', 'Tổng hợp báo cáo tuần Ban KSNB',
      'Báo cáo tuần tổng hợp từ nhiều chuyên viên, định dạng khác nhau.',
      'p04', 'p03', 'weekly', 4,
      'Gom email, chép vào mẫu báo cáo.',
      'Gom nội dung theo mẫu, chuẩn hóa câu chữ, lập danh sách việc tuần tới.',
      4, 1.5, 3, 'Cao', 'Approved', 'Chuyển sang Skill báo cáo tuần', '2026-10-31', [1, 1, 1]),
    U('UC-22', 'g7', 'Báo cáo quý tình hình KSNB trình HĐTV',
      'Báo cáo quý cần số liệu từ nhiều nguồn và nhất quán với các báo cáo trước.',
      'p12', 'p03', 'quarterly', 0.33,
      'Soạn thủ công từ báo cáo tuần/tháng.',
      'Tổng hợp số liệu, đối chiếu với báo cáo kỳ trước, dựng khung báo cáo.',
      16, 8, 4, 'Trung bình', 'Testing', 'Thử cho báo cáo quý III/2026', '2026-10-15', [1, 0, 1]),
    U('UC-23', 'g7', 'Chuẩn bị nội dung họp giao ban',
      'Nội dung giao ban tổng hợp gấp trước cuộc họp.',
      'p12', 'p03', 'weekly', 4,
      'Tổng hợp từ báo cáo tuần.',
      'Rút gọn báo cáo tuần thành danh mục vấn đề xin ý kiến.',
      2, 0.7, 2, 'Thấp', 'Draft', 'Xây prompt mới thay prompt tóm tắt biên bản cũ', '2026-11-05', [0, 1, 1]),
    U('UC-31', 'g9', 'Rà soát hồ sơ trình phê duyệt kết quả lựa chọn nhà thầu',
      'Hồ sơ đấu thầu nhiều đầu mục, phải đối chiếu trình tự và thẩm quyền theo quy chế quản lý đấu thầu.',
      'p09', 'p01', 'adhoc', 3,
      'Đọc hồ sơ, đối chiếu quy chế bằng tay.',
      'Copilot lập bảng đối chiếu trình tự thủ tục với quy chế, nêu tài liệu còn thiếu trong hồ sơ.',
      5, 2, 4, 'Cao', 'Draft', 'Chốt checklist hồ sơ đấu thầu làm dữ liệu đầu vào', '2026-11-30', [1, 1, 1]),
    U('UC-32', 'g10', 'Đối chiếu dự báo sản lượng với kế hoạch phân bổ',
      'Số liệu sản lượng theo mỏ và theo kỳ nằm ở nhiều báo cáo, đối chiếu thủ công mất thời gian.',
      'p11', 'p02', 'monthly', 1,
      'Tổng hợp bằng Excel theo từng mỏ.',
      'Copilot trong Excel lập bảng đối chiếu dự báo với kế hoạch phân bổ, đánh dấu chênh lệch vượt ngưỡng.',
      6, 2.5, 3, 'Trung bình', 'Draft', 'Xác định nguồn số liệu sản lượng dùng chung', '2026-12-15', [1, 0, 1]),
    U('UC-33', 'g8', 'Theo dõi giám sát và đánh giá đầu tư dự án',
      'Báo cáo giám sát đầu tư của các dự án gửi rải rác, khó theo dõi dự án nào chậm mốc.',
      'p16', 'p02', 'quarterly', 0.33,
      'Lập bảng theo dõi thủ công theo từng kỳ báo cáo.',
      'Copilot trích mốc tiến độ và chi phí từ báo cáo dự án, lập bảng theo dõi theo kỳ.',
      10, 4, 3, 'Trung bình', 'Draft', 'Thống nhất mẫu báo cáo giám sát đầu tư của dự án', '2026-12-20', [1, 1, 0]),
    U('UC-25', 'g5', 'Tóm tắt chuỗi thư điện tử về một vụ việc',
      'Một vụ việc có hàng chục thư qua lại giữa Ban và đơn vị; người tiếp nhận sau khó nắm đầu đuôi.',
      'p14', 'p01', 'daily', 12,
      'Đọc lại toàn bộ chuỗi thư trong hộp thư.',
      'Copilot trong Outlook tóm tắt chuỗi thư theo mốc thời gian, nêu việc đang chờ ai xử lý.',
      1, 0.3, 3, 'Trung bình', 'Testing', 'Thống nhất cách lưu chuỗi thư theo vụ việc', '2026-10-31', [0, 1, 1]),
    U('UC-26', 'g7', 'Biên bản họp và việc cần làm sau họp',
      'Họp giao ban và họp đoàn kiểm tra chưa có biên bản ngay; việc giao cho từng người dễ sót.',
      'p12', 'p03', 'weekly', 8,
      'Thư ký ghi chép tay, gõ lại biên bản sau họp.',
      'Copilot trong Teams tóm tắt nội dung họp, trích việc cần làm kèm người thực hiện để thư ký rà lại.',
      2, 0.5, 4, 'Cao', 'Testing', 'Bật ghi biên bản cho các cuộc họp nội bộ của Ban', '2026-10-25', [0, 1, 1]),
    U('UC-27', 'g6', 'So sánh hai phiên bản dự thảo văn bản',
      'Đơn vị gửi lại dự thảo đã sửa nhưng không đánh dấu thay đổi; rà lại bằng mắt mất thời gian.',
      'p11', 'p03', 'weekly', 4,
      'Đọc đối chiếu hai bản trên hai màn hình.',
      'Copilot trong Word liệt kê điểm khác nhau giữa hai phiên bản, nêu điều khoản bị sửa.',
      2, 0.7, 4, 'Trung bình', 'Draft', 'Thử trên 03 dự thảo quy chế đang rà', '2026-11-15', [0, 1, 1]),
    U('UC-28', 'g3', 'Kiểm tra bảng số liệu, phát hiện dòng bất thường',
      'Bảng số liệu đơn vị gửi hàng nghìn dòng; lọc thủ công dễ bỏ sót dòng cần kiểm tra.',
      'p13', 'p02', 'weekly', 4,
      'Lọc và sắp xếp bằng Excel theo kinh nghiệm.',
      'Copilot trong Excel lập công thức, đánh dấu dòng lệch ngưỡng để kiểm toán viên xác minh.',
      4, 1.5, 3, 'Trung bình', 'Draft', 'Chốt danh sách ngưỡng kiểm tra cho từng loại bảng', '2026-11-30', [1, 0, 1]),
    U('UC-29', 'g7', 'Dựng slide báo cáo từ bản Word',
      'Báo cáo quý đã có bản Word nhưng vẫn phải dựng lại slide trình lãnh đạo từ đầu.',
      'p04', 'p03', 'monthly', 2,
      'Chép nội dung sang PowerPoint, tự dàn trang.',
      'Copilot trong PowerPoint dựng bộ slide theo bố cục báo cáo, người soạn chỉnh lại số liệu và hình.',
      5, 1.5, 3, 'Trung bình', 'Testing', 'Chuẩn hóa mẫu slide của Ban để Copilot bám theo', '2026-11-20', [0, 1, 1]),
    U('UC-30', 'g6', 'Tra cứu quy chế nội bộ',
      'Kho quy chế trên SharePoint có hàng trăm văn bản; tra điều khoản cụ thể mất thời gian, dễ dùng nhầm bản hết hiệu lực.',
      'p11', 'p03', 'daily', 20,
      'Mở từng thư mục trên SharePoint, tìm theo tên tệp.',
      'Agent trên SharePoint trả lời kèm trích dẫn điều khoản và tên văn bản để người hỏi tự kiểm chứng.',
      0.7, 0.2, 4, 'Cao', 'Testing', 'Làm sạch thư viện, gắn nhãn còn/hết hiệu lực trước khi mở rộng', '2026-11-30', [0, 1, 1]),
    U('UC-24', 'g7', 'Tổng hợp số liệu dashboard Kiểm soát viên',
      'Số liệu đơn vị gửi nhiều định dạng, phải chuẩn hóa trước khi đưa vào dashboard.',
      'p04', 'p03', 'weekly', 4,
      'Chép tay số liệu vào tệp nguồn.',
      'Trích số liệu từ báo cáo đơn vị, kiểm tra định dạng ngày/số trước khi nạp.',
      6, 2, 3, 'Trung bình', 'Testing', 'Thử với báo cáo tuần các công ty con', '2026-10-20', [1, 1, 1])
  ];

  /* Phân công theo Matrix phân quyền Ban KSNB và danh sách nhân sự hiện hành:
     [nhóm công việc, người thực hiện, lãnh đạo phụ trách] */
  const ASSIGN = {
    'UC-01': ['g1', ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt', 'Trần Ngọc Ánh'], 'Nguyễn Thị Cẩm Tú'],
    'UC-02': ['g1', ['Lý Quốc Đạt', 'Vũ Ái Ngọc Bình'], 'Nguyễn Thị Cẩm Tú'],
    'UC-03': ['g1', ['Lý Quốc Đạt', 'Phùng Đình Sơn'], 'Vũ Anh Quân'],
    'UC-04': ['g6', ['Vũ Thúy Quỳnh', 'Trần Ngọc Ánh'], 'Vũ Anh Quân'],
    'UC-05': ['g3', ['Trần Phương Anh', 'Ngô Thị Tuấn Anh', 'Nguyễn Văn Điều'], 'Đặng Ngọc Khánh'],
    'UC-06': ['g3', ['Ngô Thị Tuấn Anh', 'Đoàn Thái Việt'], 'Đặng Ngọc Khánh'],
    'UC-07': ['g3', ['Nguyễn Văn Điều', 'Trần Phương Anh'], 'Đặng Ngọc Khánh'],
    'UC-08': ['g3', ['Ngô Thị Tuấn Anh', 'Chu Nhật Anh'], 'Đặng Ngọc Khánh'],
    'UC-09': ['g4', ['Nguyễn Văn Điều', 'Đoàn Thái Việt'], 'Đặng Ngọc Khánh'],
    'UC-10': ['g7', ['Giang Anh Dũng', 'Nguyễn Bá Lập'], 'Đặng Ngọc Khánh'],
    'UC-11': ['g4', ['Ngô Thị Tuấn Anh', 'Nguyễn Văn Điều'], 'Đặng Ngọc Khánh'],
    'UC-12': ['g5', ['Chu Nhật Anh', 'Trần Bảo Châu', 'Nguyễn Bá Lập'], 'Vũ Anh Quân'],
    'UC-13': ['g5', ['Trần Phương Anh', 'Chu Nhật Anh'], 'Vũ Anh Quân'],
    'UC-14': ['g5', ['Chu Nhật Anh', 'Giang Anh Dũng'], 'Vũ Anh Quân'],
    'UC-15': ['g1', ['Lý Quốc Đạt', 'Nguyễn Thị Phương Anh'], 'Vũ Anh Quân'],
    'UC-16': ['g1', ['Lý Quốc Đạt', 'Nguyễn Minh Hằng'], 'Vũ Anh Quân'],
    'UC-17': ['g1', ['Nguyễn Thị Phương Anh', 'Nguyễn Mỹ Hạnh'], 'Vũ Anh Quân'],
    'UC-18': ['g2', ['Vũ Ái Ngọc Bình', 'Trần Bảo Châu'], 'Nguyễn Thị Cẩm Tú'],
    'UC-19': ['g2', ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt'], 'Nguyễn Thị Cẩm Tú'],
    'UC-20': ['g2', ['Nguyễn Minh Hằng', 'Nguyễn Thị Phương Anh', 'Nguyễn Mỹ Hạnh'], 'Vũ Anh Quân'],
    'UC-21': ['g6', ['Phùng Đình Sơn', 'Nguyễn Mỹ Hạnh'], 'Vũ Anh Quân'],
    'UC-22': ['g6', ['Vũ Ái Ngọc Bình', 'Trần Ngọc Ánh'], 'Vũ Anh Quân'],
    'UC-23': ['g6', ['Nguyễn Mỹ Hạnh', 'Nguyễn Minh Hằng'], 'Vũ Anh Quân'],
    'UC-24': ['g7', ['Giang Anh Dũng', 'Trần Phương Anh'], 'Đặng Ngọc Khánh'],
    'UC-25': ['g1', ['Nguyễn Minh Hằng', 'Lương Lê Thu Hằng'], 'Vũ Anh Quân'],
    'UC-26': ['g1', ['Phùng Đình Sơn', 'Lương Lê Thu Hằng', 'Nguyễn Thị Phương Anh'], 'Vũ Anh Quân'],
    'UC-27': ['g2', ['Lý Quốc Đạt', 'Vũ Ái Ngọc Bình'], 'Nguyễn Thị Cẩm Tú'],
    'UC-28': ['g4', ['Nguyễn Bá Lập', 'Giang Anh Dũng'], 'Đặng Ngọc Khánh'],
    'UC-29': ['g6', ['Phùng Đình Sơn', 'Nguyễn Thị Phương Anh'], 'Vũ Anh Quân'],
    'UC-30': ['g2', ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt', 'Trần Bảo Châu'], 'Nguyễn Thị Cẩm Tú'],
    'UC-31': ['g9', ['Vũ Thúy Quỳnh', 'Trần Bảo Châu'], 'Nguyễn Thị Cẩm Tú'],
    'UC-32': ['g10', ['Nguyễn Bá Minh', 'Trần Ngọc Ánh'], 'Đặng Ngọc Khánh'],
    'UC-33': ['g8', ['Nguyễn Văn Điều', 'Trần Ngọc Ánh'], 'Đặng Ngọc Khánh']
  };
  useCases.forEach(u => {
    const a = ASSIGN[u.id];
    if (a) {
      u.groupId = a[0];
      u.ownerIds = a[1].map(who).filter(Boolean);   // nhiều người cùng làm một việc
      u.ownerId = u.ownerIds[0] || '';              // người chủ trì
      u.leadId = who(a[2]);
    }
  });
  /* Nhóm công việc của cán bộ suy từ chính phân công, không nhập tay */
  people.forEach(p => {
    const gs = new Set();
    useCases.forEach(u => { if ((u.ownerIds || []).includes(p.id) || u.leadId === p.id) gs.add(u.groupId); });
    p.groups = [...gs];
  });

  /* Công cụ AI dùng cho từng ứng dụng AI (khóa theo AIM.config.tools) */
  const TOOL = {
    'UC-25': 'outlook', 'UC-26': 'teams', 'UC-27': 'word', 'UC-28': 'excel', 'UC-29': 'ppt', 'UC-30': 'sp',
    'UC-02': 'word', 'UC-11': 'word', 'UC-18': 'word', 'UC-20': 'word',
    'UC-04': 'excel', 'UC-10': 'excel', 'UC-14': 'excel', 'UC-24': 'excel',
    'UC-19': 'sp'
  };
  useCases.forEach(u => { u.tool = TOOL[u.id] || 'chat'; });

  const L = (id, type, name, groupId, useCaseId, purpose, input, instruction, output,
             builderId, reviewerId, version, updated, status) =>
    ({ id, type, name, groupId, useCaseId, purpose, input, instruction, output,
       builderId, reviewerId, version, updated, status });

  const library = [
    L('PR-01', 'prompt', 'Rà soát thẩm quyền phê duyệt của tờ trình', 'g1', 'UC-01',
      'Xác định cấp có thẩm quyền quyết định nội dung tờ trình và đối chiếu với cấp trình.',
      'Tờ trình (PDF/Word); trích Điều lệ, Quy chế tài chính, phân cấp thẩm quyền hiện hành.',
`Bạn là chuyên viên Ban Kiểm soát nội bộ. Đọc tờ trình đính kèm và các văn bản phân cấp thẩm quyền.
1. Liệt kê từng nội dung đề nghị phê duyệt trong tờ trình.
2. Với mỗi nội dung, ghi điều, khoản văn bản quy định thẩm quyền và cấp có thẩm quyền.
3. So với cấp trình của tờ trình: Đúng thẩm quyền / Cần làm rõ.
Chỉ dùng văn bản được cung cấp. Không suy luận khi văn bản không nêu; khi đó ghi "Chưa đủ căn cứ trong hồ sơ".
Trình bày dạng bảng: Nội dung | Căn cứ (văn bản, điều, khoản) | Cấp có thẩm quyền | Nhận xét.`,
      'Bảng đối chiếu thẩm quyền, mỗi dòng có căn cứ cụ thể.', 'p05', 'p04', 'v1.2', '2026-09-12', 'Approved'),
    L('PR-02', 'prompt', 'Kiểm tra căn cứ pháp lý dẫn chiếu', 'g1', 'UC-01',
      'Kiểm tra các văn bản căn cứ trong tờ trình có đầy đủ số hiệu, ngày ban hành và phù hợp nội dung.',
      'Phần căn cứ của tờ trình; danh mục văn bản quản lý nội bộ còn hiệu lực.',
`Trích toàn bộ văn bản được dẫn chiếu trong phần căn cứ và nội dung tờ trình.
Với mỗi văn bản: số hiệu, ngày, cơ quan ban hành, trích yếu.
Đối chiếu với danh mục văn bản còn hiệu lực được cung cấp; đánh dấu văn bản không có trong danh mục.
Không khẳng định văn bản hết hiệu lực nếu danh mục không ghi; ghi "Cần xác minh".`,
      'Danh sách văn bản căn cứ kèm tình trạng đối chiếu.', 'p05', 'p11', 'v1.1', '2026-09-10', 'Approved'),
    L('PR-03', 'prompt', 'Khung Phiếu ý kiến Ban KSNB', 'g1', 'UC-02',
      'Dựng khung phiếu ý kiến đúng thể thức, mỗi ý có nguồn.',
      'Tờ trình; ghi chú rà soát của chuyên viên; mẫu PYK hiện hành.',
`Dựa trên ghi chú rà soát, soạn nội dung Phiếu ý kiến theo mẫu:
- Mở đầu: "Ban KSNB nhận được Tờ trình số ... ngày ... về việc ...".
- Mỗi ý: nêu nguồn ngay đầu câu (Theo tờ trình, mục ...; Theo Quy chế ..., Điều ...).
- Không đưa nhận định chưa có căn cứ. Không dùng động từ mệnh lệnh.
- Nếu có đề nghị: chủ ngữ là HĐTV hoặc Ban Điều hành, động từ "xem xét".
Văn phong hành chính, câu ngắn, không dùng từ tiếng Anh khi có từ tiếng Việt tương đương.`,
      'Dự thảo nội dung PYK để chuyên viên hoàn thiện.', 'p04', 'p01', 'v2.0', '2026-09-15', 'Approved'),
    L('PR-04', 'prompt', 'Tóm tắt tờ trình 01 trang', 'g1', 'UC-03',
      'Tóm tắt tờ trình theo khung cố định cho lãnh đạo đọc trước cuộc họp.',
      'Tờ trình và phụ lục.',
`Tóm tắt tờ trình trong tối đa 01 trang theo 04 mục:
1. Nội dung đề nghị (01-02 câu).
2. Căn cứ chính (số hiệu văn bản).
3. Số liệu chính (giá trị, tiến độ, so sánh với kế hoạch nếu tờ trình có nêu).
4. Điểm cần lưu ý (chỉ nêu điểm tờ trình chưa làm rõ, kèm vị trí trong tờ trình).
Không bình luận, không đánh giá.`,
      'Bản tóm tắt 01 trang.', 'p05', 'p04', 'v0.9', '2026-09-18', 'Testing'),
    L('PR-05', 'prompt', 'Đối chiếu checklist hồ sơ KTGS', 'g2', 'UC-05',
      'Đối chiếu danh mục hồ sơ đơn vị cung cấp với checklist kiểm tra.',
      'Checklist hồ sơ theo đề cương; danh sách tệp đơn vị gửi.',
`So sánh danh sách tệp đơn vị gửi với checklist.
Lập bảng: Mục checklist | Tệp tương ứng | Tình trạng (Đã có / Chưa thấy trong hồ sơ / Cần xác nhận).
"Chưa thấy trong hồ sơ" không có nghĩa đơn vị không có tài liệu; ghi rõ để đoàn đề nghị bổ sung.`,
      'Bảng tình trạng hồ sơ và danh sách tài liệu đề nghị bổ sung.', 'p07', 'p02', 'v0.8', '2026-09-16', 'Testing'),
    L('PR-06', 'prompt', 'Dựng đề cương kiểm tra giám sát', 'g2', 'UC-06',
      'Dựng khung đề cương từ mục tiêu, phạm vi và tiền lệ.',
      'Quyết định thành lập đoàn; mục tiêu, phạm vi; đề cương đợt trước.',
`Soạn đề cương kiểm tra gồm: mục đích, yêu cầu; phạm vi, thời kỳ; nội dung kiểm tra chi tiết; tài liệu đề nghị cung cấp; phân công; tiến độ.
Nội dung kiểm tra bám theo phạm vi trong quyết định, không mở rộng.`,
      'Dự thảo đề cương.', 'p06', 'p07', 'v1.0', '2026-09-05', 'Approved'),
    L('PR-07', 'prompt', 'Trích xuất nhiệm vụ từ Nghị quyết/TBKL', 'g5', 'UC-16',
      'Chuyển nội dung nghị quyết, thông báo kết luận thành danh mục nhiệm vụ theo dõi.',
      'Nghị quyết/Thông báo kết luận (Word/PDF).',
`Trích mọi nhiệm vụ trong văn bản thành bảng:
STT | Nội dung nhiệm vụ | Đơn vị chủ trì | Đơn vị phối hợp | Thời hạn | Vị trí trong văn bản.
Giữ nguyên câu chữ văn bản cho cột nội dung. Thời hạn không nêu thì để trống, không tự đặt.`,
      'Bảng nhiệm vụ nhập được vào sổ theo dõi.', 'p10', 'p01', 'v1.3', '2026-09-08', 'Approved'),
    L('PR-08', 'prompt', 'Rà soát dự thảo quy chế nội bộ', 'g6', 'UC-18',
      'Đối chiếu điều khoản dự thảo với văn bản cấp trên và quy chế liên quan.',
      'Dự thảo quy chế; văn bản cấp trên; quy chế liên quan đang có hiệu lực.',
`Lập bảng đối chiếu: Điều khoản dự thảo | Văn bản liên quan (điều, khoản) | Nội dung chưa thống nhất.
Chỉ nêu điểm chưa thống nhất có dẫn được điều khoản cụ thể.`,
      'Bảng đối chiếu điều khoản.', 'p11', 'p03', 'v1.0', '2026-09-02', 'Approved'),
    L('PR-09', 'prompt', 'Kiểm tra thể thức văn bản', 'g6', 'UC-20',
      'Soát lỗi thể thức văn bản hành chính trước khi trình ký.',
      'Dự thảo văn bản (Word).',
`Kiểm tra thể thức: quốc hiệu, tiêu ngữ; số, ký hiệu; địa danh, ngày tháng; trích yếu; nơi nhận; chữ ký; căn lề, phông chữ.
Liệt kê lỗi theo thứ tự xuất hiện kèm gợi ý sửa. Không sửa nội dung chuyên môn.`,
      'Danh sách lỗi thể thức và gợi ý sửa.', 'p11', 'p14', 'v1.1', '2026-08-28', 'Approved'),
    L('PR-10', 'prompt', 'Tổng hợp báo cáo tuần', 'g7', 'UC-21',
      'Gom nội dung công việc tuần của chuyên viên vào mẫu báo cáo Ban.',
      'Nội dung báo cáo của từng chuyên viên; mẫu báo cáo tuần.',
`Gom nội dung theo các mục của mẫu báo cáo. Giữ số hiệu văn bản, ngày, số liệu như bản gốc.
Gộp các việc trùng lặp. Lập mục "Kế hoạch tuần tới" từ nội dung chuyên viên đã nêu.`,
      'Dự thảo báo cáo tuần.', 'p04', 'p03', 'v1.0', '2026-09-11', 'Approved'),
    L('PR-11', 'prompt', 'Đối chiếu tờ trình với khẩu vị rủi ro', 'g4', 'UC-13',
      'Đối chiếu nội dung tờ trình đầu tư với tuyên bố khẩu vị rủi ro đã ban hành.',
      'Tờ trình đầu tư; văn bản khẩu vị rủi ro; thước đo khả năng/ảnh hưởng.',
`Với từng nhóm khẩu vị rủi ro trong văn bản, trích nội dung tờ trình có liên quan.
Ghi: Phù hợp / Chờ xác nhận (nêu thông tin còn thiếu).
Không kết luận "ngoài khẩu vị" khi chưa chứng minh được nội dung rơi đúng điều khoản không chấp nhận.`,
      'Bảng đối chiếu theo từng nhóm khẩu vị.', 'p09', 'p03', 'v0.5', '2026-09-19', 'Testing'),
    L('PR-12', 'prompt', 'Gợi ý chương trình kiểm toán theo IIA', 'g3', 'UC-09',
      'Gợi ý thủ tục kiểm toán theo rủi ro và mục tiêu kiểm soát.',
      'Mục tiêu cuộc kiểm toán; danh mục rủi ro; quy trình của đơn vị.',
`Với mỗi rủi ro, đề xuất mục tiêu kiểm soát và thủ tục kiểm toán (kiểm tra tài liệu, phỏng vấn, quan sát, phân tích).
Ghi rõ bằng chứng cần thu thập cho từng thủ tục.`,
      'Bảng chương trình kiểm toán dự thảo.', 'p08', 'p02', 'v0.3', '2026-09-20', 'Draft'),
    L('PR-13', 'prompt', 'Tóm tắt biên bản họp (bản cũ)', 'g7', 'UC-23',
      'Tóm tắt biên bản họp giao ban.',
      'Biên bản họp.',
`Tóm tắt biên bản họp thành các ý chính và việc cần làm.`,
      'Bản tóm tắt.', 'p12', 'p04', 'v1.0', '2026-06-30', 'Deprecated'),

    L('PR-14', 'prompt', 'Bộ câu hỏi kiểm tra trước khi cho ý kiến', 'g1', 'UC-01',
      'Lãnh đạo dùng trước khi ký ý kiến: kiểm tra nhanh hồ sơ đã đủ căn cứ chưa.',
      'Tờ trình và hồ sơ kèm theo; dự thảo ý kiến của chuyên viên.',
`Đọc tờ trình và dự thảo ý kiến kèm theo. Trả lời ngắn gọn 05 câu hỏi:
1. Nội dung trình thuộc thẩm quyền cấp nào, căn cứ ở đâu?
2. Số liệu trong tờ trình và phụ lục có khớp nhau không? Chỗ nào lệch?
3. Dự thảo ý kiến có câu nào không dẫn được nguồn?
4. Nội dung nào hồ sơ chưa làm rõ?
5. Có nội dung nào cần xin ý kiến đơn vị khác trước khi quyết không?
Mỗi câu trả lời tối đa 03 dòng, ghi rõ vị trí trong hồ sơ.`,
      'Bản kiểm tra nhanh 05 ý để lãnh đạo quyết định ký hay trả lại.', 'p08', 'p13', 'v1.0', '2026-09-20', 'Approved'),
    L('PR-15', 'prompt', 'Tóm tắt hồ sơ trình trong 10 dòng', 'g1', 'UC-03',
      'Đọc nhanh hồ sơ dài trước cuộc họp.',
      'Tờ trình, báo cáo hoặc hồ sơ dự án.',
`Tóm tắt hồ sơ trong tối đa 10 dòng theo thứ tự: đề nghị gì; ai trình; căn cứ chính; số tiền hoặc chỉ tiêu chính; thời hạn; điểm hồ sơ chưa làm rõ.
Không nhận xét, không đề xuất. Số liệu ghi kèm vị trí trong hồ sơ.`,
      'Bản tóm tắt 10 dòng.', 'p13', 'p06', 'v1.1', '2026-09-21', 'Approved'),
    L('PR-16', 'prompt', 'Rà nhanh rủi ro của phương án trình', 'g5', 'UC-13',
      'Lãnh đạo nhìn rủi ro chính của phương án trước khi cho ý kiến.',
      'Tờ trình phương án; văn bản khẩu vị rủi ro.',
`Liệt kê tối đa 05 rủi ro của phương án được trình, mỗi rủi ro ghi: nội dung rủi ro | căn cứ trong hồ sơ | nhóm khẩu vị rủi ro liên quan.
Chỉ nêu rủi ro dẫn được căn cứ trong hồ sơ. Không xếp hạng mức độ khi hồ sơ chưa có số liệu.`,
      'Danh sách rủi ro kèm căn cứ.', 'p22', 'p17', 'v0.6', '2026-09-22', 'Testing'),
    L('PR-17', 'prompt', 'Chuẩn bị câu hỏi cho cuộc họp', 'g6', 'UC-26',
      'Chuẩn bị câu hỏi trọng tâm trước khi chủ trì hoặc dự họp.',
      'Tài liệu họp; báo cáo của đơn vị.',
`Từ tài liệu họp, soạn tối đa 08 câu hỏi cho người chủ trì, sắp theo thứ tự chương trình họp.
Mỗi câu hỏi bám một số liệu hoặc một nội dung cụ thể trong tài liệu, ghi kèm vị trí.
Không đặt câu hỏi về nội dung tài liệu không đề cập.`,
      'Danh sách câu hỏi theo chương trình họp.', 'p25', 'p24', 'v0.8', '2026-09-22', 'Testing'),
    L('SK-01', 'skill', 'Rà soát tờ trình HĐTV (04 bước)', 'g1', 'UC-01',
      'Chuỗi rà soát chuẩn: thẩm quyền → căn cứ → số liệu → vấn đề cần làm rõ.',
      'Tờ trình; bộ văn bản phân cấp; danh mục văn bản còn hiệu lực.',
`Bước 1: Chạy PR-01 để lập bảng thẩm quyền.
Bước 2: Chạy PR-02 để kiểm tra căn cứ dẫn chiếu.
Bước 3: Trích số liệu chính, đối chiếu giữa thân tờ trình và phụ lục.
Bước 4: Tổng hợp danh sách vấn đề cần làm rõ, mỗi vấn đề ghi vị trí và căn cứ.
Đầu ra dùng làm input cho SK-02 (xuất PYK).`,
      'Hồ sơ rà soát gồm 03 bảng và danh sách vấn đề.', 'p04', 'p01', 'v0.6', '2026-09-17', 'Testing'),
    L('SK-02', 'skill', 'Xuất Phiếu ý kiến Word đúng mẫu', 'g1', 'UC-02',
      'Từ nội dung đã duyệt, xuất tệp Word PYK đúng mẫu cố định.',
      'Nội dung PYK đã duyệt; số, ngày; nơi nhận.',
`Điền nội dung vào mẫu PYK: header PVEP, quốc hiệu, số/ngày, trích yếu, nội dung, nơi nhận, chữ ký.
Kiểm tra thể thức bằng PR-09 trước khi xuất.`,
      'Tệp Word PYK.', 'p04', 'p01', 'v1.0', '2026-09-09', 'Approved'),
    L('SK-03', 'skill', 'Báo cáo tuần tự động', 'g7', 'UC-21',
      'Thu nội dung từ thư mục chung, dựng báo cáo tuần theo mẫu.',
      'Thư mục báo cáo chuyên viên trên SharePoint; mẫu báo cáo.',
`Đọc các tệp báo cáo chuyên viên nộp trong tuần.
Chạy PR-10 để tổng hợp. Đánh dấu chuyên viên chưa nộp để đầu mối nhắc.
Xuất Word theo mẫu.`,
      'Dự thảo báo cáo tuần và danh sách chưa nộp.', 'p04', 'p03', 'v0.4', '2026-09-14', 'Testing'),
    L('SK-04', 'skill', 'Đối chiếu hiệu lực văn bản dẫn chiếu', 'g6', 'UC-19',
      'Tự động liệt kê văn bản dẫn chiếu và đối chiếu danh mục còn/hết hiệu lực.',
      'Văn bản cần rà; danh mục văn bản quản lý nội bộ.',
`Trích văn bản dẫn chiếu; tra danh mục; lập bảng tình trạng; đánh dấu văn bản cần xác minh.`,
      'Bảng tình trạng hiệu lực.', 'p11', 'p03', 'v0.2', '2026-09-19', 'Draft'),

    L('AG-01', 'agent', 'Agent theo dõi chỉ đạo PVN → PVEP → Đơn vị', 'g5', 'UC-15',
      'Theo dõi quá trình tiếp nhận, giao việc và thực hiện chỉ đạo qua các cấp.',
      'Văn bản đến từ Petrovietnam; văn bản giao việc của PVEP; báo cáo của đơn vị.',
`Vai trò: trợ lý theo dõi chỉ đạo của Ban KSNB.
1. Khi có văn bản đến: nhận diện chỉ đạo, trích nhiệm vụ (dùng PR-07), ghi vào sổ theo dõi.
2. Theo dõi văn bản giao việc của PVEP cho đơn vị; nối với chỉ đạo gốc.
3. Khi có báo cáo của đơn vị: cập nhật tình trạng; chỉ đánh dấu "Hoàn thành" khi có văn bản báo cáo.
4. Hằng tuần: lập danh sách nhiệm vụ đến hạn trong 07 ngày và quá hạn, gửi đầu mối.
Không tự kết luận nguyên nhân chậm; ghi "Chưa có báo cáo" khi thiếu văn bản.`,
      'Sổ theo dõi chỉ đạo 03 cấp và bản tin tuần.', 'p10', 'p01', 'v0.3', '2026-09-18', 'Testing'),
    L('AG-02', 'agent', 'Trợ lý hồ sơ KTGS', 'g2', 'UC-05',
      'Theo dõi hồ sơ đơn vị gửi trong suốt đợt kiểm tra.',
      'Checklist; thư mục hồ sơ đơn vị gửi.',
`Mỗi khi thư mục có tệp mới: đối chiếu với checklist (PR-05), cập nhật tình trạng, lập danh sách đề nghị bổ sung.
Chỉ đọc hồ sơ, không gửi thư cho đơn vị.`,
      'Bảng tình trạng hồ sơ cập nhật liên tục.', 'p07', 'p02', 'v0.1', '2026-09-20', 'Draft'),
    L('AG-03', 'agent', 'Agent hỏi đáp kho quy chế nội bộ', 'g6', 'UC-30',
      'Trả lời câu hỏi về quy chế, quy trình nội bộ kèm trích dẫn điều khoản và tên văn bản.',
      'Thư viện văn bản quản lý nội bộ trên SharePoint của Ban; danh mục văn bản còn/hết hiệu lực.',
`Vai trò: trợ lý tra cứu văn bản quản lý nội bộ của Ban.
1. Chỉ trả lời dựa trên tài liệu trong thư viện được chỉ định.
2. Mỗi câu trả lời phải dẫn tên văn bản, số hiệu, điều, khoản.
3. Văn bản nằm trong danh mục hết hiệu lực: nêu rõ, chỉ ra văn bản thay thế nếu danh mục có ghi.
4. Không có tài liệu phù hợp thì trả lời "Chưa tìm thấy trong thư viện", không suy đoán.`,
      'Câu trả lời kèm trích dẫn để người hỏi tự kiểm chứng.', 'p11', 'p03', 'v0.2', '2026-09-21', 'Testing'),
    L('AG-04', 'agent', 'Agent lập bảng công việc cho đoàn kiểm tra', 'g3', 'UC-08',
      'Chuyển quyết định, đề cương và biên bản của đoàn kiểm tra thành bảng công việc có người phụ trách và thời hạn.',
      'Quyết định thành lập đoàn, đề cương kiểm tra, biên bản làm việc.',
`Vai trò: trợ lý lập kế hoạch công việc cho đoàn kiểm tra.
1. Đọc quyết định, đề cương và biên bản; trích các đầu việc kèm người phụ trách và thời hạn.
2. Tạo bảng công việc trên Microsoft Planner theo từng phần hành.
3. Hằng tuần lập báo cáo tiến độ, nêu việc quá hạn và việc chưa có người nhận.
4. Không tự đặt thời hạn khi tài liệu không nêu; ghi "Chưa có thời hạn".`,
      'Bảng công việc trên Planner và báo cáo tiến độ hằng tuần.', 'p15', 'p06', 'v0.1', '2026-09-23', 'Draft'),
    L('AG-05', 'agent', 'Agent bản tin đầu ngày cho Lãnh đạo Ban', 'g1', 'UC-17',
      'Tổng hợp thư, lịch họp và nhiệm vụ đến hạn thành bản tin ngắn đầu giờ sáng.',
      'Hộp thư, lịch làm việc, sổ theo dõi chỉ đạo của Ban.',
`Vai trò: trợ lý tổng hợp thông tin đầu ngày cho Lãnh đạo Ban.
Mỗi sáng lập bản tin gồm 04 mục:
1. Việc đến hạn hôm nay và đã quá hạn (nêu nguồn chỉ đạo).
2. Cuộc họp trong ngày kèm tài liệu liên quan.
3. Thư cần trả lời, sắp theo mức độ khẩn.
4. Hồ sơ chờ ý kiến của Ban.
Mỗi dòng dẫn nguồn (số văn bản, tên thư mục, tên cuộc họp). Không nhận xét, không đề xuất.`,
      'Bản tin đầu ngày gửi vào Teams hoặc thư điện tử.', 'p05', 'p10', 'v0.1', '2026-09-23', 'Draft'),
    L('SK-05', 'skill', 'Dựng slide báo cáo quý từ bản Word', 'g7', 'UC-29',
      'Chuyển báo cáo Word thành bộ slide theo mẫu trình bày của Ban.',
      'Báo cáo Word đã duyệt; mẫu slide của Ban.',
`Bước 1: Rút các mục chính của báo cáo thành đề cương slide.
Bước 2: Dựng slide theo mẫu của Ban, mỗi slide một thông điệp.
Bước 3: Giữ nguyên số liệu và số hiệu văn bản như bản Word.
Bước 4: Liệt kê slide còn thiếu hình, bảng để người soạn bổ sung.`,
      'Bộ slide nháp và danh sách nội dung cần bổ sung.', 'p04', 'p03', 'v0.3', '2026-09-20', 'Draft')
  ];

  /* Thông tin triển khai bổ sung cho Skill và Agent */
  const DEV = {
    'SK-01': { leadId: 'p01', deadline: '2026-11-15', steps: ['Kiểm tra thẩm quyền (PR-01)', 'Kiểm tra căn cứ pháp lý (PR-02)', 'Đối chiếu số liệu thân tờ trình với phụ lục', 'Lập danh sách vấn đề cần làm rõ'] },
    'SK-02': { leadId: 'p01', deadline: '2026-10-10', steps: ['Nhận nội dung PYK đã duyệt', 'Kiểm tra thể thức (PR-09)', 'Điền vào mẫu PYK', 'Xuất tệp Word'] },
    'SK-03': { leadId: 'p03', deadline: '2026-10-31', steps: ['Đọc báo cáo chuyên viên nộp trong tuần', 'Tổng hợp theo mẫu (PR-10)', 'Đánh dấu người chưa nộp', 'Xuất Word trình lãnh đạo Ban'] },
    'SK-04': { leadId: 'p03', deadline: '2026-11-10', steps: ['Trích văn bản dẫn chiếu', 'Tra danh mục còn/hết hiệu lực', 'Lập bảng tình trạng', 'Đánh dấu văn bản cần xác minh'] },
    'SK-05': { leadId: 'p03', deadline: '2026-11-20', steps: ['Rút đề cương slide từ báo cáo', 'Dựng slide theo mẫu của Ban', 'Giữ nguyên số liệu và số hiệu văn bản', 'Liệt kê nội dung cần bổ sung'] },
    'AG-01': { leadId: 'p01', deadline: '2026-12-15',
      trigger: 'Khi có văn bản đến của Petrovietnam hoặc báo cáo của đơn vị',
      dataScope: 'Sổ văn bản đến/đi của Ban; thư mục báo cáo của đơn vị trên SharePoint',
      guardrails: 'Chỉ đọc và ghi sổ theo dõi. Không gửi văn bản cho đơn vị. Chỉ ghi Hoàn thành khi có văn bản báo cáo.' },
    'AG-02': { leadId: 'p02', deadline: '2026-12-20',
      trigger: 'Khi thư mục hồ sơ của đoàn kiểm tra có tệp mới',
      dataScope: 'Checklist đề cương và thư mục hồ sơ đơn vị gửi theo từng đợt',
      guardrails: 'Chỉ đối chiếu và lập danh sách đề nghị bổ sung. Không liên hệ đơn vị. Không kết luận thiếu sót.' },
    'AG-04': { deadline: '2026-12-20',
      trigger: 'Khi có quyết định thành lập đoàn hoặc biên bản làm việc mới',
      dataScope: 'Hồ sơ đoàn kiểm tra trên SharePoint, bảng công việc trên Planner',
      guardrails: 'Chỉ lập và cập nhật bảng công việc. Không gửi nhắc trực tiếp cho đơn vị được kiểm tra.' },
    'AG-05': { deadline: '2026-12-31',
      trigger: 'Tự chạy vào đầu giờ sáng các ngày làm việc',
      dataScope: 'Hộp thư và lịch của người dùng, sổ theo dõi chỉ đạo của Ban',
      guardrails: 'Chỉ đọc và tổng hợp. Không trả lời thư thay người dùng. Mỗi dòng phải dẫn nguồn.' },
    'AG-03': { leadId: 'p03', deadline: '2026-11-30',
      trigger: 'Khi cán bộ đặt câu hỏi trong Teams hoặc trên trang SharePoint của Ban',
      dataScope: 'Thư viện văn bản quản lý nội bộ của Ban trên SharePoint',
      guardrails: 'Chỉ trả lời trong phạm vi thư viện. Luôn dẫn số hiệu, điều, khoản. Không suy đoán khi không có tài liệu.' }
  };
  /* Lĩnh vực công việc của Tổng Công ty mà sản phẩm AI phục vụ */
  const DOMAIN = {
    'PR-01': 'd10', 'PR-02': 'd10', 'PR-03': 'd12', 'PR-04': 'd10', 'PR-05': 'd12', 'PR-06': 'd12',
    'PR-07': 'd13', 'PR-08': 'd10', 'PR-09': 'd13', 'PR-10': 'd5', 'PR-11': 'd12', 'PR-12': 'd12', 'PR-13': 'd13',
    'SK-01': 'd10', 'SK-02': 'd12', 'SK-03': 'd5', 'SK-04': 'd10', 'SK-05': 'd5',
    'AG-01': 'd13', 'AG-02': 'd12', 'AG-03': 'd10', 'AG-04': 'd12', 'AG-05': 'd13'
  };
  /* Người xây dựng - người rà soát - lãnh đạo phụ trách của từng sản phẩm */
  const OWN = {
    'PR-01': ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt', 'Nguyễn Thị Cẩm Tú'],
    'PR-02': ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt', 'Nguyễn Thị Cẩm Tú'],
    'PR-03': ['Lý Quốc Đạt', 'Vũ Ái Ngọc Bình', 'Nguyễn Thị Cẩm Tú'],
    'PR-04': ['Lý Quốc Đạt', 'Nguyễn Thị Hải Yến', 'Vũ Anh Quân'],
    'PR-05': ['Trần Phương Anh', 'Đoàn Thái Việt', 'Đặng Ngọc Khánh'],
    'PR-06': ['Ngô Thị Tuấn Anh', 'Đoàn Thái Việt', 'Đặng Ngọc Khánh'],
    'PR-07': ['Lý Quốc Đạt', 'Nguyễn Thị Hải Yến', 'Vũ Anh Quân'],
    'PR-08': ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt', 'Nguyễn Thị Cẩm Tú'],
    'PR-09': ['Nguyễn Thị Phương Anh', 'Phùng Đình Sơn', 'Vũ Anh Quân'],
    'PR-10': ['Phùng Đình Sơn', 'Nguyễn Mỹ Hạnh', 'Vũ Anh Quân'],
    'PR-11': ['Chu Nhật Anh', 'Lê Thùy Dương', 'Vũ Anh Quân'],
    'PR-12': ['Nguyễn Văn Điều', 'Đoàn Thái Việt', 'Đặng Ngọc Khánh'],
    'PR-13': ['Nguyễn Minh Hằng', 'Phùng Đình Sơn', 'Vũ Anh Quân'],
    'PR-14': ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt', 'Nguyễn Thị Cẩm Tú'],
    'PR-15': ['Lý Quốc Đạt', 'Nguyễn Thị Hải Yến', 'Vũ Anh Quân'],
    'PR-16': ['Chu Nhật Anh', 'Lê Thùy Dương', 'Vũ Anh Quân'],
    'PR-17': ['Phùng Đình Sơn', 'Nguyễn Mỹ Hạnh', 'Vũ Anh Quân'],
    'SK-01': ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt', 'Nguyễn Thị Cẩm Tú'],
    'SK-02': ['Lý Quốc Đạt', 'Vũ Ái Ngọc Bình', 'Nguyễn Thị Cẩm Tú'],
    'SK-03': ['Phùng Đình Sơn', 'Nguyễn Mỹ Hạnh', 'Vũ Anh Quân'],
    'SK-04': ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt', 'Nguyễn Thị Cẩm Tú'],
    'SK-05': ['Phùng Đình Sơn', 'Nguyễn Thị Phương Anh', 'Vũ Anh Quân'],
    'AG-01': ['Lý Quốc Đạt', 'Nguyễn Thị Hải Yến', 'Vũ Anh Quân'],
    'AG-02': ['Trần Phương Anh', 'Đoàn Thái Việt', 'Đặng Ngọc Khánh'],
    'AG-03': ['Vũ Ái Ngọc Bình', 'Lý Quốc Đạt', 'Nguyễn Thị Cẩm Tú'],
    'AG-04': ['Ngô Thị Tuấn Anh', 'Đoàn Thái Việt', 'Đặng Ngọc Khánh'],
    'AG-05': ['Lý Quốc Đạt', 'Nguyễn Thị Hải Yến', 'Nguyễn Thị Cẩm Tú']
  };
  /* Đối tượng sử dụng: lead = lãnh đạo, staff = chuyên viên, both = dùng chung */
  const AUD = {
    'PR-14': 'lead', 'PR-15': 'lead', 'PR-16': 'lead', 'PR-17': 'lead',
    'PR-03': 'staff', 'PR-05': 'staff', 'PR-06': 'staff', 'PR-09': 'staff', 'PR-10': 'staff',
    'PR-12': 'staff', 'PR-13': 'staff', 'PR-01': 'both', 'PR-02': 'both', 'PR-04': 'both',
    'PR-07': 'both', 'PR-08': 'both', 'PR-11': 'both',
    'SK-01': 'staff', 'SK-02': 'staff', 'SK-03': 'staff', 'SK-04': 'staff', 'SK-05': 'staff',
    'AG-01': 'both', 'AG-02': 'staff', 'AG-03': 'both', 'AG-04': 'staff', 'AG-05': 'lead'
  };
  library.forEach(x => {
    x.audience = AUD[x.id] || 'both';
    Object.assign(x, DEV[x.id] || {});
    x.domainId = DOMAIN[x.id] || 'd12';
    const o = OWN[x.id];
    if (o) { x.builderId = who(o[0]); x.reviewerId = who(o[1]); x.leadId = who(o[2]); }
    const uc = useCases.find(u => u.id === x.useCaseId);
    if (uc) x.groupId = uc.groupId;
  });

  const M = (id, name, start, end, ownerId, deliverables, actualEnd) =>
    ({ id, name, start, end, ownerId, actualEnd: actualEnd || '',
       deliverables: deliverables.map(([t, done]) => ({ t, done: !!done })) });

  const milestones = [
    M('M1', 'Hoàn thành kế hoạch và phân công', '2026-09-01', '2026-09-30', who('Lý Quốc Đạt'), [
      ['Kế hoạch triển khai AI được Trưởng ban phê duyệt', 1],
      ['Danh mục 07 nhóm công việc', 1],
      ['Phân công PIC và Lãnh đạo phụ trách', 1],
      ['Khảo sát mức độ sử dụng Copilot của cán bộ', 1],
      ['Hoàn tất cấp quyền Copilot cho cán bộ', 0]]),
    M('M2', 'Hoàn thành ứng dụng AI và prompt thử nghiệm', '2026-09-16', '2026-10-15', who('Lý Quốc Đạt'), [
      ['Mô tả 24 ứng dụng AI đủ vướng mắc', 1],
      ['Đo thời gian trước AI cho từng ứng dụng AI', 1],
      ['Prompt thử nghiệm cho 07 nhóm công việc', 0],
      ['Đo thời gian sau AI', 0],
      ['Họp đánh giá kết quả thử nghiệm', 0]]),
    M('M3', 'Thư viện Prompt v1.0', '2026-10-01', '2026-10-31', who('Vũ Ái Ngọc Bình'), [
      ['Chuẩn mẫu mô tả prompt', 1],
      ['Review chéo toàn bộ prompt', 0],
      ['Lãnh đạo Ban phê duyệt v1.0', 0],
      ['Công bố trên SharePoint của Ban', 0]]),
    M('M4', 'Phát triển Skill/workflow', '2026-11-01', '2026-11-30', who('Phùng Đình Sơn'), [
      ['Chọn ứng dụng AI đủ điều kiện lên Skill', 1],
      ['Xây dựng Skill', 0],
      ['Thử nghiệm và đo hiệu quả', 0],
      ['Tài liệu hướng dẫn sử dụng', 0]]),
    M('M5', 'Pilot Agent', '2026-12-01', '2026-12-31', who('Lý Quốc Đạt'), [
      ['Rà soát tiêu chí Agent cho các ứng dụng dự kiến', 0],
      ['Pilot Agent theo dõi chỉ đạo', 0],
      ['Đo hiệu quả pilot', 0],
      ['Báo cáo kết quả trình Lãnh đạo Ban', 0]])
  ];

  /* Mẹo sử dụng Copilot. area khớp khóa trong AIM.config.tools, thêm 'general' và 'safety'. */
  const T = (id, area, title, level, why, how, sample, avoid, source) => ({ id, area, title, level, why, how, sample: sample || '', avoid: avoid || '', source: source || 'Ban KSNB' });
  const tips = [
    T('TP-01', 'general', 'Nêu vai trò, đầu ra và giới hạn ngay trong câu lệnh', 'Cơ bản',
      'Câu lệnh chung chung cho ra văn bản chung chung. Nói rõ người viết là ai, cần đầu ra dạng gì, được dùng tài liệu nào thì kết quả bám việc hơn.',
      ['Câu 1: vai trò và bối cảnh.', 'Câu 2: đầu ra mong muốn (bảng, danh sách, độ dài).', 'Câu 3: giới hạn nguồn và cách xử lý khi thiếu dữ liệu.'],
      'Bạn là chuyên viên kiểm soát nội bộ. Đọc tệp đính kèm và lập bảng: Nội dung | Căn cứ (văn bản, điều, khoản) | Nhận xét. Chỉ dùng tài liệu đính kèm; nội dung không có trong tài liệu thì ghi "Chưa đủ căn cứ trong hồ sơ".'),
    T('TP-02', 'general', 'Trỏ tệp bằng dấu gạch chéo thay vì dán nội dung', 'Cơ bản',
      'Dán nội dung dài làm mất bố cục bảng biểu và dễ cắt ngang tài liệu. Copilot đọc trực tiếp tệp trên OneDrive hoặc SharePoint mà người dùng có quyền.',
      ['Gõ dấu / trong ô nhập rồi chọn tệp.', 'Trỏ nhiều tệp khi cần đối chiếu.', 'Tệp nằm trên máy thì tải lên OneDrive trước.'],
      'Dựa trên /Tờ trình số 123 và /Quy chế tài chính, liệt kê các nội dung vượt thẩm quyền của Ban Điều hành, ghi rõ điều khoản.'),
    T('TP-03', 'general', 'Yêu cầu dẫn vị trí trong tài liệu', 'Cơ bản',
      'Có vị trí trích dẫn thì người đọc kiểm chứng được, tránh đưa nhận định không truy được nguồn vào văn bản.',
      ['Thêm câu: ghi rõ mục, trang hoặc điều khoản cho từng ý.', 'Rà lại vài trích dẫn ngẫu nhiên trước khi dùng.'],
      'Với mỗi nhận xét, ghi kèm mục và trang trong tờ trình. Không nêu ý nào không chỉ được vị trí.'),
    T('TP-04', 'general', 'Chia việc lớn thành nhiều lượt hỏi', 'Cơ bản',
      'Một câu lệnh yêu cầu vừa tóm tắt, vừa đối chiếu, vừa kết luận thường ra kết quả nông ở cả ba phần.',
      ['Lượt 1: tóm tắt hoặc trích dữ liệu.', 'Lượt 2: đối chiếu với quy định.', 'Lượt 3: lập bảng vấn đề cần làm rõ.', 'Giữ nguyên cuộc hội thoại để Copilot nhớ bối cảnh.'],
      ''),
    T('TP-05', 'general', 'Cho phép Copilot trả lời "chưa có căn cứ"', 'Nâng cao',
      'Khi bị ép phải trả lời, mô hình có xu hướng lấp chỗ trống bằng suy đoán. Cho sẵn lối thoát sẽ giảm nội dung bịa.',
      ['Thêm câu: không tìm thấy trong tài liệu thì ghi "Chưa tìm thấy", không suy đoán.', 'Không hỏi nguyên nhân hay trách nhiệm khi tài liệu không nêu.'],
      'Nếu tài liệu không đề cập, ghi "Chưa tìm thấy trong hồ sơ". Không suy đoán nguyên nhân, không quy trách nhiệm.'),
    T('TP-06', 'general', 'Lưu lại câu lệnh đã chạy tốt', 'Cơ bản',
      'Câu lệnh tốt là tài sản dùng chung; để trong lịch sử chat thì người khác không dùng lại được.',
      ['Chạy ổn định 3 lần trở lên thì đưa vào Thư viện Prompt của Ban.', 'Ghi rõ dữ liệu đầu vào cần chuẩn bị và kết quả mong muốn.', 'Đặt phiên bản và người rà soát.'],
      ''),
    T('TP-07', 'outlook', 'Tóm tắt chuỗi thư trước khi trả lời', 'Cơ bản',
      'Vụ việc kéo dài có hàng chục thư; người tiếp nhận sau cần biết ai đã trả lời gì và việc đang chờ ai.',
      ['Mở thư, chọn tóm tắt chuỗi thư.', 'Hỏi thêm về mốc thời gian và việc còn treo.', 'Soạn thư trả lời từ bản tóm tắt, tự rà lại số liệu.'],
      'Tóm tắt chuỗi thư này theo mốc thời gian: ai gửi gì, ngày nào, việc nào đang chờ xử lý và chờ ai.'),
    T('TP-08', 'outlook', 'Soạn thư nhắc hạn với giọng trung tính', 'Cơ bản',
      'Thư nhắc của Ban gửi đơn vị cần giữ mức trung tính, nêu căn cứ và thời hạn, không nhận định.',
      ['Nêu rõ văn bản, thời hạn và nội dung cần báo cáo.', 'Yêu cầu văn phong hành chính, không dùng tính từ đánh giá.', 'Đọc lại trước khi gửi.'],
      'Soạn thư nhắc đơn vị báo cáo theo Công văn số ..., thời hạn ngày ... Văn phong hành chính, trung tính, không nhận xét về việc chậm.'),
    T('TP-09', 'teams', 'Dùng bản tóm tắt cuộc họp để giao việc', 'Cơ bản',
      'Việc giao trong họp hay rơi rụng vì biên bản làm sau vài ngày.',
      ['Bật ghi hoặc bản chép cuộc họp theo quy định nội bộ.', 'Sau họp hỏi Copilot: ai được giao việc gì, hạn nào.', 'Thư ký rà lại trước khi phát hành.'],
      'Từ nội dung cuộc họp, lập bảng: Việc cần làm | Người thực hiện | Hạn | Trích dẫn thời điểm trong cuộc họp.'),
    T('TP-10', 'teams', 'Hỏi lại phần mình vắng mặt', 'Cơ bản',
      'Vào họp muộn hoặc dự nhiều cuộc cùng giờ thì bỏ lỡ đoạn quan trọng.',
      ['Hỏi: 20 phút đầu đã thống nhất điều gì.', 'Hỏi: có nội dung nào liên quan đến Ban Kiểm soát nội bộ không.'],
      'Tôi vào họp muộn 20 phút. Tóm tắt phần đã trao đổi và nêu nội dung liên quan đến công tác kiểm soát nội bộ.'),
    T('TP-11', 'word', 'Rà soát dự thảo theo một checklist cố định', 'Nâng cao',
      'Rà tự do mỗi lần sót một kiểu. Có checklist thì kết quả giữa các người rà giống nhau.',
      ['Dán checklist vào câu lệnh hoặc trỏ tới tệp checklist.', 'Yêu cầu trả về bảng theo đúng thứ tự mục checklist.', 'Mục nào không kiểm được thì ghi rõ lý do.'],
      'Rà dự thảo theo checklist sau, trả về bảng: Mục checklist | Kết quả | Vị trí trong dự thảo. Mục nào không kiểm được thì ghi "Không đủ thông tin".'),
    T('TP-12', 'word', 'So sánh hai phiên bản văn bản', 'Cơ bản',
      'Đơn vị gửi lại bản sửa nhưng không bật theo dõi thay đổi.',
      ['Mở bản mới, trỏ tới bản cũ bằng dấu /.', 'Yêu cầu liệt kê điều khoản bị sửa, thêm, bỏ.', 'Đối chiếu lại những điều khoản quan trọng bằng mắt.'],
      'So sánh văn bản này với /bản dự thảo trước. Liệt kê theo bảng: Điều khoản | Nội dung cũ | Nội dung mới | Loại thay đổi.'),
    T('TP-13', 'excel', 'Định dạng vùng dữ liệu thành bảng trước khi hỏi', 'Cơ bản',
      'Copilot trong Excel làm việc trên bảng có tiêu đề rõ ràng; vùng dữ liệu rời rạc cho kết quả kém.',
      ['Chọn vùng dữ liệu, dùng Format as Table.', 'Đặt tên cột không viết tắt khó hiểu.', 'Bỏ dòng trống và dòng tổng cộng xen giữa.'],
      ''),
    T('TP-14', 'excel', 'Yêu cầu công thức kèm giải thích', 'Nâng cao',
      'Công thức không hiểu thì không kiểm soát được, dễ sai khi dữ liệu thay đổi.',
      ['Hỏi công thức và yêu cầu giải thích từng thành phần.', 'Yêu cầu nêu giả định của công thức.', 'Thử trên vài dòng trước khi áp cho cả bảng.'],
      'Lập công thức đánh dấu các dòng có chi phí vượt 20% so với bình quân cùng khoản mục. Giải thích công thức và nêu giả định.'),
    T('TP-15', 'ppt', 'Dựng slide từ bản Word có tiêu đề chuẩn', 'Cơ bản',
      'Copilot lấy cấu trúc slide từ hệ thống tiêu đề của tệp Word; văn bản không phân cấp tiêu đề sẽ ra slide lộn xộn.',
      ['Đặt Heading 1, Heading 2 cho báo cáo Word.', 'Bắt đầu từ mẫu slide của Ban rồi mới tạo slide từ tệp.', 'Giữ nguyên số liệu, tự chèn lại biểu đồ.'],
      'Tạo bộ slide từ /Báo cáo quý III theo cấu trúc tiêu đề của tài liệu, mỗi slide một thông điệp, giữ nguyên số liệu.'),
    T('TP-16', 'sp', 'Làm sạch thư viện trước khi dựng agent hỏi đáp', 'Nâng cao',
      'Agent trả lời theo tài liệu có trong thư viện. Thư viện còn bản hết hiệu lực thì câu trả lời dẫn sai căn cứ.',
      ['Tách thư mục còn hiệu lực và hết hiệu lực.', 'Gắn nhãn số hiệu, ngày ban hành cho từng tệp.', 'Đặt giới hạn: luôn dẫn số hiệu, điều, khoản.', 'Thử 20 câu hỏi thường gặp trước khi mở cho cả Ban.'],
      ''),
    T('TP-17', 'chat', 'Kiểm tra phạm vi dữ liệu trước khi hỏi', 'Cơ bản',
      'Copilot Chat có chế độ làm việc với dữ liệu nội bộ và chế độ chỉ tra cứu công khai; kết quả khác nhau.',
      ['Xem chế độ đang bật trước khi hỏi việc nội bộ.', 'Việc liên quan tài liệu nội bộ thì hỏi trong ứng dụng Microsoft 365 hoặc trỏ tệp.', 'Không dán nội dung tài liệu mật ra ngoài môi trường được duyệt.'],
      ''),
    T('TP-18', 'safety', 'Người ký vẫn chịu trách nhiệm về nội dung', 'Cơ bản',
      'Copilot là công cụ soạn thảo, không phải nguồn căn cứ. Số liệu và trích dẫn phải đối chiếu lại tài liệu gốc.',
      ['Đối chiếu mọi số liệu với hồ sơ gốc trước khi trình.', 'Kiểm tra số hiệu, ngày ban hành của văn bản được dẫn.', 'Không đưa nhận định do công cụ sinh ra vào văn bản khi chưa có căn cứ.'],
      ''),
    T('TP-19', 'safety', 'Chỉ dùng dữ liệu trong phạm vi được phép', 'Cơ bản',
      'Copilot truy cập được nội dung mà tài khoản người dùng có quyền; chia sẻ tệp rộng thì phạm vi truy cập cũng rộng theo.',
      ['Kiểm tra quyền truy cập thư mục trước khi trỏ tệp.', 'Tài liệu mật xử lý theo quy định nội bộ, không đưa ra công cụ ngoài.', 'Không tải kết quả có dữ liệu nội bộ lên dịch vụ ngoài.'],
      ''),
    /* Mẹo rút từ kho NotebookLM về Microsoft 365 Copilot (52 nguồn), cần kiểm tra lại
       tính năng nào đã bật trong môi trường M365 của PVEP trước khi phổ biến. */
    T('TP-20', 'general', 'Viết câu lệnh theo khung GCSE: Mục tiêu - Bối cảnh - Nguồn - Yêu cầu', 'Cơ bản',
      'Bốn thành phần này trả lời đủ các câu hỏi Copilot cần; thiếu một phần là kết quả lệch.',
      ['Goal: nêu việc cần làm.', 'Context: vai trò và bối cảnh nghiệp vụ.', 'Source: trỏ tệp hoặc nêu nguồn dữ liệu.', 'Expectation: định dạng, độ dài, văn phong.'],
      'Bạn là chuyên viên kiểm soát nội bộ. Phân tích bảng cân đối trong /BaoCaoTaiChinh_Q3.xlsx để chỉ ra 03 biến động chi phí bất thường lớn nhất. Trình bày bảng 4 cột: Khoản mục | Mức biến động | Vị trí số liệu | Nội dung cần làm rõ. Dưới bảng tóm tắt không quá 150 từ.',
      'Câu lệnh kiểu "phân tích tệp này giúp tôi" cho ra kết quả chung chung.', 'NotebookLM'),
    T('TP-21', 'excel', 'Excel Agent Mode dựng bảng phân tích và biểu đồ', 'Nâng cao',
      'Agent Mode tự tạo sheet mới, lập PivotTable và vẽ biểu đồ thay vì chỉ trả lời trong khung chat.',
      ['Mở tệp Excel trên OneDrive hoặc SharePoint.', 'Bấm Copilot trên dải lệnh, mở Tools và chuyển sang Agent Mode.', 'Mô tả yêu cầu bằng tiếng Việt thông thường.', 'Kiểm tra lại công thức và số liệu agent tạo ra.'],
      'Đọc tệp chi phí này, tạo sheet mới lập bảng theo dõi chi phí theo đơn vị, tính trung bình động 03 tháng và vẽ biểu đồ cơ cấu chi phí.',
      'Chạy trên vùng dữ liệu thô chưa định dạng bảng (Ctrl+T) hoặc tệp chưa lưu trên OneDrive/SharePoint.', 'NotebookLM'),
    T('TP-22', 'excel', 'Hàm =COPILOT() xử lý hàng loạt trong bảng tính', 'Nâng cao',
      'Dùng như một hàm Excel: phân loại, tóm tắt, gắn nhãn cho cả cột dữ liệu.',
      ['Nhập =COPILOT("câu lệnh xử lý", tham_chiếu_ô) vào ô trống.', 'Nhấn Enter, kiểm tra kết quả ô đầu tiên.', 'Kéo công thức xuống cả cột.', 'Rà lại các dòng khác thường trước khi dùng số.'],
      '=COPILOT("Phân loại kiến nghị này thành Rủi ro cao, trung bình hoặc thấp; chỉ trả về một trong ba mức", D2)',
      'Sai dấu ngoặc kép hoặc trỏ nhầm ô làm hàm trả lỗi #VALUE!.', 'NotebookLM'),
    T('TP-23', 'ppt', 'PowerPoint Agent dựng bộ slide từ tệp báo cáo', 'Nâng cao',
      'Agent bám theo tệp đính kèm và bộ nhận diện, ra slide sát tài liệu hơn so với tạo slide từ mô tả.',
      ['Trong Copilot Chat gõ @PowerPoint hoặc mở PowerPoint Agent.', 'Đính kèm tệp báo cáo bằng dấu /.', 'Chọn mẫu trình bày của đơn vị.', 'Trả lời câu hỏi của agent về đối tượng nghe và số slide.'],
      '@PowerPoint Tạo bộ 10 slide tóm tắt /BaoCaoKiemToan2026.docx, dùng mẫu trình bày của Ban, tập trung vào danh mục rủi ro vận hành.',
      'Không đính kèm tệp nguồn, agent sẽ dựng slide từ kiến thức chung thay vì tài liệu của đơn vị.', 'NotebookLM'),
    T('TP-24', 'word', 'Word Agent Mode dựng bản thảo báo cáo theo cấu trúc cho trước', 'Nâng cao',
      'Nêu sẵn cấu trúc thì bản thảo bám đúng bố cục báo cáo của đơn vị.',
      ['Mở tài liệu Word, mở khung Copilot, chuyển Agent Mode.', 'Trỏ tới tệp ghi chú hoặc slide cuộc họp bằng dấu /.', 'Liệt kê cấu trúc: tiêu đề, tóm tắt, bảng biểu, kết luận.'],
      'Dựng bản thảo báo cáo từ /KetQuaKiemTra.pptx: mở đầu là tóm tắt, sau đó 03 nội dung chính, chuyển phần phương án xử lý thành bảng 3 cột, kết thúc bằng các việc tiếp theo.',
      'Yêu cầu sửa cả tài liệu mà không bôi đen đoạn cần sửa, dễ hỏng định dạng phần khác.', 'NotebookLM'),
    T('TP-25', 'agentst', 'Workflows Agent tự động hóa việc lặp lại', 'Nâng cao',
      'Mô tả luồng bằng lời: khi có sự kiện gì thì làm gì; agent tự dựng luồng để người dùng duyệt.',
      ['Mở Workflows Agent trong ứng dụng Copilot.', 'Nêu rõ sự kiện kích hoạt và hành động.', 'Đọc lại giả định luồng agent tự đặt ra trước khi lưu.', 'Luôn để bước con người duyệt trước khi gửi ra ngoài.'],
      'Khi có thư đến chứa từ khóa "kiểm soát nội bộ", tóm tắt nội dung, soạn sẵn thư trả lời gửi vào hòm thư của tôi để duyệt, không gửi thẳng cho người gửi.',
      'Để agent tự gửi thư ra ngoài, hoặc tạo luồng đọc chính thư nó sinh ra gây lặp vô tận.', 'NotebookLM'),
    T('TP-26', 'agentst', 'Prompt Coach chỉnh lại câu lệnh trước khi chạy', 'Cơ bản',
      'Đưa ý tưởng thô, agent hỏi thêm vài câu rồi dựng câu lệnh đủ bốn phần GCSE.',
      ['Mở Prompt Coach trong Copilot Chat.', 'Nêu ý định và đính kèm tệp dữ liệu mẫu.', 'Trả lời câu hỏi của agent về vai trò, mục tiêu.', 'Lưu câu lệnh hoàn chỉnh vào thư viện của Ban.'],
      'Tôi cần câu lệnh phân tích bảng /HoaDon.xlsx để phát hiện khoản thanh toán trùng. Giúp tôi hoàn thiện câu lệnh.',
      '', 'NotebookLM'),
    T('TP-27', 'agentst', 'People Agent tìm người đã làm việc tương tự', 'Cơ bản',
      'Tra theo kỹ năng và dự án thay vì theo tên, dựa trên dữ liệu làm việc trong Microsoft 365.',
      ['Mở People Agent trong Copilot Chat.', 'Mô tả kỹ năng, lĩnh vực hoặc dự án cần tìm.', 'Đối chiếu lại với phân công chính thức trước khi liên hệ.'],
      'Tìm cán bộ trong Tổng Công ty đã tham gia kiểm tra công tác đấu thầu hoặc rà soát hợp đồng EPCI trong hai năm gần đây.',
      'Chỉ gõ tên riêng mà không nêu kỹ năng hay bối cảnh thì kết quả ít giá trị.', 'NotebookLM'),
    T('TP-28', 'files', 'So sánh nhiều tệp cùng lúc trên OneDrive', 'Cơ bản',
      'Chọn vài tệp rồi dùng chức năng so sánh, Copilot tự lập bảng đối chiếu.',
      ['Mở OneDrive trên trình duyệt.', 'Chọn từ 02 đến 05 tệp.', 'Bấm biểu tượng Copilot rồi chọn Compare.', 'Kiểm tra lại số liệu trong bảng đối chiếu.'],
      'So sánh số văn bản, ngày ban hành, đơn vị nhận và nội dung chính giữa các tệp đã chọn, trình bày dạng bảng.',
      'Chọn quá 05 tệp thì chức năng không chạy.', 'NotebookLM'),
    T('TP-29', 'chat', 'Copilot Vision đọc nội dung đang mở trên màn hình', 'Nâng cao',
      'Hỏi trực tiếp về tài liệu dài đang hiển thị, không cần tải tệp lên.',
      ['Mở tài liệu trên màn hình.', 'Mở ứng dụng Copilot, bật chia sẻ màn hình.', 'Đặt câu hỏi về đúng phần đang xem.', 'Đóng chia sẻ ngay khi xong.'],
      'Trong báo cáo đang mở trên màn hình, chỉ ra phần nào nói về dòng tiền và tóm tắt 03 ý chính kèm số trang.',
      'Chia sẻ cả màn hình khi đang mở tài liệu khác có nội dung nhạy cảm.', 'NotebookLM'),
    T('TP-30', 'chat', 'Copilot Notebooks gom tài liệu một chuyên đề', 'Nâng cao',
      'Gom tối đa 300 tệp, thư và cuộc họp của một việc; câu trả lời chỉ dựa trên đúng bộ nguồn đó.',
      ['Tạo notebook cho từng chuyên đề hoặc từng đoàn kiểm tra.', 'Nạp tài liệu liên quan, không nạp tràn lan.', 'Hỏi trong khung chat cạnh notebook.', 'Kiểm tra trích dẫn trước khi dùng.'],
      'Dựa trên toàn bộ tài liệu đã nạp trong notebook này, lập danh sách các nội dung cần kiểm tra về tuân thủ quy trình thu chi, mỗi nội dung ghi rõ tài liệu căn cứ.',
      'Nạp nhiều tệp không liên quan làm loãng ngữ cảnh, câu trả lời kém tập trung.', 'NotebookLM'),
    T('TP-31', 'safety', 'Bốn điều không nên làm khi dùng Copilot', 'Cơ bản',
      'Các nguồn hướng dẫn đều nhấn mạnh phần giới hạn, không chỉ phần tính năng.',
      ['Không giao hẳn việc cho công cụ: bản do AI sinh ra phải có người đối soát trước khi trình.',
       'Không gõ câu lệnh vào phần ghi chú của tài liệu; dùng khung chat riêng.',
       'Kiểm soát phân quyền: Copilot đọc được những gì tài khoản người dùng đọc được, thư mục chia sẻ rộng thì phạm vi cũng rộng theo.',
       'Gắn nhãn bảo mật và áp chính sách quản lý dữ liệu trước khi mở rộng sử dụng.'],
      '',
      'Tin vào số liệu AI trả về mà không mở lại hồ sơ gốc.', 'NotebookLM'),
    /* Rút từ notebook Copilot thứ hai (17 nguồn hướng dẫn Skill, Agent, prompt) */
    T('TP-32', 'agentst', 'Tệp Skill trong Copilot là một tệp Markdown', 'Nâng cao',
      'Skill của Copilot thực chất là tệp .md mô tả cách làm một việc; ai cũng đọc và sửa được, không cần lập trình.',
      ['Tệp gồm: tên skill, mô tả công dụng, các bước thực hiện, quy tắc và lưu ý.',
       'Tệp lưu trong thư mục Skills trên OneDrive của người dùng.',
       'Tạo bằng ứng dụng Copilot Co-work, hoặc yêu cầu Copilot viết tệp skill từ mô tả công việc.',
       'Skill của Ban nên đặt cùng một mẫu để chuyển giao được giữa các chuyên viên.'],
      'Viết cho tôi một tệp skill mô tả quy trình rà soát tờ trình: các bước, dữ liệu đầu vào, kết quả cần có và các quy tắc không được vi phạm.',
      'Viết skill quá chung; skill chỉ có ích khi ghi rõ bước và quy tắc.', 'NotebookLM'),
    T('TP-33', 'agentst', 'Agent Builder dựng agent bằng hội thoại, không cần viết mã', 'Nâng cao',
      'Tự tạo được agent riêng cho một việc lặp lại mà không phụ thuộc đơn vị công nghệ thông tin.',
      ['Mở Agent Builder trong Copilot, mô tả việc agent phải làm.',
       'Nạp tài liệu trên SharePoint hoặc tệp công việc làm nguồn tri thức.',
       'Chỉnh hướng dẫn bằng cách trò chuyện, thử vài tình huống thật.',
       'Xuất bản và chia sẻ cho nhóm khi đã chạy ổn định.'],
      'Tạo agent trả lời câu hỏi về quy trình kiểm tra giám sát, chỉ dùng tài liệu trong thư viện được chỉ định, luôn dẫn tên văn bản và điều khoản.',
      'Chia sẻ agent cho cả tổ chức khi thư viện nguồn chưa được rà soát.', 'NotebookLM'),
    T('TP-34', 'agentst', 'Các agent dựng sẵn nên dùng trước khi tự xây', 'Cơ bản',
      'Microsoft 365 có sẵn vài agent phủ đúng việc hành chính thường gặp, dùng ngay không phải dựng.',
      ['Prompt Coach: hoàn thiện câu lệnh trước khi chạy.',
       'Facilitator: chuẩn bị và ghi chép cuộc họp trong Teams.',
       'Planner Agent: chuyển tài liệu thành bảng công việc, theo dõi thời hạn.',
       'Researcher: tổng hợp thông tin từ dữ liệu Microsoft 365 và nguồn ngoài.'],
      '',
      'Dựng agent mới cho việc mà agent sẵn có đã làm được.', 'NotebookLM'),
    T('TP-35', 'sp', 'Dựng trang theo dõi số liệu ngay trên SharePoint', 'Nâng cao',
      'Từ một danh sách SharePoint, Copilot sinh được trang theo dõi có thẻ số liệu, biểu đồ và bộ lọc, số liệu lấy trực tiếp từ danh sách.',
      ['Mở danh sách SharePoint cần theo dõi, gọi Copilot.',
       'Nêu rõ trong câu lệnh là muốn trang lấy số liệu trực tiếp từ danh sách.',
       'Chỉ định thẻ số liệu, biểu đồ và bộ lọc cần có.',
       'Kiểm tra quyền truy cập danh sách trước khi chia sẻ trang.'],
      'Từ danh sách theo dõi kiến nghị này, dựng trang theo dõi lấy số liệu trực tiếp từ danh sách: thẻ tổng kiến nghị, đã hoàn thành, quá hạn; biểu đồ theo đơn vị; bộ lọc theo kỳ.',
      'Chia sẻ trang rộng hơn phạm vi người được xem danh sách gốc.', 'NotebookLM'),
    T('TP-36', 'chat', 'Đặt sẵn cách trả lời bằng Custom Instructions', 'Cơ bản',
      'Khai báo một lần, mọi cuộc trò chuyện sau đều theo đúng văn phong mình cần, không phải nhắc lại.',
      ['Vào phần cài đặt cá nhân hóa của Copilot.',
       'Ghi yêu cầu cố định: trả lời ngắn, đi thẳng vào việc, không dùng từ hoa mỹ.',
       'Với công việc của Ban nên thêm: luôn dẫn nguồn, không suy đoán khi thiếu tài liệu.'],
      'Trả lời ngắn gọn, đi thẳng vào nội dung, văn phong hành chính. Luôn dẫn tên văn bản và điều khoản. Không suy đoán khi tài liệu không đề cập.',
      '', 'NotebookLM'),
    T('TP-37', 'agentst', 'Planner Agent biến tài liệu thành bảng công việc', 'Nâng cao',
      'Kế hoạch, biên bản, thư giao việc chuyển thẳng thành đầu việc có người phụ trách và thời hạn.',
      ['Đưa tài liệu cho Planner Agent, yêu cầu lập bảng công việc.',
       'Rà lại người phụ trách và thời hạn trước khi phát hành.',
       'Xuất báo cáo tiến độ sang Word khi cần trình lãnh đạo.'],
      'Từ biên bản họp đính kèm, lập bảng công việc: đầu việc, người phụ trách, thời hạn, phần hành. Việc nào biên bản không nêu thời hạn thì để trống.',
      'Để agent tự đặt thời hạn mà tài liệu không nêu.', 'NotebookLM'),
    T('TP-38', 'general', 'Ba câu lệnh dùng được hằng tuần', 'Cơ bản',
      'Ba việc lặp lại nhiều nhất: soạn thư, lập kế hoạch tuần, đọc bảng số liệu.',
      ['Soạn thư theo khung: mục tiêu, bối cảnh, nguồn, yêu cầu trình bày.',
       'Đầu tuần: yêu cầu lập danh sách việc và thời hạn từ thư, tin nhắn, lịch trong 30 ngày qua.',
       'Với bảng số liệu: yêu cầu nêu xu hướng, điểm bất thường và việc cần kiểm tra thêm.'],
      'Dựa trên thư, tin nhắn Teams và lịch của tôi trong 30 ngày qua, lập danh sách việc cần làm tuần tới kèm thời hạn, sắp theo mức độ ưu tiên.',
      '', 'NotebookLM')
  ];

  return { groups, people, useCases, library, milestones, tips };
};
