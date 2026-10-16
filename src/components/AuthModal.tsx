import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Scan,
  Activity,
  HeartPulse,
  Scale,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  canClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  canClose = true,
}) => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    authError,
    clearAuthError,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(true); // Default to full screen as requested

  // Sync mode whenever modal opens or defaultMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setLocalError(null);
      clearAuthError();
    }
  }, [isOpen, defaultMode]);

  // Support ESC key to close only if canClose is true
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && canClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, canClose]);

  if (!isOpen) return null;

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setLocalError(null);
    clearAuthError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email || !password) {
      setLocalError('Vui lòng điền đầy đủ email và mật khẩu!');
      return;
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setLocalError('Mật khẩu cần tối thiểu 6 ký tự để đảm bảo an toàn.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName || 'Học sinh FoodLabel');
      }
      onClose();
    } catch {
      // Error handled in AuthContext and displayed below
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLocalError(null);
    clearAuthError();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestAuth = async () => {
    setLocalError(null);
    clearAuthError();
    setIsSubmitting(true);
    try {
      await signInAsGuest();
      onClose();
    } catch {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || authError;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isFullScreen
          ? 'p-0 w-full h-full bg-white'
          : 'p-3 sm:p-6 lg:p-8 bg-slate-900/75 backdrop-blur-md overflow-y-auto'
      }`}
    >
      <div
        className={`bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 ${
          isFullScreen
            ? 'w-full h-full min-h-screen rounded-none'
            : 'w-full max-w-5xl rounded-3xl border border-slate-200/80 max-h-[92vh]'
        }`}
      >
        {/* ================= LEFT COLUMN: HERO & BRAND SHOWCASE ================= */}
        <div className="w-full md:w-5/12 lg:w-1/2 bg-gradient-to-br from-emerald-700 via-teal-800 to-emerald-950 text-white p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden shrink-0">
          {/* Decorative background blurs & patterns */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg">
                  🌱
                </div>
                <div>
                  <span className="text-3xs font-black tracking-widest uppercase text-emerald-300 block">
                    CỔNG GIÁO DỤC DINH DƯỠNG
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    FoodLabel AI
                  </h1>
                </div>
              </div>

              {/* Mobile back button inside hero - only show if canClose */}
              {canClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Quay lại ứng dụng"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Slogan */}
            <div className="space-y-3 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Dành cho Học sinh & Nhà trường
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                {mode === 'login' ? 'Chào mừng em quay trở lại!' : 'Khởi đầu thói quen dinh dưỡng thông minh'}
              </h2>
              <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-md">
                Tài khoản FoodLabel AI giúp em lưu trữ hồ sơ thể trạng, tính toán BMI khoa học, theo dõi calo hằng ngày và đọc hiểu nhãn thực phẩm theo chuẩn Bộ Y tế.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-8 space-y-3 hidden sm:block">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-200 shrink-0">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Quét nhãn AI tức thì</p>
                  <p className="text-2xs text-emerald-100/70">
                    Phân tích calo, đường, muối, chất béo bão hòa và cảnh báo vượt ngưỡng.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-teal-500/30 flex items-center justify-center text-teal-200 shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Theo dõi chỉ số BMI & Nhu cầu calo</p>
                  <p className="text-2xs text-emerald-100/70">
                    Giải thích chỉ số khoa học, không phán xét, hướng dẫn chế độ ăn cân bằng.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-200 shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Đồng bộ đám mây an toàn</p>
                  <p className="text-2xs text-emerald-100/70">
                    Dữ liệu nhật ký ăn uống được bảo mật riêng tư tuyệt đối trên máy chủ đám mây.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom educational badge */}
          <div className="relative z-10 pt-6 mt-6 border-t border-emerald-500/20 flex items-center justify-between text-2xs text-emerald-200/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Bảo mật tài khoản chuẩn Firebase
            </span>
            <span className="font-semibold text-emerald-300">FoodWise EDU 2026</span>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: EXPANDED LOGIN / REGISTER FORM ================= */}
        <div className="w-full md:w-7/12 lg:w-1/2 bg-white flex flex-col justify-between overflow-y-auto">
          {/* Top Controls Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
            {canClose ? (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại ứng dụng</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">
                  Cổng đăng nhập hệ thống FoodLabel AI
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {canClose ? (
                <>
                  {/* Fullscreen / Windowed toggle button */}
                  <button
                    type="button"
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="hidden md:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer"
                    title={isFullScreen ? 'Thu nhỏ cửa sổ' : 'Mở rộng toàn màn hình'}
                  >
                    {isFullScreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                    title="Đóng (ESC)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <span className="text-3xs sm:text-2xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span>🔒</span>
                  <span>Đăng nhập để mở ứng dụng</span>
                </span>
              )}
            </div>
          </div>

          {/* Form Content Container */}
          <div className="p-6 sm:p-10 lg:p-12 max-w-lg mx-auto w-full my-auto space-y-5">
            {/* Mode Switch Tabs */}
            <div className="p-1.5 rounded-2xl bg-slate-100 flex gap-1.5 border border-slate-200/80">
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-emerald-800 shadow-sm border border-emerald-100 scale-[1.01]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMode('register')}
                className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-emerald-800 shadow-sm border border-emerald-100 scale-[1.01]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng ký mới</span>
              </button>
            </div>

            {/* Quick Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-3 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng nhập nhanh với Google</span>
            </button>

            {/* Quick Guest Demo Option */}
            <button
              type="button"
              onClick={handleGuestAuth}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Dùng thử nhanh (Tài khoản Học sinh Khách - Mở ngay)</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-3xs font-extrabold text-slate-400 uppercase tracking-widest relative">
                hoặc điền email & mật khẩu
              </span>
            </div>

            {/* Error Message Box */}
            {activeError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <div className="space-y-0.5">
                  <p className="font-bold">Lưu ý xác thực:</p>
                  <p>{activeError}</p>
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Họ tên hoặc Biệt danh học sinh
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Minh Tuấn (Lớp 8A)"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hocsinh@thcs.edu.vn hoặc email của em"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự..."
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Xác nhận lại mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu phía trên..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-md shadow-emerald-700/25 transition cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>Đang kết nối hệ thống...</span>
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Đăng nhập vào FoodLabel AI</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Hoàn tất đăng ký tài khoản</span>
                  </>
                )}
              </button>
            </form>

            {/* Switch mode footer */}
            <div className="text-center pt-2">
              {mode === 'login' ? (
                <p className="text-xs text-slate-600">
                  Chưa có tài khoản học sinh?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('register')}
                    className="font-black text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer ml-1"
                  >
                    Đăng ký miễn phí ngay
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-600">
                  Đã có tài khoản từ trước?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="font-black text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer ml-1"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              )}
            </div>

            {/* Privacy & Safety Guarantee */}
            <div className="pt-4 border-t border-slate-100 flex items-start gap-2.5 text-3xs text-slate-500 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Cam kết quyền riêng tư học đường:</strong> Thông tin nhân trắc (chiều cao, cân nặng, độ tuổi) và lịch sử ăn uống của em chỉ dùng phục vụ giáo dục dinh dưỡng và tự theo dõi cá nhân, không chia sẻ cho bên thứ ba.
              </p>
            </div>
          </div>

          {/* Bottom spacing helper */}
          <div className="p-3 text-center text-3xs text-slate-400 border-t border-slate-100 hidden md:block">
            {canClose ? (
              <>
                Nhấn phím <kbd className="px-1.5 py-0.5 rounded-sm bg-slate-100 font-mono text-slate-600">ESC</kbd> hoặc bấm "Quay lại ứng dụng" để trở về trang chính.
              </>
            ) : (
              <span>
                Hệ thống yêu cầu đăng nhập tài khoản để bảo mật và lưu trữ hồ sơ dinh dưỡng của em.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
