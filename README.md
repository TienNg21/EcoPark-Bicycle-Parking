# EcoPark Bicycle Parking - Nhập môn Công nghệ Phần mềm 20211


## Mục lục

[Đặt vấn đề](#datvande)

[Hướng dẫn sử dụng](#huongdansudung)

[1. Cài đặt](#1)

  - [1.1. Cài đặt từ Github](#11)
 
  - [1.2. Trải nghiệm ngay](#12)

[2. Hướng dẫn sử dụng user](#2)
  - [2.1. Đăng ký, đăng nhập, đăng xuất](#21)
  - [2.2. Thay đổi thông tin, mật khẩu](#22)
  - [2.3. Xem bản đồ](#23)
  - [2.4. Thuê xe](#24)
  - [2.5. Trả xe](#25)
  - [2.6. Xem lịch sử thuê xe](#26)

[3. Hướng dẫn sử dụng admin](#3)
  - [3.1. Đăng nhập, đăng xuất](#31)
  - [3.2. Điều hướng và xem thông tin](#32)
  - [3.3. Quản lý xe](#33)
  - [3.4. Quản lý bãi xe](#34)
  - [3.5. Thay đổi giá thuê xe](#35)
 
<a name="datvande">

## Đặt vấn đề

Thành phố xanh Ecopark hiện đã là điểm đến nghỉ dưỡng ven đô Hà Nội, muốn đề xuất một hệ thống quản lý thông tin (website) thuê và trả xe của du khách, quản lý thông tin các bãi xe và các loại, số lượng xe khác nhau, có thể cho phép du khách thuê các loại xe khác nhau theo sở thích, ở địa điểm bãi xe gần nhất, một cách tự động.

 
<a name="huongdansudung">
 
## Hướng dẫn sử dụng

<a name="1">
 
### 1. Hướng dẫn cài đặt
 
<a name="11">

**1.1. Cài đặt từ Github:**

Bước 1: Cài đặt NodeJS trên máy

Truy cập [trang download nodejs](https://nodejs.dev/download/), tải và cài đặt phiên bản phù hợp với máy tính.

Sau khi cài đặt xong, kiểm tra lại phiên bản đã cài đặt bằng câu lệnh:
```
node -v
```

Bước 2: Clone project

```
git clone https://github.com/TienNg21/EcoPark-Bicycle-Parking.git
```

Bước 3:  Cài đặt các thư viện

Chuyển đến thư mục chứa Project vừa clone:
```
cd EcoPark-Bicycle-Parking
```
Thực hiện cài đặt thư viện:
```
npm install
```

Bước 4: Chạy project local

Chạy project bằng câu lệnh:
```
node app.js
```
Truy cập đường link sau bằng trình duyệt http://localhost:3000/ :tada:

<a name="12">

**1.2. Trải nghiệm ngay:**

Truy cập đường dẫn [EcoPark Bicycle Parking ](https://ecopark-bicycle-parking.herokuapp.com)

<a name="2">
 
### 2. Hướng dẫn sử dụng user
 
> Bạn nên sử dụng bằng điện thoại để có được trải nghiệm tốt nhất!!!
 
<a name="21">
 
**2.1. Đăng ký, đăng nhập, đăng xuất**

<img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_dangky.png?raw=true'>    <img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_dangnhap.png?raw=true'>    <img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_dangxuat.png?raw=true'>

- Trước tiên, bạn phải đăng ký tài khoản. Bạn cần điền đầy đủ thông tin: Họ tên, email, số điện thoại (phải đúng định dạng và có 10 số), số CMND/CCCD (phải có 9 hoặc 12 chữ số), giới tính, bạn có thể chọn là cư dân hoặc không (nếu là cư dân phải điền mã cư dân), nhập mật khẩu hai lần (phải có nhiều hơn 6 chữ số).
- Sau khi đăng ký thành công, bạn sẽ được chuyển sang trang đăng nhập. Tại đây bạn điền email và mật khẩu đã đăng ký để đăng nhập. Khi đăng nhập thành công bạn sẽ được đưa tới trang chủ.
- Để đăng xuất, hãy nhấn nút đăng xuất. Khi đăng xuất thành công, ta sẽ được đưa về trang đăng nhập và có thông báo đăng xuất thành công.
 
<a name="22">

**2.2. Thay đổi thông tin, mật khẩu**

<img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_thaydoithongtin.png?raw=true'>     <img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_thaydoimatkhau.png?raw=true'>

- Sau khi đăng nhập, bạn có thể vào phần tài khoản để thay đổi thông tin và mật khẩu của mình. Các thông tin phải đúng định dạng, mật khẩu cũ phải khớp và mật khẩu mới phải có nhiều hơn 6 ký tự.
 
<a name="23">

**2.3. Xem bản đồ**

<img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_bando.png?raw=true'>     <img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_bando2.png?raw=true'>

- Bạn có thể ấn vào nút bản đồ ở màn hình chính để xem vị trí của mình, đồng thời xác định vị trí các bãi xe trong khu vực EcoPark.
- Ngoài ra bạn có thể ấn vào từng bãi xe ở trên bản đồ để chuyển đến trang thuê xe của bãi đó.
 
 <a name="24">
 
**2.4. Thuê xe**

<img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_thuexe.png?raw=true'>     <img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_thuexe2.png?raw=true'>     <img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_thuexe3.png?raw=true'>     <img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_thuexe4.png?raw=true'>
  
- Ngoài cách truy cập trang thuê xe từ bản đồ, bạn có thể ấn vào nút thuê xe ở màn hình chính để thuê xe. Sau khi chọn bãi, chọn xe, chọn thời gian thuê (có giá tiền tương ứng) hãy ấn nút thuê xe để tiếp tục.
- Lưu ý, khi thuê quá thời gian đã chọn, bạn phải trả thêm tiền mỗi 30 phút.
- Sau khi ấn nút thuê xe, bạn sẽ được đưa đến trang quét mã QR.
> Mỗi bãi xe sẽ có 2 mã QR dùng để thuê xe và trả xe. Để lấy xe ra khỏi bãi, bạn phải quét mã QR thuê. Để trả xe về bãi, bạn phải quét mã QR trả. Nếu quét không đúng sẽ không thể thực hiện các thao tác trên. Mã QR không cố định mà sẽ được thay đổi theo mỗi lượt thuê xe
- Khi triển khai thực tế, bạn phải đến từng bãi xe mới có mã QR để quét. Trong phạm vi môn học, nhóm đã chuẩn bị trang sau để các bạn có thể quét mã dễ dàng hơn, bạn nên vào trang web bằng thiết bị khác để thuận tiện cho việc quét mã (do phải dùng camera) [trang lấy mã QR các bãi xe](https://ecopark-bicycle-parking.herokuapp.com/admin/qrpage). Chọn bãi xe bạn cần quét để thấy mã QR thuê và trả của bãi đó.
- Sau khi quét mã thuê xe, sẽ có thông báo. Nếu thuê thành công, app sẽ chuyển hướng về trang chủ và sẽ có bộ đếm thời gian thuê cho bạn. Nếu thời gian thuê đang chạy, nghĩa là bạn đã thuê xe thành công. Đừng vội tắt trang quét mã QR, bạn sẽ cần dùng nó để trả xe đó.
- Sau khi chọn xe nhưng chưa quét mã - chưa thuê (xe ở trạng thái pending - sẽ nói rõ hơn ở phần quản lý xe của admin), bạn hoàn toàn có thể hủy và chuyển thuê xe khác. Nếu không sau 5 phút, xe sẽ được hủy (do không quét mã).
  
<a name="25">

**2.5. Trả xe**

<img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_traxe.png?raw=true'>     <img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_traxe2.png?raw=true'>

- Tương tự khi thuê xe, để trả xe bạn cũng cần quét mã QR. Vào trang đã nêu trên để lấy mã. Sau khi thực hiện quét mã thành công, bạn đã trả xe thành công. Bây giờ hóa đơn cho việc thuê xe sẽ xuất hiện, hiển thị thông tin và số tiền bạn phải trả.
- Nhấn xác nhận để hoàn tất.
 
<a name="26">

**2.6. Xem lịch sử thuê xe**

<img width="200px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/user/user_xemlichsuthuexe.png?raw=true'>

- Sau khi thực hiện thuê xe thành công, bạn có thể nhấn nút Lịch sử thuê xe để xem lại lịch sử những lần thuê xe của mình.
 
<a name="3">

### 3. Hướng dẫn sử dụng admin
 
> Vì đây là phần của quản trị viên, một số thay đổi có thể làm thay đổi quá trình trải nghiệm của project. Nếu bạn vào trải nghiệm vui lòng không xóa các xe, bãi xe, thay đổi thông tin bừa bãi. Xin cảm ơn các bạn.

<a name="31">
 
**3.1. Đăng nhập, đăng xuất**

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_dangnhap.png?raw=true'>

- Để đăng nhập vào tài khoản admin bạn sẽ cần sử dụng tài khoản
> Email: admin@ecopark.com  Password: adminadmin
 
<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_dangxuat.png?raw=true'>

- Để đăng xuất, nhấn nút như hình trên.
 
<a name="32">
 
**3.2. Điều hướng và xem thông tin**

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_dieuhuong.png?raw=true'>

- Để điều hướng giữa các phần admin cần quản lý, bạn có thể cuộn hoặc ấn vào các nút điều hướng bên trái để cuộn tới phần tương ứng. 

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_overview.png?raw=true'>
 
- Phần trên cùng sẽ hiển thị các thông tin tổng quan về hệ thống như: doanh thu ngày hôm nay, trạng thái các xe (xe chưa thuê/ xe đang chờ được quét/ xe đang được thuê), tổng số tài khoản và số lượng bãi xe.

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_xemdoanhso.png?raw=true'>

- Bạn có thể xem một số thông tin về doanh thu, có thể chỉnh thời gian để xem doanh thu trong một khoảng thời gian bất kì.

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_xemlichsuthue.png?raw=true'>

- Tương tự với lịch sử, bạn cũng có thể xem lịch sử thuê xe trong một khoảng thời gian bất kì.
 
<a name="33">
 
**3.3. Quản lý xe**
 
> Xe sẽ có 3 trạng thái: available - khi sẵn sàng, pending - khi đã có user chọn xe nhưng chưa quét để thuê, active - khi đã có user thuê.

> Khi có xe bất kì thay đổi trạng thái, hệ thống sẽ được cập nhật ngay lập tức, có thông báo và xe vừa thay đổi trạng thái xe có phần trạng thái nhấp nháy trong 10s
 
<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_themxe.png?raw=true'>

- Để thêm xe mới, bạn cần chọn bãi mà xe đó được thêm vào. Sau đó điền thông tin loại xe và ấn thêm. Khi thêm xe thành công, sẽ có thông báo và bạn sẽ được chuyển hướng tới mục danh sách xe

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_thaydoixe.png?raw=true'>

- Khi xe được thuê, phần id khách sẽ được cấp nhật id của người dùng đang thuê xe đó.
- Để thay đổi thông tin xe, hãy ấn vào thông tin xe bạn cần thay đổi (lưu ý: chỉ có thể thay đổi được id bãi xe - chuyển vị trí xe, trạng thái xe và loại xe). Sau khi thay đổi, nhấn nút màu xanh nước biển tương ứng với xe vừa thay đổi thông tin.

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_xoaxe.png?raw=true'>
 
- Để xóa xe, bạn chỉ cần nhấn nút màu đỏ tương ứng với xe đó.

<a name="34">

**3.4. Quản lý bãi xe**

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_thembaixe.png?raw=true'>

- Để thêm bãi xe mới, bạn cần nhấn chuột phải vào một vị trí trên bản đồ để lấy tọa độ bãi xe. Sau đó điền thêm tên bãi xe rồi nhấn thêm. Sau khi thêm thành công, sẽ có thông báo và bạn sẽ được chuyển hướng tới mục danh sách bãi xe.

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_thaydoibaixe.png?raw=true'>

- Với bãi xe, bạn chỉ có thể thay đổi dược tên bãi. Sau khi thay đổi nhấn nút màu xanh nước biển tương ứng với bãi đó để hoàn tất.

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_xoabaixe.png?raw=true'>

- Để xóa bãi xe, bạn làm tương tự với xóa xe. Nhấn nút màu đỏ tương ứng với bãi xe đó.
> Lưu ý: khi bãi xe đang còn xe thì sẽ không xóa được.
 
<a name="35">
 
**3.5. Thay đổi giá thuê xe**

<img width="1000px" src='https://github.com/TienNg21/EcoPark-Bicycle-Parking/blob/main/document/demo/admin/admin_thaydoigiathue.png?raw=true'>

- Để thay đổi giá thuê 1h, 2h, 3h, giá trả muộn 30 phút, tỉ lệ giảm giá cho cư dân EcoPark. Bạn thay đổi giá trị của ô tương ứng rồi nhấn nút màu xanh tương ứng.
> Để đổi mật khẩu admin cần phải có code của nhóm
 
<a name="4">
 
### 4. Thông tin thành viên
🔥*Một sản phẩm của Nhóm 12*🔥
 - [Lã Thị Hà](https://github.com/20194266-halt)
 - [Phạm Quỳnh Trang](https://github.com/trangg1310)
 - [Đặng Thị Hạnh](https://github.com/danghanh01)
 - [Phan Chính Quốc](https://github.com/chinhquoc01)
 - [Trần Minh Thông](https://github.com/thong-ofcourse01)
 - [Khổng Thế Học](https://github.com/hoc2k1)
 - [Vũ Quang Tùng](https://github.com/hust-vqtung)
 - [Nguyễn Hữu Tiến](https://github.com/TienNg21)
