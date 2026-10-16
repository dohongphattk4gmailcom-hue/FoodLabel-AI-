import React, { useState } from 'react';
import { Calculator, ArrowRight, Lightbulb, Box, CheckCircle2, RotateCcw } from 'lucide-react';
import foodDiscoveryImg from '../assets/images/food_discovery_card_1789550965886.jpg';
import { FoodLabelData } from '../types';

interface DemonstrationExampleProps {
  onLoadExampleToAnalyzer?: (data: FoodLabelData) => void;
}

export const DemonstrationExample: React.FC<DemonstrationExampleProps> = ({ onLoadExampleToAnalyzer }) => {
  // Demo baseline values: 120 kcal / 30 g, 2 servings per box
  const [servingSize, setServingSize] = useState<number>(30);
  const [servingsPerBox, setServingsPerBox] = useState<number>(2);
  const [caloriesPerServing, setCaloriesPerServing] = useState<number>(120);
  const [userAmountGrams, setUserAmountGrams] = useState<number>(60);

  const totalBoxWeight = servingSize * servingsPerBox;
  const totalBoxCalories = caloriesPerServing * servingsPerBox;

  // Real-time calculation based on user amount
  const userRatio = Math.round((userAmountGrams / servingSize) * 100) / 100;
  const userCalories = Math.round(caloriesPerServing * userRatio * 10) / 10;

  const isWholeBox = Math.abs(userAmountGrams - totalBoxWeight) < 0.1;

  const resetToStandardDemo = () => {
    setServingSize(30);
    setServingsPerBox(2);
    setCaloriesPerServing(120);
    setUserAmountGrams(60);
  };

  const handleApplyToAnalyzer = () => {
    if (onLoadExampleToAnalyzer) {
      onLoadExampleToAnalyzer({
        productName: 'Bánh ngũ cốc giòn Crispy Grain (Mẫu SGK)',
        brand: 'NutriBite',
        servingSize,
        servingUnit: 'g',
        servingsPerContainer: servingsPerBox,
        netWeight: totalBoxWeight,
        netWeightUnit: 'g',
        caloriesPerServing,
        sugarsPerServing: 6,
        totalFatPerServing: 4,
        proteinPerServing: 3,
        carbsPerServing: 18,
        sodiumPerServing: 90,
        ingredientsText: 'Bột mì, yến mạch (25%), dầu thực vật, đường, muối iod, chất tạo xốp (INS 500ii).',
        ingredientList: ['Bột mì', 'Yến mạch (25%)', 'Dầu thực vật', 'Đường', 'Muối iod', 'Chất tạo xốp (INS 500ii)'],
        expirationDateText: 'NSX: 10/01/2026 - HSD: 10/07/2026',
        allergensWarning: 'Có chứa lúa mì (gluten).',
      });
    }
  };

  // Validation state
  const isServingValid = servingSize > 0;
  const isBoxValid = servingsPerBox > 0;
  const isCaloriesValid = caloriesPerServing >= 0;
  const isAmountValid = userAmountGrams > 0;
  const isDataValid = isServingValid && isBoxValid && isCaloriesValid && isAmountValid;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Kiểm tra phép tính &amp; Nhân đôi năng lượng (Mục 5)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                120 × 2 = 240 kcal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Ví dụ: Một khẩu phần bánh có 120 kcal, một hộp có 2 khẩu phần. Khi dùng hết hộp: 120 × 2 = 240 kcal.
            </p>
          </div>
        </div>

        <button
          onClick={resetToStandardDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
          title="Khôi phục thông số chuẩn 120 kcal / 30g, 2 khẩu phần"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại chuẩn SGK (120 × 2 = 240)</span>
        </button>
      </div>

      {/* Invalid data alert if any input is negative or zero */}
      {!isDataValid && (
        <div className="my-4 p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
          <span>⚠️ Cảnh báo dữ liệu không hợp lệ:</span>
          <span className="font-normal">Khẩu phần, số phần và năng lượng phải lớn hơn 0 và không được để trống.</span>
        </div>
      )}

      {/* Primary Demonstration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* Left: Original Label Snippet & Interactive Inputs */}
        <div className="lg:col-span-4 bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-slate-200 text-slate-700 rounded">
                Dữ liệu ghi trên nhãn
              </span>
              <span className="text-3xs text-emerald-700 font-bold">Cho phép sửa thử</span>
            </div>

            {/* Product Image Illustration */}
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <img
                src={foodDiscoveryImg}
                alt="Bánh ngũ cốc giòn dinh dưỡng"
                referrerPolicy="no-referrer"
                className="w-full h-28 object-cover"
              />
            </div>

            <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs space-y-3 text-xs">
              {/* Field 1: Serving Size */}
              <div>
                <label className="text-slate-500 block font-semibold mb-1">Khối lượng 1 khẩu phần (gam):</label>
                <input
                  type="number"
                  min="1"
                  value={servingSize}
                  onChange={(e) => setServingSize(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 font-mono font-bold text-slate-900 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Field 2: Calories per Serving */}
              <div>
                <label className="text-slate-500 block font-semibold mb-1">Năng lượng 1 khẩu phần (kcal):</label>
                <input
                  type="number"
                  min="0"
                  value={caloriesPerServing}
                  onChange={(e) => setCaloriesPerServing(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 font-mono font-bold text-emerald-700 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Field 3: Servings per container */}
              <div>
                <label className="text-slate-500 block font-semibold mb-1">Số khẩu phần trong cả hộp:</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={servingsPerBox}
                  onChange={(e) => setServingsPerBox(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 font-mono font-bold text-indigo-700 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Visual Box Graphic */}
            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 mb-2">
                <Box className="w-4 h-4 text-indigo-600" />
                <span>Mô hình: 1 Hộp gồm {servingsPerBox} phần</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: Math.min(4, Math.ceil(servingsPerBox)) }).map((_, i) => (
                  <div key={i} className="bg-white border border-indigo-200 rounded p-2 text-center text-xs">
                    <span className="text-indigo-800 font-bold block">Phần {i + 1}</span>
                    <span className="text-slate-500">{servingSize}g • {caloriesPerServing} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={handleApplyToAnalyzer}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <span>Áp dụng thông số này lên Form chính</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: The Core Mathematical Explanation */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200">
            <div className="flex items-center gap-2 mb-3 text-emerald-900 font-bold text-base sm:text-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Phép tính khi dùng cả hộp (Toàn bộ bao bì):</span>
            </div>

            {/* Formulas Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Formula 1: Weight */}
              <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  1. Tổng khối lượng cả hộp
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight my-1">
                  {servingSize} × {servingsPerBox} = {totalBoxWeight} g
                </div>
                <p className="text-xs text-slate-600">
                  Khối lượng 1 khẩu phần ({servingSize} g) × số khẩu phần ({servingsPerBox}).
                </p>
              </div>

              {/* Formula 2: Calories */}
              <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  2. Tổng năng lượng khi dùng hết hộp
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight my-1">
                  {caloriesPerServing} × {servingsPerBox} = {totalBoxCalories} kcal
                </div>
                <p className="text-xs text-slate-600">
                  Năng lượng 1 khẩu phần ({caloriesPerServing} kcal) × số khẩu phần ({servingsPerBox}).
                </p>
              </div>
            </div>

            {/* Narrative Explanation */}
            <div className="mt-4 p-3.5 bg-white/90 rounded-lg border border-emerald-300 text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Giải thích vì sao kết quả là {totalBoxCalories} kcal:</span>
              </div>
              <p>
                Nhiều bạn thường nhầm tưởng rằng con số <strong>{caloriesPerServing} kcal</strong> ghi trên bao bì là cho cả hộp bánh.
                Tuy nhiên, nhà sản xuất quy định 1 hộp bánh nặng <strong>{totalBoxWeight} g</strong> chứa tới <strong>{servingsPerBox} khẩu phần</strong> (mỗi lần ăn chuẩn chỉ là {servingSize} g).
              </p>
              <p>
                Nếu học sinh ăn hết một mạch cả hộp bánh, cơ thể sẽ nạp gấp <strong>{servingsPerBox} lần</strong> khẩu phần tiêu chuẩn:
                <span className="inline-block mx-1 font-mono font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  {caloriesPerServing} kcal × {servingsPerBox} = {totalBoxCalories} kcal
                </span>.
              </p>
            </div>
          </div>

          {/* Dynamic Interactive Calculator */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Mô phỏng tương tác: Khi em ăn lượng tùy ý
              </span>
              <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Tỉ lệ: {userRatio} lần khẩu phần
              </span>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 flex justify-between mb-1">
                  <span>Lượng thực tế em ăn (gam):</span>
                  <span className="font-bold text-indigo-700">{userAmountGrams} g</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max={Math.max(120, totalBoxWeight * 2)}
                  step="5"
                  value={userAmountGrams}
                  onChange={(e) => setUserAmountGrams(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-2xs text-slate-400 mt-1">
                  <span>5 g</span>
                  <span>{servingSize}g (1 phần)</span>
                  <span>{totalBoxWeight}g (Cả hộp)</span>
                  <span>{totalBoxWeight * 2}g (2 hộp)</span>
                </div>
              </div>

              {/* Real-time Math Feedback */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex flex-col justify-center space-y-1">
                <div className="text-slate-500">Phép tính tương ứng:</div>
                <div className="font-mono font-bold text-sm text-slate-800">
                  {caloriesPerServing} kcal × ({userAmountGrams} / {servingSize}) ={' '}
                  <span className="text-emerald-700 text-base">{userCalories} kcal</span>
                </div>
                <div className="text-2xs text-slate-500">
                  {isWholeBox
                    ? '🎯 Đúng bằng 1 hộp đầy đủ (120 × 2 = 240 kcal).'
                    : userAmountGrams < servingSize
                    ? 'Em đang ăn ít hơn 1 khẩu phần tiêu chuẩn.'
                    : 'Em đang ăn nhiều hơn 1 khẩu phần tiêu chuẩn.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
