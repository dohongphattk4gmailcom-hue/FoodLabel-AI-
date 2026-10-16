import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  MessageSquarePlus,
  Star,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  History,
  Send,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserFeedbackItem, VersionChangelogItem } from '../types';

const STORAGE_FEEDBACK_KEY = 'foodwise_user_feedback_v2';

const CHANGELOG_V1_VS_V2: VersionChangelogItem[] = [
  {
    version: 'Phiên bản V2.0 (Hiện tại)',
    date: 'Tháng 10/2026',
    title: 'Nâng cấp toàn diện theo 11 tiêu chuẩn ứng dụng giáo dục THCS',
    fixes: [
      'Đã sửa lỗi phân tán giao diện: Gom thành Một form nhập nhãn duy nhất, ảnh nhãn hiển thị trực tiếp để đối chiếu.',
      'Đã khắc phục hoàn toàn tình trạng AI đoán mò ngày hết hạn: Bắt buộc trả về thông báo chuẩn "Không tìm thấy thông tin hạn dùng trên dữ liệu cung cấp" nếu nhãn thiếu date.',
      'Đã thêm cơ chế kiểm chứng từng trường: Bổ sung 2 nút bấm [✓ Đúng] và [✎ Sửa lại] cho từng trường dữ liệu.',
      'Đã bổ sung cơ chế từ chối an toàn cho ảnh kém chất lượng: Tự động cảnh báo "Chưa đọc rõ, vui lòng chụp lại" khi ảnh bị mờ, chụp nghiêng hoặc chữ quá nhỏ.',
      'Sửa lỗi nhầm lẫn đơn vị dinh dưỡng: Bổ sung kiểm tra đơn vị mg Natri vs g Muối ăn và đối chiếu calo từ đạm, béo, đường.',
    ],
    improvements: [
      'Tích hợp tính năng Đăng nhập & Đăng ký tài khoản (Firebase Auth & Firestore): Mỗi người dùng có thể tạo tài khoản riêng biệt (Google 1 chạm hoặc Email/Mật khẩu), quản lý hồ sơ thể chất, đồng bộ nhật ký ăn uống và bảo vệ dữ liệu cá nhân.',
      'Bổ sung tính năng "FoodLabel AI – Theo dõi dinh dưỡng cá nhân & BMI": Tự động tính chỉ số BMI theo phân vị tăng trưởng THCS, ước tính nhu cầu năng lượng (TDEE) theo mức vận động, tìm kiếm món ăn hoặc thêm từ nhãn quét, phân tích cân bằng đạm-béo-tinh bột và thống kê biểu đồ 7 ngày.',
      'Bổ sung chức năng "Hôm nay em đã ăn gì?": Cộng dồn calo, đường, muối trong ngày theo ngưỡng khuyến nghị THCS của Viện Dinh Dưỡng & WHO.',
      'Xây dựng Bộ kiểm thử 20 nhãn thực phẩm thực tế (8 rõ, 4 mờ, 4 nghiêng, 4 chữ siêu nhỏ) có Ground Truth và đo tỷ lệ đọc đúng thực tế.',
      'Bổ sung cảnh báo an toàn dị ứng bắt buộc: Nhắc học sinh tự kiểm tra nhãn gốc, không khẳng định an toàn chỉ vì AI không tìm thấy.',
      'Nâng cấp giao diện theo chuẩn màu Xanh lá (Emerald), Trắng và Vàng nhạt (Amber), tối ưu trên cả điện thoại và máy tính.',
    ],
  },
  {
    version: 'Phiên bản V1.0 (Trước đây)',
    date: 'Tháng 09/2026',
    title: 'Phiên bản thử nghiệm ban đầu',
    fixes: [
      'Xây dựng khung phân tích 5 góc cơ bản (Khẩu phần, Thành phần, Dinh dưỡng, Hạn dùng, Điều cần kiểm tra).',
      'Thử nghiệm công thức nhân calo theo số khẩu phần (120 kcal x 2 = 240 kcal).',
    ],
    improvements: [
      'Nhận diện sơ bộ văn bản nhãn bằng AI và mã quy tắc toán học.',
    ],
  },
];

