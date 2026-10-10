### Sử sụng API

#### Phim mới cập nhật  
GET https://${domain}/api/films/phim-moi-cap-nhat?page=${page}  
Ví dụ: https://${domain}/api/films/phim-moi-cap-nhat?page=1

Lưu ý: `items` được sắp xếp theo `modified` giảm dần (phim vừa cập nhật lên đầu). Quan sát này đúng cho mọi endpoint danh sách khác bên dưới (`danh-sach`, `the-loai`, `quoc-gia`, `nam-phat-hanh`), **trừ** `search` (xem lưu ý riêng ở mục Tìm kiếm phim). Có thể tận dụng để polling/đồng bộ incremental — dừng lấy thêm trang khi gặp `modified` cũ hơn lần sync trước.

#### Phim theo danh mục
GET https://${domain}/api/films/danh-sach/${slug}?page=${page}
Ví dụ: https://${domain}/api/films/danh-sach/phim-dang-chieu?page=1

Lưu ý: response có thêm field `cat` ở cấp ngoài (ngang hàng `items`), dạng `{ "name", "title", "slug" }`, mô tả nhóm/danh mục đang lọc. Field này (và cách dùng tương tự) cũng xuất hiện ở `the-loai`, `quoc-gia`, `nam-phat-hanh` bên dưới, nhưng **không có** ở `phim-moi-cap-nhat` và `search`.

#### Thông tin Phim & Danh sách tập phim
GET https://${domain}/api/film/${slug}  
Ví dụ: https://${domain}/api/film/hoa-thien-cot

Response gồm object `movie` với các field cơ bản giống endpoint danh sách (`name`, `slug`, `description`, `total_episodes`, `current_episode`, `quality`, `language`, `director`, `casts`...), kèm thêm field `category` — object chứa thông tin phân loại theo từng nhóm. `movie` cũng có thêm field `id` (khác với các item trong endpoint danh sách thường — vốn không có `id`); vẫn nên dùng `slug` làm khoá chính, `id` chỉ mang tính tham khảo nội bộ.

```json
"category": {
  "1": { "group": { "name": "Định dạng" }, "list": [{ "name": "Phim bộ" }] },
  "2": { "group": { "name": "Thể loại" }, "list": [{ "name": "..." }, ...] },
  "3": { "group": { "name": "Năm" }, "list": [{ "name": "2017" }] },
  "4": { "group": { "name": "Quốc gia" }, "list": [{ "name": "Nhật Bản" }] }
}
```

Lưu ý: key số (`"1"`, `"2"`...) không cố định thứ tự nhóm — nên lặp qua `Object.values(category)` và dùng `group.name` để xác định đúng nhóm (Định dạng/Thể loại/Năm/Quốc gia) thay vì dựa vào key.

> Response thực tế còn có field `episodes` chứa danh sách tập phim — README này chỉ tài liệu hóa phần metadata phân loại, không mô tả cấu trúc phần phát video.

#### Phim theo thể loại
GET https://${domain}/api/films/the-loai/${slug}?page=${page}  
Ví dụ: https://${domain}/api/films/the-loai/hanh-dong?page=1

`cat` ví dụ thực tế (`the-loai/phim-hai`): `{ "name": "Hài", "title": "Phim Hài", "slug": "phim-hai" }` — `title` thường có tiền tố "Phim", `name` là tên ngắn dùng hiển thị tag/badge.

#### Phim theo quốc gia
GET https://${domain}/api/films/quoc-gia/${slug}?page=${page}  
Ví dụ: https://${domain}/api/films/quoc-gia/au-my?page=1

`cat` ví dụ thực tế (`quoc-gia/nhat-ban`): `{ "name": "Japan", "title": "Nhật Bản", "slug": "nhat-ban" }` — `name` là tên tiếng Anh, `title` là tên tiếng Việt hiển thị. Đây cũng là cách gián tiếp xác thực slug quốc gia (xem bảng ở mục Cấu trúc Menu — slug `nhat-ban` đã được xác nhận đúng qua field này).

#### Phim theo năm
GET https://${domain}/api/films/nam-phat-hanh/${slug}?page=${page}  
Ví dụ: https://${domain}/api/films/nam-phat-hanh/2024?page=1

`cat` ví dụ thực tế (`nam-phat-hanh/2018`): `{ "name": "2018", "title": "2018", "slug": "2018" }`.

#### Tìm kiếm phim
GET https://${domain}/api/films/search?keyword=${slug}  
Ví dụ: https://${domain}/api/films/search?keyword=Regeneration

Lưu ý:
- Khác với các endpoint danh sách khác, mỗi item trong kết quả tìm kiếm có thêm field `id` (string dạng mã hóa, ví dụ `eyJpdiI6...`). Field này không dùng để điều hướng — tiếp tục dùng `slug` làm khoá chính.
- Thứ tự `items` **không** sắp xếp theo `modified` giảm dần như các endpoint danh sách khác (xem lưu ý ở mục "Phim mới cập nhật") — không nên dựa vào thứ tự kết quả tìm kiếm để suy luận phim nào mới hơn.

### Cấu trúc Menu (Header)

Menu chính nằm trong nút hamburger, mở dạng drawer trượt từ trái, gồm các mục:

- TV shows
- Phim lẻ
- Phim bộ
- Đang chiếu
- Thể loại (accordion, xem danh sách bên dưới)
- Quốc gia (accordion, xem danh sách bên dưới)
- Năm (accordion, xem danh sách bên dưới)

Mỗi nhóm Thể loại / Quốc gia / Năm hoạt động theo kiểu accordion — chỉ mở 1 nhóm tại một thời điểm, bấm lại để thu gọn.

#### Danh sách Thể loại
Dùng với endpoint `GET /api/films/the-loai/${slug}`

| Tên hiển thị | Slug |
|---|---|
| Hành Động | hanh-dong |
| Phiêu Lưu | phieu-luu |
| Hoạt Hình | hoat-hinh |
| Hài | phim-hai |
| Hình Sự | hinh-su |
| Tài Liệu | tai-lieu |
| Chính Kịch | chinh-kich |
| Gia Đình | gia-dinh |
| Giả Tưởng | gia-tuong |
| Lịch Sử | lich-su |
| Kinh Dị | kinh-di |
| Nhạc | phim-nhac |
| Bí Ẩn | bi-an |
| Lãng Mạn | lang-man |
| Khoa Học Viễn Tưởng | khoa-hoc-vien-tuong |
| Gây Cấn | gay-can |
| Chiến Tranh | chien-tranh |
| Tâm Lý | tam-ly |
| Tình Cảm | tinh-cam |
| Cổ Trang | co-trang |
| Miền Tây | mien-tay |
| Phim 18+ | phim-18 |  

#### Danh sách Quốc gia
Dùng với endpoint `GET /api/films/quoc-gia/${slug}`

| Tên hiển thị | Slug (suy ra, cần xác thực) |
|---|---|
| Âu Mỹ | au-my |
| Anh | anh |
| Trung Quốc | trung-quoc |
| Indonesia | indonesia |
| Việt Nam | viet-nam |
| Pháp | phap |
| Hồng Kông | hong-kong |
| Hàn Quốc | han-quoc |
| Nhật Bản | nhat-ban |
| Thái Lan | thai-lan |
| Đài Loan | dai-loan |
| Nga | nga |
| Hà Lan | ha-lan |
| Philippines | philippines |
| Ấn Độ | an-do |
| Quốc gia khác | quoc-gia-khac |

#### Danh sách Năm
Dùng với endpoint `GET /api/films/nam-phat-hanh/${slug}`, slug là năm dạng số (2004 → 2026).

### Cấu trúc Response chung

Mọi endpoint danh sách (phim mới, theo danh mục, thể loại, quốc gia, năm, **và cả tìm kiếm**) trả về cùng một schema:

\`\`\`json
{
  "status": "success",
  "paginate": {
    "current_page": 1,
    "total_page": 1644,
    "total_items": 32877,
    "items_per_page": 10
  },
  "items": [ ... ]
}
\`\`\`

Mỗi object trong `items` có các field sau:

| Field | Kiểu | Ghi chú |
|---|---|---|
| `name` | string | Tên tiếng Việt |
| `slug` | string | Dùng làm key/route, nên ưu tiên hơn `name` vì luôn unique |
| `original_name` | string | Tên gốc |
| `thumb_url`, `poster_url` | string | URL ảnh |
| `created`, `modified` | string (ISO 8601) | Thời gian tạo / cập nhật |
| `description` | string | Mô tả |
| `total_episodes` | number | Tổng số tập |
| `current_episode` | string | Không cố định format — có thể là `"Tập N"`, `"Hoàn tất (X/X)"`, hoặc `"FULL"` |
| `time` | string | Thời lượng mỗi tập |
| `quality` | string | Ví dụ `"HD"` |
| `language` | string | `"Vietsub"` hoặc `"Lồng Tiếng"` |
| `director` | string \| null | **Có thể null**, cần xử lý fallback |
| `casts` | string \| null | **Có thể null**, là 1 string nối bằng dấu phẩy, không phải array |

Lưu ý: response **không có field `country`/`format`** dù UI cần hiển thị cột Quốc gia và Định dạng — 2 giá trị này phải tự suy luận phía client (`format` suy từ `total_episodes`, `country` hiện chưa có nguồn dữ liệu trực tiếp từ endpoint danh sách).

### Lưu ý khi gọi API

- Luôn bọc `try/catch` quanh mọi lệnh gọi API và kiểm tra `data.status === "success"` trước khi đọc `items`, vì response lỗi vẫn có thể trả về HTTP 200.
- Trang cuối có thể trả `items: []` nếu vượt quá `total_page` — không nên giả định luôn có dữ liệu.

### Quy ước UI đã thống nhất

- Menu hamburger: drawer trượt từ phải, 3 nhóm Thể loại/Quốc gia/Năm hoạt động kiểu accordion, **chỉ mở 1 nhóm tại một thời điểm**.
- Phân trang: hiển thị 2 nút điều hướng trang trước và tiếp theo, nút `1, 2, 3, ..., n-1, n`, vị trí "..." khi bấm sẽ chuyển thành input số để nhập trang cần tới (không dùng dropdown hay modal riêng).