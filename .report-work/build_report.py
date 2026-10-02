from pathlib import Path
from copy import deepcopy
from docx import Document
from docx.shared import Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(r"E:\Ecommerce")
WORK = ROOT / ".report-work"
SOURCE = WORK / "template-reference.docx"
OUTPUT = ROOT / "Bao_cao_thuc_tap_Nhom_3_Noshop.docx"
ASSETS = WORK / "assets"
FONT = Path(r"C:\Windows\Fonts\arial.ttf")

def font(size, bold=False):
    path = r"C:\Windows\Fonts\arialbd.ttf" if bold else str(FONT)
    return ImageFont.truetype(path, size)

def box(draw, xy, title, body="", fill="#EAF2F8"):
    x1,y1,x2,y2 = xy
    draw.rounded_rectangle(xy, radius=18, fill=fill, outline="#1F4E79", width=3)
    draw.multiline_text((x1+20,y1+16), title, font=font(30, True), fill="#17365D", spacing=5)
    if body:
        draw.multiline_text((x1+20,y1+62), body, font=font(22), fill="#222222", spacing=5)

def arrow(draw, start, end):
    draw.line([start,end], fill="#1F4E79", width=5)
    x,y=end; draw.polygon([(x,y),(x-18,y-10),(x-18,y+10)], fill="#1F4E79")

def diagram(name, title, boxes, arrows):
    path = ASSETS / name
    im = Image.new("RGB", (1500, 900), "white")
    d = ImageDraw.Draw(im)
    d.text((50,28), title, font=font(40, True), fill="#17365D")
    for item in boxes: box(d,*item)
    for a in arrows: arrow(d,*a)
    im.save(path, quality=95)
    return path

def make_diagrams():
    ASSETS.mkdir(exist_ok=True)
    diagram("architecture.png", "Kiến trúc tổng thể hệ thống noshop", [
        ((60,160,330,310), "Người dùng", "Buyer | Seller | Admin"),
        ((440,160,720,310), "Next.js 15", "React 19, App Router\nTailwind CSS"),
        ((830,160,1110,310), "Express API", "JWT, Mongoose, Multer"),
        ((1220,160,1450,310), "MongoDB 7", "User, Product, Order..."),
        ((520,500,980,665), "Triển khai", "Nginx reverse proxy\nDocker Compose | HTTPS")],
        [((330,235),(440,235)),((720,235),(830,235)),((1110,235),(1220,235)),((970,310),(820,500))])
    diagram("usecase.png", "Tác nhân và chức năng chính", [
        ((70,150,340,300), "Buyer", "Tìm kiếm, giỏ hàng\nĐặt hàng, đánh giá"),
        ((70,470,340,620), "Seller", "Quản lý sản phẩm\nXử lý đơn, doanh thu"),
        ((70,710,340,860), "Admin", "Người dùng, danh mục\nToàn sàn, thống kê"),
        ((540,250,1200,650), "Nền tảng noshop", "Đăng ký / đăng nhập JWT\nSản phẩm, danh mục, đơn hàng\nReview, upload hình ảnh, dashboard")],
        [((340,225),(540,330)),((340,545),(540,450)),((340,785),(540,560))])
    diagram("domain.png", "Mô hình dữ liệu MongoDB", [
        ((70,140,360,300), "User", "role: admin | seller | buyer\nshop, isActive"),
        ((570,100,900,275), "Product", "category, seller, stock\nrating, images, sold"),
        ((1120,140,1430,300), "Category", "name, slug, image"),
        ((570,520,900,720), "Order", "buyer, items, shippingAddress\npayment, status, total"),
        ((1120,520,1430,680), "Review", "product, buyer\nrating, comment")],
        [((360,210),(570,180)),((900,180),(1120,210)),((360,250),(570,590)),((900,610),(1120,600)),((360,270),(1120,610))])
    diagram("order_flow.png", "Luồng tạo đơn hàng", [
        ((50,300,280,440), "Buyer", "Giỏ hàng"), ((350,300,630,440), "Checkout", "Địa chỉ, phương thức"),
        ((700,300,1000,440), "POST /api/orders", "Kiểm tra tồn kho"), ((1080,300,1450,440), "MongoDB", "Trừ tồn, tạo Order")],
        [((280,370),(350,370)),((630,370),(700,370)),((1000,370),(1080,370))])
    diagram("auth_flow.png", "Xác thực và phân quyền", [
        ((70,300,340,440), "Đăng nhập", "email + mật khẩu"), ((450,300,720,440), "Auth API", "bcryptjs.verify"),
        ((830,300,1080,440), "JWT", "Hiệu lực 7 ngày"), ((1190,300,1450,440), "Middleware", "protect + authorize")],
        [((340,370),(450,370)),((720,370),(830,370)),((1080,370),(1190,370))])
    diagram("deployment.png", "Kiến trúc triển khai", [
        ((70,320,310,470), "Internet", "Cloudflare DNS"), ((410,320,650,470), "Nginx", "80 / 443 TLS"),
        ((750,190,1040,340), "Frontend", "Next.js :3000"), ((750,500,1040,650), "Backend", "Express :5000"),
        ((1140,500,1430,650), "MongoDB", "Container :27017")],
        [((310,395),(410,395)),((650,350),(750,265)),((650,440),(750,575)),((1040,575),(1140,575))])
    diagram("dashboard.png", "Không gian làm việc theo vai trò", [
        ((100,260,480,560), "Buyer", "Trang chủ | Sản phẩm\nGiỏ hàng | Thanh toán\nĐơn hàng | Đánh giá"),
        ((570,260,950,560), "Seller", "Dashboard | Sản phẩm\nTạo/sửa/xóa | Đơn shop\nDoanh thu và số lượng bán"),
        ((1040,260,1420,560), "Admin", "Dashboard toàn sàn\nNgười dùng | Danh mục\nĐơn hàng | Thống kê")], [])

