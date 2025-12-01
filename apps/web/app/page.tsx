// ...existing code...
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

export default function Index() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">iDoc</h1>
          <p className="text-gray-600">Quản lý tài liệu nhanh chóng — demo sử dụng Tailwind CSS</p>
        </header>

        <div className="mb-6 flex gap-3">
          <input
            type="search"
            aria-label="Tìm kiếm"
            placeholder="Tìm tài liệu, dự án..."
            className="flex-1 px-4 py-2 rounded-md border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Tìm
          </button>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn</CardTitle>
              <CardDescription>Tài liệu hướng dẫn sử dụng sản phẩm</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Các bước chi tiết, ví dụ và best practices cho người dùng mới.
            </CardContent>
            <CardFooter className="flex justify-end">
              <a href="#" className="text-indigo-600 hover:underline px-2 py-1">
                Xem
              </a>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mẫu</CardTitle>
              <CardDescription>Mẫu tài liệu và templates</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Tải xuống hoặc nhân bản mẫu phù hợp với dự án của bạn.
            </CardContent>
            <CardFooter className="flex justify-end">
              <a href="#" className="text-indigo-600 hover:underline px-2 py-1">
                Mở
              </a>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hỗ trợ</CardTitle>
              <CardDescription>Liên hệ bộ phận hỗ trợ</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Gửi yêu cầu và theo dõi tiến trình hỗ trợ kỹ thuật.
            </CardContent>
            <CardFooter className="flex justify-end">
              <a href="#" className="text-indigo-600 hover:underline px-2 py-1">
                Gửi yêu cầu
              </a>
            </CardFooter>
          </Card>
        </section>

        <footer className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} iDoc
        </footer>
      </div>
    </main>
  );
}