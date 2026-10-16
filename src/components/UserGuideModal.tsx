import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Camera,
  Eye,
  CheckCircle2,
  Calculator,
  UtensilsCrossed,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  BookOpen,
  FlaskConical,
  Info,
  Check
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrySampleDemo?: () => void;
}

const STORAGE_KEY_DONT_AUTO_SHOW = 'foodwise_dont_auto_show_guide_v2';

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onTrySampleDemo,
}) => {
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_DONT_AUTO_SHOW) === 'true';
    } catch {
      return false;
    }
  });

  if (!isOpen) return null;

  const handleClose = () => {
    try {
      if (dontShowAgain) {
        localStorage.setItem(STORAGE_KEY_DONT_AUTO_SHOW, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY_DONT_AUTO_SHOW);
      }
    } catch (e) {
      console.warn('Cannot write localStorage:', e);
    }
    onClose();
  };

  const steps = [
    {
      id: 1,
      badge: 'Bước 1',
      title: 'Quét & Gửi ảnh nhãn',
      icon: Camera,
      color: 'emerald',
      summary: 'Mở camera điện thoại quét trực tiếp, tải ảnh hoặc dán nhanh bằng Ctrl + V.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Tại khung <strong>"Một form nhập nhãn thực phẩm duy nhất"</strong>, em có thể:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-700">
            <li>
              <strong>Bấm "Mở Camera quét":</strong> Căn chỉnh bao bì bánh kẹo, sữa vào giữa khung hình rồi nhấn nút chụp.
            </li>
            <li>
              <strong>Tải ảnh / Dán ảnh (Ctrl+V):</strong> Tải ảnh nhãn có sẵn từ điện thoại/máy tính hoặc dán ảnh chụp màn hình.
            </li>
            <li>
              <strong>Chọn nhãn mẫu thử nghiệm:</strong> Có sẵn các mẫu chuẩn SGK và 20 nhãn thử nghiệm đa dạng.
            </li>
          </ul>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-medium">
            💡 <strong>AI thông minh & trung thực:</strong> AI sẽ tự động đọc khẩu phần, calo, đường, muối, hạn dùng. Nếu ảnh bị mờ, chụp nghiêng hoặc chữ quá bé, hệ thống sẽ cảnh báo <em>"Chưa đọc rõ, vui lòng chụp lại"</em> chứ không tự ý đoán mò số liệu!
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: 'Bước 2',
      title: 'Quan sát & Đối chiếu',
      icon: Eye,
      color: 'amber',
      summary: 'Tự quan sát trước, sau đó đối chiếu kết quả AI với nút [Đúng] và [Sửa lại].',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Để rèn luyện tư duy phản biện khoa học, em hãy thực hiện 2 thao tác:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <Eye className="w-4 h-4 text-amber-600" />
                Ô "Em quan sát trước"
              </span>
              <p className="text-2xs text-amber-800">
                Hãy dành 10 giây ghi lại suy nghĩ của em: Nhãn này nhiều đường hay ít đường? Đơn vị là gam hay miligam?
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Nút [Đúng] & [Sửa lại]
              </span>
              <p className="text-2xs text-blue-800">
                Mỗi trường dữ liệu đều có nút xác nhận. Nếu AI đọc sai chữ số (ví dụ 120 thành 720), em bấm <strong>[Sửa lại]</strong> để chỉnh sửa.
              </p>
            </div>
          </div>
          <p className="text-slate-500 text-3xs">
            * Nguyên tắc: Học sinh luôn là người kiểm chứng cuối cùng, AI đóng vai trò trợ lý hỗ trợ.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      badge: 'Bước 3',
      title: '5 Góc phân tích khoa học',
      icon: BookOpen,
      color: 'blue',
      summary: 'Khám phá Khẩu phần, Thành phần, Dinh dưỡng, Hạn dùng và Điều cần kiểm tra.',
      content: (
        <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
          <p>
            Sau khi bấm <strong>"Phân tích nhãn bằng AI"</strong>, hệ thống sẽ bóc tách toàn diện 5 góc nhìn:
          </p>
          <div className="space-y-1.5">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-3xs shrink-0">Góc 1</span>
              <div>
                <strong className="text-slate-900">Khẩu phần:</strong> Giải thích 1 khẩu phần là bao nhiêu gam và hộp có bao nhiêu khẩu phần.
              </div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-3xs shrink-0">Góc 2</span>
              <div>
                <strong className="text-slate-900">Thành phần:</strong> Nguyên liệu ghi đầu tiên là chất chiếm tỷ lệ khối lượng nhiều nhất; kèm cảnh báo dị ứng.
              </div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-3xs shrink-0">Góc 3</span>
              <div>
                <strong className="text-slate-900">Dinh dưỡng:</strong> Calo, Đường, Chất béo, Đạm, Natri theo khẩu phần và theo cả hộp.
              </div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-3xs shrink-0">Góc 4</span>
              <div>
                <strong className="text-slate-900">Hạn dùng:</strong> Giải thích HSD/NSX hoặc nêu rõ nếu bao bì chưa dập date.
              </div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-3xs shrink-0">Góc 5</span>
              <div>
                <strong className="text-slate-900">Điều cần kiểm tra:</strong> Nêu những số liệu còn thiếu, vị trí dập date, câu hỏi tư duy.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      badge: 'Bước 4',
      title: 'Kiểm tra phép tính ăn thực tế',
      icon: Calculator,
      color: 'indigo',
      summary: 'Kéo thanh trượt để xem lượng Calo, Đường và Muối thay đổi khi ăn nhiều hơn 1 khẩu phần.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950">
            <span className="font-bold flex items-center gap-1.5 mb-1 text-xs">
              <Calculator className="w-4 h-4 text-indigo-600" />
              Ví dụ kinh điển về "Bẫy khẩu phần":
            </span>
            <p className="text-2xs leading-relaxed">
              Một hộp bánh ghi <strong>120 kcal / khẩu phần (30g)</strong>, nhưng cả hộp có <strong>2 khẩu phần (60g)</strong>. Nếu em ăn hết cả hộp, năng lượng thực tế em nạp vào là:
            </p>
            <div className="mt-2 font-mono font-bold text-sm bg-white p-2 rounded-lg border border-indigo-200 text-center text-indigo-700">
              120 kcal × 2 = 240 kcal
            </div>
          </div>
          <p>
            Em hãy thử đổi lượng ăn bằng <strong>ô nhập số</strong> hoặc <strong>kéo thanh trượt</strong> để xem tổng calo, đường (g) và natri (mg) cập nhật theo thời gian thực!
          </p>
        </div>
      ),
    },
    {
      id: 5,
      badge: 'Bước 5',
      title: 'Nhật ký & Rèn luyện',
      icon: UtensilsCrossed,
      color: 'teal',
      summary: 'Lưu vào mục "Hôm nay em đã ăn gì?", kiểm thử 20 nhãn và làm bài tập tình huống.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            <li>
              <strong>Dinh dưỡng cá nhân &amp; BMI:</strong> Nhập chiều cao, cân nặng để tự động tính BMI phù hợp lứa tuổi THCS, ước tính nhu cầu calo tham khảo hàng ngày (TDEE), tìm kiếm món ăn hoặc thêm từ nhãn vừa quét và theo dõi biểu đồ 7 ngày.
            </li>
            <li>
              <strong>Đăng ký &amp; Đăng nhập tài khoản:</strong> Mỗi học sinh có thể tạo một tài khoản riêng (bằng Email hoặc 1 chạm với Google) để lưu hồ sơ thể chất và nhật ký ăn uống an toàn trên máy chủ đám mây.
            </li>
            <li>
              <strong>Kiểm thử 20 nhãn thực phẩm:</strong> Khám phá bộ dữ liệu 20 nhãn (ảnh rõ, mờ, chụp nghiêng, chữ nhỏ) và kiểm tra tỷ lệ nhận diện thực tế của AI.
            </li>
            <li>
              <strong>Bài tập tình huống:</strong> Nhập vai người tiêu dùng thông minh để giải quyết các bẫy tiếp thị "0g đường", "không cholesterol".
            </li>
          </ul>
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-2xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong>Lưu ý an toàn dị ứng:</strong> FoodLabel AI là công cụ học tập. Em luôn phải tự đọc danh sách thành phần trên bao bì gốc và hỏi người lớn khi có cơ địa dị ứng, không khẳng định an toàn chỉ vì AI không tìm thấy chất đó.
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps.find((s) => s.id === activeStepTab) || steps[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-emerald-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-4 sm:p-5 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0 shadow-xs">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="guide-modal-title" className="text-base sm:text-lg font-black tracking-tight text-white">
                  Hướng dẫn sử dụng FoodLabel AI
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 text-3xs font-extrabold uppercase border border-emerald-300/30">
                  Dành cho THCS
                </span>
              </div>
              <p className="text-2xs text-emerald-100 mt-0.5">
                Các bước đơn giản để làm chủ kỹ năng đọc nhãn thực phẩm & toán học dinh dưỡng
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Đóng hộp thoại"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-3 sm:px-5 py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === activeStepTab;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStepTab(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white hover:text-emerald-800'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-3xs flex items-center justify-center font-bold ${
                  isActive ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {s.id}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">{s.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {currentStep.id}
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                {currentStep.badge}: {currentStep.title}
              </h3>
            </div>
            <span className="text-3xs text-slate-400 font-semibold">
              Bước {currentStep.id} / 5
            </span>
          </div>

          <p className="text-xs font-semibold text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
            👉 {currentStep.summary}
          </p>

          {/* Dynamic Content */}
          <div className="pt-1">{currentStep.content}</div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Checkbox Remember */}
          <label className="flex items-center gap-2 text-2xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer accent-emerald-600"
            />
            <span>Không tự động hiện lại khi tải lại trang</span>
          </label>

          {/* Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeStepTab < steps.length ? (
              <button
                type="button"
                onClick={() => setActiveStepTab(activeStepTab + 1)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>Xem bước tiếp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {onTrySampleDemo && (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onTrySampleDemo();
                }}
                className="px-3 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 transition cursor-pointer flex items-center gap-1"
              >
                <span>Thử mẫu 240 kcal</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Đã hiểu, Bắt đầu ngay!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