def clear_para(p, text=""):
    for child in list(p._p):
        if child.tag != qn('w:pPr'):
            p._p.remove(child)
    if text:
        p.add_run(text)

def set_para(p, text, align=None):
    clear_para(p, text)
    if align is not None: p.alignment = align

def remove_body_drawings(p):
    for drawing in list(p._p.xpath('.//w:drawing')):
        drawing.getparent().remove(drawing)

def add_image(p, image, width=6.25):
    clear_para(p)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(str(image), width=Inches(width))

def set_cell(cell, value):
    p = cell.paragraphs[0]
    set_para(p, str(value))
    for extra in cell.paragraphs[1:]: clear_para(extra)

def fill_table(table, rows):
    for r, values in enumerate(rows):
        for c, value in enumerate(values):
            if r < len(table.rows) and c < len(table.rows[r].cells): set_cell(table.rows[r].cells[c], value)
    for r in range(len(rows), len(table.rows)):
        for c in range(len(table.rows[r].cells)): set_cell(table.rows[r].cells[c], "")

make_diagrams()
doc = Document(SOURCE)
paras = list(doc.paragraphs)

# Preserve the cover system and only replace its editable words.
set_para(paras[12], "ĐỀ TÀI: XÂY DỰNG NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ ĐA VAI TRÒ NOSHOP", WD_ALIGN_PARAGRAPH.CENTER)
set_para(paras[13], "Website thương mại điện tử đa gian hàng với Buyer, Seller và Admin", WD_ALIGN_PARAGRAPH.CENTER)

