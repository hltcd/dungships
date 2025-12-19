import { FileText } from "lucide-react";

export const metadata = {
  title: "Điều Khoản Dịch Vụ",
  description: "Các điều khoản và điều kiện sử dụng dịch vụ tại Học Lập Trình Cùng Dũng.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="p-4 bg-purple-500/10 rounded-full mb-6">
          <FileText className="w-12 h-12 text-purple-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Điều Khoản Dịch Vụ
        </h1>
        <p className="text-gray-400 font-medium italic">
          Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      <div className="space-y-12 text-gray-300 leading-relaxed bg-white/[0.02] backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
            1. Chấp nhận điều khoản
          </h2>
          <p>
            Bằng cách truy cập và sử dụng dịch vụ của Học Lập Trình Cùng Dũng, bạn đồng ý tuân thủ các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ ngay lập tức.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
            2. Tài khoản và Bảo mật
          </h2>
          <p>
            Bạn có trách nhiệm giữ bí mật thông tin tài khoản và mật khẩu của mình. Bạn hoàn toàn chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của mình. Chúng tôi có quyền đình chỉ tài khoản nếu phát hiện dấu hiệu gian lận hoặc vi phạm chính sách cộng đồng.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
            3. Quyền sở hữu trí tuệ
          </h2>
          <p>
            Mọi nội dung bao gồm video, tài liệu, mã nguồn (source code) và thiết kế trên website này đều thuộc sở hữu của Học Lập Trình Cùng Dũng hoặc các đối tác cấp phép. Bạn không được phép sao chép, phân phối hoặc bán lại các tài liệu này mà không có sự đồng ý bằng văn bản.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
            4. Thanh toán và Hoàn trả
          </h2>
          <p>
            Khi thực hiện mua khóa học hoặc source code, bạn đồng ý cung cấp thông tin thanh toán chính xác. Do tính chất đặc biệt của sản phẩm số, các đơn hàng đã thanh toán thành công và được cấp quyền truy cập sẽ không được hoàn trả trừ các trường hợp đặc biệt do lỗi hệ thống.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
            5. Giới hạn trách nhiệm
          </h2>
          <p>
            Chúng tôi nỗ lực cung cấp nội dung chính xác và chất lượng nhất, tuy nhiên không cam kết kết quả cụ thể cho quá trình học tập của mỗi cá nhân. Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất gián tiếp nào phát sinh từ việc sử dụng dịch vụ.
          </p>
        </section>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Học Lập Trình Cùng Dũng. Mọi quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm underline decoration-white/20">
              Chính sách bảo mật
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
