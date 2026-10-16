import React, { useState, useEffect, useMemo } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Info,
  Calendar,
  Sparkles,
  Flame,
  Candy,
  Droplets,
  BookOpen,
  User,
  Heart,
  Scale,
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ShieldCheck,
  Target,
  BarChart3,
  PieChart,
  HelpCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import {
  DailyFoodLogItem,
  FoodLabelData,
  UserPersonalProfile,
  ActivityLevel,
  NutritionGoal,
  MealType,
} from '../types';
import { calculateBmiAnalysis, estimateCalorieNeeds } from '../utils/nutritionAdvisor';
import { COMMON_FOODS_DATABASE, CommonFoodItem } from '../data/commonFoodsDatabase';

interface DailyFoodLogProps {
  currentScannedLabel?: FoodLabelData;
  onSelectProductForAnalysis?: (data: FoodLabelData) => void;
}

const STORAGE_KEY_ITEMS = 'foodwise_daily_log_items_v3';
const STORAGE_KEY_PROFILE = 'foodwise_user_profile_v3';
const STORAGE_KEY_HISTORY = 'foodwise_weekly_calorie_history_v3';

// Default secondary school student profile (Học sinh THCS lớp 8)
const DEFAULT_PROFILE: UserPersonalProfile = {
  name: 'Học sinh THCS',
  weightKg: 46,
  heightCm: 156,
  age: 13,
  gender: 'unspecified',
  activityLevel: 'moderate',
  personalGoal: 'balanced',
  isProfileSet: true,
};

// Initial demo items for students
const INITIAL_DEMO_ITEMS: DailyFoodLogItem[] = [
  {
    id: 'demo-item-1',
    productName: 'Bánh mì kẹp thịt chả & pate',
    servingSize: 130,
    servingUnit: 'g',
    quantityServings: 1,
    consumedWeight: 130,
    calories: 385,
    protein: 14.5,
    fat: 13.2,
    carbs: 52.0,
    sugars: 4.2,
    sodium: 680,
    saltGrams: 1.7,
    mealType: 'breakfast',
    dateKey: new Date().toISOString().split('T')[0],
    loggedAt: '06:45 Sáng',
    notes: 'Bữa sáng trước khi tới trường',
  },
  {
    id: 'demo-item-2',
    productName: 'Sữa tươi tiệt trùng có đường (1 hộp)',
    servingSize: 180,
    servingUnit: 'ml',
    quantityServings: 1,
    consumedWeight: 180,
    calories: 135,
    protein: 5.4,
    fat: 5.9,
    carbs: 15.3,
    sugars: 14.5,
    sodium: 85,
    saltGrams: 0.21,
    mealType: 'snack',
    dateKey: new Date().toISOString().split('T')[0],
    loggedAt: '09:25 Giờ ra chơi',
    notes: 'Uống giờ giải lao tiết 2',
  },
  {
    id: 'demo-item-3',
    productName: 'Cơm tấm sườn nướng',
    servingSize: 350,
    servingUnit: 'g',
    quantityServings: 1,
    consumedWeight: 350,
    calories: 590,
    protein: 28.0,
    fat: 19.5,
    carbs: 76.0,
    sugars: 6.5,
    sodium: 980,
    saltGrams: 2.45,
    mealType: 'lunch',
    dateKey: new Date().toISOString().split('T')[0],
    loggedAt: '12:00 Bữa trưa',
    notes: 'Ăn kèm dưa leo và canh cải',
  },
];

