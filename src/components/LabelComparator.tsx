import React, { useState } from 'react';
import { Scale, ArrowRight, Lightbulb, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { COMPARISON_SAMPLES } from '../data/comparisonSamples';
import { LabelComparisonItem } from '../types';

export const LabelComparator: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(COMPARISON_SAMPLES[0].id);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [showTakeaway, setShowTakeaway] = useState<boolean>(false);

  const currentComparison: LabelComparisonItem =
    COMPARISON_SAMPLES.find((c) => c.id === selectedCaseId) || COMPARISON_SAMPLES[0];

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setStudentAnswer('');
    setShowTakeaway(false);
  };

  const { labelA, labelB } = currentComparison;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                So sánh nhãn: Quan sát biến thiên khi thay đổi 1 chi tiết
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                Tính năng mở rộng
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Đưa hai nhãn gần giống nhau, chỉ thay đổi 1 yếu tố cốt lõi để học sinh nhận diện sự khác biệt.
            </p>
          </div>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {COMPARISON_SAMPLES.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleSelectCase(item.id)}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              item.id === selectedCaseId
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Trường hợp {index + 1}:</span>
            <span className="font-normal truncate max-w-xs">{item.title.split(':')[1] || item.title}</span>
          </button>
        ))}
      </div>

      {/* Changed Detail Highlight Bar */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs uppercase font-bold text-amber-900 tracking-wider block">
            Điểm mấu chốt được thay đổi:
          </span>
          <p className="text-sm font-semibold text-amber-950 mt-0.5">
            {currentComparison.changedDetailSummary}
          </p>
          <p className="text-xs text-amber-800 mt-1">{currentComparison.description}</p>
        </div>
      </div>

      {/* Side by Side Label Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Label A */}
        <div className="bg-slate-50 rounded-xl p-5 border-2 border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Phiên bản A (Nguyên bản)
              </span>
              <span className="text-2xs text-slate-500 font-mono">
                {labelA.netWeight} {labelA.netWeightUnit}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-2">{labelA.productName}</h4>

            {/* Nutrition summary */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500 font-sans">Khẩu phần ghi:</span>
                <strong>{labelA.servingSize} {labelA.servingUnit} ({labelA.servingsPerContainer} phần/hộp)</strong>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500 font-sans">Năng lượng / khẩu phần:</span>
                <strong className="text-blue-700">{labelA.caloriesPerServing} kcal</strong>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500 font-sans">Đường (Sugars):</span>
                <strong>{labelA.sugarsPerServing} g</strong>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500 font-sans">Chất béo (Bão hòa):</span>
                <strong>{labelA.totalFatPerServing} g ({labelA.saturatedFatPerServing} g)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Đạm / Natri:</span>
                <strong>{labelA.proteinPerServing} g / {labelA.sodiumPerServing} mg</strong>
              </div>
            </div>

            {/* Ingredients excerpt */}
            <div className="mt-3 p-2.5 bg-slate-100 rounded text-2xs text-slate-600">
              <span className="font-bold block mb-1">Thành phần:</span>
              <p>{labelA.ingredientsText}</p>
            </div>
          </div>
        </div>

        {/* Label B */}
        <div className="bg-slate-50 rounded-xl p-5 border-2 border-teal-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-teal-100 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                Phiên bản B (Đã đổi 1 chi tiết)
              </span>
              <span className="text-2xs text-slate-500 font-mono">
                {labelB.netWeight} {labelB.netWeightUnit}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-2">{labelB.productName}</h4>

            {/* Nutrition summary */}
            <div className="bg-white p-3.5 rounded-lg border border-teal-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500 font-sans">Khẩu phần ghi:</span>
                <strong className="text-teal-900">{labelB.servingSize} {labelB.servingUnit} ({labelB.servingsPerContainer} phần/hộp)</strong>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500 font-sans">Năng lượng / khẩu phần:</span>
                <strong className="text-teal-700">{labelB.caloriesPerServing} kcal</strong>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500 font-sans">Đường (Sugars):</span>
                <strong>{labelB.sugarsPerServing} g</strong>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500 font-sans">Chất béo (Bão hòa):</span>
                <strong>{labelB.totalFatPerServing} g ({labelB.saturatedFatPerServing} g)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Đạm / Natri:</span>
                <strong>{labelB.proteinPerServing} g / {labelB.sodiumPerServing} mg</strong>
              </div>
            </div>

            {/* Ingredients excerpt */}
            <div className="mt-3 p-2.5 bg-teal-50/70 rounded text-2xs text-teal-900 border border-teal-100">
              <span className="font-bold block mb-1">Thành phần:</span>
              <p>{labelB.ingredientsText}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Points Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
              <th className="p-3 font-bold">Chỉ số so sánh</th>
              <th className="p-3 font-bold text-blue-900">Nhãn A</th>
              <th className="p-3 font-bold text-teal-900">Nhãn B</th>
              <th className="p-3 font-bold">Tác động & Ý nghĩa khoa học</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentComparison.comparisonPoints.map((pt, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-800">{pt.aspect}</td>
                <td className="p-3 font-mono text-slate-700">{pt.valueA}</td>
                <td className="p-3 font-mono font-bold text-teal-800">{pt.valueB}</td>
                <td className="p-3 text-slate-600">{pt.impactExplanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Guided Inquiry Activity */}
      <div className="bg-amber-50/80 p-5 rounded-xl border border-amber-200 space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-700" />
          <h4 className="text-sm font-bold text-amber-950">
            Câu hỏi hướng dẫn học sinh quan sát:
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
          "{currentComparison.guidedPrompt}"
        </p>

        <textarea
          rows={2}
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="Nhập suy nghĩ và quan sát của em sau khi đối chiếu hai nhãn..."
          className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setShowTakeaway(!showTakeaway)}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showTakeaway ? 'Thu gọn bài học' : 'Xem đúc kết khoa học'}</span>
          </button>
        </div>

        {showTakeaway && (
          <div className="mt-3 p-3.5 bg-white rounded-lg border border-amber-300 text-xs text-slate-700 animate-in fade-in space-y-1">
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Đúc kết phản biện:
            </span>
            <p className="leading-relaxed">{currentComparison.takeaway}</p>
          </div>
        )}
      </div>
    </div>
  );
};