text_map = {
17:"GIỚI THIỆU NHÓM THỰC HIỆN",
18:"Nhóm thực hiện đề tài gồm 05 thành viên. Công việc được chia theo các module có trong source code: kiến trúc và triển khai, giao diện người dùng, xác thực và phân quyền, quản lý sản phẩm - danh mục, đơn hàng - đánh giá và kiểm thử.",
19:"Bảng 0.1. Phân công công việc nhóm", 23:"Bảng 0.2. Kế hoạch thực hiện dự án trong 06 tuần",
25:"CHƯƠNG 1. GIỚI THIỆU ĐỀ TÀI", 26:"1.1. Lý do chọn đề tài",
27:"Thương mại điện tử cần đồng thời phục vụ trải nghiệm mua sắm, vận hành gian hàng và quản trị toàn sàn. Với yêu cầu đó, nhóm xây dựng noshop, một nền tảng đa vai trò cho phép Buyer tìm và mua sản phẩm, Seller vận hành gian hàng, còn Admin giám sát dữ liệu toàn hệ thống.",
28:"Đề tài tập trung vào một ứng dụng web hiện đại có frontend tách biệt với REST API, dữ liệu MongoDB và mô hình phân quyền rõ ràng. Cách tổ chức này phù hợp để mở rộng chức năng, triển khai bằng container và kiểm thử các luồng nghiệp vụ quan trọng.",
29:"Phiên bản hiện tại hỗ trợ danh mục, tìm kiếm và lọc sản phẩm, giỏ hàng phía client, đặt hàng, hai phương thức thanh toán COD/chuyển khoản, đánh giá, dashboard và quản lý theo ba vai trò.",
30:"1.2. Mục tiêu của đề tài",
31:"Mục tiêu là xây dựng nền tảng noshop vận hành được với các luồng nghiệp vụ cốt lõi của sàn thương mại điện tử và có thể triển khai thực tế bằng Docker.",
32:"Xây dựng giao diện responsive bằng Next.js 15, React 19, TypeScript và Tailwind CSS.",
33:"Xây dựng REST API bằng Node.js, Express và TypeScript; tổ chức theo route, controller, middleware và model.",
34:"Thiết kế MongoDB với các collection User, Category, Product, Order và Review; dùng Mongoose để quản lý schema và quan hệ tham chiếu.",
35:"Cung cấp luồng buyer: tìm kiếm, lọc, xem chi tiết, giỏ hàng, checkout, theo dõi đơn và đánh giá sản phẩm.",
36:"Cung cấp kênh Seller và Admin: quản lý sản phẩm, danh mục, người dùng, đơn hàng và số liệu dashboard.",
37:"1.3. Phạm vi của đề tài",
38:"Phạm vi source gồm xác thực JWT, phân quyền admin/seller/buyer, upload ảnh, CRUD danh mục và sản phẩm, đơn hàng có kiểm tra tồn kho, review, thống kê admin/seller và giao diện riêng theo vai trò.",
39:"Chức năng hiện chưa triển khai đầy đủ gồm cổng thanh toán tích hợp với nhà cung cấp thực, vận chuyển kết nối đối tác, thông báo thời gian thực, mã khuyến mại được lưu ở backend và kiểm thử tự động ở mức unit/integration.",
40:"1.4. Đối tượng sử dụng hệ thống", 41:"Bảng 1.1. Đối tượng sử dụng hệ thống",
43:"1.5. Công nghệ sử dụng", 44:"Bảng 1.2. Công nghệ sử dụng",
46:"1.6. Kiến trúc tổng thể của hệ thống",
47:"Hệ thống được tách thành frontend Next.js và backend Express. Trình duyệt gọi API qua Axios; Express xử lý nghiệp vụ, middleware xác thực JWT và phân quyền, sau đó Mongoose truy cập MongoDB. Khi triển khai, Nginx định tuyến / tới frontend, /api và /uploads tới backend.",
48:"Mô hình xử lý tổng quát: Browser → Next.js/React → REST API Express → Mongoose → MongoDB.",
50:"Hình 1.1. Kiến trúc tổng thể hệ thống noshop", 52:"1.7. Ý nghĩa thực tiễn của đề tài",
53:"Đề tài giúp nhóm vận dụng kiến thức phân tích yêu cầu, thiết kế dữ liệu, lập trình full-stack TypeScript, bảo mật JWT, xây dựng trải nghiệm người dùng, triển khai Docker/Nginx và kiểm thử luồng nghiệp vụ trên một sản phẩm có thể truy cập qua môi trường staging.",
62:"CHƯƠNG 2. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", 63:"2.1. Tổng quan phân tích hệ thống",
64:"noshop xử lý giao dịch giữa người mua và người bán trên cùng một nền tảng. Các đối tượng chính được phân quyền theo vai trò, trong đó dữ liệu sản phẩm, đơn hàng và đánh giá được liên kết qua ObjectId trong MongoDB.",
65:"2.2. Tác nhân của hệ thống", 66:"Bảng 2.1. Tác nhân của hệ thống", 68:"2.3. Yêu cầu chức năng", 69:"Bảng 2.2. Yêu cầu chức năng",
71:"2.4. Yêu cầu phi chức năng", 72:"Mật khẩu được băm bằng bcryptjs trước khi lưu trữ; JWT được ký với thời hạn 7 ngày.", 73:"Middleware protect và authorize giới hạn API theo vai trò; Seller chỉ thao tác trên dữ liệu thuộc gian hàng của mình.", 74:"MongoDB 7 chạy riêng trong Docker volume để duy trì dữ liệu; backend kiểm tra trạng thái kết nối qua /api/health.", 75:"Upload chỉ chấp nhận ảnh jpeg/jpg/png/webp/gif với dung lượng tối đa 5 MB.", 76:"Giao diện Next.js dùng TypeScript, Tailwind CSS, context cho Auth/Cart/Toast và đáp ứng tốt trên trình duyệt hiện đại.",
77:"2.5. Sơ đồ Use Case tổng quát", 79:"Hình 2.1. Tác nhân và các chức năng chính của noshop",
80:"Các use case quan trọng gồm đăng ký, đăng nhập, cập nhật hồ sơ, tìm kiếm/lọc sản phẩm, giỏ hàng, checkout, xử lý đơn, đánh giá và các nghiệp vụ quản trị/seller.",
81:"2.6. Đặc tả Use Case tiêu biểu", 82:"Bảng 2.3. Đặc tả Use Case tiêu biểu", 84:"2.7. Sơ đồ lớp và mô hình dữ liệu", 87:"Hình 2.2. Mô hình collection và quan hệ tham chiếu", 88:"Các collection chính là User, Category, Product, Order và Review. Product tham chiếu Category và Seller; Order chứa các OrderItem, tham chiếu Buyer; Review gắn với Product và Buyer.",
89:"2.8. Sơ đồ tuần tự", 91:"Hình 2.3. Luồng tạo đơn hàng", 93:"Khi checkout, backend xác thực người dùng, kiểm tra từng sản phẩm và tồn kho, giảm stock, tăng sold, tính tổng tiền, tạo Order và trả kết quả cho client.", 95:"Hình 2.4. Luồng xác thực và phân quyền", 97:"Khi đăng nhập thành công, backend ký JWT chứa id người dùng. Các API cần bảo vệ đọc Bearer token, lấy người dùng đang hoạt động và kiểm tra role trước khi thực hiện nghiệp vụ.", 100:"Hình 2.5. Luồng triển khai dịch vụ", 101:"Docker Compose chạy các container mongodb, backend và frontend. Nginx reverse proxy nhận HTTPS, chuyển tiếp các đường dẫn phù hợp và giới hạn kích thước request upload.",
102:"2.9. Thiết kế cơ sở dữ liệu", 104:"Hình 2.6. Sơ đồ dữ liệu lõi của noshop", 106:"Bảng 2.4. Các collection dữ liệu", 108:"2.10. Từ điển dữ liệu", 109:"Bảng 2.5. Từ điển dữ liệu", 111:"Giỏ hàng được quản lý ở frontend qua CartContext và localStorage. Khi đặt hàng, danh sách item được gửi tới API để backend xác thực lại giá, sản phẩm và tồn kho trước khi ghi Order.",
129:"CHƯƠNG 3. XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG", 130:"3.1. Tổng quan frontend", 131:"Frontend đặt tại frontend/src/app theo Next.js App Router. Các trang công khai gồm trang chủ, sản phẩm, chi tiết, giỏ hàng, checkout, đăng nhập và đăng ký; các vùng /seller và /admin có layout riêng.", 132:"Các component dùng chung gồm Navbar, Footer và ProductCard. AuthContext lưu phiên người dùng, CartContext điều phối giỏ hàng, ToastContext hiển thị thông báo; lib/api.ts cấu hình Axios và interceptor đính kèm token.",
133:"3.2. Cấu trúc frontend", 134:"Bảng 3.1. Cấu trúc frontend", 136:"3.3. Trang chủ", 137:"Trang chủ trình bày banner, danh mục, flash sale và khu vực gợi ý. Thanh điều hướng dẫn tới sản phẩm, giỏ hàng, đăng nhập hoặc các khu vực theo vai trò.", 139:"Hình 3.1. Trang chủ noshop trên môi trường staging",
141:"3.4. Danh sách và chi tiết sản phẩm", 142:"Trang /products nhận tham số tìm kiếm và lọc, hiển thị sản phẩm qua ProductCard. Trang /products/[id] hiển thị ảnh, giá, thông tin Seller, tồn kho, đánh giá và hành động thêm vào giỏ hàng.", 144:"Hình 3.2. Trang danh sách sản phẩm", 147:"Hình 3.3. Luồng điều hướng tới chi tiết sản phẩm",
149:"3.5. Giỏ hàng và đặt hàng", 150:"CartContext duy trì các item, số lượng và tổng giá trị. Trang checkout yêu cầu địa chỉ giao hàng, chọn COD hoặc chuyển khoản, sau đó gọi POST /api/orders và làm mới giỏ hàng khi đặt thành công.", 152:"Hình 3.4. Luồng giỏ hàng", 155:"Hình 3.5. Luồng checkout", 158:"Hình 3.6. Luồng phản hồi tạo đơn", 
160:"3.6. Tài khoản và không gian theo vai trò", 161:"Người dùng đăng ký với role buyer hoặc seller. Sau đăng nhập, Buyer xem đơn hàng cá nhân; Seller quản lý dashboard, sản phẩm và đơn; Admin quản lý người dùng, danh mục, đơn và số liệu toàn sàn.", 163:"Hình 3.7. Trang đăng nhập", 166:"Hình 3.8. Phân tách không gian thao tác", 169:"Hình 3.9. Dashboard theo vai trò", 171:"Hình 3.10. Quản lý sản phẩm Seller", 174:"Hình 3.11. Quản lý người dùng Admin", 176:"Hình 3.12. Quản lý danh mục Admin", 179:"Hình 3.13. Quản lý đơn hàng", 182:"Hình 3.14. Thành phần giao diện dùng chung", 185:"Hình 3.15. API upload ảnh", 188:"Hình 3.16. Dashboard và số liệu", 189:"3.7. Backend, kiểm thử và triển khai", 190:"Backend tổ chức theo controllers, routes, models và middlewares. Các script deploy/test gồm pack_and_deploy.py, test_routes.py, test_dynamic.py, verify_sample_accounts.py và verify_live.py; chúng hỗ trợ đóng gói, triển khai và kiểm tra các luồng truy cập, CRUD, đơn hàng, đánh giá và tài khoản mẫu."
}
for idx, value in text_map.items(): set_para(paras[idx], value)

