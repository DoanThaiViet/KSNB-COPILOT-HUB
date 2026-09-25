/* =========================================================================
   SKILL RÀ SOÁT TỜ TRÌNH & PHIẾU Ý KIẾN BAN KSNB (chi tiết)
   Nguồn: skill "ksnb-y-kien-to-trinh" và "pyk" của Ban (Bộ kính lúp kiểm soát 10 lăng kính,
   bố cục PYK 3 phần, văn phong, gu biên tập Lãnh đạo Ban). Đã bỏ phần chỉ dùng trên máy cá nhân.
   ========================================================================= */
AIM.kbPyk = [
{
"groupId": "g1",
"useCaseId": "UC-01",
"domainId": "d12",
"tag": "HĐTV/PYK",
"audience": "both",
"builderId": "",
"version": "v1.0",
"updated": "2026-09-25",
"source": "Skill Ban KSNB (ksnb-y-kien-to-trinh, pyk)",
"status": "Approved",
"id": "KS-20",
"type": "skill",
"name": "Rà soát tờ trình và ý kiến các Ban (Bộ kính lúp kiểm soát)",
"purpose": "Rà soát tờ trình/công văn TGĐ trình HĐTV và ý kiến các Ban theo \"Bộ kính lúp kiểm soát\" 10 lăng kính, lập danh mục vấn đề có căn cứ trước khi soạn Phiếu ý kiến.",
"input": "Tờ trình/CVNB và phụ lục; quy chế phân cấp thẩm quyền; ý kiến các Ban; TBKL kỳ trước; PYK nháp nếu có",
"instruction": "Bạn là chuyên viên Ban Kiểm soát nội bộ PVEP. Đọc toàn bộ tờ trình, phụ lục và ý kiến các Ban đính kèm. (1) Xác định HĐTV được đề nghị \"thông qua\" hay \"phê duyệt\" nội dung gì và đối chiếu thẩm quyền theo quy chế phân cấp đính kèm. (2) Rà soát theo 10 lăng kính: thẩm quyền và quy trình; kỳ vọng hay cam kết; trong hay vượt phạm vi đã duyệt; cơ sở định giá; tính trùng, thiếu, hai lần; đối chiếu chéo số liệu; mẫu số công thức; tác động dòng tiền; quyền cần bảo lưu; tính đầy đủ hồ sơ. (3) Lập bảng: Vấn đề | Lăng kính | Hồ sơ thể hiện (trang) | Căn cứ | Đánh giá | Cần làm rõ. (4) Liệt kê điểm còn khác quan điểm và danh sách \"Cần xác minh\". Chỉ dùng tài liệu được cung cấp; không suy diễn; chưa đủ căn cứ ghi \"Cần làm rõ\".",
"output": "Bảng vấn đề theo 10 lăng kính; điểm còn khác quan điểm; danh sách Cần xác minh; tóm tắt dễ hiểu (tùy chọn)",
"steps": [
"Đọc toàn bộ tờ trình, phụ lục, ý kiến các Ban, email giải trình. File Word của PVEP thường có tracked changes: đọc cả phần chèn mới, bỏ phần đã xóa.",
"Xác định HĐTV được đề nghị làm gì: \"thông qua\" để trình cấp trên hay \"phê duyệt\" cuối cùng.",
"Kiểm tra thẩm quyền trước tiên, đối chiếu quy chế phân cấp; kiểm tra nội dung có vượt phạm vi kế hoạch/báo cáo đầu tư đã duyệt không.",
"Quét hồ sơ bằng 10 lăng kính dưới đây, chọn lăng kính liên quan.",
"Với mỗi vấn đề ghi: hồ sơ nói gì · căn cứ · đánh giá KSNB · điểm cần làm rõ.",
"Liệt kê điểm còn khác quan điểm giữa đơn vị trình và các Ban, nêu quan điểm KSNB.",
"Tách riêng danh sách \"Cần xác minh\", không trộn vào kết luận."
],
"file": "KS-20_ra_soat_to_trinh_kinh_lup_kiem_soat.md",
"doc": "---\nname: ra_soat_to_trinh_kinh_lup_kiem_soat\ndescription: Rà soát tờ trình/công văn TGĐ trình HĐTV và ý kiến các Ban theo \"Bộ kính lúp kiểm soát\" 10 lăng kính, lập danh mục vấn đề có căn cứ trước khi soạn Phiếu ý kiến.\n---\n\n# Rà soát tờ trình và ý kiến các Ban (Bộ kính lúp kiểm soát)\n\nDùng khi nhận tờ trình/CVNB trình HĐTV cần Ban KSNB cho ý kiến. Vai trò KSNB là tham mưu độc lập cho HĐTV theo tư duy kiểm soát: rà thẩm quyền, phát hiện rủi ro và bất cập, chỉ rõ phần thiếu căn cứ. Đầu ra của Skill này là danh mục vấn đề, làm đầu vào cho Skill \"Soạn Phiếu ý kiến Ban KSNB\".\n\n## Hồ sơ cần có\n\n| Loại | Bắt buộc? | Dùng để |\n|---|---|---|\n| Tờ trình/CVNB (số, ngày) | Bắt buộc | Nguồn chính của mọi nhận định |\n| Phụ lục tính toán, bảng giá | Nên có | Soát cơ sở định giá, đối chiếu số |\n| Quy chế phân cấp thẩm quyền | Nên có | Mục Thẩm quyền; thiếu thì ghi \"cần đối chiếu\" |\n| Ý kiến các Ban khác, email giải trình | Nếu có | Tìm điểm còn khác quan điểm |\n| Hợp đồng/PSC/điều khoản dẫn chiếu | Nếu có | Kiểm tra mốc thời hạn, quyền gia hạn |\n| TBKL/phê duyệt các kỳ trước | Nếu có | Tiền lệ để dẫn chiếu |\n| PYK nháp | Nếu có | Rà trên nền nháp thay vì soạn mới |\n\n## Nguyên tắc nền\n\n- Mọi nhận định gắn với điều/khoản/quyết định/số liệu cụ thể trong hồ sơ.\n- Không suy diễn pháp lý khi không có cơ sở; chưa đủ căn cứ thì ghi \"cần làm rõ\".\n- Tách rõ điều tờ trình nói (\"Theo báo cáo, …\") với đánh giá của KSNB.\n- Chỉ rõ rủi ro, không né tránh; không làm đẹp nội dung.\n- \"Chưa thấy trong hồ sơ\" không đồng nghĩa \"không có/chưa thực hiện\".\n\n## Workflow\n\n1. Đọc toàn bộ tờ trình, phụ lục, ý kiến các Ban, email giải trình. File Word của PVEP thường có tracked changes: đọc cả phần chèn mới, bỏ phần đã xóa.\n2. Xác định HĐTV được đề nghị làm gì: \"thông qua\" để trình cấp trên hay \"phê duyệt\" cuối cùng.\n3. Kiểm tra thẩm quyền trước tiên, đối chiếu quy chế phân cấp; kiểm tra nội dung có vượt phạm vi kế hoạch/báo cáo đầu tư đã duyệt không.\n4. Quét hồ sơ bằng 10 lăng kính dưới đây, chọn lăng kính liên quan.\n5. Với mỗi vấn đề ghi: hồ sơ nói gì · căn cứ · đánh giá KSNB · điểm cần làm rõ.\n6. Liệt kê điểm còn khác quan điểm giữa đơn vị trình và các Ban, nêu quan điểm KSNB.\n7. Tách riêng danh sách \"Cần xác minh\", không trộn vào kết luận.\n\n## Bộ kính lúp kiểm soát (10 lăng kính)\n\n1. **Thẩm quyền và quy trình.** Đúng cấp quyết định chưa? Có vượt phạm vi đã duyệt không? Thời hạn pháp lý (Luật/PSC/Nghị định) còn hiệu lực, có sát hạn không? Phiên bản trước đã được cấp trên phê duyệt chưa.\n2. **Kỳ vọng hay cam kết chắc chắn.** Nguồn tiền/điều kiện còn là kỳ vọng hay đã cam kết (bồi thường bảo hiểm chưa ký Release Agreement, điều khoản \"without prejudice\", \"funded as available\"). Cảnh báo trước khi phát sinh cam kết tài chính.\n3. **Trong hay vượt phạm vi đã duyệt.** Đối chiếu FDP, TMĐT, báo cáo đầu tư góp vốn, kế hoạch đã duyệt; tách phần phát sinh mới.\n4. **Cơ sở định giá và cấu thành chi phí.** Hạng mục lớn có đơn giá, cấu thành, tham chiếu giá không? Cảnh giác khoản tỷ trọng lớn \"chưa có cấu thành chi phí\" hoặc dùng đơn giá bình quân áp đồng nhất.\n5. **Tính trùng, tính thiếu, tính hai lần.** Khoản triển khai sớm đã nằm trong tổng chưa? Chi phí đã có nguồn ở chương trình khác chưa? Có nghĩa vụ bị bỏ sót không?\n6. **Đối chiếu chéo số liệu.** So cùng hạng mục ở các văn bản khác nhau; phát hiện lệch tổng, trùng tên, số hiệu văn bản dẫn chiếu không nhất quán.\n7. **Mẫu số của công thức.** Nghĩa vụ tính theo sản lượng, trữ lượng, % giá trị hợp đồng: kiểm tra mẫu số và biến đầu vào.\n8. **Tác động dòng tiền và nghĩa vụ doanh nghiệp.** Phần chi phí không thu hồi chuyển thành nghĩa vụ của ai? Tác động dòng tiền, lợi nhuận phân phối.\n9. **Quyền và lợi ích cần bảo lưu.** Quyền truy đòi bên thứ ba, quyền bảo lưu của bên bảo hiểm; nội dung thuộc điều hành của NĐH nhưng tác động đến lợi ích góp vốn.\n10. **Tính đầy đủ và hình thức hồ sơ.** Phụ lục thiếu nội dung, thiếu revision log, dẫn chiếu số hiệu không nhất quán; nêu thành mục riêng cuối phần phân tích.\n\n## Output chuẩn\n\n- Bảng rà soát: Vấn đề | Lăng kính | Hồ sơ thể hiện (trích, trang) | Căn cứ | Đánh giá KSNB | Cần làm rõ.\n- Danh sách điểm còn khác quan điểm giữa các bên.\n- Danh sách \"Cần xác minh\".\n- (Tùy chọn) Tóm tắt dễ hiểu 150–300 từ: Đây là chuyện gì · Ai xin, xin ai · Vì sao · Xin gì, bao nhiêu tiền · Vướng ở đâu · HĐTV cần quyết gì.\n\n## Prompt gọi nhanh\n\n> Bạn là chuyên viên Ban Kiểm soát nội bộ PVEP. Đọc toàn bộ tờ trình, phụ lục và ý kiến các Ban đính kèm. (1) Xác định HĐTV được đề nghị \"thông qua\" hay \"phê duyệt\" nội dung gì và đối chiếu thẩm quyền theo quy chế phân cấp đính kèm. (2) Rà soát theo 10 lăng kính: thẩm quyền và quy trình; kỳ vọng hay cam kết; trong hay vượt phạm vi đã duyệt; cơ sở định giá; tính trùng, thiếu, hai lần; đối chiếu chéo số liệu; mẫu số công thức; tác động dòng tiền; quyền cần bảo lưu; tính đầy đủ hồ sơ. (3) Lập bảng: Vấn đề | Lăng kính | Hồ sơ thể hiện (trang) | Căn cứ | Đánh giá | Cần làm rõ. (4) Liệt kê điểm còn khác quan điểm và danh sách \"Cần xác minh\". Chỉ dùng tài liệu được cung cấp; không suy diễn; chưa đủ căn cứ ghi \"Cần làm rõ\".\n\n## Human approval\n\n- AI chỉ lập danh mục vấn đề và dự thảo.\n- Cán bộ phụ trách xác nhận căn cứ, số liệu trước khi đưa vào Phiếu ý kiến.\n"
},
{
"groupId": "g1",
"useCaseId": "UC-01",
"domainId": "d12",
"tag": "HĐTV/PYK",
"audience": "both",
"builderId": "",
"version": "v1.0",
"updated": "2026-09-25",
"source": "Skill Ban KSNB (ksnb-y-kien-to-trinh, pyk)",
"status": "Approved",
"id": "KP-20",
"type": "prompt",
"name": "Rà soát tờ trình theo 10 lăng kính kiểm soát",
"purpose": "Rà soát tờ trình/công văn TGĐ trình HĐTV và ý kiến các Ban theo \"Bộ kính lúp kiểm soát\" 10 lăng kính, lập danh mục vấn đề có căn cứ trước khi soạn Phiếu ý kiến.",
"input": "Tờ trình/CVNB và phụ lục; quy chế phân cấp thẩm quyền; ý kiến các Ban; TBKL kỳ trước; PYK nháp nếu có",
"instruction": "Bạn là chuyên viên Ban Kiểm soát nội bộ PVEP. Đọc toàn bộ tờ trình, phụ lục và ý kiến các Ban đính kèm. (1) Xác định HĐTV được đề nghị \"thông qua\" hay \"phê duyệt\" nội dung gì và đối chiếu thẩm quyền theo quy chế phân cấp đính kèm. (2) Rà soát theo 10 lăng kính: thẩm quyền và quy trình; kỳ vọng hay cam kết; trong hay vượt phạm vi đã duyệt; cơ sở định giá; tính trùng, thiếu, hai lần; đối chiếu chéo số liệu; mẫu số công thức; tác động dòng tiền; quyền cần bảo lưu; tính đầy đủ hồ sơ. (3) Lập bảng: Vấn đề | Lăng kính | Hồ sơ thể hiện (trang) | Căn cứ | Đánh giá | Cần làm rõ. (4) Liệt kê điểm còn khác quan điểm và danh sách \"Cần xác minh\". Chỉ dùng tài liệu được cung cấp; không suy diễn; chưa đủ căn cứ ghi \"Cần làm rõ\".",
"output": "Bảng vấn đề theo 10 lăng kính; điểm còn khác quan điểm; danh sách Cần xác minh; tóm tắt dễ hiểu (tùy chọn)",
"skillId": "KS-20"
},
{
"groupId": "g1",
"useCaseId": "UC-02",
"domainId": "d12",
"tag": "HĐTV/PYK",
"audience": "both",
"builderId": "",
"version": "v1.0",
"updated": "2026-09-25",
"source": "Skill Ban KSNB (ksnb-y-kien-to-trinh, pyk)",
"status": "Approved",
"id": "KS-21",
"type": "skill",
"name": "Soạn Phiếu ý kiến Ban KSNB (PYK) chi tiết",
"purpose": "Soạn Phiếu ý kiến (PYK) của Ban KSNB đối với tờ trình trình HĐTV theo đúng bố cục 3 phần, câu mở và câu kết cố định, văn phong hành chính và gu biên tập của Lãnh đạo Ban.",
"input": "Danh mục vấn đề đã rà soát; số hiệu, ngày, trích yếu tờ trình; quy chế phân cấp; TBKL kỳ trước; PYK nháp nếu có",
"instruction": "Từ danh mục vấn đề đã rà soát và tờ trình đính kèm, hãy soạn thân Phiếu ý kiến Ban KSNB. Bố cục: câu mở \"Liên quan đến Công văn số … ngày … của … về việc … (sau đây gọi là \"…\"), Ban Kiểm soát nội bộ (KSNB) có ý kiến như sau:\"; 1. Về thẩm quyền (dẫn chiếu quy chế, nói rõ thông qua hay phê duyệt); 2. Các nội dung cần lưu ý (mỗi ý là gạch đầu dòng \"Về …:\", nêu hồ sơ nói gì, đánh giá KSNB, điểm cần làm rõ; yêu cầu bổ sung lồng trong từng ý); 3. Đề xuất kiến nghị (đồng ý chủ trương kèm điều kiện và mốc, ngắn gọn); câu kết \"Kính trình HĐTV xem xét, quyết định.\" Văn phong hành chính; không dùng dấu gạch ngang dài; không in đậm giữa câu; chỉ dùng câu truy được nguồn trong hồ sơ.",
"output": "Thân Phiếu ý kiến 3 phần (Thẩm quyền · Nội dung cần lưu ý · Kiến nghị) với câu mở, câu kết cố định; checklist trước khi trình ký",
"steps": [
"[ ] Câu mở đúng số hiệu, ngày, trích yếu; câu kết đúng bản chất (thông qua/phê duyệt).",
"[ ] Mục 1 Thẩm quyền đứng đầu, có dẫn chiếu quy chế.",
"[ ] Mỗi nhận định ở mục 2 có căn cứ (điều, khoản, trang, số liệu).",
"[ ] Kiến nghị ngắn, có điều kiện và mốc.",
"[ ] Không còn ký tự \"—\", \"–\"; không bold giữa câu; không đoạn rỗng, không bullet trống.",
"[ ] PYK nháp: không còn nhãn tiểu mục bị xóa sót (đoạn bắt đầu bằng \":\"), câu cụt, \"Số:\" thiếu khoảng trắng, ngày tháng sai.",
"[ ] Cán bộ phụ trách và Lãnh đạo Ban đã duyệt nội dung trước khi điền mẫu Word."
],
"file": "KS-21_soan_phieu_y_kien_ban_ksnb.md",
"doc": "---\nname: soan_phieu_y_kien_ban_ksnb\ndescription: Soạn Phiếu ý kiến (PYK) của Ban KSNB đối với tờ trình trình HĐTV theo đúng bố cục 3 phần, câu mở và câu kết cố định, văn phong hành chính và gu biên tập của Lãnh đạo Ban.\n---\n\n# Soạn Phiếu ý kiến Ban KSNB (PYK)\n\nDùng sau khi đã rà soát tờ trình (Skill \"Rà soát tờ trình và ý kiến các Ban\"). Đầu ra là thân Phiếu ý kiến, copy vào mẫu PYK của Ban để trình ký.\n\n## Đầu vào\n\n- Danh mục vấn đề đã rà soát (bảng vấn đề, căn cứ, đánh giá).\n- Số hiệu, ngày, trích yếu tờ trình/công văn.\n- Quy chế phân cấp thẩm quyền; TBKL/phê duyệt các kỳ trước (để dẫn tiền lệ).\n- PYK nháp nếu có (sửa trên nền nháp).\n\n## Bố cục bắt buộc (3 phần)\n\n**Câu mở (cố định):**\n> Liên quan đến Công văn số [số hiệu] ngày [...] của [đơn vị trình] về việc [trích yếu] (sau đây gọi là \"[tên gọi tắt]\"), Ban Kiểm soát nội bộ (KSNB) có ý kiến như sau:\n\n**1. Về thẩm quyền** (luôn đặt đầu tiên)\n- Phân định cấp có thẩm quyền đối với từng nội dung, dẫn chiếu quy chế phân cấp cụ thể; tách tiểu mục nếu nhiều loại nội dung (1.1 Công tác thầu; 1.2 CTHĐ&NS…).\n- Kiểm tra nội dung phát sinh có vượt phạm vi kế hoạch/báo cáo đầu tư đã duyệt không; nếu vượt, thẩm quyền đẩy lên cấp cao hơn.\n- Dùng đúng bản chất quyết định: HĐTV \"thông qua\" chủ trương khác \"phê duyệt\"; nói rõ khi tờ trình chỉ là bước thông qua để trình cấp trên.\n\n**2. Các nội dung cần lưu ý** (phần phân tích chính)\n- Mỗi tiểu mục là một gạch đầu dòng \"-\" có nhãn \"Về …:\" và xử lý một vấn đề.\n- Mỗi tiểu mục nêu: hồ sơ nói gì (\"Theo báo cáo, …\", \"Theo nội dung tại TT …\") → đánh giá của KSNB → điểm cần làm rõ/kiểm soát.\n- Yêu cầu bổ sung lồng ngay trong tiểu mục (\"tờ trình nên bổ sung đánh giá cụ thể về …\"), không tách danh sách dài.\n- Dẫn tiền lệ phê duyệt các kỳ trước (số TBKL + ngày + phạm vi).\n- Tính đầy đủ và hình thức hồ sơ để thành tiểu mục cuối.\n\n**3. Đề xuất kiến nghị**\n- Mặc định \"đồng ý chủ trương kèm điều kiện ràng buộc\".\n- Mỗi gạch đầu dòng là một kiến nghị gắn điều kiện và mốc cụ thể (\"trước khi ký Phụ lục hợp đồng\", \"trước khi trình BCT\").\n- Kiến nghị ngắn; Lãnh đạo Ban thường cắt danh sách dài \"đề nghị Ban Điều hành thực hiện…\".\n- Có thể giao đầu mối kiểm soát việc tiếp thu.\n\n**Câu kết (cố định):**\n> Kính trình HĐTV xem xét, quyết định.\n\n(hoặc khi là bước thông qua: \"Với các nội dung nêu trên, kính đề nghị HĐTV xem xét, thông qua …\")\n\n## Khung mục 3 tham khảo\n\n> Trên cơ sở phân tích trên, Ban KSNB kiến nghị HĐTV xem xét [thông qua/phê duyệt] theo hướng đồng ý chủ trương kèm điều kiện ràng buộc:\n> - [Đồng ý nội dung A] với [trần/phạm vi cụ thể]. Yêu cầu [đơn vị] [điều kiện] trước [mốc].\n> - [Đối với nội dung B]: đồng ý ghi nhận với [nguồn dự kiến]. Yêu cầu [đơn vị] trình lại [hồ sơ còn thiếu] trước khi [ký kết/triển khai].\n> - Rà soát và báo cáo HĐTV [các phát sinh] so với [kế hoạch/TMĐT đã duyệt].\n> - Giao [Ban…] kiểm soát việc hoàn thiện hồ sơ, thống nhất số liệu trước khi trình cấp trên.\n\n## Văn phong (bắt buộc)\n\n- Hành chính nhà nước, ngắn gọn, trung tính; không ngôi thứ nhất kiểu bình luận.\n- Không dùng dấu gạch ngang dài (— hoặc –) để nối câu.\n- Chỉ in đậm tiêu đề mục (1., 2., 3.); không bôi đậm giữa câu.\n- Không dùng từ dẫn kiểu blog (\"Hệ quả:\", \"Mấu chốt:\", \"Điểm đáng chú ý là\").\n- Không dùng nhịp \"không phải X mà là Y\", \"không chỉ… mà còn\".\n- Không kết luận lạc quan chung chung.\n- Dùng \"là/cần/đề nghị/yêu cầu\"; câu khẳng định trực tiếp.\n\n## Checklist trước khi trình ký\n\n- [ ] Câu mở đúng số hiệu, ngày, trích yếu; câu kết đúng bản chất (thông qua/phê duyệt).\n- [ ] Mục 1 Thẩm quyền đứng đầu, có dẫn chiếu quy chế.\n- [ ] Mỗi nhận định ở mục 2 có căn cứ (điều, khoản, trang, số liệu).\n- [ ] Kiến nghị ngắn, có điều kiện và mốc.\n- [ ] Không còn ký tự \"—\", \"–\"; không bold giữa câu; không đoạn rỗng, không bullet trống.\n- [ ] PYK nháp: không còn nhãn tiểu mục bị xóa sót (đoạn bắt đầu bằng \":\"), câu cụt, \"Số:\" thiếu khoảng trắng, ngày tháng sai.\n- [ ] Cán bộ phụ trách và Lãnh đạo Ban đã duyệt nội dung trước khi điền mẫu Word.\n\n## Prompt gọi nhanh\n\n> Từ danh mục vấn đề đã rà soát và tờ trình đính kèm, hãy soạn thân Phiếu ý kiến Ban KSNB. Bố cục: câu mở \"Liên quan đến Công văn số … ngày … của … về việc … (sau đây gọi là \"…\"), Ban Kiểm soát nội bộ (KSNB) có ý kiến như sau:\"; 1. Về thẩm quyền (dẫn chiếu quy chế, nói rõ thông qua hay phê duyệt); 2. Các nội dung cần lưu ý (mỗi ý là gạch đầu dòng \"Về …:\", nêu hồ sơ nói gì, đánh giá KSNB, điểm cần làm rõ; yêu cầu bổ sung lồng trong từng ý); 3. Đề xuất kiến nghị (đồng ý chủ trương kèm điều kiện và mốc, ngắn gọn); câu kết \"Kính trình HĐTV xem xét, quyết định.\" Văn phong hành chính; không dùng dấu gạch ngang dài; không in đậm giữa câu; chỉ dùng câu truy được nguồn trong hồ sơ.\n\n## Human approval\n\n- AI chỉ dự thảo thân văn bản.\n- Cán bộ phụ trách báo cáo nội dung đánh giá cho Lãnh đạo Ban duyệt trước khi điền mẫu Word và trình ký.\n"
},
{
"groupId": "g1",
"useCaseId": "UC-02",
"domainId": "d12",
"tag": "HĐTV/PYK",
"audience": "both",
"builderId": "",
"version": "v1.0",
"updated": "2026-09-25",
"source": "Skill Ban KSNB (ksnb-y-kien-to-trinh, pyk)",
"status": "Approved",
"id": "KP-21",
"type": "prompt",
"name": "Dự thảo thân Phiếu ý kiến Ban KSNB",
"purpose": "Soạn Phiếu ý kiến (PYK) của Ban KSNB đối với tờ trình trình HĐTV theo đúng bố cục 3 phần, câu mở và câu kết cố định, văn phong hành chính và gu biên tập của Lãnh đạo Ban.",
"input": "Danh mục vấn đề đã rà soát; số hiệu, ngày, trích yếu tờ trình; quy chế phân cấp; TBKL kỳ trước; PYK nháp nếu có",
"instruction": "Từ danh mục vấn đề đã rà soát và tờ trình đính kèm, hãy soạn thân Phiếu ý kiến Ban KSNB. Bố cục: câu mở \"Liên quan đến Công văn số … ngày … của … về việc … (sau đây gọi là \"…\"), Ban Kiểm soát nội bộ (KSNB) có ý kiến như sau:\"; 1. Về thẩm quyền (dẫn chiếu quy chế, nói rõ thông qua hay phê duyệt); 2. Các nội dung cần lưu ý (mỗi ý là gạch đầu dòng \"Về …:\", nêu hồ sơ nói gì, đánh giá KSNB, điểm cần làm rõ; yêu cầu bổ sung lồng trong từng ý); 3. Đề xuất kiến nghị (đồng ý chủ trương kèm điều kiện và mốc, ngắn gọn); câu kết \"Kính trình HĐTV xem xét, quyết định.\" Văn phong hành chính; không dùng dấu gạch ngang dài; không in đậm giữa câu; chỉ dùng câu truy được nguồn trong hồ sơ.",
"output": "Thân Phiếu ý kiến 3 phần (Thẩm quyền · Nội dung cần lưu ý · Kiến nghị) với câu mở, câu kết cố định; checklist trước khi trình ký",
"skillId": "KS-21"
}
];
(function () {
  const base = AIM.seed;
  AIM.seed = function () {
    const d = base();
    AIM.kbPyk.forEach(x => { const u = d.useCases.find(c => c.id === x.useCaseId);
      d.library.push({ ...x, reviewerId: u ? u.ownerId : '', leadId: u ? u.leadId : '', deadline: '' }); });
    return d;
  };
})();
