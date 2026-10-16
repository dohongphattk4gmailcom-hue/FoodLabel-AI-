import React, { useState, useEffect } from 'react';
import { X, Check, Edit3, AlertCircle } from 'lucide-react';
import { FoodLabelData } from '../types';

interface LabelDataEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: FoodLabelData;
  onSave: (updatedData: FoodLabelData) => void;
}

export const LabelDataEditorModal: React.FC<LabelDataEditorModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<FoodLabelData>({ ...initialData });

  // Crucial: Synchronize formData whenever initialData changes or the modal is opened
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        ...initialData,
        // Ensure lists and defaults are safe
        ingredientList: initialData.ingredientList ? [...initialData.ingredientList] : [],
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field: keyof FoodLabelData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  Chỉnh sửa thông số nhãn thực phẩm
                </h3>
                <span className="text-2xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold max-w-[200px] truncate">
                  {formData.productName || 'Sản phẩm đang quét'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Kiểm tra hoặc điều chỉnh lại các chỉ số của sản phẩm vừa quét trước khi AI phân tích
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Lưu ý:</strong> Em có thể chỉnh sửa các con số nếu ảnh nhãn chụp bị mờ hoặc muốn thử nghiệm một tình huống nhãn mới.
            </span>
          </div>

          {/* Product & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên sản phẩm
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thương hiệu / Nhà sản xuất
              </label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="Ví dụ: Vinamilk, Orion, v.v."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Servings Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              🥣 Thông tin Khẩu phần & Quy cách đóng gói
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  1 Khẩu phần
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.servingSize}
                  onChange={(e) => handleChange('servingSize', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  Đơn vị (g/ml)
                </label>
                <select
                  value={formData.servingUnit}
                  onChange={(e) => handleChange('servingUnit', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="g">g (gam)</option>
                  <option value="ml">ml (mililit)</option>
                </select>
              </div>
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  Số khẩu phần/hộp
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.servingsPerContainer}
                  onChange={(e) => handleChange('servingsPerContainer', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  Khối lượng tịnh
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.netWeight}
                  onChange={(e) => handleChange('netWeight', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Nutrition Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              📊 Dinh dưỡng mỗi khẩu phần ({formData.servingSize} {formData.servingUnit})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  Năng lượng (kcal)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.caloriesPerServing}
                  onChange={(e) => handleChange('caloriesPerServing', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-emerald-700"
                  required
                />
              </div>
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  Đường - Sugars (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.sugarsPerServing}
                  onChange={(e) => handleChange('sugarsPerServing', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  Tổng chất béo - Fat (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.totalFatPerServing}
                  onChange={(e) => handleChange('totalFatPerServing', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  Béo bão hòa (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.saturatedFatPerServing ?? 0}
                  onChange={(e) => handleChange('saturatedFatPerServing', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  Chất đạm - Protein (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.proteinPerServing}
                  onChange={(e) => handleChange('proteinPerServing', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-2xs font-semibold text-slate-600 mb-1">
                  Natri - Sodium (mg)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.sodiumPerServing ?? 0}
                  onChange={(e) => handleChange('sodiumPerServing', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Expiration Date Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              📅 Ngày sản xuất / Hạn sử dụng (NSX / HSD)
            </label>
            <input
              type="text"
              value={formData.expirationDateText}
              onChange={(e) => handleChange('expirationDateText', e.target.value)}
              placeholder="Ví dụ: NSX: 01/01/2026 - HSD: 01/07/2026 hoặc ghi 'Không tìm thấy...'"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-2xs text-slate-500 mt-1">
              *Nếu bao bì không ghi HSD, giữ nguyên: <em>"Không tìm thấy thông tin hạn dùng trên dữ liệu cung cấp"</em>.
            </p>
          </div>

          {/* Ingredients Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              🧾 Danh sách thành phần
            </label>
            <textarea
              rows={3}
              value={formData.ingredientsText}
              onChange={(e) => handleChange('ingredientsText', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận dữ liệu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