# Group members and workload.
fill_table(doc.tables[0], [
 ["STT", "Họ tên", "Mã sinh viên"], ["1", "Nguyễn Văn Toán", "B22DTCN071"], ["2", "Nguyễn Hoàng Minh", "B22DTCN065"], ["3", "Đặng Anh Hoàng", "B22DTCN061"], ["4", "Nguyễn Ngọc Huy", "B22DTCN062"], ["5", "Đào Tiến Thành", "B22DTCN073"]])
fill_table(doc.tables[1], [
 ["STT","Họ tên","MSSV","Vai trò","Công việc phụ trách","File/module liên quan","Kết quả bàn giao"],
 ["1","Nguyễn Hoàng Minh","B22DTCN065","Nhóm trưởng","Phân tích kiến trúc, tích hợp frontend-backend, Docker/Nginx, kiểm thử và tổng hợp báo cáo","README.md; deploy/*; docker-compose.yml; nginx/stg-ecom.conf","Kiến trúc, triển khai, báo cáo"],
 ["2","Nguyễn Văn Toán","B22DTCN071","Frontend Buyer","Trang chủ, sản phẩm, chi tiết, Navbar/Footer, CartContext và giao diện mua hàng","frontend/src/app; components; context/CartContext.tsx","Giao diện Buyer và giỏ hàng"],
 ["3","Đặng Anh Hoàng","B22DTCN061","Xác thực và bảo mật","Đăng ký, đăng nhập JWT, cập nhật hồ sơ, middleware protect/authorize","authController.ts; userController.ts; middlewares/auth.ts","Module tài khoản và phân quyền"],
 ["4","Nguyễn Ngọc Huy","B22DTCN062","Seller và quản trị","CRUD sản phẩm/danh mục, dashboard Seller/Admin, quản lý người dùng","product/category/stats controllers; admin/*; seller/*","Kênh Seller và Admin"],
 ["5","Đào Tiến Thành","B22DTCN073","Đơn hàng và kiểm thử","Checkout, tồn kho, trạng thái đơn, review, API test và kiểm thử luồng động","orderController.ts; reviewController.ts; deploy/test_*.py","Luồng đơn hàng, review, kiểm thử"]])
