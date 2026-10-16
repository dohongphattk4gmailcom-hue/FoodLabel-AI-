import React, { useState } from 'react';
import {
  User as UserIcon,
  LogIn,
  LogOut,
  ChevronDown,
  Settings,
  Shield,
  Sparkles,
  UtensilsCrossed,
  Activity,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

interface UserAccountBarProps {
  onOpenDailyLog?: () => void;
}

export const UserAccountBar: React.FC<UserAccountBarProps> = ({ onOpenDailyLog }) => {
  const { user, userProfile, logout, updateUserProfile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  // Profile edit fields
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState<number | ''>('');
  const [editWeight, setEditWeight] = useState<number | ''>('');
  const [editHeight, setEditHeight] = useState<number | ''>('');
  const [editGender, setEditGender] = useState<'male' | 'female' | 'other'>('male');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setShowDropdown(false);
  };

  const handleOpenProfileEditor = () => {
    if (userProfile) {
      setEditName(userProfile.displayName || '');
      setEditAge(userProfile.age || '');
      setEditWeight(userProfile.weightKg || '');
      setEditHeight(userProfile.heightCm || '');
      setEditGender(userProfile.gender || 'male');
    }
    setShowProfileEditor(true);
    setShowDropdown(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUserProfile({
        displayName: editName.trim() || 'Học sinh FoodLabel',
        age: editAge ? Number(editAge) : undefined,
        weightKg: editWeight ? Number(editWeight) : undefined,
        heightCm: editHeight ? Number(editHeight) : undefined,
        gender: editGender,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowProfileEditor(false);
      }, 1200);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAuth('login')}
            className="px-3 py-1.5 rounded-xl border border-emerald-600/40 hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-700" />
            <span>Đăng nhập</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAuth('register')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Đăng ký</span>
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authMode}
        />
      </>
    );
  }

  const displayName = userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'Học sinh';

  return (
    <div className="relative">
      {/* Logged in chip button */}
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-2.5 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 transition flex items-center gap-2 cursor-pointer shadow-2xs text-left"
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs overflow-hidden shrink-0">
          {user.photoURL ? (
            <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="hidden sm:block text-left pr-1 max-w-[130px] truncate">
          <p className="text-2xs font-extrabold text-slate-800 truncate leading-tight">
            {displayName}
          </p>
          <p className="text-3xs text-emerald-700 font-medium truncate">
            {user.email || 'Tài khoản học sinh'}
          </p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-2.5 border-b border-slate-100">
              <p className="text-xs font-black text-slate-800 truncate">{displayName}</p>
              <p className="text-2xs text-slate-500 truncate">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-3xs font-extrabold">
                🌱 Đã đăng nhập
              </span>
            </div>

            <div className="p-1 space-y-0.5">
              <button
                type="button"
                onClick={handleOpenProfileEditor}
                className="w-full px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-emerald-600" />
                <span>Hồ sơ cơ thể &amp; Chỉ số</span>
              </button>

              {onOpenDailyLog && (
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    onOpenDailyLog();
                  }}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                  <span>Xem nhật ký calo hằng ngày</span>
                </button>
              )}

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Profile Modal */}
      {showProfileEditor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative my-auto animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">Hồ sơ cá nhân học sinh</h3>
                <p className="text-xs text-emerald-100">Cập nhật thông tin để ứng dụng ước tính chỉ số chuẩn xác</p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileEditor(false)}
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-3.5">
              <div>
                <label className="block text-2xs font-extrabold text-slate-700 mb-1">
                  Biệt danh / Tên hiển thị
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-slate-700 mb-1">
                    Độ tuổi (11 – 15 tuổi)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="99"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="VD: 13"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-extrabold text-slate-700 mb-1">
                    Giới tính sinh học
                  </label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác / Không công khai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-slate-700 mb-1">
                    Chiều cao (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="100"
                    max="220"
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value ? Number(e.target.value) : '')}
                    placeholder="VD: 155"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-extrabold text-slate-700 mb-1">
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="25"
                    max="180"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value ? Number(e.target.value) : '')}
                    placeholder="VD: 45"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Đã lưu thông tin hồ sơ thành công!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileEditor(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? 'Đang lưu...' : 'Lưu hồ sơ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
