import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calculator,
  Scale,
  Gamepad2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Search,
  Camera,
  UtensilsCrossed,
  FlaskConical,
  History,
  ShieldCheck,
  BookOpen,
  Info
} from 'lucide-react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { DemonstrationExample } from './components/DemonstrationExample';
import { FiveAnglesAnalysis } from './components/FiveAnglesAnalysis';
import { ScenarioGame } from './components/ScenarioGame';
import { LabelComparator } from './components/LabelComparator';
import { UnifiedLabelForm } from './components/UnifiedLabelForm';
import { DailyFoodLog } from './components/DailyFoodLog';
import { TestingSuite20Labels } from './components/TestingSuite20Labels';
import { FeedbackAndChangelog } from './components/FeedbackAndChangelog';
import { UserGuideModal } from './components/UserGuideModal';
import { AppUserGuide } from './components/AppUserGuide';
import { UserAccountBar } from './components/UserAccountBar';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { SAMPLE_LABELS, EMPTY_LABEL_DATA } from './data/sampleLabels';
import { FoodLabelData, FiveAnglesAnalysis as FiveAnglesType, RuleCheckResult, StudentObservation } from './types';
import { executeRuleChecks } from './utils/rulesEngine';

export default function App() {
  const { user, loading } = useAuth();

  // Navigation State
  const [activeNavTab, setActiveNavTab] = useState<
    'analyzer' | 'daily_log' | 'testing_suite' | 'demo' | 'game' | 'comparator' | 'changelog'
  >('analyzer');

  // User Guide Modal state ("khi sử dụng phần mềm sẽ hiện ra 1 ô hướng dẫn sử dụng")
  const [showGuideModal, setShowGuideModal] = useState<boolean>(() => {
    try {
      const dontShow = localStorage.getItem('foodwise_dont_auto_show_guide_v2');
      return dontShow !== 'true';
    } catch {
      return true;
    }
  });

  // Core Data: Trống hoàn toàn ban đầu. Chỉ sau khi quét nhãn hoặc tải ảnh mới bỏ dữ liệu vào!
  const [currentLabelData, setCurrentLabelData] = useState<FoodLabelData>(EMPTY_LABEL_DATA);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedImageMime, setUploadedImageMime] = useState<string>('image/jpeg');

  // Student Observation State (Ô "Em quan sát trước")
  const [studentObservationText, setStudentObservationText] = useState<string>('');

  // Amount consumed for math verification
  const [userConsumedGrams, setUserConsumedGrams] = useState<number>(30);

  // AI Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [rejectionNotice, setRejectionNotice] = useState<string | null>(null);
  const [fiveAnglesResult, setFiveAnglesResult] = useState<FiveAnglesType | null>(null);
  const [ruleCheckResult, setRuleCheckResult] = useState<RuleCheckResult | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Khi có dữ liệu nhãn được quét hoặc cập nhật, cập nhật lại kết quả 5 góc
  useEffect(() => {
    if (currentLabelData.productName || currentLabelData.caloriesPerServing > 0) {
      generateFiveAngles(currentLabelData, userConsumedGrams || 30);
    }
  }, [currentLabelData.productName, currentLabelData.caloriesPerServing, currentLabelData.servingSize]);

  const generateFiveAngles = (data: FoodLabelData, consumedGrams: number) => {
    const rules = executeRuleChecks(data, consumedGrams);
    setRuleCheckResult(rules);

    const isNoExpiry =
      !data.expirationDateText ||
      data.expirationDateText.includes('Không tìm thấy') ||
      data.expirationDateText.toLowerCase().includes('không') ||
      data.expirationDateText.includes('Chưa đọc rõ');

    const angles: FiveAnglesType = {
      servingAngle: {
        title: '🥣 Khẩu phần',
        servingText: `${data.servingSize} ${data.servingUnit} / khẩu phần`,
        servingsPerContainerText: `${data.servingsPerContainer} khẩu phần / hộp`,
        containerTotalWeight: `${data.netWeight} ${data.netWeightUnit}`,
        aiFinding: `Nhãn quy định khẩu phần là ${data.servingSize} ${data.servingUnit}. Toàn bộ hộp gồm ${data.servingsPerContainer} khẩu phần (tổng ${data.netWeight} ${data.netWeightUnit}). Khi ăn hết cả hộp sẽ nạp lượng dinh dưỡng gấp ${data.servingsPerContainer} lần.`,
        statedData: `${data.servingSize} ${data.servingUnit} (Hộp gồm ${data.servingsPerContainer} phần)`,
        calculatedData: `Tổng khối lượng cả hộp: ${data.servingSize * data.servingsPerContainer} ${data.servingUnit}`,
      },
      ingredientsAngle: {
        title: '🧾 Thành phần',
        rawText: data.ingredientsText,
        parsedList: data.ingredientList || [],
        topIngredients: (data.ingredientList || []).slice(0, 2),
        additivesOrSweeteners: (data.ingredientList || []).filter(
          (i) => i.includes('INS') || i.toLowerCase().includes('chất') || i.toLowerCase().includes('sucralose')
        ),
        allergens: data.allergensWarning ? [data.allergensWarning] : [],
        aiFinding: `Thành phần đứng đầu là "${data.ingredientList?.[0] || 'N/A'}" (chiếm tỷ lệ khối lượng lớn nhất theo quy định ghi nhãn).`,
        allergenNotice:
          'LỜI NHẮC AN TOÀN BẮT BUỘC: Em hãy tự đối chiếu danh sách thành phần trên bao bì gốc. Tuyệt đối không khẳng định sản phẩm an toàn chỉ vì AI không tìm thấy thành phần liên quan.',
      },
      nutritionAngle: {
        title: '📊 Dinh dưỡng',
        caloriesPerServing: data.caloriesPerServing,
        macronutrients: [
          { name: 'Năng lượng', value: data.caloriesPerServing, unit: 'kcal' },
          { name: 'Đường', value: data.sugarsPerServing, unit: 'g' },
          { name: 'Chất béo', value: data.totalFatPerServing, unit: 'g' },
          { name: 'Chất đạm', value: data.proteinPerServing, unit: 'g' },
          { name: 'Carbohydrate', value: data.carbsPerServing ?? null, unit: 'g' },
          { name: 'Natri', value: data.sodiumPerServing ?? null, unit: 'mg' },
        ],
        aiFinding: `Cung cấp ${data.caloriesPerServing} kcal cho 1 khẩu phần ${data.servingSize}${data.servingUnit}. Nếu dùng hết cả hộp (${data.servingsPerContainer} khẩu phần) thì năng lượng nạp vào là ${Math.round(data.caloriesPerServing * data.servingsPerContainer)} kcal.`,
        calculationNote: `Phép tính: ${data.caloriesPerServing} kcal × ${data.servingsPerContainer} khẩu phần = ${Math.round(data.caloriesPerServing * data.servingsPerContainer)} kcal.`,
      },
      expirationAngle: {
        title: '📅 Hạn dùng',
        rawText: data.expirationDateText,
        status: isNoExpiry ? 'not_found' : 'found',
        displayText: isNoExpiry
          ? 'Không tìm thấy thông tin hạn dùng trên dữ liệu cung cấp'
          : data.expirationDateText,
        aiFinding: isNoExpiry
          ? 'Quy tắc an toàn: Không tìm thấy thông tin hạn dùng trên dữ liệu cung cấp. Tuyệt đối không phỏng đoán ngày tháng khi bao bì không ghi rõ.'
          : `Ghi nhận hạn dùng: ${data.expirationDateText}. Cần kiểm tra ngày thực tế trước khi dùng.`,
      },
      checkpointsAngle: {
        title: '🔎 Điều cần kiểm tra',
        missingOrAmbiguousItems: isNoExpiry
          ? ['Thông tin Hạn sử dụng trên bao bì (Thiếu date rõ ràng)', 'Vị trí dập date trên đáy lon hoặc mép dập nhiệt']
          : ['Đối chiếu ngày thực tế với hạn sử dụng trên nắp hộp'],
        questionsForStudent: [
          `Nếu em ăn hết cả hộp (${data.netWeight} ${data.netWeightUnit}), em sẽ nạp bao nhiêu kcal?`,
          'Thành phần nào chiếm tỷ lệ khối lượng nhiều nhất trong sản phẩm này?',
        ],
        verificationTips: [
          'Kiểm tra đơn vị miligam (mg) ở Natri để tránh nhầm với gam (g).',
          'Đọc kỹ danh sách thành phần và cảnh báo dị ứng nếu có cơ địa nhạy cảm.',
        ],
      },
    };
    setFiveAnglesResult(angles);
  };

  // Automated AI Analysis Execution via /api/analyze-label
  const executeAIAnalysis = async (customPayload?: {
    imageBase64?: string;
    mimeType?: string;
    text?: string;
  }) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setRejectionNotice(null);

    try {
      let payload: any = {};
      if (customPayload) {
        payload = customPayload;
      } else if (uploadedImageBase64) {
        payload = {
          imageBase64: uploadedImageBase64,
          mimeType: uploadedImageMime,
          text: studentObservationText ? `Ghi chú của học sinh: ${studentObservationText}` : undefined,
        };
      } else {
        payload = {
          text: `Sản phẩm: ${currentLabelData.productName}. Khẩu phần: ${currentLabelData.servingSize}${currentLabelData.servingUnit}. Số khẩu phần: ${currentLabelData.servingsPerContainer}. Khối lượng tịnh: ${currentLabelData.netWeight}${currentLabelData.netWeightUnit}. Năng lượng: ${currentLabelData.caloriesPerServing} kcal. Đường: ${currentLabelData.sugarsPerServing}g. Đạm: ${currentLabelData.proteinPerServing}g. Béo: ${currentLabelData.totalFatPerServing}g. Natri: ${currentLabelData.sodiumPerServing}mg. Hạn dùng: ${currentLabelData.expirationDateText}. Thành phần: ${currentLabelData.ingredientsText}. Cảnh báo dị ứng: ${currentLabelData.allergensWarning || 'Không'}.`,
        };
      }

      const response = await fetch('/api/analyze-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Máy chủ phân tích phản hồi lỗi.');
      }

      const data = await response.json();

      // Check if AI rejected due to image quality (blurry, tilted, tiny text)
      if (
        data.isImageClear === false ||
        (data.unclearReason && data.unclearReason.includes('Chưa đọc rõ')) ||
        (data.rejectionNotice && data.rejectionNotice.includes('Chưa đọc rõ'))
      ) {
        setRejectionNotice(data.unclearReason || 'Chưa đọc rõ, vui lòng chụp lại');
      }

      if (data.parsedData) {
        // Enforce safety rule on expiration date
        const exp = data.parsedData.expirationDateText;
        if (!exp || exp.toLowerCase().includes('không')) {
          data.parsedData.expirationDateText =
            'Không tìm thấy thông tin hạn dùng trên dữ liệu cung cấp';
        }

        setCurrentLabelData(data.parsedData);
        const totalNet =
          data.parsedData.netWeight ||
          data.parsedData.servingSize * (data.parsedData.servingsPerContainer || 1) ||
          60;
        setUserConsumedGrams(totalNet);

        const rules = executeRuleChecks(data.parsedData, totalNet);
        setRuleCheckResult(rules);
      }

      if (data.fiveAngles) {
        setFiveAnglesResult(data.fiveAngles);
      } else {
        generateFiveAngles(data.parsedData || currentLabelData, userConsumedGrams);
      }

      // Smooth notification
      showToast('AI đã hoàn thành đọc nhãn! Em hãy đối chiếu với ảnh gốc bên dưới.');
    } catch (err: any) {
      console.warn('Lỗi khi gọi API AI, sử dụng mã quy tắc và mô hình nội bộ:', err);
      generateFiveAngles(currentLabelData, userConsumedGrams);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Image Upload handler that automatically kicks off AI OCR Scanning
  const handleImageFileSelected = (base64: string, mime: string, customHintText?: string) => {
    setUploadedImageBase64(base64);
    setUploadedImageMime(mime);
    setRejectionNotice(null);

    executeAIAnalysis({
      imageBase64: base64,
      mimeType: mime,
      text: customHintText || studentObservationText || undefined,
    });
  };

  // Update Consumed Grams & recalculate rules
  const handleConsumedGramsChange = (newGrams: number) => {
    setUserConsumedGrams(newGrams);
    const rules = executeRuleChecks(currentLabelData, newGrams);
    setRuleCheckResult(rules);
  };

  // Load a label from the 20 Testing suite directly into the unified form
  const handleLoadLabelFromTest = (data: FoodLabelData, imageUrl: string) => {
    setCurrentLabelData(data);
    setUploadedImageBase64(imageUrl);
    setUploadedImageMime('image/svg+xml');
    setActiveNavTab('analyzer');
    setUserConsumedGrams(data.netWeight || data.servingSize * data.servingsPerContainer);
    generateFiveAngles(data, data.netWeight || data.servingSize * data.servingsPerContainer);
    showToast(`Đã nạp mẫu "${data.productName}" lên Biểu mẫu chính.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // 1. Full-screen loading screen while checking auth session
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 flex flex-col items-center justify-center p-6 text-white selection:bg-emerald-500">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl shadow-2xl animate-pulse">
            🌱
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          FoodLabel AI
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/80 mb-6 font-medium text-center max-w-sm">
          Đang khởi tạo phiên làm việc học sinh và kiểm tra bảo mật...
        </p>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xs text-xs text-emerald-200">
          <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span>Vui lòng chờ giây lát...</span>
        </div>
      </div>
    );
  }

  // 2. If user is not logged in, enforce full-screen Auth Gate ("làm cho nó full màn hính luôn hồi nào đăng nhập xong mới mở ra")
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-slate-900">
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          defaultMode="login"
          canClose={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Disclaimer Banner at top */}
      <DisclaimerBanner />

      {/* Floating Toast Notification */}
      {notificationToast && (
        <div className="fixed top-14 right-4 z-50 bg-slate-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg border border-emerald-500/50 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-500/20 shadow-xs">
        {/* Tier 1: Brand & User Account Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 border-b border-slate-100">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-sm shadow-emerald-600/30">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  FoodLabel AI
                </h1>
                <span className="text-emerald-500 font-light hidden sm:inline">•</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800">
                  Đọc hiểu nhãn thực phẩm THCS
                </span>
              </div>
              <p className="text-3xs sm:text-2xs text-slate-500 hidden sm:block">
                AI trợ lý • Phân tích 5 góc • Tính toán calo trung thực • Cảnh báo dị ứng an toàn
              </p>
            </div>
          </div>

          {/* Right section: Guide button & User Account (Login/Register/Avatar) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-extrabold shadow-xs border border-amber-500/40 text-xs"
              title="Bấm để mở ô hướng dẫn sử dụng phần mềm"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">📖 Hướng dẫn sử dụng</span>
              <span className="sm:hidden">Hướng dẫn</span>
            </button>

            <UserAccountBar onOpenDailyLog={() => setActiveNavTab('daily_log')} />
          </div>
        </div>

        {/* Tier 2: Navigation Tabs */}
        <div className="bg-slate-50/60 px-4 sm:px-6 lg:px-8 py-1.5 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveNavTab('analyzer')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeNavTab === 'analyzer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Đọc &amp; Phân tích nhãn</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNavTab('daily_log')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeNavTab === 'daily_log'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
              title="Theo dõi thông tin cơ thể, BMI và calo hằng ngày"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Dinh dưỡng cá nhân &amp; BMI</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNavTab('testing_suite')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeNavTab === 'testing_suite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Kiểm thử 20 nhãn</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNavTab('demo')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeNavTab === 'demo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Kiểm tra phép tính (240 kcal)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNavTab('game')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeNavTab === 'game'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Bài tập tình huống</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNavTab('comparator')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeNavTab === 'comparator'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>So sánh 2 nhãn</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNavTab('changelog')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeNavTab === 'changelog'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Cải tiến V1 vs V2</span>
            </button>
          </div>
        </div>
      </header>

      {/* Ô Hướng dẫn sử dụng phần mềm (Modal tự động hiện ra hoặc bấm mở) */}
      <UserGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onTrySampleDemo={() => {
          setActiveNavTab('demo');
          showToast('Đã mở bài học kiểm tra phép tính mẫu 240 kcal.');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ================= TAB 1: MAIN UNIFIED FORM & 5 ANGLES ================= */}
        {activeNavTab === 'analyzer' && (
          <div className="space-y-6">
            {/* Ô HƯỚNG DẪN SỬ DỤNG NHANH 4 BƯỚC TRÊN TRANG */}
            <AppUserGuide
              onOpenDemo={() => setActiveNavTab('demo')}
              onOpenFullModalGuide={() => setShowGuideModal(true)}
            />

            {/* 1. MỘT FORM NHẬP NHÃN DUY NHẤT (Mục 2 & 3) */}
            <UnifiedLabelForm
              labelData={currentLabelData}
              onChangeLabelData={(updated) => {
                setCurrentLabelData(updated);
                generateFiveAngles(updated, userConsumedGrams);
              }}
              uploadedImageBase64={uploadedImageBase64}
              onImageSelected={handleImageFileSelected}
              studentObservation={studentObservationText}
              onChangeStudentObservation={setStudentObservationText}
              onAnalyzeAI={() => executeAIAnalysis()}
              isAnalyzing={isAnalyzing}
              rejectionNotice={rejectionNotice}
              onAddToDailyLog={(data) => {
                setActiveNavTab('daily_log');
                showToast(`Đã nạp món "${data.productName}" vào Nhật ký dinh dưỡng.`);
              }}
            />

            {/* 2. BỘ PHÉP TÍNH TIÊU THỤ & NHÂN ĐÔI CALO (Mục 5) - CHỈ HIỂN THỊ KHI ĐÃ QUÉT HOẶC CÓ DỮ LIỆU */}
            {ruleCheckResult && (uploadedImageBase64 || currentLabelData.productName) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        Kiểm tra phép tính khi ăn (Toán học dinh dưỡng)
                      </h3>
                      <p className="text-2xs text-slate-500">
                        Tính toán năng lượng, lượng đường và lượng muối thực tế nạp vào cơ thể
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-semibold text-slate-500">Lượng em ăn thực tế:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={userConsumedGrams}
                        onChange={(e) => handleConsumedGramsChange(parseFloat(e.target.value) || 0)}
                        className="w-20 p-1.5 text-xs font-bold text-center border border-emerald-300 rounded-lg bg-emerald-50 text-emerald-900"
                      />
                      <span className="text-xs font-bold text-slate-600">{currentLabelData.servingUnit || 'g'}</span>
                    </div>
                  </div>
                </div>

                {/* Slider for quick interaction */}
                <div className="space-y-1">
                  <div className="flex justify-between text-2xs text-slate-500">
                    <span>Kéo thanh trượt để đổi lượng ăn:</span>
                    <span className="font-bold text-emerald-800">
                      Tương đương: {ruleCheckResult.consumptionMath.ratio} lần khẩu phần
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max={Math.max(100, (currentLabelData.netWeight || currentLabelData.servingSize * 2) * 2)}
                    step="5"
                    value={userConsumedGrams}
                    onChange={(e) => handleConsumedGramsChange(parseFloat(e.target.value) || 5)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {/* Math breakdown results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-3xs font-bold text-slate-500 uppercase">Tổng Calo nạp vào</span>
                    <p className="text-xl font-black text-emerald-700">
                      {ruleCheckResult.consumptionMath.totalKcal} kcal
                    </p>
                    <p className="text-3xs text-slate-600 font-mono">
                      {ruleCheckResult.consumptionMath.calorieFormula}
                    </p>
                  </div>

                  <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 space-y-1">
                    <span className="text-3xs font-bold text-slate-500 uppercase">Tổng Đường nạp vào</span>
                    <p className="text-xl font-black text-rose-700">
                      {ruleCheckResult.consumptionMath.totalSugarGrams !== undefined
                        ? `${ruleCheckResult.consumptionMath.totalSugarGrams} g`
                        : 'Không có dữ liệu'}
                    </p>
                    <p className="text-3xs text-slate-600">
                      {currentLabelData.sugarsPerServing !== null
                        ? `${currentLabelData.sugarsPerServing}g × ${ruleCheckResult.consumptionMath.ratio}`
                        : 'Nhãn không ghi lượng đường'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                    <span className="text-3xs font-bold text-slate-500 uppercase">Tổng Natri nạp vào</span>
                    <p className="text-xl font-black text-blue-700">
                      {ruleCheckResult.consumptionMath.totalSodiumMg !== undefined
                        ? `${ruleCheckResult.consumptionMath.totalSodiumMg} mg`
                        : 'Không có dữ liệu'}
                    </p>
                    <p className="text-3xs text-slate-600">
                      {currentLabelData.sodiumPerServing !== null && currentLabelData.sodiumPerServing !== undefined
                        ? `~ ${Math.round((ruleCheckResult.consumptionMath.totalSodiumMg || 0) / 400 * 10) / 10} g muối ăn`
                        : 'Nhãn không ghi Natri'}
                    </p>
                  </div>
                </div>

                {/* Step explanation */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-2xs space-y-1 text-slate-700">
                  <p className="font-bold text-slate-900">Chi tiết các bước tính toán:</p>
                  <p className="whitespace-pre-line leading-relaxed">
                    {ruleCheckResult.consumptionMath.stepExplanation}
                  </p>
                </div>
              </div>
            )}

            {/* 3. HIỂN THỊ PHÂN TÍCH NĂM GÓC (Mục 4) - CHỈ KHI CÓ KẾT QUẢ ĐÃ QUÉT */}
            {fiveAnglesResult && (uploadedImageBase64 || currentLabelData.productName) && (
              <FiveAnglesAnalysis
                labelData={currentLabelData}
                fiveAngles={fiveAnglesResult}
                ruleCheck={ruleCheckResult}
                userConsumedGrams={userConsumedGrams}
              />
            )}
          </div>
        )}

        {/* ================= TAB 2: DAILY FOOD LOG (Mục 8) ================= */}
        {activeNavTab === 'daily_log' && (
          <DailyFoodLog currentScannedLabel={currentLabelData} />
        )}

        {/* ================= TAB 3: 20 TESTING LABELS SUITE (Mục 6) ================= */}
        {activeNavTab === 'testing_suite' && (
          <TestingSuite20Labels onLoadLabelToMainForm={handleLoadLabelFromTest} />
        )}

        {/* ================= TAB 4: CALCULATION DEMO (Mục 5) ================= */}
        {activeNavTab === 'demo' && (
          <DemonstrationExample
            onLoadExampleToAnalyzer={(data) => {
              setCurrentLabelData(data);
              setActiveNavTab('analyzer');
              generateFiveAngles(data, data.netWeight);
              showToast('Đã nạp mẫu chuẩn SGK lên Trợ lý.');
            }}
          />
        )}

        {/* ================= TAB 5: SCENARIOS GAME ================= */}
        {activeNavTab === 'game' && <ScenarioGame />}

        {/* ================= TAB 6: COMPARATOR ================= */}
        {activeNavTab === 'comparator' && (
          <LabelComparator
            onLoadToAnalyzer={(data) => {
              setCurrentLabelData(data);
              setActiveNavTab('analyzer');
              generateFiveAngles(data, data.netWeight);
              showToast(`Đã nạp nhãn "${data.productName}" vào Phân tích.`);
            }}
          />
        )}

        {/* ================= TAB 7: CHANGELOG & FEEDBACK (Mục 9) ================= */}
        {activeNavTab === 'changelog' && <FeedbackAndChangelog />}
      </main>

      {/* Educational Footer with Safe Disclaimer (Mục 11) */}
      <footer className="bg-white border-t border-slate-200 py-6 text-2xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 text-xs">FoodLabel AI</span>
              <span className="text-slate-300">|</span>
              <span>Ứng dụng AI Hỗ trợ Học sinh THCS Đọc hiểu Nhãn Thực phẩm</span>
            </div>
            <div className="text-3xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
              Phiên bản V2.0 • Chuẩn Giáo dục Khoa học
            </div>
          </div>
          <p className="leading-relaxed text-3xs text-slate-500 max-w-4xl">
            <strong>Giới hạn an toàn (Mục 11):</strong> FoodLabel AI là công cụ học tập và rèn luyện kỹ năng số, không phải công cụ tư vấn y tế. Ứng dụng không đánh giá tình trạng sức khỏe cá nhân, không kê đơn chế độ ăn, không chẩn đoán dị ứng và không khẳng định thực phẩm an toàn tuyệt đối chỉ từ ảnh nhãn. Học sinh và gia đình luôn cần đối chiếu bao bì gốc và tham khảo ý kiến người lớn hoặc chuyên gia dinh dưỡng khi cần thiết.
          </p>
        </div>
      </footer>
    </div>
  );
}
