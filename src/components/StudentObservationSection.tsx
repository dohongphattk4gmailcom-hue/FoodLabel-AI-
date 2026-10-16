import React, { useState } from 'react';
import { HelpCircle, Check, Sparkles, AlertCircle, ArrowRight, UserCheck, Bot, Cpu } from 'lucide-react';
import { StudentObservation, FoodLabelData, RuleCheckResult } from '../types';

interface StudentObservationSectionProps {
  labelData: FoodLabelData;
  observation: StudentObservation | null;
  onSubmitObservation: (obs: StudentObservation) => void;
  onProceedToAI: () => void;
  ruleCheckResult?: RuleCheckResult;
}

export const StudentObservationSection: React.FC<StudentObservationSectionProps> = ({
  labelData,
  observation,
  onSubmitObservation,
  onProceedToAI,
  ruleCheckResult,
}) => {
  const [servingsGuess, setServingsGuess] = useState(observation?.predictedServings || '');
  const [caloriesGuess, setCaloriesGuess] = useState(observation?.predictedTotalCalories || '');
  const [notesGuess, setNotesGuess] = useState(observation?.notesToCheck || '');
  const [hasSubmitted, setHasSubmitted] = useState(!!observation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newObs: StudentObservation = {
      predictedServings: servingsGuess,
      predictedTotalCalories: caloriesGuess,
      notesToCheck: notesGuess,
      submittedAt: new Date().toISOString(),
    };
    onSubmitObservation(newObs);
    setHasSubmitted(true);
    onProceedToAI();
  };

  const handleEditAgain = () => {
    setHasSubmitted(false);
  };

  const actualServings = labelData.servingsPerContainer;
  const actualCaloriesPerServing = labelData.caloriesPerServing;
  const actualTotalKcal = Math.round(actualServings * actualCaloriesPerServing);

  // Compare user guess with actual
  const numericServingsGuess = parseFloat(servingsGuess);
  const numericCaloriesGuess = parseFloat(caloriesGuess);

  const isServingsCorrect = !isNaN(numericServingsGuess) && Math.abs(numericServingsGuess - actualServings) < 0.2;
  const isCaloriesCorrect = !isNaN(numericCaloriesGuess) && Math.abs(numericCaloriesGuess - actualTotalKcal) < 5;

  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 sm:p-6 mb-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-amber-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
            🧑‍🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-amber-950">
                Phần “Em quan sát trước”
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-200/80 text-amber-900">
                Rèn luyện tư duy
              </span>
            </div>
            <p className="text-xs text-amber-800">
              Trước khi xem AI và Quy tắc, học sinh tự suy nghĩ và ghi nhận phán đoán cá nhân.
            </p>
          </div>
        </div>

        {hasSubmitted && (
          <button
            onClick={handleEditAgain}
            className="text-xs text-amber-800 hover:text-amber-950 underline font-medium cursor-pointer self-start sm:self-auto"
          >
            Sửa lại dự đoán của em
          </button>
        )}
      </div>

      {!hasSubmitted ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Question 1 */}
            <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                1. Em nghĩ sản phẩm có bao nhiêu khẩu phần?
              </label>
              <p className="text-2xs text-slate-500 mb-2">
                (Xem số lần ăn được khuyến nghị trong 1 bao bì)
              </p>
              <input
                type="number"
                step="0.5"
                required
                value={servingsGuess}
                onChange={(e) => setServingsGuess(e.target.value)}
                placeholder="Ví dụ: 2"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Question 2 */}
            <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                2. Nếu dùng hết hộp thì tổng năng lượng là bao nhiêu (kcal)?
              </label>
              <p className="text-2xs text-slate-500 mb-2">
                (Thử nhẩm: Lấy calo 1 khẩu phần nhân với số khẩu phần)
              </p>
              <input
                type="number"
                step="1"
                required
                value={caloriesGuess}
                onChange={(e) => setCaloriesGuess(e.target.value)}
                placeholder="Ví dụ: 240"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Question 3 */}
          <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              3. Có thông tin nào em muốn kiểm tra lại?
            </label>
            <p className="text-2xs text-slate-500 mb-2">
              (Ví dụ: Hạn sử dụng có ghi rõ ngày không? Có đường hay chất bảo quản không? Đơn vị là gam hay mg?)
            </p>
            <textarea
              rows={2}
              value={notesGuess}
              onChange={(e) => setNotesGuess(e.target.value)}
              placeholder="Ghi chú suy nghĩ của em: ví dụ 'Em muốn tìm ngày hết hạn ở đâu', 'Em muốn xem có chất gây dị ứng không'..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-2xs text-amber-800 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Điền xong phán đoán, hãy bấm nút để mở kết quả đối chiếu AI & Quy tắc toán học.
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Phân tích bằng AI & Đối chiếu kết quả</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        /* Comparison Result View (Student vs AI vs Rules) */
        <div className="mt-4 space-y-4">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-bold text-slate-800">
                Bảng đối chiếu: Phán đoán của Em vs Mã Quy tắc & AI
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              {/* Servings comparison */}
              <div className={`p-3.5 rounded-lg border ${isServingsCorrect ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/70 border-amber-300'}`}>
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>Khẩu phần trong hộp:</span>
                  {isServingsCorrect ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-bold">
                      <Check className="w-4 h-4" /> Em đoán chính xác!
                    </span>
                  ) : (
                    <span className="text-amber-800 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-4 h-4" /> Cần xem kỹ nhãn
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 min-w-24">Em nghĩ:</span>
                    <strong className="text-amber-900">{servingsGuess || 'Chưa điền'} khẩu phần</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 min-w-24">Nhãn thực tế:</span>
                    <strong className="text-emerald-800">{actualServings} khẩu phần ({labelData.servingSize}{labelData.servingUnit}/khẩu phần)</strong>
                  </div>
                </div>
              </div>

              {/* Calories comparison */}
              <div className={`p-3.5 rounded-lg border ${isCaloriesCorrect ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/70 border-amber-300'}`}>
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>Tổng calo khi dùng hết hộp:</span>
                  {isCaloriesCorrect ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-bold">
                      <Check className="w-4 h-4" /> Tính toán tuyệt vời!
                    </span>
                  ) : (
                    <span className="text-amber-800 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-4 h-4" /> Xem phép tính chuẩn
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 min-w-24">Em tính ra:</span>
                    <strong className="text-amber-900">{caloriesGuess || 'Chưa điền'} kcal</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 min-w-24">Phép tính chuẩn:</span>
                    <strong className="text-emerald-800">
                      {labelData.caloriesPerServing} kcal × {actualServings} = {actualTotalKcal} kcal
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Note of Student Checkpoint */}
            {notesGuess && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">
                  💡 Điểm em đã ghi nhận muốn kiểm tra lại:
                </span>
                <p className="text-slate-600 italic">"{notesGuess}"</p>
                <p className="text-2xs text-indigo-700 mt-1">
                  👉 Hãy đối chiếu mục này tại <strong>Góc 4 (Hạn dùng)</strong> và <strong>Góc 5 (Điều cần kiểm tra)</strong> ở bên dưới!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
