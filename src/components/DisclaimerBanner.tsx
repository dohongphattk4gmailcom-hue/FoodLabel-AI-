import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-amber-50/90 border-b border-amber-200 text-amber-950 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Nguyên tắc giáo dục & an toàn:</strong> Ứng dụng hỗ trợ học sinh rèn luyện kỹ năng đọc nhãn thực phẩm và tư duy phản biện.
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-amber-800 font-semibold hover:text-amber-900 underline underline-offset-2 ml-6 md:ml-0 cursor-pointer"
        >
          <span>{isExpanded ? 'Thu gọn lưu ý' : '4 Điều website KHÔNG làm'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs text-amber-900">
          <div className="bg-white/80 p-2.5 rounded-md border border-amber-200 flex items-start gap-2">
            <span className="text-red-500 font-bold text-sm">❌</span>
            <div>
              <strong>Không chẩn đoán sức khỏe:</strong> Không thay thế bác sĩ hoặc chuyên gia y tế trong bất kỳ trường hợp nào.
            </div>
          </div>
          <div className="bg-white/80 p-2.5 rounded-md border border-amber-200 flex items-start gap-2">
            <span className="text-red-500 font-bold text-sm">❌</span>
            <div>
              <strong>Không kê chế độ ăn:</strong> Không đưa ra thực đơn giảm cân, tăng cân hay chế độ dinh dưỡng cá nhân hóa.
            </div>
          </div>
          <div className="bg-white/80 p-2.5 rounded-md border border-amber-200 flex items-start gap-2">
            <span className="text-red-500 font-bold text-sm">❌</span>
            <div>
              <strong>Không chẩn đoán dị ứng:</strong> Người có cơ địa dị ứng luôn cần kiểm tra xác nhận từ bác sĩ chuyên khoa.
            </div>
          </div>
          <div className="bg-white/80 p-2.5 rounded-md border border-amber-200 flex items-start gap-2">
            <span className="text-red-500 font-bold text-sm">❌</span>
            <div>
              <strong>Không khẳng định an toàn:</strong> Không cam kết thực phẩm an toàn 100% chỉ dựa trên thông tin trên nhãn.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