export const FeedbackAndChangelog: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<UserFeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FEEDBACK_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read feedback from localStorage:', e);
    }
    // No fake reviews initially as requested by user prompt: "Không tự tạo phản hồi người dùng hoặc kết quả thử nghiệm chưa diễn ra."
    return [];
  });

  // Form states
  const [studentName, setStudentName] = useState('');
  const [schoolGrade, setSchoolGrade] = useState('Lớp 7');
  const [easeOfUseScore, setEaseOfUseScore] = useState(5);
  const [comprehensionScore, setComprehensionScore] = useState(5);
  const [accuracyScore, setAccuracyScore] = useState(5);
  const [encounteredErrors, setEncounteredErrors] = useState('');
  const [userComments, setUserComments] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FEEDBACK_KEY, JSON.stringify(feedbacks));
    } catch (e) {
      console.warn('Could not save feedback to localStorage:', e);
    }
  }, [feedbacks]);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !userComments.trim()) return;

    const newFeedback: UserFeedbackItem = {
      id: `fb-${Date.now()}`,
      studentName: studentName.trim(),
      schoolGrade,
      easeOfUseScore,
      comprehensionScore,
      accuracyScore,
      encounteredErrors: encounteredErrors.trim(),
      userComments: userComments.trim(),
      submittedAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
    setSubmitSuccess(true);

    // Reset form
    setStudentName('');
    setEncounteredErrors('');
    setUserComments('');
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  // Calculate actual averages if reviews exist
  const avgEase =
    feedbacks.length > 0
      ? (feedbacks.reduce((a, b) => a + b.easeOfUseScore, 0) / feedbacks.length).toFixed(1)
      : null;
  const avgComp =
    feedbacks.length > 0
      ? (feedbacks.reduce((a, b) => a + b.comprehensionScore, 0) / feedbacks.length).toFixed(1)
      : null;
  const avgAcc =
    feedbacks.length > 0
      ? (feedbacks.reduce((a, b) => a + b.accuracyScore, 0) / feedbacks.length).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold mb-2 border border-emerald-400/30">
          <History className="w-3.5 h-3.5" />
          <span>Chức năng Mục 9 • Thử nghiệm &amp; Cải tiến V1 vs V2</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          🚀 Thử nghiệm thực tế &amp; Lịch sử cải tiến
        </h2>
        <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl leading-relaxed">
          Ghi nhận minh bạch các lỗi đã khắc phục giữa <strong>Phiên bản V1</strong> và <strong>Phiên bản V2</strong>, kèm theo biểu mẫu thu thập phản hồi thực tế từ học sinh THCS trong quá trình sử dụng website.
        </p>
      </div>

      {/* SECTION 1: CHANGELOG V1 VS V2 (Ghi nhận các lỗi đã sửa giữa phiên bản V1 và V2) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <GitCompare className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Nhật ký cải tiến: Các lỗi đã sửa giữa Phiên bản V1 và V2
            </h3>
            <p className="text-2xs text-slate-500">So sánh đối chiếu chi tiết các cải tiến chức năng</p>
          </div>
        </div>

        <div className="space-y-4">
          {CHANGELOG_V1_VS_V2.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${
                idx === 0
                  ? 'bg-emerald-50/40 border-emerald-300'
                  : 'bg-slate-50 border-slate-200'
              } space-y-3`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-700 text-white">
                    {item.version}
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{item.title}</h4>
                </div>
                <span className="text-3xs text-slate-500">{item.date}</span>
              </div>

              {/* Fixes list */}
              <div className="space-y-1.5">
                <p className="text-2xs font-bold text-rose-700 uppercase flex items-center gap-1">
                  <span>🛠️ Các vấn đề / lỗi đã khắc phục triệt để:</span>
                </p>
                <ul className="space-y-1 text-2xs text-slate-700 pl-4 list-disc">
                  {item.fixes.map((fix, fIdx) => (
                    <li key={fIdx} className="leading-relaxed">
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements list */}
              <div className="space-y-1.5 pt-1">
                <p className="text-2xs font-bold text-emerald-800 uppercase flex items-center gap-1">
                  <span>✨ Tính năng mới bổ sung:</span>
                </p>
                <ul className="space-y-1 text-2xs text-slate-700 pl-4 list-disc">
                  {item.improvements.map((imp, iIdx) => (
                    <li key={iIdx} className="leading-relaxed">
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: STUDENT FEEDBACK FORM (Thu thập phản hồi về độ dễ sử dụng, lỗi nhận diện, mức độ dễ hiểu) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Box */}
        <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-emerald-300 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquarePlus className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Gửi phản hồi dùng thử website
              </h3>
              <p className="text-2xs text-slate-500">
                Dành cho học sinh và giáo viên đóng góp ý kiến thực tế
              </p>
            </div>
          </div>

          {submitSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Cảm ơn em! Phản hồi thực tế đã được lưu vào hệ thống thành công.</span>
            </div>
          )}

          <form onSubmit={handleSubmitFeedback} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-2xs font-bold text-slate-700">Họ và tên học sinh:</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh An"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-2xs font-bold text-slate-700">Khối lớp THCS:</label>
                <select
                  value={schoolGrade}
                  onChange={(e) => setSchoolGrade(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900 cursor-pointer"
                >
                  <option value="Lớp 6">Lớp 6</option>
                  <option value="Lớp 7">Lớp 7</option>
                  <option value="Lớp 8">Lớp 8</option>
                  <option value="Lớp 9">Lớp 9</option>
                </select>
              </div>
            </div>

            {/* Ratings 1-5 */}
            <div className="space-y-2 pt-1">
              {/* Rating 1: Ease of use */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-2xs font-bold text-slate-700">Độ dễ sử dụng giao diện:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEaseOfUseScore(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          s <= easeOfUseScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-2xs font-bold text-slate-600 ml-1">{easeOfUseScore}/5</span>
                </div>
              </div>

              {/* Rating 2: Comprehension */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-2xs font-bold text-slate-700">Mức độ dễ hiểu của 5 góc:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setComprehensionScore(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          s <= comprehensionScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-2xs font-bold text-slate-600 ml-1">
                    {comprehensionScore}/5
                  </span>
                </div>
              </div>

              {/* Rating 3: AI Accuracy */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-2xs font-bold text-slate-700">Độ chuẩn xác đọc nhãn:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAccuracyScore(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          s <= accuracyScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-2xs font-bold text-slate-600 ml-1">{accuracyScore}/5</span>
                </div>
              </div>
            </div>

            {/* Lỗi nhận diện ghi nhận nếu có */}
            <div className="space-y-1">
              <label className="text-2xs font-bold text-slate-700">
                Lỗi nhận diện gặp phải (nếu có):
              </label>
              <input
                type="text"
                value={encounteredErrors}
                onChange={(e) => setEncounteredErrors(e.target.value)}
                placeholder="Ví dụ: Nhãn bị lem số natri đọc nhầm thành calo..."
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            {/* Ý kiến đóng góp */}
            <div className="space-y-1">
              <label className="text-2xs font-bold text-slate-700">
                Ý kiến đóng góp &amp; cảm nghĩ của em:
              </label>
              <textarea
                required
                rows={3}
                value={userComments}
                onChange={(e) => setUserComments(e.target.value)}
                placeholder="Em thấy trang web giúp em biết cách đọc số lượng khẩu phần và không bị nhầm lẫn calo cả hộp..."
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi phản hồi thực tế</span>
            </button>
          </form>
        </div>

        {/* Real Feedback List Box */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <span>Phản hồi thực tế đã thu thập ({feedbacks.length})</span>
            </h3>
            {feedbacks.length > 0 && (
              <span className="text-3xs text-slate-500">Được lưu cục bộ</span>
            )}
          </div>

          {/* Average metrics if reviews exist */}
          {feedbacks.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-center">
              <div>
                <p className="text-3xs text-slate-500 font-semibold">Dễ dùng</p>
                <p className="text-base font-black text-emerald-800">{avgEase} / 5</p>
              </div>
              <div>
                <p className="text-3xs text-slate-500 font-semibold">Dễ hiểu</p>
                <p className="text-base font-black text-emerald-800">{avgComp} / 5</p>
              </div>
              <div>
                <p className="text-3xs text-slate-500 font-semibold">Chuẩn xác</p>
                <p className="text-base font-black text-emerald-800">{avgAcc} / 5</p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl space-y-2">
              <Info className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">
                Chưa có phản hồi nào được ghi nhận.
              </p>
              <p className="text-3xs text-slate-500 max-w-sm mx-auto">
                Theo quy tắc khoa học trung thực: <strong>Không tự tạo phản hồi người dùng hoặc kết quả thử nghiệm chưa diễn ra.</strong> Học sinh hãy dùng thử và gửi phản hồi ở biểu mẫu bên cạnh!
              </p>
            </div>
          )}

          {/* Feedback items list */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 space-y-1.5 transition text-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{fb.studentName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-3xs font-semibold">
                      {fb.schoolGrade}
                    </span>
                  </div>
                  <span className="text-3xs text-slate-400">{fb.submittedAt}</span>
                </div>

                <div className="flex items-center gap-3 text-3xs text-slate-600">
                  <span>Dễ dùng: ⭐ {fb.easeOfUseScore}</span>
                  <span>Dễ hiểu: ⭐ {fb.comprehensionScore}</span>
                  <span>Chuẩn xác: ⭐ {fb.accuracyScore}</span>
                </div>

                <p className="text-slate-800 leading-relaxed font-medium">"{fb.userComments}"</p>

                {fb.encounteredErrors && (
                  <p className="text-3xs text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                    <strong>Lỗi phát hiện:</strong> {fb.encounteredErrors}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
