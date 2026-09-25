/* ========================== SẢN PHẨM MẪU ==========================
   Sản phẩm thật mà Prompt/Skill/Agent tạo ra, để cán bộ hình dung đầu ra.
   Bố cục slide kiểm tra giám sát lấy theo bộ slide "Tóm tắt kết quả KTGS"
   của Ban. Nội dung viết lại dạng chung, mọi số liệu đều làm mờ và có
   watermark Ban Kiểm soát nội bộ - PVEP. */
AIM.views.samples = (function () {
  const U = AIM.ui, S = AIM.store;
  const { esc } = U;
  const b = v => `<b class="bl">${esc(v)}</b>`;      // số liệu cần làm mờ
  const WM = 'BAN KSNB · PVEP';

  /* ---------------- 1. Slide họp giao ban ---------------- */
  const deckGiaoBan = {
    id: 'SP-01', kind: 'deck',
    title: 'Slide họp giao ban Ban',
    madeBy: 'Copilot trong PowerPoint · Skill SK-05',
    source: 'Báo cáo tuần của chuyên viên (Word) + sổ theo dõi chỉ đạo',
    time: 'Trước AI: 2 giờ · Sau AI: 30 phút',
    foot: 'Họp giao ban tuần 39/2026',
    slides: [
      { kind: 'cover', kicker: 'BAN KIỂM SOÁT NỘI BỘ', title: 'HỌP GIAO BAN TUẦN 39/2026',
        sub: 'Kỳ báo cáo: 22/9 - 26/9/2026 · Người trình bày: Đầu mối tổng hợp' },
      { kind: 'kpi', title: 'Số liệu chính trong tuần',
        items: [['Tờ trình đã có ý kiến', '12', 'văn bản'], ['Đoàn kiểm tra đang thực hiện', '03', 'đoàn'],
                ['Kiến nghị đến hạn', '08', 'kiến nghị'], ['Chỉ đạo quá hạn', '02', 'nhiệm vụ']] },
      { kind: 'table', title: 'Tiến độ các đoàn kiểm tra giám sát',
        head: ['Đoàn kiểm tra', 'Đơn vị', 'Giai đoạn', 'Tiến độ', 'Ghi chú'],
        rows: [['Đoàn số 01', 'Đơn vị A', 'Đang kiểm tra tại đơn vị', '65%', 'Đúng tiến độ'],
               ['Đoàn số 02', 'Đơn vị B', 'Tổng hợp dự thảo báo cáo', '80%', 'Đúng tiến độ'],
               ['Đoàn số 03', 'Đơn vị C', 'Chuẩn bị đề cương', '20%', 'Chờ hồ sơ bổ sung']],
        blurCols: [3] },
      { kind: 'list', title: 'Tờ trình đã có ý kiến trong tuần',
        items: ['Tờ trình về kế hoạch thu dọn mỏ - ý kiến đã gửi trong tuần',
                'Tờ trình về phát sinh hợp đồng - đề nghị làm rõ 03 nội dung',
                'Tờ trình về trích lập quỹ - thống nhất theo đề xuất',
                'Tờ trình điều chỉnh kế hoạch - chờ hồ sơ bổ sung'] },
      { kind: 'table', title: 'Chỉ đạo đến hạn và quá hạn',
        head: ['Nguồn chỉ đạo', 'Nội dung', 'Đơn vị chủ trì', 'Hạn', 'Tình trạng'],
        rows: [['Petrovietnam', 'Báo cáo công tác kiểm soát nội bộ quý', 'Ban KSNB', '30/9/2026', 'Đang thực hiện'],
               ['HĐTV', 'Rà soát quy chế quản lý nội bộ', 'Ban KSNB', '15/10/2026', 'Đang thực hiện'],
               ['Ban Điều hành', 'Theo dõi kiến nghị sau kiểm tra', 'Các đơn vị', '20/9/2026', 'Quá hạn']],
        blurCols: [3] },
      { kind: 'ask', title: 'Nội dung xin ý kiến Lãnh đạo Ban',
        items: [['Bổ sung nhân sự cho đoàn kiểm tra', 'Đoàn đang thiếu 01 thành viên phụ trách phần tài chính.'],
                ['Thời điểm gửi báo cáo quý', 'Đề nghị Lãnh đạo Ban cho ý kiến về mốc trình.'],
                ['Phạm vi rà soát quy chế đợt này', 'Làm rõ giới hạn rà soát để phân công đúng người.']] },
      { kind: 'list', title: 'Kế hoạch tuần tới',
        items: ['Hoàn thành dự thảo báo cáo của đoàn kiểm tra',
                'Gửi ý kiến đối với các tờ trình còn tồn',
                'Rà soát danh mục kiến nghị đến hạn tháng sau',
                'Cập nhật sổ theo dõi chỉ đạo sau khi nhận báo cáo của đơn vị'] }
    ]
  };

  /* ---------------- 2. Slide tóm tắt kết quả kiểm tra giám sát ---------------- */
  const deckKTGS = {
    id: 'SP-02', kind: 'deck',
    title: 'Slide tóm tắt kết quả kiểm tra giám sát',
    madeBy: 'Copilot trong PowerPoint · Skill rà soát hồ sơ KTGS',
    source: 'Biên bản kiểm tra, hồ sơ đơn vị cung cấp, danh mục kiến nghị kỳ trước',
    time: 'Trước AI: 8 giờ · Sau AI: 3 giờ',
    foot: 'Đơn vị được kiểm tra · Kết quả KTGS 2026',
    slides: [
      { kind: 'cover2', org: 'TỔNG CÔNG TY THĂM DÒ KHAI THÁC DẦU KHÍ', unit: 'BAN KIỂM SOÁT NỘI BỘ',
        title: 'Kết quả kiểm tra giám sát tại đơn vị',
        facts: [['ĐOÀN KTGS', 'Quyết định số ...'], ['THỜI GIAN', '5 ngày làm việc'], ['KỲ KIỂM TRA', 'Năm 2025 và 2026']] },
      { kind: 'divider', no: '01', part: 'PHẦN HÀNH 01', title: 'Kiến nghị kỳ trước',
        sub: 'Tình hình thực hiện các kiến nghị đã nêu tại kỳ kiểm tra trước',
        tags: ['Đã hoàn thành', 'Tiếp tục thực hiện'] },
      { kind: 'reco', title: 'Tình hình thực hiện kiến nghị kỳ trước',
        sum: ['08', 'kiến nghị kỳ trước', [['05', 'hoàn thành'], ['03', 'tiếp tục']]],
        head: ['Nội dung kiến nghị', 'Tình hình thực hiện', 'Trạng thái'],
        rows: [['Bổ sung, hoàn thiện hồ sơ các gói thầu đã nêu tại biên bản kỳ trước', 'Đơn vị đã bổ sung hồ sơ', 'Hoàn thành'],
               ['Phối hợp thu hồi công nợ phải thu của dự án', 'Đã thu hồi phần lớn công nợ trong kỳ', 'Hoàn thành'],
               ['Lập kế hoạch mua sắm tổng thể hằng năm', 'Đã lập sau khi phê duyệt ngân sách', 'Hoàn thành'],
               ['Quản lý, lưu trữ đầy đủ hồ sơ các gói thầu', 'Một số gói thầu chưa đủ hồ sơ theo quy định', 'Tiếp tục'],
               ['Áp dụng đúng hình thức lựa chọn nhà thầu theo hạn mức', 'Còn gói thầu chưa phù hợp hạn mức', 'Tiếp tục']] },
      { kind: 'divider', no: '02', part: 'PHẦN HÀNH 02', title: 'Hệ thống văn bản quản lý nội bộ',
        sub: 'Khung pháp lý đã ban hành và các quy trình nội bộ đơn vị cần hoàn thiện',
        tags: ['Quy trình bắt buộc còn thiếu', 'Quy trình khuyến nghị bổ sung'] },
      { kind: 'obs', title: 'Văn bản quản lý nội bộ', count: '02 nội dung',
        items: [{ no: '01', head: 'Chưa ban hành quy trình mua sắm cho một số dự án', due: 'Quý IV/2026',
                  obs: 'Một số dự án vẫn áp dụng văn bản ban hành trước khi có quy trình mua sắm hiện hành và trước khi ký hợp đồng dầu khí mới.',
                  base: 'Quy trình mua sắm hiện hành · Quyết định phân cấp' },
                { no: '02', head: 'Chưa có quy trình lập chương trình hoạt động và ngân sách', due: 'Quý IV/2026',
                  obs: 'Đề nghị xem xét ban hành quy trình kèm danh mục biểu mẫu và mốc thời gian từng bước tính từ ngày trình.',
                  base: 'Quy chế quản lý kế hoạch · Phụ lục kèm theo' }] },
      { kind: 'stat', title: 'Cấp vốn so với nhu cầu giải ngân thực tế',
        groups: [['DỰ ÁN A · SỐ DƯ GÓP VỐN CUỐI THÁNG SO VỚI GIẢI NGÂN', [['324%', 'Tháng 01'], ['777%', 'Tháng 02'], ['275%', 'Tháng 03']]],
                 ['DỰ ÁN B · SỐ DƯ CẤP VỐN CUỐI KỲ SO VỚI THỰC CHI', [['395%', 'Tháng 04'], ['379%', 'Tháng 06']]]],
        note: 'Quan sát: số dư cấp vốn cuối kỳ cao hơn nhiều lần nhu cầu chi trong kỳ.' },
      { kind: 'reco', title: 'Tổng hợp kiến nghị của Đoàn kiểm tra',
        sum: ['17', 'kiến nghị kỳ này', [['06', 'thực hiện ngay'], ['11', 'theo lộ trình']]],
        head: ['Phần hành', 'Số kiến nghị', 'Thời hạn đề nghị'],
        rows: [['Văn bản quản lý nội bộ', '04', 'Quý IV/2026'],
               ['Công tác đấu thầu, mua sắm', '05', 'Ngay'],
               ['Quản lý hợp đồng và công nợ', '03', 'Quý I/2027'],
               ['Tài chính kế toán', '05', 'Ngay']],
        blurCols: [1] }
    ]
  };

  /* ---------------- 3. Dashboard theo dõi kiến nghị ---------------- */
  const dash = {
    id: 'SP-03', kind: 'dash',
    title: 'Dashboard theo dõi kiến nghị sau kiểm tra',
    madeBy: 'Copilot trên SharePoint · trang lấy số liệu trực tiếp từ danh sách',
    source: 'Danh sách theo dõi kiến nghị trên SharePoint của Ban',
    time: 'Trước AI: 5 giờ/kỳ · Sau AI: 1 giờ/kỳ',
    foot: 'Dashboard nội bộ Ban KSNB'
  };


  /* ---------------- 4. Bộ nhận diện thương hiệu ---------------- */
  const brand = {
    id: 'SP-04', kind: 'brand',
    title: 'Bộ nhận diện thương hiệu PVEP',
    madeBy: 'Copilot Chat + công cụ tạo ảnh · prompt mô tả hệ thống nhận diện',
    source: 'Logo, dải màu và mẫu tài liệu hiện hành của Tổng Công ty',
    time: 'Trước AI: 3-5 ngày thuê thiết kế · Sau AI: 1 buổi dựng bản nháp',
    foot: 'Bản nháp nội bộ · chưa phải quy định nhận diện chính thức'
  };

  const ICONS = [['Thăm dò', 'M4 20h16M7 20V9l5-4 5 4v11M10 20v-5h4v5'],
    ['Khai thác', 'M5 20h14M8 20V7l8 5v8M8 7l-3 3'],
    ['Sản xuất', 'M4 20h16V10l-5 3V10l-5 3V6H4z'],
    ['Vận hành', 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 3v2M12 19v2M3 12h2M19 12h2'],
    ['An toàn', 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z'],
    ['Môi trường', 'M12 21c5-3 8-7 8-12a8 8 0 00-16 0c0 5 3 9 8 12zM12 21V9'],
    ['Tăng trưởng', 'M4 19h16M7 19v-6M12 19V8M17 19v-9'],
    ['Hợp tác', 'M7 13l3 3 4-4 3 3M3 10h4l3-3 4 4 3-3h4'],
    ['Đổi mới', 'M9 18h6M10 21h4M12 3a6 6 0 00-3 11v2h6v-2a6 6 0 00-3-11z'],
    ['Công nghệ', 'M12 9a3 3 0 100 6 3 3 0 000-6zM12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2'],
    ['Quản trị', 'M4 19h16M6 19V9l6-4 6 4v10M10 19v-5h4v5'],
    ['Cộng đồng', 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5M17 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5M16.5 14.5c2.5.3 4 2.2 4.5 5']
  ];

  function brandHTML() {
    const sw = (hex, name) => `<div class="bsw"><i style="background:#${hex}"></i><span>${name || ('#' + hex)}</span></div>`;
    const sec = (no, t, inner) => `<section class="bsec"><h4><em>${no}</em>${t}</h4>${inner}</section>`;
    return `<div class="brandsheet">
      <header class="bhead">
        <div class="bh1"><img src="assets/logo.png" alt=""><div>
          <span>HỆ THỐNG NHẬN DIỆN THƯƠNG HIỆU</span>
          <h2>PETROVIETNAM PVEP</h2>
          <p>Tiên phong tìm kiếm thăm dò và khai thác dầu khí, vì tương lai năng lượng bền vững của Việt Nam.</p>
          <div class="bkw"><i>NĂNG LƯỢNG</i><i>TIÊN PHONG</i><i>BỀN VỮNG</i></div>
        </div></div>
        <div class="bhimg"></div>
      </header>

      ${sec('01', 'Hệ màu', `
        <div class="bgrid2">
          <div>
            <div class="blab">Màu chủ đạo</div>
            <div class="bsws">${['006838', '00843D', '00A651', '2E3192', '23286B'].map(h => sw(h)).join('')}</div>
            <div class="blab">Màu bổ trợ</div>
            <div class="bsws">${['16203A', '4B5563', '94A3B8', 'E9E6F7', 'F3F6F9'].map(h => sw(h)).join('')}</div>
            <div class="blab">Màu nhấn</div>
            <div class="bsws">${['E0982A', 'DB584E', '00B29A', '2DB36A', '7A5AF8'].map(h => sw(h)).join('')}</div>
          </div>
          <div>
            <div class="blab">Dải chuyển màu</div>
            <div class="bgr" style="background:linear-gradient(90deg,#006838,#00a651)"></div>
            <div class="bgr" style="background:linear-gradient(90deg,#00843d,#2e3192)"></div>
            <div class="bgr" style="background:linear-gradient(90deg,#23286b,#7a5af8)"></div>
            <div class="blab">Tỷ lệ dùng màu</div>
            <div class="buse">
              <div><b style="--c:#006838;--p:70">70%</b><span>Màu doanh nghiệp</span></div>
              <div><b style="--c:#2e3192;--p:20">20%</b><span>Thông tin</span></div>
              <div><b style="--c:#E0982A;--p:10">10%</b><span>Nhấn</span></div>
            </div>
          </div>
        </div>`)}

      ${sec('02', 'Chữ và số', `
        <div class="btyp">
          <div><span class="blab">Tiêu đề</span><b class="bt1">Be Vietnam Pro</b><i>Bold / SemiBold</i></div>
          <div><span class="blab">Văn bản</span><b class="bt2">Be Vietnam Pro Regular</b><i>14-15px · dòng 1,55</i></div>
          <div><span class="blab">Số liệu</span><b class="bt3">12,8 · 9,4 · 98%</b><i>Chữ số đều bề ngang</i></div>
        </div>
        <p class="bnote">Bản nháp đề xuất phông Sora cho tiêu đề. Sora chưa có đủ bộ dấu tiếng Việt nên bản dùng nội bộ chuyển sang Be Vietnam Pro.</p>`)}

      ${sec('03', 'Ngôn ngữ hình ảnh', `
        <div class="bvis">
          <div class="bimg"></div>
          <div class="bprin">
            ${[['Chân thực', 'Hình ảnh thật tại công trình, không dàn dựng'],
               ['Tiên phong', 'Góc nhìn hướng tới, thể hiện công nghệ'],
               ['Bền vững', 'Tôn trọng con người và môi trường'],
               ['Tin cậy', 'An toàn, hiệu quả, đúng cam kết']]
              .map(([t, d]) => `<div><b>${t}</b><span>${d}</span></div>`).join('')}
          </div>
        </div>`)}

      ${sec('04', 'Bộ biểu tượng', `
        <div class="bicons">${ICONS.map(([n, d]) => `<div><svg viewBox="0 0 24 24"><path d="${d}"/></svg><span>${n}</span></div>`).join('')}</div>`)}

      ${sec('05', 'Hoa văn và mô típ', `
        <div class="bpat">
          <div class="bp bp1"><span>Mô típ logo</span></div>
          <div class="bp bp2"><span>Sóng năng lượng</span></div>
          <div class="bp bp3"><span>Đường đồng mức</span></div>
          <div class="bp bp4"><span>Lưới điểm dữ liệu</span></div>
        </div>`)}

      ${sec('06', 'Lưới và giãn cách', `
        <div class="bgrid2">
          <div><div class="blab">Thang giãn cách</div>
            <div class="bsp">${[4, 8, 16, 24, 32, 64].map(v => `<div><i style="height:${v}px"></i><span>${v}</span></div>`).join('')}</div></div>
          <div><div class="blab">Bo góc</div>
            <div class="brad">${[4, 8, 12, 16].map(v => `<div><i style="border-radius:${v}px"></i><span>${v}px</span></div>`).join('')}</div></div>
        </div>`)}

      ${sec('07', 'Thành phần giao diện', `
        <div class="bui">
          <div><span class="blab">Nút</span><div class="bbtns"><b class="p">Nút chính</b><b class="s">Nút phụ</b><b class="t">Nút chữ</b></div></div>
          <div><span class="blab">Thẻ trạng thái</span><div class="bchips"><i class="g">Đã duyệt</i><i class="a">Thử nghiệm</i><i class="n">Dự thảo</i></div></div>
          <div><span class="blab">Thanh tiến độ</span><div class="bprog"><u style="width:78%"></u></div><span class="bsm">78%</span></div>
          <div><span class="blab">Biểu đồ nhỏ</span><div class="bspark">${[40, 62, 35, 78, 55, 90].map(v => `<i style="height:${v}%"></i>`).join('')}</div></div>
        </div>`)}

      <footer class="bfoot"><img src="assets/logo.png" alt=""><span>Bản nháp nội bộ phục vụ thống nhất cách trình bày tài liệu của Ban. Chưa thay thế quy định nhận diện của Tổng Công ty.</span></footer>
    </div>`;
  }

  const samples = [deckKTGS, brand, dash, deckGiaoBan];   // Bộ nhận diện đưa lên vị trí thứ 2 (thay chỗ Slide họp giao ban)
  let cur = 0;

  /* ================= vẽ từng loại trang ================= */
  function slideHTML(sl, foot) {
    const wm = `<div class="wm">${WM}</div>`;
    if (sl.kind === 'cover') {
      return `<div class="sl cover">${wm}
        <div class="lg"><img src="assets/logo.png" alt=""></div>
        <div class="kk">${esc(sl.kicker)}</div><h2>${esc(sl.title)}</h2>
        <div class="sb">${esc(sl.sub)}</div></div>`;
    }
    if (sl.kind === 'cover2') {
      return `<div class="sl cover2">${wm}
        <div class="c2h"><img src="assets/logo.png" alt=""><div><b>${esc(sl.org)}</b><span>${esc(sl.unit)}</span></div></div>
        <h2>${esc(sl.title)}</h2>
        <div class="c2f">${sl.facts.map(([k, v]) => `<div><em>${esc(k)}</em>${b(v)}</div>`).join('')}</div></div>`;
    }
    if (sl.kind === 'divider') {
      return `<div class="sl divi">${wm}
        <div class="dvno">${esc(sl.no)}</div>
        <div class="dvb"><span>${esc(sl.part)}</span><h2>${esc(sl.title)}</h2><p>${esc(sl.sub)}</p>
          <div class="dvt">${sl.tags.map(t => `<i>${esc(t)}</i>`).join('')}</div></div></div>`;
    }
    const head = `<div class="slh"><span class="u">${esc(foot || '')}</span><h3>${esc(sl.title)}</h3></div>`;
    let body = '';
    if (sl.kind === 'kpi') {
      body = `<div class="slkpi">${sl.items.map(([l, v, u]) => `<div><span>${esc(l)}</span>${b(v)}<i>${esc(u)}</i></div>`).join('')}</div>`;
    } else if (sl.kind === 'table' || sl.kind === 'reco') {
      const sum = sl.sum ? `<div class="slsum"><div class="n">${b(sl.sum[0])}<span>${esc(sl.sum[1])}</span></div>
        ${sl.sum[2].map(([n, l]) => `<div class="p">${b(n)}<span>${esc(l)}</span></div>`).join('')}</div>` : '';
      body = sum + `<table class="sltb"><thead><tr>${sl.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${sl.rows.map(r => `<tr>${r.map((c, i) => `<td${/Hoàn thành|Tiếp tục|Ngay/.test(c) ? ' class="st"' : ''}>${(sl.blurCols || []).includes(i) ? b(c) : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    } else if (sl.kind === 'list') {
      body = `<ul class="sllist">${sl.items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
    } else if (sl.kind === 'ask') {
      body = `<div class="slask">${sl.items.map(([t, d], i) => `<div><em>${String(i + 1).padStart(2, '0')}</em><div><h4>${esc(t)}</h4><p>${esc(d)}</p></div></div>`).join('')}</div>`;
    } else if (sl.kind === 'obs') {
      body = `<div class="slobs">${sl.items.map(o => `<div class="ob">
        <div class="obh"><em>${esc(o.no)}</em><h4>${esc(o.head)}</h4><span class="due">${esc(o.due)}</span></div>
        <div class="obr"><i>QUAN SÁT</i><p>${esc(o.obs)}</p></div>
        <div class="obr"><i>CĂN CỨ</i><p>${b(o.base)}</p></div></div>`).join('')}</div>`;
    } else if (sl.kind === 'stat') {
      body = `<div class="slstat">${sl.groups.map(([t, vals]) => `<div><em>${esc(t)}</em>
        <div class="sv">${vals.map(([v, l]) => `<div>${b(v)}<span>${esc(l)}</span></div>`).join('')}</div></div>`).join('')}
        <p class="note">${esc(sl.note)}</p></div>`;
    }
    return `<div class="sl">${wm}${head}<div class="slb">${body}</div>
      <div class="slf"><span>${esc(foot || '')}</span><span>Tài liệu nội bộ</span></div></div>`;
  }

  /* Dashboard mẫu: một trang duy nhất */
  function dashHTML() {
    const bars = [['Đơn vị A', 72], ['Đơn vị B', 55], ['Đơn vị C', 38], ['Bộ máy điều hành', 22]];
    const rows = [['KN-026', 'Hoàn thiện hồ sơ gói thầu', 'Đơn vị A', '30/9/2026', 'Quá hạn'],
                  ['KN-031', 'Ban hành quy trình mua sắm dự án', 'Đơn vị B', '15/10/2026', 'Đang thực hiện'],
                  ['KN-034', 'Đối chiếu công nợ nội bộ', 'Đơn vị A', '31/10/2026', 'Đang thực hiện'],
                  ['KN-038', 'Rà soát định mức chi phí', 'Đơn vị C', '20/9/2026', 'Quá hạn']];
    return `<div class="sl dash"><div class="wm">${WM}</div>
      <div class="dsh"><div><span class="u">Ban Kiểm soát nội bộ</span><h3>Theo dõi kiến nghị sau kiểm tra</h3></div>
        <div class="dfil"><span>Kỳ: Năm 2026</span><span>Đơn vị: Tất cả</span></div></div>
      <div class="dkpi">
        ${[['Tổng kiến nghị', '124'], ['Đã hoàn thành', '78'], ['Đang thực hiện', '34'], ['Quá hạn', '12']]
          .map(([l, v], i) => `<div class="${i === 3 ? 'red' : ''}"><span>${esc(l)}</span>${b(v)}</div>`).join('')}
      </div>
      <div class="dmid">
        <div class="dcard"><em>Tỷ lệ hoàn thành theo đơn vị</em>
          ${bars.map(([l, v]) => `<div class="dbar"><span>${esc(l)}</span><i><u style="width:${v}%"></u></i>${b(v + '%')}</div>`).join('')}</div>
        <div class="dcard"><em>Kiến nghị theo phần hành</em>
          <div class="ddon">${[['Đấu thầu', 34, '#00843d'], ['Tài chính', 28, '#2e3192'], ['Hợp đồng', 22, '#0a7e8c'], ['Khác', 16, '#E0982A']]
            .map(([l, v, c]) => `<div><i style="background:${c}"></i><span>${esc(l)}</span>${b(v)}</div>`).join('')}</div></div>
      </div>
      <div class="dcard"><em>Kiến nghị cần theo dõi</em>
        <table class="sltb"><thead><tr><th>Mã</th><th>Nội dung</th><th>Đơn vị</th><th>Hạn</th><th>Trạng thái</th></tr></thead>
        <tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i === 4 ? ' class="st"' : ''}>${i === 3 ? b(c) : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      </div>`;
  }

  const pageHTML = (sp, i) => sp.kind === 'dash' ? dashHTML() : sp.kind === 'brand' ? brandHTML() : slideHTML(sp.slides[i], sp.foot);
  const pages = sp => sp.slides ? sp.slides.length : 1;

  function viewer(sp) {
    const n = pages(sp);
    const p = U.modal({
      wide: true, title: esc(sp.title),
      sub: `<span>${esc(sp.madeBy)}</span><span class="faint">Số liệu giả lập, đã làm mờ</span>`,
      body: `<div class="deck" id="deck">${pageHTML(sp, cur)}</div>
        <div class="deckbar">
          ${n > 1 ? `<button class="btn sm" data-prev>‹ Trang trước</button><span id="deckn">${cur + 1} / ${n}</span><button class="btn sm" data-next>Trang sau ›</button>` : '<span class="faint">01 trang</span>'}
          <span class="sp" style="flex:1"></span>
          <label class="blurtoggle"><input type="checkbox" id="blurOff"> Bỏ làm mờ số liệu</label>
        </div>`,
      foot: `<button class="btn" data-close>Đóng</button>`
    });
    const draw = () => {
      U.$('#deck', p).innerHTML = pageHTML(sp, cur);
      const d = U.$('#deckn', p); if (d) d.textContent = (cur + 1) + ' / ' + n;
      U.$('#deck', p).classList.toggle('noblur', U.$('#blurOff', p).checked);
    };
    p.addEventListener('click', e => {
      if (e.target.closest('[data-prev]')) { cur = (cur - 1 + n) % n; draw(); }
      if (e.target.closest('[data-next]')) { cur = (cur + 1) % n; draw(); }
    });
    p.addEventListener('change', e => { if (e.target.id === 'blurOff') U.$('#deck', p).classList.toggle('noblur', e.target.checked); });
    const key = e => {
      if (!document.body.contains(p)) return document.removeEventListener('keydown', key);
      if (e.key === 'ArrowRight') { cur = (cur + 1) % n; draw(); }
      if (e.key === 'ArrowLeft') { cur = (cur - 1 + n) % n; draw(); }
    };
    document.addEventListener('keydown', key);
  }

  function render(el) {
    el.innerHTML = `
      <div class="phd"><div><h2>Sản phẩm tạo bởi Copilot</h2>
        <div class="meta">${samples.length} sản phẩm · số liệu giả lập, đã làm mờ · có watermark Ban KSNB</div></div></div>
      <div class="spgrid">${samples.map(sp => `
        <div class="spc" data-id="${sp.id}">
          <div class="spthumb">${pageHTML(sp, 0)}</div>
          <div class="spmeta">
            <h4>${esc(sp.title)}</h4>
            <div class="kv">
              <span>Tạo bằng</span><div>${esc(sp.madeBy)}</div>
              <span>Dữ liệu vào</span><div>${esc(sp.source)}</div>
              <span>Thời gian</span><div>${esc(sp.time)}</div>
              <span>Dung lượng</span><div>${pages(sp)} trang</div>
            </div>
            <button class="btn primary" data-open="${sp.id}">Xem sản phẩm</button>
          </div>
        </div>`).join('')}
      </div>`;
    el.addEventListener('click', e => {
      const c = e.target.closest('[data-id],[data-open]');
      if (!c) return;
      cur = 0; viewer(samples.find(x => x.id === (c.dataset.open || c.dataset.id)));
    });
  }

  function open(id) { const sp = samples.find(x => x.id === id); if (sp) { cur = 0; viewer(sp); } }

  return { title: 'Sản phẩm tạo bởi Copilot', menu: 'Sản phẩm tạo bởi Copilot', count: () => samples.length, render, open, samples };
})();
