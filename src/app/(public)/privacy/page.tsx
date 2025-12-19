import { Shield } from "lucide-react";

export const metadata = {
  title: "Chính Sách Bảo Mật",
  description: "Chính sách bảo mật thông tin người dùng tại Học Lập Trình Cùng Dũng.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="p-4 bg-blue-500/10 rounded-full mb-6">
          <Shield className="w-12 h-12 text-blue-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Chính Sách Bảo Mật
        </h1>
        <p className="text-gray-400 font-medium italic">
          Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      <div className="space-y-12 text-gray-300 leading-relaxed bg-white/[0.02] backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            1. Thu thập thông tin
          </h2>
          <p>
            Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản trên hệ thống, bao gồm tên, địa chỉ email và thông tin từ Google (nếu bạn sử dụng đăng nhập Google). Thông tin này giúp chúng tôi xác định danh tính và quản lý hồ sơ học tập của bạn.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            2. Sử dụng thông tin
          </h2>
          <p>
            Thông tin của bạn được sử dụng để:
          </p>
          <ul className="list-disc ml-6 mt-4 space-y-2">
            <li>Cung cấp quyền truy cập vào các khóa học và dịch vụ đã mua.</li>
            <li>Xử lý giao dịch thanh toán và hỗ trợ khách hàng.</li>
            <li>Gửi thông báo về cập nhật khóa học, lỗi kỹ thuật hoặc chương trình khuyến mãi (nếu bạn đồng ý).</li>
            <li>Cá nhân hóa trải nghiệm người dùng trên nền tảng.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            3. Bảo mật thông tin
          </h2>
          <p>
            Chúng tôi áp dụng các biện pháp bảo mật dữ liệu tiên tiến để bảo vệ thông tin cá nhân của bạn. Dữ liệu nhạy cảm được mã hóa và lưu trữ an toàn. Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba ngoại trừ các đối tác xử lý thanh toán tin cậy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            4. Cookies
          </h2>
          <p>
            Website sử dụng cookies để ghi nhớ phiên đăng nhập và các tùy chọn cá nhân. Bạn có thể chọn tắt cookies trong cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến một số tính năng của trang web.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            5. Thay đổi chính sách
          </h2>
          <p>
            Chúng tôi có quyền cập nhật chính sách bảo mật này bất cứ lúc nào. Các thay đổi sẽ được thông báo trực tiếp trên trang web hoặc qua email. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận chính sách mới.
          </p>
        </section>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Học Lập Trình Cùng Dũng. Mọi quyền được bảo lưu.
          </p>
          <a href="mailto:dunglvdeveloper@gmail.com" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
            dunglvdeveloper@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