export const DailyFoodLog: React.FC<DailyFoodLogProps> = ({ currentScannedLabel }) => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'register'>('login');

  // 1. User Personal Profile state
  const [profile, setProfile] = useState<UserPersonalProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read user profile:', e);
    }
    return DEFAULT_PROFILE;
  });

  // Synchronize with logged-in user profile
  useEffect(() => {
    if (userProfile) {
      setProfile((prev) => ({
        ...prev,
        name: userProfile.displayName || prev.name,
        age: userProfile.age ?? prev.age,
        weightKg: userProfile.weightKg ?? prev.weightKg,
        heightCm: userProfile.heightCm ?? prev.heightCm,
        gender: (userProfile.gender as any) ?? prev.gender,
      }));
    }
  }, [userProfile]);

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [tempProfile, setTempProfile] = useState<UserPersonalProfile>(profile);

  // 2. Food Log Items state
  const [logItems, setLogItems] = useState<DailyFoodLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read food log items:', e);
    }
    return INITIAL_DEMO_ITEMS;
  });

  // 3. UI and Modal states
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedMealTab, setSelectedMealTab] = useState<'all' | MealType>('all');
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [activeViewTab, setActiveViewTab] = useState<'tracker' | 'bmi' | 'statistics'>('tracker');

  // Form states for manual food entry
  const [formName, setFormName] = useState('');
  const [formMealType, setFormMealType] = useState<MealType>('breakfast');
  const [formServings, setFormServings] = useState(1);
  const [formServingSize, setFormServingSize] = useState(100);
  const [formServingUnit, setFormServingUnit] = useState('g');
  const [formCalories, setFormCalories] = useState(150);
  const [formProtein, setFormProtein] = useState<number | string>(5);
  const [formFat, setFormFat] = useState<number | string>(3);
  const [formCarbs, setFormCarbs] = useState<number | string>(20);
  const [formSugars, setFormSugars] = useState<number | string>(6);
  const [formSodium, setFormSodium] = useState<number | string>(120);
  const [formNotes, setFormNotes] = useState('');

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Error saving profile:', e);
    }
  }, [profile]);

  // Persist Log Items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(logItems));
    } catch (e) {
      console.warn('Error saving log items:', e);
    }
  }, [logItems]);

  // Calculations: BMI Analysis
  const bmiAnalysis = useMemo(() => {
    return calculateBmiAnalysis(profile.weightKg, profile.heightCm, profile.age, profile.gender);
  }, [profile.weightKg, profile.heightCm, profile.age, profile.gender]);

  // Calculations: Calorie Needs Estimate (TDEE)
  const calorieNeeds = useMemo(() => {
    return estimateCalorieNeeds(profile);
  }, [profile]);

  // Daily Totals
  const totals = useMemo(() => {
    const totalCal = logItems.reduce((acc, item) => acc + item.calories, 0);
    const totalSugar = Math.round(logItems.reduce((acc, item) => acc + item.sugars, 0) * 10) / 10;
    const totalSodium = logItems.reduce((acc, item) => acc + item.sodium, 0);
    const totalSaltG = Math.round((totalSodium / 400) * 100) / 100;
    const totalProtein = Math.round(logItems.reduce((acc, item) => acc + (item.protein || 0), 0) * 10) / 10;
    const totalFat = Math.round(logItems.reduce((acc, item) => acc + (item.fat || 0), 0) * 10) / 10;
    const totalCarbs = Math.round(logItems.reduce((acc, item) => acc + (item.carbs || 0), 0) * 10) / 10;

    return {
      calories: totalCal,
      sugars: totalSugar,
      sodium: totalSodium,
      saltGrams: totalSaltG,
      protein: totalProtein,
      fat: totalFat,
      carbs: totalCarbs,
    };
  }, [logItems]);

  // Comparison Percentages against estimated targets
  const calPercent = Math.min(100, Math.round((totals.calories / calorieNeeds.tdee) * 100));
  const sugarPercent = Math.min(100, Math.round((totals.sugars / calorieNeeds.sugarMaxGrams) * 100));
  const sodiumPercent = Math.min(100, Math.round((totals.sodium / calorieNeeds.sodiumMaxMg) * 100));
  const proteinPercent = Math.min(100, Math.round((totals.protein / calorieNeeds.proteinGramsTarget) * 100));
  const carbPercent = Math.min(100, Math.round((totals.carbs / calorieNeeds.carbGramsTarget) * 100));
  const fatPercent = Math.min(100, Math.round((totals.fat / calorieNeeds.fatGramsTarget) * 100));

  // Filtered Common Foods for search
  const filteredCommonFoods = useMemo(() => {
    return COMMON_FOODS_DATABASE.filter((food) => {
      const matchQuery =
        food.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
        food.portionDesc.toLowerCase().includes(foodSearchQuery.toLowerCase());
      const matchCategory =
        selectedCategoryFilter === 'all' || food.category === selectedCategoryFilter;
      return matchQuery && matchCategory;
    });
  }, [foodSearchQuery, selectedCategoryFilter]);

  // Filtered Log Items for meal tabs
  const filteredLogItems = useMemo(() => {
    if (selectedMealTab === 'all') return logItems;
    return logItems.filter((item) => (item.mealType || 'snack') === selectedMealTab);
  }, [logItems, selectedMealTab]);

  // 7-day historical simulation based on current items for the statistics chart
  const weeklyHistoryData = useMemo(() => {
    const days = [
      { day: 'T2', name: 'Thứ Hai', kcal: Math.round(calorieNeeds.tdee * 0.92) },
      { day: 'T3', name: 'Thứ Ba', kcal: Math.round(calorieNeeds.tdee * 0.98) },
      { day: 'T4', name: 'Thứ Tư', kcal: Math.round(calorieNeeds.tdee * 1.05) },
      { day: 'T5', name: 'Thứ Năm', kcal: Math.round(calorieNeeds.tdee * 0.88) },
      { day: 'T6', name: 'Thứ Sáu', kcal: Math.round(calorieNeeds.tdee * 1.02) },
      { day: 'T7', name: 'Thứ Bảy', kcal: Math.round(calorieNeeds.tdee * 1.1) },
      { day: 'CN', name: 'Hôm nay', kcal: totals.calories > 0 ? totals.calories : Math.round(calorieNeeds.tdee * 0.95) },
    ];
    return days;
  }, [calorieNeeds.tdee, totals.calories]);

  // Add Item from Common Food Database
  const handleAddFromCommon = (food: CommonFoodItem, mealType: MealType = 'breakfast') => {
    const newItem: DailyFoodLogItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productName: food.name,
      servingSize: food.servingSizeGrams,
      servingUnit: 'g',
      quantityServings: 1,
      consumedWeight: food.servingSizeGrams,
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      sugars: food.sugars,
      sodium: food.sodium,
      saltGrams: Math.round((food.sodium / 400) * 100) / 100,
      mealType,
      dateKey: new Date().toISOString().split('T')[0],
      loggedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      notes: food.healthTip ? `Lời khuyên: ${food.healthTip}` : 'Thêm từ thực đơn học đường phổ biến',
    };

    setLogItems((prev) => [newItem, ...prev]);
  };

  // Add Item from currently scanned label
  const handleAddFromScanned = () => {
    if (!currentScannedLabel || !currentScannedLabel.productName) return;

    setFormName(currentScannedLabel.productName);
    setFormServingSize(currentScannedLabel.servingSize || 30);
    setFormServingUnit(currentScannedLabel.servingUnit || 'g');
    setFormCalories(currentScannedLabel.caloriesPerServing || 120);
    setFormProtein(currentScannedLabel.proteinPerServing ?? 3);
    setFormFat(currentScannedLabel.totalFatPerServing ?? 2);
    setFormCarbs(currentScannedLabel.carbsPerServing ?? 15);
    setFormSugars(currentScannedLabel.sugarsPerServing ?? 5);
    setFormSodium(currentScannedLabel.sodiumPerServing ?? 80);
    setFormServings(1);
    setFormNotes('Trích xuất từ nhãn thực phẩm vừa quét');
    setIsAddingNew(true);
  };

  // Save manual/edited item
  const handleSaveItem = () => {
    if (!formName.trim()) return;

    const servings = Math.max(0.1, Number(formServings) || 1);
    const calPerServing = Number(formCalories) || 0;
    const proteinPerServing = formProtein === '' ? 0 : Number(formProtein) || 0;
    const fatPerServing = formFat === '' ? 0 : Number(formFat) || 0;
    const carbsPerServing = formCarbs === '' ? 0 : Number(formCarbs) || 0;
    const sugarPerServing = formSugars === '' ? 0 : Number(formSugars) || 0;
    const sodiumPerServing = formSodium === '' ? 0 : Number(formSodium) || 0;

    const totalCal = Math.round(calPerServing * servings);
    const totalProtein = Math.round(proteinPerServing * servings * 10) / 10;
    const totalFat = Math.round(fatPerServing * servings * 10) / 10;
    const totalCarbs = Math.round(carbsPerServing * servings * 10) / 10;
    const totalSugar = Math.round(sugarPerServing * servings * 10) / 10;
    const totalSodium = Math.round(sodiumPerServing * servings);
    const totalSaltG = Math.round((totalSodium / 400) * 100) / 100;
    const totalWeight = Math.round(formServingSize * servings);

    if (editingItemId) {
      setLogItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                productName: formName,
                servingSize: formServingSize,
                servingUnit: formServingUnit,
                quantityServings: servings,
                consumedWeight: totalWeight,
                calories: totalCal,
                protein: totalProtein,
                fat: totalFat,
                carbs: totalCarbs,
                sugars: totalSugar,
                sodium: totalSodium,
                saltGrams: totalSaltG,
                mealType: formMealType,
                notes: formNotes,
              }
            : item
        )
      );
      setEditingItemId(null);
    } else {
      const newItem: DailyFoodLogItem = {
        id: `item-${Date.now()}`,
        productName: formName,
        servingSize: formServingSize,
        servingUnit: formServingUnit,
        quantityServings: servings,
        consumedWeight: totalWeight,
        calories: totalCal,
        protein: totalProtein,
        fat: totalFat,
        carbs: totalCarbs,
        sugars: totalSugar,
        sodium: totalSodium,
        saltGrams: totalSaltG,
        mealType: formMealType,
        dateKey: new Date().toISOString().split('T')[0],
        loggedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        notes: formNotes,
      };
      setLogItems((prev) => [newItem, ...prev]);
    }

    setIsAddingNew(false);
    resetForm();
  };

  const handleStartEdit = (item: DailyFoodLogItem) => {
    setEditingItemId(item.id);
    setFormName(item.productName);
    setFormMealType(item.mealType || 'breakfast');
    setFormServings(item.quantityServings);
    setFormServingSize(item.servingSize);
    setFormServingUnit(item.servingUnit);
    setFormCalories(Math.round(item.calories / item.quantityServings));
    setFormProtein(item.protein ? Math.round((item.protein / item.quantityServings) * 10) / 10 : 0);
    setFormFat(item.fat ? Math.round((item.fat / item.quantityServings) * 10) / 10 : 0);
    setFormCarbs(item.carbs ? Math.round((item.carbs / item.quantityServings) * 10) / 10 : 0);
    setFormSugars(Math.round((item.sugars / item.quantityServings) * 10) / 10);
    setFormSodium(Math.round(item.sodium / item.quantityServings));
    setFormNotes(item.notes || '');
    setIsAddingNew(true);
  };

  const handleDeleteItem = (id: string) => {
    setLogItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearToday = () => {
    if (window.confirm('Em có chắc chắn muốn xóa toàn bộ các món đã ghi hôm nay?')) {
      setLogItems([]);
    }
  };

  const handleResetAllData = () => {
    if (
      window.confirm(
        'Thao tác này sẽ xóa toàn bộ thông tin cá nhân và nhật ký ăn uống đã lưu trên trình duyệt của em để bảo vệ quyền riêng tư. Em có muốn tiếp tục?'
      )
    ) {
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_ITEMS);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      setProfile(DEFAULT_PROFILE);
      setTempProfile(DEFAULT_PROFILE);
      setLogItems([]);
      alert('Đã xóa sạch dữ liệu cá nhân an toàn.');
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormMealType('breakfast');
    setFormServings(1);
    setFormServingSize(100);
    setFormServingUnit('g');
    setFormCalories(150);
    setFormProtein(5);
    setFormFat(3);
    setFormCarbs(20);
    setFormSugars(6);
    setFormSodium(120);
    setFormNotes('');
    setEditingItemId(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(tempProfile);
    setIsEditingProfile(false);
    if (user) {
      try {
        await updateUserProfile({
          displayName: tempProfile.name,
          age: tempProfile.age,
          weightKg: tempProfile.weightKg,
          heightCm: tempProfile.heightCm,
          gender: tempProfile.gender as any,
        });
      } catch (err) {
        console.warn('Could not sync profile to cloud:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* User Account Cloud Sync Banner */}
      {user ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
              ) : (
                '🌱'
              )}
            </div>
            <div>
              <p className="font-extrabold text-slate-800 text-xs">
                Tài khoản FoodLabel AI: <span className="text-emerald-700">{userProfile?.displayName || user.displayName || user.email}</span>
              </p>
              <p className="text-3xs sm:text-2xs text-slate-500">
                Hồ sơ thể chất và nhật ký calo được đồng bộ trực tiếp với máy chủ cá nhân của em.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Đã liên kết đám mây</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-2xs shrink-0">
              💡
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Tạo tài khoản học sinh để lưu giữ nhật ký ăn uống &amp; chỉ số BMI
              </p>
              <p className="text-3xs sm:text-2xs text-slate-600">
                Em đang dùng thử ở chế độ khách (dữ liệu tạm trên máy). Hãy đăng ký hoặc đăng nhập tài khoản FoodLabel AI để đồng bộ mọi lúc mọi nơi!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setAuthDefaultMode('login');
                setShowAuthModal(true);
              }}
              className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/50 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-700" />
              <span>Đăng nhập</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthDefaultMode('register');
                setShowAuthModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-300" />
              <span>Đăng ký mới</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP HEADER & INTRO BANNER */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-emerald-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-2xs font-extrabold border border-emerald-400/40">
              <Activity className="w-3.5 h-3.5" />
              <span>FoodLabel AI • Theo dõi dinh dưỡng cá nhân &amp; BMI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Chào {profile.name || 'em'}!</span>
              <span className="text-emerald-400 text-base font-normal">
                ({profile.age} tuổi • {profile.heightCm} cm • {profile.weightKg} kg)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Theo dõi thông tin cơ thể, tìm hiểu chỉ số BMI theo chuẩn tăng trưởng lứa tuổi THCS và ước tính nhu cầu năng lượng hằng ngày. Ghi lại lượng calo từ thực phẩm để rèn luyện thói quen dinh dưỡng khoa học và cân bằng.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTempProfile(profile);
                setIsEditingProfile(true);
              }}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-300" />
              <span>Cập nhật chỉ số cơ thể</span>
            </button>

            {currentScannedLabel && currentScannedLabel.productName && (
              <button
                type="button"
                onClick={handleAddFromScanned}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer animate-pulse"
                title="Bấm để lấy dữ liệu từ nhãn vừa quét"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>+ Thêm món vừa quét nhãn</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsAddingNew(!isAddingNew);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'Đóng form nhập' : 'Tự nhập món mới'}</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs: Tracker / BMI details / Statistics */}
        <div className="mt-6 pt-4 border-t border-emerald-500/30 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveViewTab('tracker')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeViewTab === 'tracker'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-700/50'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>1. Nhật ký thực phẩm &amp; Calo hôm nay</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('bmi')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeViewTab === 'bmi'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-700/50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>2. Thước đo BMI &amp; Nhu cầu năng lượng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('statistics')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeViewTab === 'statistics'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-emerald-200 hover:bg-emerald-700/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>3. Thống kê &amp; Biểu đồ 7 ngày</span>
          </button>
        </div>
      </div>

      {/* 2. MODAL / COLLAPSIBLE PROFILE EDITOR (Bước 1: Nhập thông tin cơ bản) */}
      {isEditingProfile && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Thông tin cơ thể &amp; Mục tiêu dinh dưỡng cá nhân
                </h3>
                <p className="text-2xs text-slate-500">
                  Nhập các chỉ số để ứng dụng tính BMI phù hợp độ tuổi và ước tính mức calo tham khảo.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tên người dùng / Biệt danh */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tên / Biệt danh:</label>
                <input
                  type="text"
                  required
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  placeholder="Ví dụ: Minh Anh, Nam..."
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              {/* Độ tuổi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Độ tuổi (năm):</label>
                <input
                  type="number"
                  required
                  min="6"
                  max="99"
                  value={tempProfile.age}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, age: parseInt(e.target.value) || 13 })
                  }
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
                <span className="text-3xs text-slate-400">Lứa tuổi THCS thường từ 11 – 15 tuổi</span>
              </div>

              {/* Chiều cao (cm) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Chiều cao (cm):</label>
                <input
                  type="number"
                  required
                  min="80"
                  max="230"
                  step="0.5"
                  value={tempProfile.heightCm}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, heightCm: parseFloat(e.target.value) || 150 })
                  }
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
                <span className="text-3xs text-slate-400">Dùng thước đứng đo vào buổi sáng</span>
              </div>

              {/* Cân nặng (kg) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Cân nặng (kg):</label>
                <input
                  type="number"
                  required
                  min="15"
                  max="200"
                  step="0.1"
                  value={tempProfile.weightKg}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, weightKg: parseFloat(e.target.value) || 45 })
                  }
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
                <span className="text-3xs text-slate-400">Cân vào buổi sáng sau thức dậy</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Giới tính (không bắt buộc) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Giới tính <span className="font-normal text-slate-400">(không bắt buộc):</span>
                </label>
                <select
                  value={tempProfile.gender || 'unspecified'}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, gender: e.target.value as any })
                  }
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                >
                  <option value="unspecified">Không muốn tiết lộ</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              {/* Mức độ hoạt động thể chất */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mức độ hoạt động thể chất:</label>
                <select
                  value={tempProfile.activityLevel}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, activityLevel: e.target.value as ActivityLevel })
                  }
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                >
                  <option value="sedentary">Ít vận động (chủ yếu ngồi học)</option>
                  <option value="light">Vận động nhẹ (đi bộ, thể dục 1-3 buổi/tuần)</option>
                  <option value="moderate">Vừa phải (chơi thể thao, bóng rổ 3-5 buổi/tuần)</option>
                  <option value="very_active">Rất năng động (thể thao cường độ cao 6-7 buổi)</option>
                </select>
              </div>

              {/* Mục tiêu cá nhân lành mạnh */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mục tiêu cá nhân:</label>
                <select
                  value={tempProfile.personalGoal}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, personalGoal: e.target.value as NutritionGoal })
                  }
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
                >
                  <option value="balanced">🥗 Tìm hiểu chế độ ăn cân bằng &amp; đa dạng</option>
                  <option value="maintain">⚖️ Duy trì cân nặng khỏe mạnh &amp; tăng chiều cao</option>
                  <option value="healthy_change">🏃 Tìm hiểu thay đổi cân nặng tích cực</option>
                </select>
              </div>
            </div>

            {/* Safety principles notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-2xs space-y-1 leading-relaxed">
              <p className="font-extrabold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Nguyên tắc an toàn học đường:</span>
              </p>
              <p>
                • Ứng dụng không tự động đặt mục tiêu ép cân, giảm cân cực đoan hay ăn kiêng khắc nghiệt cho học sinh THCS.
              </p>
              <p>
                • Thông tin chỉ lưu trên máy em và có thể chỉnh sửa hoặc xóa sạch bất kỳ lúc nào.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetAllData}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
              >
                Xóa toàn bộ dữ liệu &amp; Đặt lại
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu thông tin cơ thể</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 3. KEY METRICS SUMMARY BAR (Always visible) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: BMI */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold text-slate-500 uppercase flex items-center gap-1">
              <Scale className="w-3 h-3 text-emerald-600" />
              <span>Chỉ số BMI</span>
            </span>
            <span className={`text-3xs font-extrabold px-1.5 py-0.5 rounded ${bmiAnalysis.colorClass}`}>
              {bmiAnalysis.categoryLabel.split('(')[0]}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{bmiAnalysis.bmiValue}</span>
            <span className="text-3xs text-slate-400">kg/m²</span>
          </div>
          <p className="text-3xs text-slate-500 truncate">
            {profile.age < 19 ? 'Phân vị tăng trưởng THCS' : 'Tiêu chuẩn người lớn IDI'}
          </p>
        </div>

        {/* Metric 2: Estimated Daily Calories (TDEE) */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold text-slate-500 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Nhu cầu Calo ngày</span>
            </span>
            <span className="text-3xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              TDEE
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{calorieNeeds.tdee}</span>
            <span className="text-3xs text-slate-400">kcal/ngày</span>
          </div>
          <p className="text-3xs text-slate-500 truncate">
            BMR cơ bản: {calorieNeeds.bmr} kcal
          </p>
        </div>

        {/* Metric 3: Calories Consumed Today */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold text-slate-500 uppercase flex items-center gap-1">
              <UtensilsCrossed className="w-3 h-3 text-blue-500" />
              <span>Đã nạp hôm nay</span>
            </span>
            <span className="text-3xs font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              {calPercent}%
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totals.calories}</span>
            <span className="text-3xs text-slate-400">/ {calorieNeeds.tdee} kcal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                totals.calories > calorieNeeds.tdee ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, calPercent)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Free Sugar & Salt Check */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold text-slate-500 uppercase flex items-center gap-1">
              <Candy className="w-3 h-3 text-rose-500" />
              <span>Đường &amp; Muối</span>
            </span>
            <span
              className={`text-3xs font-extrabold px-1.5 py-0.5 rounded ${
                totals.sugars > calorieNeeds.sugarMaxGrams || totals.sodium > calorieNeeds.sodiumMaxMg
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {totals.sugars > calorieNeeds.sugarMaxGrams ? 'Vượt đường' : 'An toàn'}
            </span>
          </div>
          <div className="text-xs font-extrabold text-slate-800 space-y-0.5">
            <div>🍬 Đường: {totals.sugars}g / &lt;25g</div>
            <div>🧂 Natri: {totals.sodium}mg / &lt;2000mg</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW TAB 1: DAILY FOOD LOG TRACKER (Hôm nay em đã ăn gì?)                 */}
      {/* ========================================================================= */}
      {activeViewTab === 'tracker' && (
        <div className="space-y-6">
          {/* A. SEARCH AND ADD COMMON FOODS SECTION (Mục 4: Tìm kiếm thực phẩm) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600" />
                  <span>Tìm kiếm nhanh món ăn &amp; đồ uống học đường</span>
                </h3>
                <p className="text-2xs text-slate-500">
                  Gõ tên món để xem lượng calo, chất đạm, tinh bột, chất béo và bấm để thêm vào nhật ký hôm nay.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-3xs font-bold">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'bữa sáng', label: 'Bữa sáng' },
                  { id: 'bữa chính', label: 'Bữa chính' },
                  { id: 'ăn vặt', label: 'Ăn vặt' },
                  { id: 'đồ uống', label: 'Đồ uống' },
                  { id: 'trái cây', label: 'Trái cây' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-full cursor-pointer transition whitespace-nowrap ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={foodSearchQuery}
                onChange={(e) => setFoodSearchQuery(e.target.value)}
                placeholder="Tìm món: bánh mì, phở, xôi gà, sữa tươi, trà sữa, chuối, cơm tấm..."
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
              />
              {foodSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFoodSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Quick Food Items Grid (Carousel / Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {filteredCommonFoods.map((food) => (
                <div
                  key={food.id}
                  className="p-3 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition flex items-start justify-between gap-2.5 group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-2xl select-none shrink-0 mt-0.5">{food.icon}</span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-extrabold text-slate-900 truncate group-hover:text-emerald-900">
                        {food.name}
                      </p>
                      <p className="text-3xs text-slate-500">{food.portionDesc}</p>
                      <div className="flex flex-wrap items-center gap-1.5 text-3xs font-bold pt-1">
                        <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          🔥 {food.calories} kcal
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          🥩 {food.protein}g đạm
                        </span>
                        <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          🌾 {food.carbs}g tinh bột
                        </span>
                        {food.sugars > 15 && (
                          <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            🍬 {food.sugars}g đường
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => handleAddFromCommon(food, 'breakfast')}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-3xs font-extrabold shadow-2xs transition cursor-pointer flex items-center gap-1"
                      title="Thêm món này vào nhật ký"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B. FORM TO ADD OR EDIT FOOD (If active) */}
          {isAddingNew && (
            <div className="bg-emerald-50/70 rounded-3xl border-2 border-emerald-400 p-5 sm:p-6 space-y-4 shadow-md animate-fadeIn">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-emerald-700" />
                  <span>{editingItemId ? 'Chỉnh sửa món ăn' : 'Nhập thông tin dinh dưỡng thực phẩm'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Tên thực phẩm */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Tên món ăn / đồ uống:</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ví dụ: Bánh quy ngũ cốc, Sữa chua dâu..."
                    className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Thuộc bữa ăn */}
                <div className="space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Bữa ăn:</label>
                  <select
                    value={formMealType}
                    onChange={(e) => setFormMealType(e.target.value as MealType)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900"
                  >
                    <option value="breakfast">🌅 Bữa sáng</option>
                    <option value="lunch">☀️ Bữa trưa</option>
                    <option value="dinner">🌙 Bữa tối</option>
                    <option value="snack">🍪 Ăn xế / Ăn vặt</option>
                  </select>
                </div>

                {/* Số lượng khẩu phần */}
                <div className="space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Lượng đã ăn (Số phần):</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={formServings}
                    onChange={(e) => setFormServings(parseFloat(e.target.value) || 1)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900"
                  />
                </div>

                {/* Calo mỗi phần */}
                <div className="space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Calo 1 phần (kcal):</label>
                  <input
                    type="number"
                    min="0"
                    value={formCalories}
                    onChange={(e) => setFormCalories(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900"
                  />
                </div>

                {/* Chất đạm (Protein) */}
                <div className="space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Chất đạm / Protein (g):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formProtein}
                    onChange={(e) => setFormProtein(e.target.value)}
                    placeholder="g đạm"
                    className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900"
                  />
                </div>

                {/* Chất béo (Fat) */}
                <div className="space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Chất béo / Lipid (g):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formFat}
                    onChange={(e) => setFormFat(e.target.value)}
                    placeholder="g béo"
                    className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900"
                  />
                </div>

                {/* Tinh bột (Carbohydrate) */}
                <div className="space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Tinh bột / Carbs (g):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(e.target.value)}
                    placeholder="g carbs"
                    className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900"
                  />
                </div>

                {/* Đường */}
                <div className="space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Lượng đường (g):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formSugars}
                    onChange={(e) => setFormSugars(e.target.value)}
                    placeholder="Để trống nếu không có"
                    className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900"
                  />
                </div>

                {/* Natri */}
                <div className="space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Natri (mg):</label>
                  <input
                    type="number"
                    min="0"
                    value={formSodium}
                    onChange={(e) => setFormSodium(e.target.value)}
                    placeholder="Để trống nếu không có"
                    className="w-full text-xs font-bold p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900"
                  />
                </div>

                {/* Ghi chú */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-2xs font-bold text-slate-700">Ghi chú thêm:</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Ví dụ: Ăn sau giờ tập thể dục, uống ít đá..."
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveItem}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItemId ? 'Cập nhật món' : 'Lưu vào nhật ký'}</span>
                </button>
              </div>
            </div>
          )}

          {/* C. NUTRITION MACRONUTRIENT BALANCE (Đạm, Béo, Tinh bột, Đường, Muối) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  <span>Cân bằng dinh dưỡng đã nạp hôm nay</span>
                </h3>
                <p className="text-2xs text-slate-500">
                  Đối chiếu lượng chất dinh dưỡng thực tế với khuyến nghị cho học sinh {profile.age} tuổi.
                </p>
              </div>
              <div className="text-3xs font-extrabold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                Mục tiêu: {profile.personalGoal === 'balanced' ? 'Ăn cân bằng' : 'Duy trì thể trạng'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Protein Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    🥩 Chất đạm (Protein)
                  </span>
                  <span className="text-2xs font-extrabold text-emerald-700">
                    {proteinPercent}% mục tiêu
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-900">{totals.protein} g</span>
                  <span className="text-3xs text-slate-400">/ ~{calorieNeeds.proteinGramsTarget} g</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>
                <p className="text-3xs text-slate-500">
                  Rất quan trọng để phát triển chiều cao và cơ bắp lứa tuổi học sinh.
                </p>
              </div>

              {/* Carbohydrate Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    🌾 Tinh bột (Carbohydrate)
                  </span>
                  <span className="text-2xs font-extrabold text-blue-700">
                    {carbPercent}% mục tiêu
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-900">{totals.carbs} g</span>
                  <span className="text-3xs text-slate-400">/ ~{calorieNeeds.carbGramsTarget} g</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${carbPercent}%` }}
                  />
                </div>
                <p className="text-3xs text-slate-500">
                  Cung cấp năng lượng chính cho não bộ học tập và hoạt động thể chất.
                </p>
              </div>

              {/* Fat Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    🥑 Chất béo (Lipid)
                  </span>
                  <span className="text-2xs font-extrabold text-amber-700">
                    {fatPercent}% mục tiêu
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-900">{totals.fat} g</span>
                  <span className="text-3xs text-slate-400">/ ~{calorieNeeds.fatGramsTarget} g</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${fatPercent}%` }}
                  />
                </div>
                <p className="text-3xs text-slate-500">
                  Cần thiết để hấp thu các vitamin tan trong dầu (A, D, E, K).
                </p>
              </div>
            </div>
          </div>

          {/* D. CONSUMED FOODS LIST BY MEALS (Danh sách món đã ăn trong ngày) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Nhật ký ăn uống hôm nay ({logItems.length} món đã ghi)
                </h3>
              </div>

              {/* Meal Filter Tabs */}
              <div className="flex items-center gap-1 text-3xs font-bold">
                {[
                  { id: 'all', label: 'Tất cả bữa' },
                  { id: 'breakfast', label: '🌅 Sáng' },
                  { id: 'lunch', label: '☀️ Trưa' },
                  { id: 'dinner', label: '🌙 Tối' },
                  { id: 'snack', label: '🍪 Ăn vặt' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedMealTab(tab.id as any)}
                    className={`px-2.5 py-1 rounded-full cursor-pointer transition ${
                      selectedMealTab === tab.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {logItems.length === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <UtensilsCrossed className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Chưa có món nào được ghi hôm nay.</p>
                <p className="text-3xs text-slate-500">
                  Hãy chọn một món từ danh sách tìm kiếm phía trên hoặc bấm <strong>[Tự nhập món mới]</strong>.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredLogItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{item.productName}</span>
                        <span className="text-3xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                          {item.quantityServings} phần ({item.consumedWeight} {item.servingUnit})
                        </span>
                        <span className="text-3xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                          {item.mealType === 'breakfast'
                            ? '🌅 Bữa sáng'
                            : item.mealType === 'lunch'
                            ? '☀️ Bữa trưa'
                            : item.mealType === 'dinner'
                            ? '🌙 Bữa tối'
                            : '🍪 Ăn vặt'}
                        </span>
                        <span className="text-3xs text-slate-400">{item.loggedAt}</span>
                      </div>
                      {item.notes && (
                        <p className="text-3xs text-slate-500 italic truncate max-w-xl">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {/* Macronutrient breakdown tags */}
                      <div className="flex items-center gap-1.5 text-3xs font-extrabold">
                        <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                          🔥 {item.calories} kcal
                        </span>
                        {item.protein !== undefined && item.protein > 0 && (
                          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hidden sm:inline">
                            🥩 {item.protein}g đạm
                          </span>
                        )}
                        <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-900 border border-rose-200">
                          🍬 {item.sugars}g đường
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
                          🧂 {item.sodium}mg natri
                        </span>
                      </div>

                      {/* Edit and Delete Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                          title="Sửa số lượng khẩu phần"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          title="Xóa món này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {logItems.length > 0 && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleClearToday}
                  className="text-2xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                >
                  Xóa toàn bộ món hôm nay
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW TAB 2: DETAILED BMI & ENERGY REQUIREMENTS (Mục 4 & 5)                 */}
      {/* ========================================================================= */}
      {activeViewTab === 'bmi' && (
        <div className="space-y-6 animate-fadeIn">
          {/* A. VISUAL BMI GAUGE & EXPLANATION CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Phân tích Chỉ số Khối Cơ thể (BMI) theo lứa tuổi
                  </h3>
                </div>
                <p className="text-2xs text-slate-500">
                  Chuẩn đánh giá tăng trưởng học sinh THCS của Viện Dinh Dưỡng Quốc Gia &amp; Tổ chức Y tế Thế giới (WHO).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Công thức chuẩn:</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 font-mono text-xs font-extrabold">
                  BMI = Cân nặng (kg) / [Chiều cao (m)]²
                </span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-2xs font-bold">
                <span className="text-blue-700">Mảnh khảnh / Nhẹ cân (&lt; 5th)</span>
                <span className="text-emerald-700">Cân đối lý tưởng (5th – 85th)</span>
                <span className="text-amber-700">Nguy cơ thừa cân (85th – 95th)</span>
                <span className="text-rose-700">Nguy cơ béo phì (&gt; 95th)</span>
              </div>

              {/* Color Bar */}
              <div className="relative h-6 w-full rounded-2xl overflow-hidden flex shadow-inner">
                <div className="w-[20%] bg-blue-300" title="Nhẹ cân" />
                <div className="w-[50%] bg-emerald-400" title="Cân đối" />
                <div className="w-[18%] bg-amber-400" title="Nguy cơ thừa cân" />
                <div className="w-[12%] bg-rose-400" title="Nguy cơ béo phì" />

                {/* Pointer indicator */}
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-slate-950 shadow-md transform -translate-x-1/2 transition-all duration-700"
                  style={{
                    left: `${Math.max(
                      5,
                      Math.min(
                        95,
                        profile.age < 19
                          ? ((bmiAnalysis.bmiValue - 12) / (30 - 12)) * 100
                          : ((bmiAnalysis.bmiValue - 15) / (32 - 15)) * 100
                      )
                    )}%`,
                  }}
                >
                  <div className="w-3 h-3 bg-slate-950 rounded-full -top-1.5 -left-0.75 absolute" />
                </div>
              </div>

              {/* Indicator label */}
              <div className="flex items-center justify-between text-3xs text-slate-400 px-1 font-mono">
                <span>BMI ~14</span>
                <span>BMI ~18.5</span>
                <span>BMI ~22</span>
                <span>BMI ~25</span>
                <span>BMI ~30+</span>
              </div>
            </div>

            {/* Detailed Explanation Box */}
            <div className={`p-4 rounded-2xl border ${bmiAnalysis.colorClass} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>{bmiAnalysis.categoryLabel}</span>
                </span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white/70">
                  {bmiAnalysis.percentileRange}
                </span>
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                {bmiAnalysis.explanation}
              </p>
              <div className="pt-2 border-t border-black/10 flex items-start gap-2 text-2xs leading-relaxed">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                <div>
                  <span className="font-extrabold">Lời khuyên giáo dục: </span>
                  <span>{bmiAnalysis.educationalTip}</span>
                </div>
              </div>
            </div>

            {/* Safe Medical Disclaimer for Adolescents */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-2xs space-y-1">
              <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Quy tắc an toàn BMI học đường:</span>
              </p>
              <p>
                • <strong>Không áp dụng ngưỡng BMI người lớn cố định</strong> cho lứa tuổi thanh thiếu niên đang phát triển chiều cao và cơ bắp.
              </p>
              <p>
                • <strong>Không tự ép cân hay nhịn ăn:</strong> Cơ thể học sinh cần đủ năng lượng để não bộ tập trung học tập và hệ xương kéo dài.
              </p>
            </div>
          </div>

          {/* B. DETAILED CALORIE NEEDS & METABOLIC ESTIMATE (BMR & TDEE) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Flame className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Ước tính nhu cầu năng lượng hàng ngày (TDEE)
                </h3>
                <p className="text-2xs text-slate-500">
                  Công thức chuyển hóa năng lượng Mifflin-St Jeor và hệ số vận động thể chất (PAL).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-2xs font-extrabold text-amber-900 uppercase">
                  1. Năng lượng cơ bản (BMR)
                </span>
                <p className="text-2xl font-black text-amber-950">{calorieNeeds.bmr} kcal</p>
                <p className="text-3xs text-amber-800">
                  Năng lượng tối thiểu để duy trì sự sống (tim đập, phổi thở, não hoạt động) khi nghỉ ngơi hoàn toàn.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-2xs font-extrabold text-emerald-900 uppercase">
                  2. Hệ số vận động (PAL)
                </span>
                <p className="text-2xl font-black text-emerald-950">× {calorieNeeds.activityMultiplier}</p>
                <p className="text-3xs text-emerald-800">
                  Mức vận động: {profile.activityLevel === 'moderate' ? 'Vừa phải (thể thao 3-5 ngày)' : profile.activityLevel}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1">
                <span className="text-2xs font-extrabold text-teal-900 uppercase">
                  3. Tổng nhu cầu ước tính (TDEE)
                </span>
                <p className="text-2xl font-black text-teal-950">~{calorieNeeds.tdee} kcal/ngày</p>
                <p className="text-3xs text-teal-800">
                  Mức năng lượng tham khảo để duy trì học tập và thể chất khỏe mạnh.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-2xs text-slate-600 leading-relaxed">
              <span className="font-extrabold text-slate-800">Ghi chú khoa học: </span>
              {calorieNeeds.scientificNotes}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW TAB 3: 7-DAY NUTRITION HISTORY & EDUCATIONAL TIPS (Mục 4 & 5)         */}
      {/* ========================================================================= */}
      {activeViewTab === 'statistics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* A. 7-DAY CALORIE BAR CHART */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    Lịch sử năng lượng nạp 7 ngày gần nhất
                  </h3>
                </div>
                <p className="text-2xs text-slate-500">
                  Quan sát thói quen ăn uống hằng ngày so với mức năng lượng tham khảo ({calorieNeeds.tdee} kcal).
                </p>
              </div>

              <div className="flex items-center gap-3 text-3xs font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-emerald-500 rounded" />
                  <span>Cân đối</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-amber-500 rounded" />
                  <span>Vượt mức tham khảo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-slate-900 border-t-2 border-dashed border-slate-700" />
                  <span>Ngưỡng TDEE ({calorieNeeds.tdee})</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Container */}
            <div className="relative pt-6 pb-2">
              {/* Target Line */}
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-600/50 z-10 pointer-events-none"
                style={{ bottom: '50%' }}
              >
                <span className="absolute -top-3.5 right-2 text-3xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Chuẩn TDEE: {calorieNeeds.tdee} kcal
                </span>
              </div>

              {/* Bars */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end">
                {weeklyHistoryData.map((d, index) => {
                  const maxChartKcal = Math.max(calorieNeeds.tdee * 1.4, 2600);
                  const heightPercent = Math.min(100, Math.round((d.kcal / maxChartKcal) * 100));
                  const isOver = d.kcal > calorieNeeds.tdee * 1.05;

                  return (
                    <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-3xs font-black text-slate-700 opacity-80 group-hover:opacity-100">
                        {d.kcal}
                      </span>
                      <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl h-full flex items-end overflow-hidden p-0.5">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-700 ${
                            isOver ? 'bg-amber-500 group-hover:bg-amber-600' : 'bg-emerald-500 group-hover:bg-emerald-600'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-2xs font-extrabold text-slate-800 block">{d.day}</span>
                        <span className="text-3xs text-slate-400 hidden sm:block">{d.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-3xs text-slate-500 text-center">
              Biểu đồ giúp em quan sát tính ổn định của lượng thức ăn nạp vào qua các ngày học tập và cuối tuần.
            </p>
          </div>

          {/* B. EDUCATIONAL NUTRITION TIPS & HABITS (Bước 5: Gợi ý giáo dục dinh dưỡng) */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-950 font-black text-sm sm:text-base">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <span>Gợi ý giáo dục dinh dưỡng học đường (Mục 5 &amp; 7)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1 shadow-2xs">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  🌈 Đa dạng hóa thực phẩm "Cầu vồng":
                </span>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Cố gắng ăn ít nhất 5 màu sắc rau củ quả mỗi ngày (đỏ từ cà chua, cam từ cà rốt, xanh từ rau ngót, tím từ bắp cải tím, trắng từ củ cải). Mỗi màu sắc mang lại một nhóm chất chống oxy hóa tự nhiên khác nhau.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1 shadow-2xs">
                <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  🔍 Kỹ năng đọc nhãn thực phẩm chủ động:
                </span>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Khi mua đồ ăn nhẹ ở căng tin hay siêu thị, luôn kiểm tra <strong>Khối lượng 1 khẩu phần</strong> và <strong>Lượng đường tự do</strong>. Đừng để bao bì bắt mắt đánh lừa về hàm lượng calo thực tế!
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1 shadow-2xs">
                <span className="font-extrabold text-blue-900 flex items-center gap-1.5">
                  💧 Uống đủ nước lọc tự nhiên:
                </span>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Học sinh cần từ 1.5 đến 2 lít nước lọc mỗi ngày. Uống nước trước khi cảm thấy khát, hạn chế thay thế nước lọc bằng nước ngọt có ga hay trà sữa nhiều đường.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1 shadow-2xs">
                <span className="font-extrabold text-rose-900 flex items-center gap-1.5">
                  🛡️ Cảnh giác với trào lưu ép cân trên mạng:
                </span>
                <p className="text-2xs text-slate-600 leading-relaxed">
                  Tuyệt đối không bắt chước các chế độ ăn kiêng hà khắc, nhịn ăn gián đoạn không có hướng dẫn của người lớn hoặc uống thuốc giảm cân trôi nổi. Sức khỏe và sự tăng trưởng chiều cao mới là ưu tiên số một!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MANDATORY SCIENTIFIC REFERENCE & SAFETY DISCLAIMER (Mục 6 & 11) */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-2xs space-y-2">
        <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-xs">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Căn cứ khoa học &amp; Giới hạn an toàn (Mục 6 &amp; 11)</span>
        </div>
        <p className="leading-relaxed">
          • <strong>Nguồn tài liệu chính thống:</strong> Bảng Nhu cầu Dinh dưỡng Khuyến nghị cho người Việt Nam (Viện Dinh Dưỡng Quốc Gia - Bộ Y Tế); Khuyến cáo lượng đường và muối tiêu thụ (Tổ chức Y tế Thế giới - WHO); Chuẩn tăng trưởng trẻ em &amp; thanh thiếu niên 5-19 tuổi (WHO Growth Reference).
        </p>
        <p className="leading-relaxed text-slate-600">
          • <strong>Giới hạn an toàn:</strong> FoodLabel AI là công cụ hỗ trợ giáo dục dinh dưỡng học đường, giúp học sinh THCS hiểu về nhãn thực phẩm và xây dựng thói quen ăn uống lành mạnh. Ứng dụng không đưa ra chẩn đoán y khoa, không thay thế bác sĩ hoặc chuyên gia dinh dưỡng, và không kê đơn chế độ ăn bệnh lý cá nhân hóa.
        </p>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authDefaultMode}
      />
    </div>
  );
};
