import React, { useState } from 'react';
import {
  Soup,
  FileText,
  BarChart3,
  Calendar,
  Search,
  Bot,
  Cpu,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FiveAnglesAnalysis as FiveAnglesType, FoodLabelData, RuleCheckResult } from '../types';

interface FiveAnglesAnalysisProps {
  labelData: FoodLabelData;
  fiveAngles: FiveAnglesType;
  ruleCheck: RuleCheckResult;
  userConsumedGrams: number;
}

export const FiveAnglesAnalysis: React.FC<FiveAnglesAnalysisProps> = ({
  labelData,
  fiveAngles,
  ruleCheck,
  userConsumedGrams,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'serving' | 'ingredients' | 'nutrition' | 'expiration' | 'checkpoints'>('all');
  const [studentNotes, setStudentNotes] = useState<{ [key: string]: string }>({});

  const handleStudentNoteChange = (angleKey: string, text: string) => {
    setStudentNotes((prev) => ({ ...prev, [angleKey]: text }));
  };

  const isNoExpiryFound =
    labelData.expirationDateText.includes('Không tìm thấy') ||
    fiveAngles.expirationAngle.status === 'not_found' ||
    fiveAngles.expirationAngle.displayText.includes('Không tìm thấy');

  return (
    <div className="space-y-6">
      {/* 3-Role Explanation Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚖️</span>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              Nguyên tắc phân định 3 vai trò độc lập (Mục 5)
            </h3>
          </div>
          <span className="text-2xs text-slate-400">Độ tin cậy khoa học</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Role 1: AI */}
          <div className="bg-slate-800/80 rounded-lg p-3 border border-indigo-500/40">
            <div className="flex items-center gap-2 text-indigo-300 font-bold mb-1">
              <Bot className="w-4 h-4" />
              <span>1. AI Trợ lý</span>
            </div>
            <p className="text-slate-300 text-2xs leading-relaxed">
              Đọc và tách dữ liệu thô từ văn bản hoặc hình ảnh nhãn thực phẩm vào 5 góc, không bịa thông tin.
            </p>
          </div>

          {/* Role 2: Rule Engine */}
          <div className="bg-slate-800/80 rounded-lg p-3 border border-emerald-500/40">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
              <Cpu className="w-4 h-4" />
              <span>2. Mã quy tắc (Toán học)</span>
            </div>
            <p className="text-slate-300 text-2xs leading-relaxed">
              Kiểm tra tính logic toán học, đối chiếu số khẩu phần × khối lượng, quy đổi đơn vị (g vs mg), tính tổng calo.
            </p>
          </div>

          {/* Role 3: Student */}
          <div className="bg-slate-800/80 rounded-lg p-3 border border-amber-500/40">
            <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
              <UserCheck className="w-4 h-4" />
              <span>3. Học sinh (Người quyết định)</span>
            </div>
            <p className="text-slate-300 text-2xs leading-relaxed">
              Tự xem xét căn cứ, đối chiếu thực tế, nhận định các rủi ro còn thiếu và đưa ra quyết định tiêu dùng an toàn.
            </p>
          </div>
        </div>
      </div>

      {/* Tab filter buttons */}
      <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Xem trọn vẹn 5 góc
        </button>
        <button
          onClick={() => setActiveTab('serving')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'serving'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🥣</span> Góc 1: Khẩu phần
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ingredients'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🧾</span> Góc 2: Thành phần
        </button>
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'nutrition'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>📊</span> Góc 3: Dinh dưỡng
        </button>
        <button
          onClick={() => setActiveTab('expiration')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'expiration'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>📅</span> Góc 4: Hạn dùng
        </button>
        <button
          onClick={() => setActiveTab('checkpoints')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'checkpoints'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🔎</span> Góc 5: Điều cần kiểm tra
        </button>
      </div>

      {/* 5 Angles Content Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* ================= GÓC 1: KHẨU PHẦN ================= */}
        {(activeTab === 'all' || activeTab === 'serving') && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Angle Header */}
            <div className="bg-blue-50/70 px-5 py-3.5 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Soup className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-blue-950">
                    Góc 1: 🥣 Khẩu phần (Serving Size)
                  </h4>
                  <p className="text-2xs text-blue-800">
                    Xác định kích thước 1 lần ăn chuẩn và số lượng khẩu phần chứa trong toàn bộ gói.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-white rounded-full text-blue-700 border border-blue-200">
                {labelData.servingSize} {labelData.servingUnit} / phần
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">Khẩu phần 1 lần ăn</span>
                  <strong className="text-base text-slate-800 font-mono">
                    {labelData.servingSize} {labelData.servingUnit}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">Số khẩu phần trong hộp</span>
                  <strong className="text-base text-slate-800 font-mono">
                    {labelData.servingsPerContainer} khẩu phần
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">Tổng khối lượng cả hộp</span>
                  <strong className="text-base text-slate-800 font-mono">
                    {labelData.netWeight} {labelData.netWeightUnit}
                  </strong>
                </div>
              </div>

              {/* 1. AI Findings */}
              <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI trích xuất từ nhãn:</span>
                </div>
                <p className="text-slate-700">
                  {fiveAngles.servingAngle.aiFinding ||
                    `Nhãn ghi rõ 1 khẩu phần là ${labelData.servingSize}${labelData.servingUnit}. Toàn bộ hộp gồm ${labelData.servingsPerContainer} khẩu phần.`}
                </p>
              </div>

              {/* 2. Rule Check Engine Result */}
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-950 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Mã quy tắc kiểm tra phép tính khẩu phần:</span>
                  </div>
                  <span className="font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                    {ruleCheck.servingVsNetWeight.formula}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {ruleCheck.servingVsNetWeight.explanation}
                </p>
              </div>

              {/* 3. Student Check & Reflection */}
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Học sinh tự xem căn cứ & nhận xét:</span>
                </div>
                <p className="text-slate-600 text-2xs">
                  👉 Em hãy đối chiếu: Khi mua gói bánh này, em thường ăn hết cả gói hay chỉ ăn đúng 1 khẩu phần {labelData.servingSize}{labelData.servingUnit}?
                </p>
                <input
                  type="text"
                  placeholder="Ghi nhận xét của em về khẩu phần thực tế..."
                  value={studentNotes['serving'] || ''}
                  onChange={(e) => handleStudentNoteChange('serving', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= GÓC 2: THÀNH PHẦN ================= */}
        {(activeTab === 'all' || activeTab === 'ingredients') && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Angle Header */}
            <div className="bg-indigo-50/70 px-5 py-3.5 border-b border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-indigo-950">
                    Góc 2: 🧾 Thành phần (Ingredients)
                  </h4>
                  <p className="text-2xs text-indigo-800">
                    Quy tắc ghi nhãn: Thành phần đứng đầu danh sách là thành phần chiếm tỉ lệ khối lượng cao nhất.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-full text-indigo-700 border border-indigo-200">
                {labelData.ingredientList.length || 0} thành phần
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Ingredients tag cloud */}
              <div>
                <span className="text-slate-500 font-semibold block mb-2">
                  Danh sách thành phần (sắp xếp theo thứ tự giảm dần tỉ lệ):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {labelData.ingredientList.map((ing, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        idx === 0
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {idx + 1}. {ing} {idx === 0 && ' (Nhiều nhất)'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergens & Additives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-rose-50/70 p-3.5 rounded-lg border-2 border-rose-300 space-y-1">
                  <span className="font-extrabold text-rose-900 block text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Cảnh báo dị ứng (Mục 7)</span>
                  </span>
                  <p className="text-slate-800 text-2xs font-semibold">
                    {labelData.allergensWarning || 'Không ghi nhận cảnh báo dị ứng cụ thể trên nhãn.'}
                  </p>
                  <p className="text-3xs text-rose-800 leading-relaxed pt-1 border-t border-rose-200">
                    * <strong>Lời nhắc bắt buộc:</strong> Học sinh và gia đình hãy tự kiểm tra danh sách thành phần trên bao bì gốc. Tuyệt đối không khẳng định sản phẩm không gây dị ứng chỉ vì AI không tìm thấy thành phần liên quan.
                  </p>
                </div>
                <div className="bg-purple-50/60 p-3 rounded-lg border border-purple-200">
                  <span className="font-bold text-purple-900 block mb-1">
                    🧪 Phụ gia &amp; Chất tạo ngọt ghi nhận
                  </span>
                  <p className="text-slate-700">
                    {fiveAngles.ingredientsAngle.additivesOrSweeteners?.join(', ') ||
                      'Chất bảo quản, hương liệu hoặc phụ gia thực phẩm theo mã INS (nếu có).'}
                  </p>
                </div>
              </div>

              {/* Student Decision */}
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Học sinh quan sát thành phần:</span>
                </div>
                <p className="text-slate-600 text-2xs">
                  👉 Có chất nào em muốn tra cứu thêm không (ví dụ chất tạo xốp INS 500ii, dầu cọ, siro ngô)?
                </p>
                <input
                  type="text"
                  placeholder="Ghi nhận xét về thành phần em quan sát thấy..."
                  value={studentNotes['ingredients'] || ''}
                  onChange={(e) => handleStudentNoteChange('ingredients', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= GÓC 3: DINH DƯỠNG ================= */}
        {(activeTab === 'all' || activeTab === 'nutrition') && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Angle Header */}
            <div className="bg-emerald-50/70 px-5 py-3.5 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-emerald-950">
                    Góc 3: 📊 Dinh dưỡng (Nutrition Facts)
                  </h4>
                  <p className="text-2xs text-emerald-800">
                    Kiểm tra các chỉ số năng lượng (kcal), đường, chất béo, chất đạm, natri.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-white rounded-full text-emerald-800 border border-emerald-200">
                {labelData.caloriesPerServing} kcal / phần
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Nutrition Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-center">
                  <span className="text-slate-500 block text-2xs">Năng lượng</span>
                  <strong className="text-base text-emerald-800 font-bold block">
                    {labelData.caloriesPerServing}
                  </strong>
                  <span className="text-2xs text-slate-500">kcal/phần</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-500 block text-2xs">Đường (Sugars)</span>
                  <strong className="text-base text-slate-800 font-bold block">
                    {labelData.sugarsPerServing !== null && labelData.sugarsPerServing !== undefined
                      ? `${labelData.sugarsPerServing}`
                      : 'Không có'}
                  </strong>
                  <span className="text-2xs text-slate-500">g/phần</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-500 block text-2xs">Tổng chất béo</span>
                  <strong className="text-base text-slate-800 font-bold block">
                    {labelData.totalFatPerServing}
                  </strong>
                  <span className="text-2xs text-slate-500">g/phần</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-500 block text-2xs">Béo bão hòa</span>
                  <strong className="text-base text-slate-800 font-bold block">
                    {labelData.saturatedFatPerServing ?? 0}
                  </strong>
                  <span className="text-2xs text-slate-500">g/phần</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-500 block text-2xs">Chất đạm (Protein)</span>
                  <strong className="text-base text-slate-800 font-bold block">
                    {labelData.proteinPerServing}
                  </strong>
                  <span className="text-2xs text-slate-500">g/phần</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-500 block text-2xs">Natri (Sodium)</span>
                  <strong className="text-base text-slate-800 font-bold block">
                    {labelData.sodiumPerServing !== null && labelData.sodiumPerServing !== undefined
                      ? `${labelData.sodiumPerServing}`
                      : 'Không có'}
                  </strong>
                  <span className="text-2xs text-slate-500">mg/phần</span>
                </div>
              </div>

              {/* Rule Check for Calories from Macros */}
              <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Mã quy tắc đối chiếu calo từ các chất đa lượng (Hệ số Atwater):</span>
                  </div>
                  <span className="font-mono text-2xs bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {ruleCheck.macroCalorieCheck.formula}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {ruleCheck.macroCalorieCheck.explanation}
                </p>
              </div>

              {/* Step-by-Step Transparent Math for Consumed Amount */}
              <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-blue-950">
                  <span>Phép tính dinh dưỡng theo lượng sử dụng ({userConsumedGrams} {labelData.servingUnit}):</span>
                  <span className="text-blue-700 font-mono">
                    {ruleCheck.consumptionMath.calorieFormula}
                  </span>
                </div>
                <div className="bg-white p-3 rounded border border-blue-100 font-mono text-2xs whitespace-pre-line text-slate-700 leading-relaxed">
                  {ruleCheck.consumptionMath.stepExplanation}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= GÓC 4: HẠN DÙNG ================= */}
        {(activeTab === 'all' || activeTab === 'expiration') && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Angle Header */}
            <div
              className={`px-5 py-3.5 border-b flex items-center justify-between ${
                isNoExpiryFound
                  ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                  : 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                    isNoExpiryFound ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold">
                    Góc 4: 📅 Hạn dùng (Expiration & Shelf life)
                  </h4>
                  <p className="text-2xs text-slate-600">
                    Quy tắc bảo vệ: Tuyệt đối không phỏng đoán nếu dữ liệu không ghi rõ.
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  isNoExpiryFound
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {isNoExpiryFound ? 'Cần kiểm tra lại date' : 'Đã ghi nhận HSD'}
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Prominent Expiration Text Box */}
              <div
                className={`p-4 rounded-xl border ${
                  isNoExpiryFound
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="text-2xs uppercase tracking-wider block font-bold text-slate-500 mb-1">
                  Thông tin hạn sử dụng trích xuất từ nhãn:
                </span>
                <div className="text-sm sm:text-base font-bold font-mono">
                  {labelData.expirationDateText}
                </div>
                {isNoExpiryFound && (
                  <div className="mt-2.5 pt-2.5 border-t border-rose-200/80 text-xs text-rose-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Quy tắc bắt buộc của FoodLabel AI:</strong> Nếu nhãn không ghi hạn dùng hoặc ảnh chụp bị thiếu vị trí in date, hệ thống ghi rõ: <em>“Không tìm thấy thông tin hạn dùng trên dữ liệu cung cấp”</em>, chứ <strong>không được tự đoán</strong> để đảm bảo an toàn tuyệt đối cho người tiêu dùng.
                    </span>
                  </div>
                )}
              </div>

              {/* Storage Instructions */}
              {labelData.storageInstructions && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-0.5">
                    ❄️ Hướng dẫn bảo quản:
                  </span>
                  <p className="text-slate-600">{labelData.storageInstructions}</p>
                </div>
              )}

              {/* Student Action */}
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Học sinh hành động khi cầm sản phẩm thật:</span>
                </div>
                <p className="text-slate-600 text-2xs">
                  👉 Nhìn ở đáy lon, nắp chai, mép dán nhiệt hoặc cổ chai để đối chiếu ngày sản xuất (NSX) và hạn dùng (HSD/Best Before).
                </p>
                <input
                  type="text"
                  placeholder="Ghi chú vị trí in date em tìm thấy trên bao bì thực tế..."
                  value={studentNotes['expiration'] || ''}
                  onChange={(e) => handleStudentNoteChange('expiration', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= GÓC 5: ĐIỀU CẦN KIỂM TRA ================= */}
        {(activeTab === 'all' || activeTab === 'checkpoints') && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Angle Header */}
            <div className="bg-amber-50/80 px-5 py-3.5 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-amber-950">
                    Góc 5: 🔎 Điều cần kiểm tra (Critical Checkpoints)
                  </h4>
                  <p className="text-2xs text-amber-800">
                    Thông tin còn thiếu hoặc cần đối chiếu thực tế trước khi sử dụng.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-white rounded-full text-amber-800 border border-amber-200">
                Checklist phản biện
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Checkpoints Checklist */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-700 block">
                  Danh sách những điểm nghi vấn hoặc cần kiểm tra thực tế:
                </span>
                <div className="space-y-2">
                  {/* Point 1: Expiry */}
                  <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-800 block mb-0.5">
                        {isNoExpiryFound ? '⚠️ Thiếu thông tin hạn dùng' : 'Kiểm tra ngày hết hạn'}
                      </strong>
                      <p className="text-slate-600">
                        {isNoExpiryFound
                          ? 'Dữ liệu nhãn hiện tại không có HSD. Học sinh cần kiểm tra xem date có được dập nổi ở đáy hộp hoặc mối hàn bao bì hay không.'
                          : `Đã có thông tin: ${labelData.expirationDateText}. Cần kiểm tra xem sản phẩm có còn trong thời hạn hay không.`}
                      </p>
                    </div>
                  </div>

                  {/* Point 2: Servings Trap */}
                  <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-800 block mb-0.5">
                        Kiểm tra cạm bẫy khẩu phần (Serving Size Trap)
                      </strong>
                      <p className="text-slate-600">
                        Bao bì gồm {labelData.servingsPerContainer} khẩu phần. Nếu ăn hết cả gói thì năng lượng nạp vào là{' '}
                        <strong>{Math.round(labelData.caloriesPerServing * labelData.servingsPerContainer)} kcal</strong>, không phải chỉ {labelData.caloriesPerServing} kcal.
                      </p>
                    </div>
                  </div>

                  {/* Point 3: Unit consistency */}
                  <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-800 block mb-0.5">
                        Đối chiếu đơn vị đo lường (Gam vs Miligam)
                      </strong>
                      <p className="text-slate-600">
                        Đường, Đạm, Béo được tính theo <strong>gam (g)</strong>, còn Natri được tính theo <strong>miligam (mg)</strong>. 1g = 1.000mg. Đừng nhầm lẫn giữa hai đơn vị này.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Decision Box */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <span>Quyết định của Học sinh: Em sẽ làm gì tiếp theo?</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Dựa trên 5 góc phân tích ở trên, em có tự tin hiểu đúng sản phẩm này chưa? Em có cần người bán cung cấp thêm thông tin gì trước khi sử dụng không?
                </p>
                <textarea
                  rows={2}
                  placeholder="Ghi quyết định hoặc kết luận của em..."
                  value={studentNotes['checkpoints'] || ''}
                  onChange={(e) => handleStudentNoteChange('checkpoints', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