fill_table(doc.tables[2], [
 ["Tuần","Mục tiêu","TV1","TV2","TV3","TV4","TV5","Sản phẩm bàn giao"],
 ["1","Khảo sát và phạm vi","Kiến trúc/deploy","UI Buyer","Auth/JWT","Seller/Admin","Đơn/review","Phạm vi, công nghệ"],
 ["2","Phân tích thiết kế","API, MongoDB","Luồng giao diện","Role, middleware","CRUD dữ liệu","Luồng checkout","Use case, dữ liệu"],
 ["3","Xây dựng frontend","Tích hợp API","Trang buyer/cart","Login/register","Dashboard","Checkout/review","Frontend cơ bản"],
 ["4","Xây dựng backend","Docker config","Sản phẩm UI","Auth API","Product/category API","Order/review API","REST API"],
 ["5","Tích hợp","Staging/Nginx","Hoàn thiện UX","Kiểm tra quyền","Seller/Admin","Kiểm tra đơn","Bản tích hợp"],
 ["6","Kiểm thử báo cáo","Tổng hợp","Ảnh giao diện","Test tài khoản","Test CRUD","Test luồng động","Báo cáo hoàn chỉnh"]])
fill_table(doc.tables[3], [["STT","Đối tượng","Mô tả"],["1","Khách truy cập","Xem trang chủ, tìm kiếm/lọc sản phẩm, xem chi tiết, đăng ký và đăng nhập"],["2","Buyer","Dùng giỏ hàng, checkout, theo dõi đơn hàng, gửi đánh giá"],["3","Seller","Quản lý gian hàng, sản phẩm, đơn có chứa sản phẩm của shop và dashboard riêng"],["4","Admin","Quản lý người dùng, danh mục, toàn bộ đơn hàng và thống kê toàn sàn"]])
fill_table(doc.tables[4], [["STT","Công nghệ","Vai trò trong hệ thống"],["1","TypeScript","Ngôn ngữ chính cho frontend và backend"],["2","Next.js 15","Frontend App Router và build standalone"],["3","React 19","Xây dựng component và context"],["4","Tailwind CSS","Tạo giao diện responsive"],["5","Axios","Gọi API và đính kèm JWT"],["6","Node.js 22","Môi trường chạy backend"],["7","Express.js","REST API và middleware"],["8","Mongoose","Schema, validation và truy vấn MongoDB"],["9","MongoDB 7","Lưu dữ liệu nghiệp vụ"],["10","JWT + bcryptjs","Xác thực, phân quyền, băm mật khẩu"],["11","Multer","Upload ảnh sản phẩm"],["12","Docker + Nginx","Đóng gói, reverse proxy và HTTPS"]])
fill_table(doc.tables[5], [["STT","Tác nhân","Mô tả"],["1","Khách truy cập","Xem nội dung công khai, tìm kiếm và đăng ký/đăng nhập"],["2","Buyer","Mua hàng, quản lý giỏ, đơn hàng và đánh giá"],["3","Seller","Quản lý gian hàng, sản phẩm và đơn liên quan"],["4","Admin","Quản lý dữ liệu, tài khoản và số liệu sàn"]])
fill_table(doc.tables[6], [["Mã","Nhóm","Mô tả"],["F01","Sản phẩm","Danh sách, tìm kiếm toàn văn, lọc, sắp xếp, phân trang"],["F02","Sản phẩm","Xem chi tiết và sản phẩm liên quan"],["F03","Tài khoản","Đăng ký buyer/seller, đăng nhập và demo login"],["F04","Tài khoản","Xem/cập nhật hồ sơ, thông tin shop"],["F05","Giỏ hàng","Thêm, sửa số lượng, xóa và lưu localStorage"],["F06","Đơn hàng","Checkout COD/chuyển khoản, tính tổng tiền trên server"],["F07","Đơn hàng","Buyer xem lịch sử và chi tiết đơn"],["F08","Đơn hàng","Seller/Admin cập nhật trạng thái đơn"],["F09","Review","Buyer tạo và xem đánh giá sản phẩm"],["F10","Seller","Dashboard doanh thu, sản phẩm và đơn shop"],["F11","Seller","Tạo, sửa, xóa sản phẩm của shop"],["F12","Admin","Dashboard tổng quan toàn sàn"],["F13","Admin","Quản lý người dùng và trạng thái hoạt động"],["F14","Admin","CRUD danh mục"],["F15","Admin","Theo dõi toàn bộ đơn hàng"],["F16","Upload","Upload ảnh định dạng hợp lệ, giới hạn 5 MB"],["F17","Hạ tầng","Health check, Docker Compose, Nginx reverse proxy"]])
fill_table(doc.tables[7], [["Mã","Use Case","Tác nhân","Mô tả xử lý"],["UC01","Đăng ký/đăng nhập","Khách truy cập","Kiểm tra email, băm mật khẩu, tạo JWT hoặc trả lỗi xác thực"],["UC02","Tìm kiếm sản phẩm","Khách/Buyer","Nhận keyword và bộ lọc, trả dữ liệu phân trang"],["UC03","Quản lý sản phẩm","Seller/Admin","Kiểm tra quyền sở hữu; tạo, sửa hoặc xóa sản phẩm"],["UC04","Đặt hàng","Buyer","Xác thực token, kiểm tra tồn kho, trừ stock và tạo Order"],["UC05","Cập nhật trạng thái","Seller/Admin","Chỉ seller liên quan hoặc admin được đổi trạng thái đơn"],["UC06","Đánh giá","Buyer","Tạo review, cập nhật rating và numReviews của Product"],["UC07","Xem thống kê","Seller/Admin","Tổng hợp doanh thu, đơn, sản phẩm và đơn gần đây theo vai trò"]])
fill_table(doc.tables[8], [["Collection","Mô tả"],["users","Tài khoản, role, trạng thái và thông tin shop Seller"],["categories","Danh mục với name, slug, mô tả và ảnh"],["products","Sản phẩm, giá, tồn kho, seller, category, rating và ảnh"],["orders","Đơn hàng, item, địa chỉ giao, phương thức/trạng thái thanh toán"],["reviews","Đánh giá sao và nhận xét của Buyer cho Product"]])
dictionary = [["Collection","Trường","Kiểu dữ liệu","Ràng buộc","Mô tả"],
["users","name","String","required","Tên hiển thị"],["users","email","String","unique, required","Email đăng nhập"],["users","password","String","required","Mật khẩu đã băm"],["users","role","String","admin/seller/buyer","Vai trò tài khoản"],["users","shop","Object","seller","Thông tin gian hàng"],["users","isActive","Boolean","default true","Trạng thái hoạt động"],["categories","name","String","unique, required","Tên danh mục"],["categories","slug","String","unique, required","Định danh URL"],["categories","description","String","optional","Mô tả danh mục"],["categories","image","String","optional","Ảnh danh mục"],["products","name","String","required","Tên sản phẩm"],["products","slug","String","required","Định danh URL"],["products","description","String","required","Mô tả sản phẩm"],["products","price","Number","min 0","Giá bán"],["products","originalPrice","Number","optional","Giá gốc"],["products","stock","Number","min 0","Tồn kho"],["products","sold","Number","default 0","Số lượng bán"],["products","category","ObjectId","ref Category","Danh mục"],["products","seller","ObjectId","ref User","Chủ gian hàng"],["products","images","String[]","optional","Danh sách ảnh"],["products","rating","Number","1..5","Điểm trung bình"],["products","numReviews","Number","default 0","Số đánh giá"],["products","isActive","Boolean","default true","Hiển thị sản phẩm"],["orders","orderCode","String","unique, required","Mã đơn"],["orders","buyer","ObjectId","ref User","Người mua"],["orders","items","Array","required","Chi tiết sản phẩm"],["orders","shippingAddress","Object","required","Địa chỉ giao"],["orders","paymentMethod","String","COD/BANK_TRANSFER","Phương thức thanh toán"],["orders","paymentStatus","String","UNPAID/PAID","Trạng thái thanh toán"],["orders","orderStatus","String","5 trạng thái","Trạng thái xử lý"],["orders","totalAmount","Number","required","Tổng tiền"],["items","product","ObjectId","ref Product","Sản phẩm đặt"],["items","quantity","Number","min 1","Số lượng"],["items","seller","ObjectId","ref User","Seller của item"],["reviews","product","ObjectId","ref Product","Sản phẩm được đánh giá"],["reviews","buyer","ObjectId","ref User","Người đánh giá"],["reviews","rating","Number","1..5","Số sao"],["reviews","comment","String","required","Nội dung nhận xét"],["all","createdAt/updatedAt","Date","timestamps","Thời điểm tạo/cập nhật"]]
fill_table(doc.tables[9], dictionary)
fill_table(doc.tables[10], [["Đường dẫn / file","Chức năng"],["app/page.tsx","Trang chủ, banner, danh mục và khu vực sản phẩm"],["app/products/page.tsx","Danh sách, tìm kiếm, lọc và sắp xếp sản phẩm"],["app/products/[id]/page.tsx","Chi tiết sản phẩm, ảnh, review và hành động mua"],["app/cart/page.tsx","Giỏ hàng và cập nhật số lượng"],["app/checkout/page.tsx","Thông tin giao hàng và tạo đơn"],["app/login + register","Đăng nhập, đăng ký Buyer/Seller"],["app/orders/page.tsx","Lịch sử đơn của Buyer"],["app/seller/*","Dashboard, sản phẩm và đơn của Seller"],["app/admin/*","Dashboard, users, categories và orders"],["components/*","Navbar, Footer và ProductCard"],["context/* + lib/api.ts","Auth, Cart, Toast và Axios API client"]])

