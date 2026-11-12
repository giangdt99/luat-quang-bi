# SPEC ngân hàng câu hỏi ôn thi viên chức GV THCS (phần luật)
Mục tiêu: web ôn thi gồm bài học + câu hỏi luyện tập dưới mỗi bài. Đề thi thật có 3 dạng: (s) chọn 1 đáp án, (m) chọn nhiều đáp án, (f) điền chỗ trống. Đề thật hay "đánh lừa" bằng từ đồng nghĩa/gần nghĩa, đổi 1 chữ, đổi số, đổi "và/hoặc", "ít nhất/tối đa/không quá", "được/không được", "phải/có thể", đổi chủ thể, và dấu chấm/phẩy/chấm phẩy làm thay đổi phạm vi ý.
## Nguồn sự thật
Chỉ dùng thông tin trong file facts tương ứng (/sessions/nifty-zen-goldberg/mnt/outputs/thi/facts/F1_vienchuc.md, F2_giaoduc.md, F3_ungxu_dieule.md). TUYỆT ĐỐI không đặt câu hỏi dựa trên chỗ gắn [chưa xác minh] / [Thứ cấp] / mâu thuẫn nguồn; không bịa số điều. Đọc kĩ phần văn bản của mình (đọc cả các ghi chú "điểm dễ nhầm" và mục câu hỏi ôn tập tiêu biểu để lấy ý). Nếu cần, được phép dùng WebSearch/web_fetch để xác minh thêm nhưng ưu tiên facts.
## File đầu ra: /sessions/nifty-zen-goldberg/mnt/Project-Luat-Quang-Bi/data/json/{ID}.json (UTF-8)
{"id":"L3","ten":"Luật Nhà giáo 2025","so":"Luật số 73/2025/QH15","hieuluc":"01/01/2026","mota":"1-2 câu mô tả",
 "baihoc":[{"id":"L3-1","ten":"Tên bài (chủ đề)","tomtat":["ý kiến thức 1 (dùng **in đậm** cho từ khoá/con số/cụm dễ bị đánh lừa)", ... 6–14 ý, mỗi ý 1 câu, có ghi Điều/Khoản"],
  "bay":["⚠ cặp từ/ chữ hay bị đánh lừa ở bài này, vd: 'không được làm' ≠ 'hạn chế làm'; 'phải' ≠ 'có thể'", ... 2–5 ý],
  "cauhoi":[ ... ]}]}
Mỗi văn bản chia 3–6 BÀI theo chủ đề/chương cho dễ học; mỗi bài ≥ 18 câu (nên 20–28).
## Câu hỏi
- Trắc nghiệm 1 đáp án: {"t":"s","q":"...","o":["đáp án A","đáp án B","đáp án C","đáp án D"],"a":[2],"e":"giải thích ngắn: vì sao đúng + vì sao các phương án gây nhầm sai","r":"Điều 11 khoản 2 Luật Nhà giáo 2025"}
  (o KHÔNG ghi sẵn "A.", "B."; 4 phương án là chủ yếu; vị trí đáp án đúng phải phân bố đều/ngẫu nhiên 0..3)
- Nhiều đáp án: {"t":"m","q":"... (chọn tất cả đáp án đúng)","o":[4–5 phương án],"a":[0,2,3],"e":"...","r":"..."} (đúng ≥2 và < tổng số phương án)
- Điền chỗ trống: {"t":"f","q":"Nhà giáo không được ____ người học học thêm dưới ____ hình thức.","a":[["ép buộc","ép"],["mọi"]],"e":"...","r":"..."} — mỗi "____" (4 gạch dưới) là 1 chỗ trống; "a" là list theo từng chỗ trống, mỗi phần tử là list các cách viết CHẤP NHẬN (viết thường, không thừa; chỉ gộp biến thể thật sự đúng nguyên văn như số "5" / "năm"; KHÔNG chấp nhận từ đồng nghĩa nếu văn bản dùng đúng từ khác). Chỗ trống nên là từ khoá/con số/cụm ngắn (1–4 từ).
- Tỉ lệ mỗi bài: khoảng 50% s, 20% m, 30% f. 
- ≥ 40% câu phải có "bẫy" kiểu đề thật: phương án nhiễu dùng từ đồng nghĩa/gần nghĩa/chữ gần giống (vd "ít nhất" vs "tối đa", "mầm non" vs "phổ thông", "Chính phủ" vs "Thủ tướng Chính phủ", "tổ chức" vs "cá nhân"), đổi số liệu, đổi chủ thể, hoặc 1 mệnh đề trong phương án có dấu phẩy/chấm phẩy làm thêm/bớt điều kiện (câu hỏi dạng "Phát biểu nào đúng/ sai về ..."). Với dạng "đúng/sai" có thể viết phương án là câu hoàn chỉnh dài.
- Giải thích "e" nêu RÕ chỗ bẫy khi có. "r" = nguồn: tên văn bản + Điều/khoản (chỉ khi đã xác minh; nếu chỉ biết điều thì ghi điều).
- Không trùng câu; không hỏi về thông tin chưa xác minh; câu hỏi phải có đúng 1 đáp án rõ ràng (hoặc đúng tập đáp án với m). Tiếng Việt chuẩn, dấu đầy đủ.
## Kiểm tra
Chạy: python3 /sessions/nifty-zen-goldberg/mnt/Project-Luat-Quang-Bi/tools/validate.py /sessions/nifty-zen-goldberg/mnt/Project-Luat-Quang-Bi/data/json/{ID}.json  → phải "TỔNG LỖI 0". Sau đó tự đọc lại 15 câu ngẫu nhiên đối chiếu facts. Báo cáo cuối ≤4 dòng: số bài, số câu, chỗ nào còn không chắc.
