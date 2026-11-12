# SPEC bài học CHUYÊN MÔN (vòng 2) – Tin học 7/8 KNTT, 1 file / 1 bài
Mục tiêu: web ôn thi viên chức vòng 2 (chuyên môn Tin học THCS, tự luận). Người học = giáo viên cần hiểu chắc kiến thức bài + biết soạn mục tiêu/hoạt động + trả lời tự luận + làm trắc nghiệm kiểm tra. Bài học phải RÕ RÀNG, có VÍ DỤ trực quan, DỄ NHỚ.
## Nguồn (đọc đủ trước khi viết)
- SGK KNTT trong thư mục /sessions/nifty-zen-goldberg/mnt/Tin học_SGK_bo KNTT/ (tên có dấu NFD: dùng python glob/os.walk để tìm; có thể là PDF/ảnh – đọc phần bài của bạn nếu đọc được).
- Giáo án rút gọn & từ khoá đã soạn: /sessions/nifty-zen-goldberg/mnt/outputs/thi/json/{FILE}.json và /sessions/nifty-zen-goldberg/mnt/outputs/thi/kw/{FILE}.json.
- Kế hoạch dạy học: /sessions/nifty-zen-goldberg/mnt/outputs/all/ref/KHDH_Tin{7|8}.txt; giáo án đầy đủ: /sessions/nifty-zen-goldberg/mnt/outputs/all/out/GiaoAn/Lop{7|8}/*.docx (có thể đọc bằng python-docx); năng lực AI: /sessions/nifty-zen-goldberg/mnt/outputs/all/ai/AI_{7|8}.txt.
Kiến thức phải đúng SGK/chương trình Tin học 2018; không bịa; nếu không chắc một chi tiết SGK thì nêu ở mức chung.
## Đầu ra: /sessions/nifty-zen-goldberg/mnt/Project-Luat-Quang-Bi/data/cm_parts/{FILE}.json (UTF-8) – 1 object:
{"id":"T7-B02","ten":"Bài 2. Phần mềm máy tính",
 "tomtat":[8–12 ý kiến thức chi tiết (mỗi ý 1–2 câu, **in đậm** từ khoá/khái niệm/phân loại/quy trình/số liệu)],
 "ynho":[4–5 ý CẦN NHỚ NHẤT, ngắn ≤20 chữ],
 "bang":[1–2 bảng {"tieu_de":"","cot":[],"dong":[[]]} so sánh/phân loại],
 "vidu":[3–4 {"tinh_huong":"ví dụ thực tế/ bài tập mẫu minh hoạ kiến thức (có số liệu nếu là bài toán, kèm lời giải ngắn)","ket_luan":"→ ..."}],
 "nho":[2–4 mẹo ghi nhớ (viết tắt/vần/so sánh)],
 "bay":[2–4 chỗ dễ nhầm/ dễ bị đánh lừa],
 "giaoan":[khung giáo án để thi, mỗi phần 1 chuỗi: "**Mục tiêu** – Kiến thức: ...; Năng lực: ...; Phẩm chất: ...", "**Chuẩn bị** – GV: ...; HS: ...", "**Hoạt động 1 – Mở đầu** (mục tiêu, nội dung, sản phẩm, cách tổ chức 4 bước)", "**Hoạt động 2 – Hình thành kiến thức** ...", "**Hoạt động 3 – Luyện tập** ...", "**Hoạt động 4 – Vận dụng** ...", "**Kiểm tra đánh giá** ..."],
 "ai":[2–3 ý tích hợp năng lực AI vào bài (GV dùng chatbot, HS kiểm chứng đầu ra, đạo đức AI) cụ thể],
 "cauhoi":[≥ 18 câu trắc nghiệm kiến thức bài theo chuẩn ở dưới],
 "tuluan":[3 câu tự luận đề thi vòng 2 kèm lời giải: 1 câu lí thuyết/bài toán/thuật toán về bài; 1 câu "nêu mục tiêu bài học theo chương trình 2018" hoặc "thiết kế 1 hoạt động dạy học"; 1 câu vận dụng/đánh giá/tích hợp: {"q":"Câu ... (điểm). ...","a":["ý 1","ý 2",...]}]}
## Câu trắc nghiệm (giống phần luật)
- s: {"t":"s","q":"","o":[4 phương án],"a":[idx],"e":"giải thích ngắn nêu rõ chỗ bẫy","r":"SGK Tin học 7 KNTT – Bài 2"} ; m: {"t":"m",...,"a":[≥2 đúng và < tổng]} ; f (điền chỗ trống CÓ PHƯƠNG ÁN CHỌN): {"t":"f","q":"... ____ ... ____","a":[["đáp án chỗ 1","biến thể"],["đáp án chỗ 2"]],"o":[4 phương án; mỗi phương án là list chuỗi theo thứ tự chỗ trống],"k":idx đúng,"e":"","r":""} (o[k] phải trùng một cách viết trong a ở mỗi chỗ trống; 3 phương án nhiễu khác nhau, SAI).
- Tỉ lệ ~50% s, 20% m, 30% f; vị trí đáp án đúng phân bố đều; ≥ 40% câu có bẫy kiểu đề thật (từ gần nghĩa, đổi 1 chữ, đổi số, đổi thứ tự bước thuật toán...). Câu thuật toán/bảng tính/dung lượng/nhị phân phải TÍNH ĐÚNG (chạy python kiểm). Không trùng câu.
## Kiểm tra
Cách làm: viết script python tạo file (nội dung tự viết tay). Kiểm bằng cách tạo tạm 1 file wrapper {"id":"X","ten":"x","so":"x","mota":"x","baihoc":[<object bài>]} rồi chạy: python3 /sessions/nifty-zen-goldberg/mnt/Project-Luat-Quang-Bi/tools/validate.py <wrapper> → TỔNG LỖI 0 (bỏ wrapper khỏi thư mục data/json). Báo cáo ≤3 dòng.