# Replace stale body images while retaining the cover logo/background.
figures = {49:(ASSETS/'architecture.png',6.25),78:(ASSETS/'usecase.png',6.25),85:(ASSETS/'domain.png',6.25),90:(ASSETS/'order_flow.png',6.25),94:(ASSETS/'auth_flow.png',6.25),98:(ASSETS/'deployment.png',6.25),103:(ASSETS/'domain.png',6.25),138:(ASSETS/'home.png',6.25),143:(ASSETS/'products.png',6.25),146:(ASSETS/'usecase.png',6.25),151:(ASSETS/'order_flow.png',6.25),154:(ASSETS/'order_flow.png',6.25),157:(ASSETS/'order_flow.png',6.25),162:(ASSETS/'login.png',5.8),165:(ASSETS/'dashboard.png',6.25),168:(ASSETS/'dashboard.png',6.25),170:(ASSETS/'dashboard.png',6.25),173:(ASSETS/'dashboard.png',6.25),175:(ASSETS/'usecase.png',6.25),178:(ASSETS/'order_flow.png',6.25),181:(ASSETS/'architecture.png',6.25),184:(ASSETS/'auth_flow.png',6.25),187:(ASSETS/'dashboard.png',6.25)}
for i,p in enumerate(paras):
    if i >= 17 and p._p.xpath('.//w:drawing'): remove_body_drawings(p)
for i,(image,width) in figures.items(): add_image(paras[i], image, width)

doc.core_properties.title = "Báo cáo thực tập tốt nghiệp - noshop"
doc.core_properties.subject = "Nền tảng thương mại điện tử đa vai trò"
doc.core_properties.author = "Nhóm 3"
doc.save(OUTPUT)
print(OUTPUT)
