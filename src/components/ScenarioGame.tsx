import React, { useState } from 'react';
import { Gamepad2, Award, CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import { SCENARIO_QUESTIONS } from '../data/scenarios';
import { ScenarioQuestion } from '../types';

export const ScenarioGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [rationaleText, setRationaleText] = useState<string>('');
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    actionCorrect: boolean;
    rationaleSufficient: boolean;
    pointsAwarded: number;
    feedback: string;
  } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);

  const currentScenario: ScenarioQuestion = SCENARIO_QUESTIONS[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (hasEvaluated) return;
    setSelectedOptionId(optId);
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOptionId) return;

    const chosenOption = currentScenario.options.find((o) => o.id === selectedOptionId);
    const isActionCorrect = !!chosenOption?.isCorrectAction;

    // Check rationale
    const cleanRationale = rationaleText.trim().toLowerCase();
    const matchesKeywords = currentScenario.expectedRationaleKeywords.filter((kw) =>
      cleanRationale.includes(kw.toLowerCase())
    );

    // Rationale is sufficient if it has at least 15 characters and matches at least 1-2 keywords, or has good depth (>30 chars)
    const isRationaleSufficient =
      cleanRationale.length >= 15 && (matchesKeywords.length >= 1 || cleanRationale.length >= 35);

    let points = 0;
    let feedback = '';

    if (isActionCorrect && isRationaleSufficient) {
      points = 100;
      feedback = 'Xuất sắc! Em đã chọn đúng cách xử lý VÀ nêu được căn cứ xác đáng dựa trên quy tắc đọc nhãn thực phẩm!';
    } else if (isActionCorrect && !isRationaleSufficient) {
      points = 0; // "phải nêu được căn cứ mới được tính điểm" (Requirement 7)
      feedback = 'Em đã chọn đúng hướng xử lý, nhưng CHƯA NÊU ĐỦ CĂN CỨ khoa học (hoặc phần giải thích còn quá ngắn). Theo luật chơi, chỉ tính điểm khi có căn cứ rõ ràng!';
    } else {
      points = 0;
      feedback = 'Cách xử lý này chưa chính xác. Hãy xem kỹ phân tích bài học bên dưới để rút kinh nghiệm!';
    }

    setEvaluationResult({
      actionCorrect: isActionCorrect,
      rationaleSufficient: isRationaleSufficient,
      pointsAwarded: points,
      feedback,
    });

    if (points > 0 && !completedScenarios.includes(currentIndex)) {
      setScore((prev) => prev + points);
      setCompletedScenarios((prev) => [...prev, currentIndex]);
    }

    setHasEvaluated(true);
  };

  const handleNextScenario = () => {
    if (currentIndex < SCENARIO_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetTurn();
    }
  };

  const handlePrevScenario = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetTurn();
    }
  };

  const resetTurn = () => {
    setSelectedOptionId(null);
    setRationaleText('');
    setHasEvaluated(false);
    setEvaluationResult(null);
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompletedScenarios([]);
    resetTurn();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Trò chơi tình huống: Chuyên gia thẩm định nhãn
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                Tính năng mở rộng
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Quy tắc vàng: Chọn cách xử lý đúng <strong>VÀ</strong> phải nêu được căn cứ mới được tính điểm!
            </p>
          </div>
        </div>

        {/* Score display */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 text-xs font-bold text-purple-900">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Điểm tích lũy: {score} đ</span>
          </div>
          <button
            onClick={handleRestartGame}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition cursor-pointer"
            title="Chơi lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress step */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Tình huống <strong>{currentIndex + 1}</strong> / {SCENARIO_QUESTIONS.length}
        </span>
        <div className="flex gap-1.5">
          {SCENARIO_QUESTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                resetTurn();
              }}
              className={`w-7 h-7 rounded-md text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                i === currentIndex
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : completedScenarios.includes(i)
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Card */}
      <div className="space-y-4">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
              {currentScenario.badge}
            </span>
            <h3 className="text-base font-bold text-slate-800">{currentScenario.title}</h3>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{currentScenario.situation}</p>

          {/* Label Snippet box */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-2xs space-y-1.5 font-mono text-xs">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider font-sans block mb-1">
              🔎 Trích đoạn nhãn thực tế:
            </span>
            {currentScenario.labelSnippet.serving && (
              <div>
                <span className="text-slate-500 font-sans font-semibold">Khẩu phần: </span>
                <span className="text-slate-800">{currentScenario.labelSnippet.serving}</span>
              </div>
            )}
            {currentScenario.labelSnippet.energy && (
              <div>
                <span className="text-slate-500 font-sans font-semibold">Năng lượng: </span>
                <span className="text-emerald-700 font-bold">{currentScenario.labelSnippet.energy}</span>
              </div>
            )}
            {currentScenario.labelSnippet.ingredients && (
              <div>
                <span className="text-slate-500 font-sans font-semibold">Thành phần: </span>
                <span className="text-slate-800">{currentScenario.labelSnippet.ingredients}</span>
              </div>
            )}
            {currentScenario.labelSnippet.expiration && (
              <div>
                <span className="text-slate-500 font-sans font-semibold">Hạn dùng: </span>
                <span className="text-rose-700">{currentScenario.labelSnippet.expiration}</span>
              </div>
            )}
            {currentScenario.labelSnippet.notes && (
              <div className="text-slate-500 text-2xs italic font-sans pt-1">
                *Ghi chú: {currentScenario.labelSnippet.notes}
              </div>
            )}
          </div>
        </div>

        {/* Question & Option Selection Form */}
        <form onSubmit={handleEvaluate} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Câu hỏi: {currentScenario.question}
            </label>

            {/* Options */}
            <div className="space-y-2.5">
              {currentScenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle = 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/30';

                if (hasEvaluated) {
                  if (opt.isCorrectAction) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                  } else if (isSelected && !opt.isCorrectAction) {
                    optionStyle = 'border-rose-500 bg-rose-50 text-rose-950 line-through';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-purple-600 bg-purple-50/70 shadow-2xs';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer text-xs sm:text-sm flex items-start gap-3 ${optionStyle}`}
                  >
                    <input
                      type="radio"
                      name="scenario-option"
                      checked={isSelected}
                      onChange={() => handleSelectOption(opt.id)}
                      disabled={hasEvaluated}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">{opt.actionText}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rationale Input (Mandatory for points) */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-amber-950">
                ✍️ Căn cứ của em (Bắt buộc phải nêu căn cứ mới được tính điểm):
              </label>
              <span className="text-2xs text-amber-800 font-medium">
                (Ít nhất 15 ký tự và chứa từ khóa lập luận)
              </span>
            </div>
            <textarea
              rows={2}
              required
              disabled={hasEvaluated}
              value={rationaleText}
              onChange={(e) => setRationaleText(e.target.value)}
              placeholder="Giải thích vì sao em chọn cách xử lý này? Căn cứ vào số khẩu phần, công thức tính calo, hạn sử dụng hay thành phần nào trên nhãn?..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>

          {/* Submit / Feedback Buttons */}
          {!hasEvaluated ? (
            <button
              type="submit"
              disabled={!selectedOptionId || rationaleText.trim().length < 5}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <span>Nộp bài & Thẩm định căn cứ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              {/* Result evaluation box */}
              <div
                className={`p-4 rounded-xl border ${
                  evaluationResult?.pointsAwarded && evaluationResult.pointsAwarded > 0
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                  {evaluationResult?.pointsAwarded && evaluationResult.pointsAwarded > 0 ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Chính xác! +{evaluationResult.pointsAwarded} điểm</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Chưa đạt điểm (0 điểm)</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed">{evaluationResult?.feedback}</p>
              </div>

              {/* Lesson Learned Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Giải thích khoa học & Bài học rút ra:</span>
                </div>
                <p className="text-slate-700">{currentScenario.explanation}</p>
                <div className="p-2.5 bg-indigo-50 rounded border border-indigo-100 font-medium text-indigo-900">
                  🎯 <strong>Ghi nhớ:</strong> {currentScenario.lessonLearned}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrevScenario}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  ← Tình huống trước
                </button>
                <button
                  type="button"
                  onClick={resetTurn}
                  className="px-3 py-2 text-xs font-medium text-purple-700 hover:underline cursor-pointer"
                >
                  Thử trả lời lại
                </button>
                {currentIndex < SCENARIO_QUESTIONS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextScenario}
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Tình huống tiếp theo →
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700">
                    🎉 Em đã hoàn thành toàn bộ tình huống!
                  </span>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
