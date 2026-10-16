import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Camera,
  Edit3,
  Lightbulb,
  CheckCircle2,
  Calculator,
  Eye,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface AppUserGuideProps {
  onQuickStartUpload?: () => void;
  onOpenDemo?: () => void;
  onOpenFullModalGuide?: () => void;
}

export const AppUserGuide: React.FC<AppUserGuideProps> = ({
  onQuickStartUpload,
  onOpenDemo,
  onOpenFullModalGuide,
}) => {
  // Guide is open by default so new users immediately see how to use the software
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <section
      id="app-user-guide-section"
      className="bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-amber-50/40 border border-emerald-200 rounded-2xl shadow-xs overflow-hidden transition-all duration-200"
    >
      {/* Guide Header Banner */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-emerald-100/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 font-bold text-lg">
            📖
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Ô Hướng dẫn sử dụng FoodLabel AI (4 bước nhanh)
              </h2>
              <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Dành cho THCS
              </span>
            </div>
            <p className="text-2xs text-slate-600 mt-0.5">
              Rèn luyện kỹ năng đọc nhãn thực phẩm, phát hiện bẫy khẩu phần và tư duy dinh dưỡng khoa học.
            </p>
          </div>
        </div>

        {/* Toggle Collapse/Expand & Modal Button */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenFullModalGuide && (
            <button
              onClick={onOpenFullModalGuide}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-2xs font-bold text-emerald-800 bg-white hover:bg-emerald-100/80 border border-emerald-200 transition cursor-pointer shadow-2xs"
              title="Xem hộp thoại hướng dẫn chi tiết"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xem chi tiết</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition cursor-pointer shadow-2xs"
            title={isExpanded ? 'Thu gọn hướng dẫn' : 'Mở rộng ô hướng dẫn'}
          >
            <span>{isExpanded ? 'Thu gọn' : 'Hiện hướng dẫn'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Guide Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4 animate-in fade-in duration-150">
          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-3xs font-extrabold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                    Bước 1
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Quét hoặc nạp ảnh</span>
                </h3>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Bấm <strong>"Mở Camera quét"</strong>, tải ảnh từ máy hoặc dán nhanh bằng <strong>Ctrl+V</strong>. AI sẽ tự động đọc khẩu phần, calo, đường, muối, hạn dùng.
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-3xs text-emerald-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Không đoán mò khi ảnh mờ</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-3xs font-extrabold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                    Bước 2
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>Tự nhận xét & Đối chiếu</span>
                </h3>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Ghi suy nghĩ vào ô <strong>"Em quan sát trước"</strong>. Sau đó kiểm tra từng thông số và bấm nút <strong>[Đúng]</strong> hoặc <strong>[Sửa lại]</strong> nếu AI nhận diện chưa chuẩn.
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-3xs text-amber-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-500" />
                <span>Em là người làm chủ dữ liệu</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-3xs font-extrabold flex items-center justify-center">
                    3
                  </span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                    Bước 3
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Khám phá 5 góc phân tích</span>
                </h3>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Xem chi tiết 5 góc: <strong>Khẩu phần</strong> (gam/phần), <strong>Thành phần</strong> (xếp theo thứ tự tỷ lệ), <strong>Dinh dưỡng</strong>, <strong>Hạn dùng</strong> và <strong>Điều cần kiểm tra</strong>.
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-3xs text-blue-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                <span>Kèm cảnh báo dị ứng an toàn</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-3xs font-extrabold flex items-center justify-center">
                    4
                  </span>
                  <span className="text-3xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                    Bước 4
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Kiểm tra phép tính khi ăn</span>
                </h3>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Nhập số gam hoặc kéo thanh trượt lượng em ăn để thấy calo nhân lên: <em>120 kcal × 2 khẩu phần = 240 kcal</em>. Bấm thêm vào <strong>"Hôm nay em đã ăn gì?"</strong> để ghi nhật ký.
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 text-3xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Toán học dinh dưỡng thực tế</span>
              </div>
            </div>
          </div>

          {/* Quick Helpful Banner */}
          <div className="bg-white/90 border border-emerald-100 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-2xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-700">
                <strong>Mẹo hay:</strong> Nếu ảnh bao bì bị cong hoặc chữ quá nhỏ, hệ thống sẽ nhắc chụp lại. Em luôn có thể tự sửa số liệu ở form trước khi phân tích.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenDemo && (
                <button
                  onClick={onOpenDemo}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition cursor-pointer flex items-center gap-1 border border-emerald-200"
                >
                  <span>Thử ví dụ mẫu 240 kcal</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
