import React from 'react';
import { Sparkles, ShieldCheck, Apple, BookOpen, CheckCircle2, ChevronRight, Camera } from 'lucide-react';
import heroBannerImg from '../assets/images/nutrition_hero_banner_1789550950734.jpg';
import foodDiscoveryImg from '../assets/images/food_discovery_card_1789550965886.jpg';
import smartDetectiveImg from '../assets/images/smart_detective_card_1789550980751.jpg';

interface HeroVisualBannerProps {
  onStartScanning?: () => void;
  onExploreDemo?: () => void;
}

export const HeroVisualBanner: React.FC<HeroVisualBannerProps> = ({
  onStartScanning,
  onExploreDemo,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-850 to-slate-900 text-white shadow-md border border-indigo-700/40">
      {/* Subtle background glow effect */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Heading, Subtitle and Key Highlights */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khoa học dinh dưỡng học đường & Tư duy phản biện</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug">
              Trở thành <span className="text-amber-300">người tiêu dùng thông thái</span> khi đọc nhãn thực phẩm
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Nhận diện chữ viết bao bì bằng AI, phát hiện bẫy khẩu phần thu nhỏ, tính toán chính xác lượng calo & đường khi ăn hết gói, và rèn luyện thói quen kiểm tra hạn dùng an toàn.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-white flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Bóc tách 5 góc toàn diện
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-white flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Công thức minh bạch (120 kcal × 2 = 240 kcal)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-white flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Không đoán mò hạn sử dụng
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onStartScanning && (
              <button
                onClick={onStartScanning}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-slate-950" />
                <span>Mở Camera / Quét nhãn ngay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {onExploreDemo && (
              <button
                onClick={onExploreDemo}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-200" />
                <span>Xem ví dụ sách giáo khoa</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: High Quality Visual Illustration */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-xl overflow-hidden shadow-xl border border-white/20 group">
            <img
              src={heroBannerImg}
              alt="Minh họa khám phá nhãn thực phẩm dinh dưỡng"
              referrerPolicy="no-referrer"
              className="w-full h-48 sm:h-56 lg:h-64 object-cover transform group-hover:scale-102 transition duration-500"
            />
            {/* Overlay tag */}
            <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-2xs sm:text-xs flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium text-slate-200">
                  Dinh dưỡng lành mạnh • Lựa chọn thông minh
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold text-3xs">
                CHUẨN STEM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VisualSideCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Card 1: Thám tử nhãn thực phẩm */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between hover:shadow-xs transition">
        <div>
          <div className="relative rounded-lg overflow-hidden mb-3 border border-slate-100">
            <img
              src={smartDetectiveImg}
              alt="Thám tử đọc nhãn thực phẩm"
              referrerPolicy="no-referrer"
              className="w-full h-36 sm:h-40 object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-indigo-600/90 text-white text-3xs font-bold tracking-wider uppercase">
              Bí quyết mua sắm
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🔎 3 Nguyên tắc vàng khi đọc nhãn</span>
          </h3>

          <ul className="mt-2 space-y-1.5 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-indigo-700 shrink-0">1.</span>
              <span>
                <strong>Khẩu phần ăn:</strong> Nhìn số phần trong 1 gói trước khi xem calo (1 gói có thể có 2-3 phần).
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-indigo-700 shrink-0">2.</span>
              <span>
                <strong>Thứ tự thành phần:</strong> Thành phần ghi đầu tiên là chất chiếm trọng lượng nhiều nhất.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-indigo-700 shrink-0">3.</span>
              <span>
                <strong>Hạn dùng (EXP/HSD):</strong> Không mua sản phẩm bị nhòe hạn hoặc gần sát ngày hết hạn.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
          <span>Kỹ năng tiêu dùng học đường</span>
          <span className="font-semibold text-indigo-600">Đọc kỹ trước khi ăn</span>
        </div>
      </div>

      {/* Card 2: Thực phẩm lành mạnh & Cân bằng */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between hover:shadow-xs transition">
        <div>
          <div className="relative rounded-lg overflow-hidden mb-3 border border-slate-100">
            <img
              src={foodDiscoveryImg}
              alt="Thực phẩm tươi và dinh dưỡng cân bằng"
              referrerPolicy="no-referrer"
              className="w-full h-36 sm:h-40 object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-700/90 text-white text-3xs font-bold tracking-wider uppercase">
              Sống khỏe mỗi ngày
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🥗 Dinh dưỡng cân bằng cho tuổi học trò</span>
          </h3>

          <ul className="mt-2 space-y-1.5 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-emerald-700 shrink-0">•</span>
              <span>
                <strong>Cắt giảm đường tự do:</strong> Tổ chức Y tế Thế giới khuyến cáo học sinh không dùng quá 25g đường/ngày.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-emerald-700 shrink-0">•</span>
              <span>
                <strong>Cảnh giác với muối Natri:</strong> Snack mặn, mì ăn liền thường chứa lượng natri rất cao.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-emerald-700 shrink-0">•</span>
              <span>
                <strong>Ưu tiên thực phẩm tươi:</strong> Trái cây, rau củ và sữa tươi không đường luôn là lựa chọn ưu tiên.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
          <span>Khuyến nghị Viện Dinh Dưỡng</span>
          <span className="font-semibold text-emerald-600">Ăn uống có ý thức</span>
        </div>
      </div>
    </div>
  );
};

export const AmbientPageDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      {/* Top right subtle warm pastel gradient blob */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl opacity-60" />
      {/* Mid left subtle soft purple/indigo blob */}
      <div className="absolute top-96 left-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl opacity-50" />
      {/* Bottom right amber warmth */}
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl opacity-60" />
    </div>
  );
};
