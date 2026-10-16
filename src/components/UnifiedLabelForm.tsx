import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Check,
  RefreshCw,
  HelpCircle,
  Eye,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  Scale,
  Zap,
  Flame,
  FileText,
  BookmarkPlus
} from 'lucide-react';
import { FoodLabelData, FieldValidationStatus } from '../types';
import { CameraScannerModal } from './CameraScannerModal';
import { SAMPLE_LABELS } from '../data/sampleLabels';

interface UnifiedLabelFormProps {
  labelData: FoodLabelData;
  onChangeLabelData: (data: FoodLabelData) => void;
  uploadedImageBase64: string | null;
  onImageSelected: (base64: string, mime: string, customHintText?: string) => void;
  studentObservation: string;
  onChangeStudentObservation: (obs: string) => void;
  onAnalyzeAI: () => void;
  isAnalyzing: boolean;
  onAddToDailyLog?: (data: FoodLabelData) => void;
  rejectionNotice?: string | null;
}

export const UnifiedLabelForm: React.FC<UnifiedLabelFormProps> = ({
  labelData,
  onChangeLabelData,
  uploadedImageBase64,
  onImageSelected,
  studentObservation,
  onChangeStudentObservation,
  onAnalyzeAI,
  isAnalyzing,
  onAddToDailyLog,
  rejectionNotice,
}) => {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeEditingField, setActiveEditingField] = useState<string | null>(null);

  // Field verification state for each field: 'unconfirmed' | 'correct' | 'edited'
  const [fieldStatus, setFieldStatus] = useState<FieldValidationStatus>({
    productName: 'unconfirmed',
    servingSize: 'unconfirmed',
    servingsPerContainer: 'unconfirmed',
    caloriesPerServing: 'unconfirmed',
    sugarsPerServing: 'unconfirmed',
    sodiumPerServing: 'unconfirmed',
    expirationDateText: 'unconfirmed',
    ingredientsText: 'unconfirmed',
  });

  const markFieldCorrect = (field: keyof FieldValidationStatus) => {
    setFieldStatus((prev) => ({ ...prev, [field]: 'correct' }));
    if (activeEditingField === field) setActiveEditingField(null);
  };

  const toggleFieldEdit = (field: keyof FieldValidationStatus) => {
    if (activeEditingField === field) {
      setActiveEditingField(null);
    } else {
      setActiveEditingField(field);
      setFieldStatus((prev) => ({ ...prev, [field]: 'edited' }));
    }
  };

  // Handle image upload from file picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageSelected(reader.result, file.type || 'image/jpeg');
          // Reset field verification statuses
          resetVerificationStatuses();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Support paste from clipboard (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              if (base64) {
                onImageSelected(base64, blob.type || 'image/png', 'Ảnh dán từ bộ nhớ tạm (Ctrl+V)');
                resetVerificationStatuses();
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageSelected]);

  const resetVerificationStatuses = () => {
    setFieldStatus({
      productName: 'unconfirmed',
      servingSize: 'unconfirmed',
      servingsPerContainer: 'unconfirmed',
      caloriesPerServing: 'unconfirmed',
      sugarsPerServing: 'unconfirmed',
      sodiumPerServing: 'unconfirmed',
      expirationDateText: 'unconfirmed',
      ingredientsText: 'unconfirmed',
    });
  };

  // Check if AI declared the image unclear
  const isUnclear =
    rejectionNotice ||
    labelData.isImageClear === false ||
    (labelData.unclearReason && labelData.unclearReason.includes('Chưa đọc rõ'));

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-500/20 shadow-md p-5 sm:p-7 space-y-6">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Biểu mẫu duy nhất • Nhận diện &amp; Tùy chỉnh trực tiếp</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>📝 Biểu mẫu thông tin nhãn thực phẩm</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Chụp camera hoặc gửi ảnh, AI sẽ bóc tách số liệu vào form. Em hãy đối chiếu với ảnh gốc và bấm <strong className="text-emerald-700">[Đúng]</strong> hoặc <strong className="text-amber-700">[Sửa lại]</strong> trước khi phân tích.
          </p>
        </div>

        {/* Quick sample selector */}
        <div className="flex items-center gap-2">
          <label className="text-2xs font-semibold text-slate-500 whitespace-nowrap">Mẫu thử nghiệm:</label>
          <select
            aria-label="Chọn nhãn thực phẩm mẫu"
            className="text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            value={labelData.productName ? SAMPLE_LABELS.find(s => s.data.productName === labelData.productName)?.id || '' : ''}
            onChange={(e) => {
              if (!e.target.value) return;
              const sample = SAMPLE_LABELS.find((s) => s.id === e.target.value);
              if (sample) {
                onChangeLabelData(sample.data);
                resetVerificationStatuses();
              }
            }}
          >
            <option value="">-- Chọn nhãn mẫu thử nghiệm --</option>
            {SAMPLE_LABELS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SECTION 1: PHOTO & SCAN BUTTONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Image Preview & Camera Trigger */}
        <div className="lg:col-span-5 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>📷 Ảnh nhãn thực phẩm</span>
              <span className="text-emerald-600">*</span>
            </span>
            <span className="text-3xs font-normal text-slate-400">Hỗ trợ Camera, Tải ảnh, Ctrl+V</span>
          </label>

          {/* Image Display Card */}
          <div className="relative group bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-700 flex items-center justify-center min-h-[240px] max-h-[340px]">
            {uploadedImageBase64 ? (
              <img
                src={uploadedImageBase64}
                alt="Ảnh nhãn thực phẩm đang phân tích"
                className="max-h-[330px] w-auto max-w-full object-contain p-2 transition-transform duration-300"
              />
            ) : (
              <div className="p-6 text-center text-slate-300 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Chưa có ảnh nhãn thực phẩm</p>
                  <p className="text-2xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Hướng camera vào nhãn sản phẩm hoặc chọn ảnh từ máy để AI tự động nhận diện chữ &amp; số liệu.
                  </p>
                </div>
              </div>
            )}

            {/* Quick scanning overlay banner */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xs flex flex-col items-center justify-center p-4 text-center">
                <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-emerald-300 font-bold text-xs">AI đang đọc nhãn thực phẩm...</p>
                <p className="text-slate-400 text-3xs mt-1">Đang bóc tách 7 trường thông tin dinh dưỡng</p>
              </div>
            )}
          </div>

          {/* Camera & Upload Buttons directly under the photo */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsCameraModalOpen(true)}
              className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Quét Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Tải / Gửi ảnh</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Right: Notification & Instructions */}
        <div className="lg:col-span-7 space-y-4">
          {/* Rejection / Unclear Image Banner (Mục 3) */}
          {isUnclear ? (
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <h4 className="font-extrabold text-sm sm:text-base text-amber-900">
                  Chưa đọc rõ, vui lòng chụp lại
                </h4>
              </div>
              <p className="text-xs leading-relaxed text-amber-800">
                {labelData.notes?.includes('Từ chối nhận diện')
                  ? labelData.notes
                  : 'Ảnh chụp có thể bị mờ nét, chụp quá nghiêng hoặc chữ in trên bao bì quá nhỏ. Để bảo vệ an toàn và không tạo ra số liệu đoán mò, AI từ chối suy diễn các trường bị nhòe.'}
              </p>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-300 text-2xs space-y-1 text-slate-700">
                <p className="font-bold text-amber-900">💡 Hướng dẫn chụp ảnh đạt chuẩn:</p>
                <p>• Căn camera vuông góc 90° với mặt phẳng nhãn, không chụp vát hay gấp mép.</p>
                <p>• Bật đèn hoặc chụp nơi đủ ánh sáng, giữ chắc tay để chữ không bị nhòe vệt.</p>
                <p>• Phóng to hoặc chụp cận cảnh riêng bảng Nutrition Facts nếu chữ quá nhỏ.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCameraModalOpen(true)}
                className="w-full mt-2 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Mở lại Camera chụp lại ngay</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-emerald-900">
                  Cơ chế đối chiếu dữ liệu trung thực (Mục 2 &amp; 3)
                </p>
                <p className="text-slate-600 leading-relaxed text-2xs">
                  AI trích xuất trung thực từ ảnh nhãn gốc, <strong>không đoán mò số liệu thiếu</strong>. Với mỗi trường bên dưới, em hãy đối chiếu với ảnh gốc và bấm nút:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-3xs font-bold border border-emerald-300">
                    <Check className="w-2.5 h-2.5" /> [✓ Đúng]: Khớp ảnh
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-3xs font-bold border border-amber-300">
                    <Edit3 className="w-2.5 h-2.5" /> [✎ Sửa lại]: Nhập tay số đúng
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Student Prior Observation Box (Mục 2: Ô "Em quan sát trước") */}
          <div className="p-3.5 rounded-xl bg-yellow-50/80 border border-yellow-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-600" />
                <span>Ô “Em quan sát trước” (Dành cho học sinh tự nhận xét)</span>
              </label>
              <span className="text-3xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">Tập tư duy phản biện</span>
            </div>
            <textarea
              value={studentObservation}
              onChange={(e) => onChangeStudentObservation(e.target.value)}
              placeholder="Ví dụ: Em thấy hộp này có 2 khẩu phần, vậy nếu ăn hết cả hộp sẽ nạp gấp đôi calo. Trên nắp hộp em chưa thấy in hạn sử dụng rõ ràng..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border border-yellow-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400"
            />
            <p className="text-3xs text-amber-800">
              * Học sinh tự quan sát bao bì và ghi lại nhận định trước khi xem kết quả phân tích của AI.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE 7 CORE FIELDS WITH [ĐÚNG] AND [SỬA LẠI] BUTTONS */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Các trường dữ liệu trích xuất từ nhãn</span>
            </h3>
            <p className="text-2xs text-slate-500">
              {uploadedImageBase64 || labelData.productName
                ? 'Đối chiếu từng trường với ảnh thực phẩm gốc bên trên'
                : 'Chỉ hiển thị dữ liệu sau khi chụp/quét nhãn. Tuyệt đối không tự ý gán tên sản phẩm khác.'}
            </p>
          </div>
          {uploadedImageBase64 ? (
            <span className="text-3xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Đã nạp ảnh nhãn • Sẵn sàng đối chiếu
            </span>
          ) : (
            <span className="text-3xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-300 self-start sm:self-auto flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              Đang chờ quét nhãn thực phẩm
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Field 1: Tên thực phẩm */}
          <div className={`p-3 rounded-xl border transition ${
            fieldStatus.productName === 'correct'
              ? 'bg-emerald-50/50 border-emerald-300'
              : fieldStatus.productName === 'edited'
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xs font-bold text-slate-700 uppercase">1. Tên thực phẩm</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => markFieldCorrect('productName')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    fieldStatus.productName === 'correct'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                  title="Xác nhận số liệu này đúng với ảnh gốc"
                >
                  <Check className="w-2.5 h-2.5" /> Đúng
                </button>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('productName')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    activeEditingField === 'productName'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  }`}
                  title="Chỉnh sửa lại nếu AI đọc sai"
                >
                  <Edit3 className="w-2.5 h-2.5" /> Sửa
                </button>
              </div>
            </div>
            {activeEditingField === 'productName' ? (
              <input
                type="text"
                value={labelData.productName}
                placeholder="Nhập tên sản phẩm nếu quét chưa đủ..."
                onChange={(e) => onChangeLabelData({ ...labelData, productName: e.target.value })}
                className="w-full text-xs font-bold p-1.5 bg-white border border-amber-400 rounded focus:ring-1 focus:ring-amber-500"
              />
            ) : (
              <p
                className={`text-xs font-extrabold truncate ${
                  labelData.productName ? 'text-slate-900' : 'text-slate-400 italic font-normal'
                }`}
                title={labelData.productName || 'Đang chờ quét nhãn...'}
              >
                {labelData.productName || 'Chưa quét (chờ tải ảnh/camera)'}
              </p>
            )}
          </div>

          {/* Field 2: Khối lượng 1 khẩu phần (g) */}
          <div className={`p-3 rounded-xl border transition ${
            fieldStatus.servingSize === 'correct'
              ? 'bg-emerald-50/50 border-emerald-300'
              : fieldStatus.servingSize === 'edited'
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xs font-bold text-slate-700 uppercase">2. 1 Khẩu phần (Serving size)</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => markFieldCorrect('servingSize')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    fieldStatus.servingSize === 'correct'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" /> Đúng
                </button>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('servingSize')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    activeEditingField === 'servingSize'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  }`}
                >
                  <Edit3 className="w-2.5 h-2.5" /> Sửa
                </button>
              </div>
            </div>
            {activeEditingField === 'servingSize' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={labelData.servingSize || ''}
                  onChange={(e) =>
                    onChangeLabelData({ ...labelData, servingSize: parseFloat(e.target.value) || 0 })
                  }
                  className="w-20 text-xs font-bold p-1 bg-white border border-amber-400 rounded"
                />
                <select
                  value={labelData.servingUnit || 'g'}
                  onChange={(e) => onChangeLabelData({ ...labelData, servingUnit: e.target.value })}
                  className="text-xs p-1 bg-white border border-amber-400 rounded"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                </select>
              </div>
            ) : (
              <p
                className={`text-xs font-extrabold ${
                  labelData.servingSize > 0 ? 'text-slate-900' : 'text-slate-400 font-normal italic'
                }`}
              >
                {labelData.servingSize > 0
                  ? `${labelData.servingSize} ${labelData.servingUnit || 'g'} / khẩu phần`
                  : 'Chưa quét (chờ tải ảnh/camera)'}
              </p>
            )}
          </div>

          {/* Field 3: Số khẩu phần trong cả hộp */}
          <div className={`p-3 rounded-xl border transition ${
            fieldStatus.servingsPerContainer === 'correct'
              ? 'bg-emerald-50/50 border-emerald-300'
              : fieldStatus.servingsPerContainer === 'edited'
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xs font-bold text-slate-700 uppercase">3. Số phần trong cả hộp</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => markFieldCorrect('servingsPerContainer')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    fieldStatus.servingsPerContainer === 'correct'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" /> Đúng
                </button>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('servingsPerContainer')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    activeEditingField === 'servingsPerContainer'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  }`}
                >
                  <Edit3 className="w-2.5 h-2.5" /> Sửa
                </button>
              </div>
            </div>
            {activeEditingField === 'servingsPerContainer' ? (
              <input
                type="number"
                min="0.1"
                step="any"
                value={labelData.servingsPerContainer || ''}
                onChange={(e) =>
                  onChangeLabelData({
                    ...labelData,
                    servingsPerContainer: parseFloat(e.target.value) || 1,
                  })
                }
                className="w-24 text-xs font-bold p-1 bg-white border border-amber-400 rounded"
              />
            ) : (
              <p
                className={`text-xs font-extrabold ${
                  labelData.servingsPerContainer > 0 ? 'text-slate-900' : 'text-slate-400 font-normal italic'
                }`}
              >
                {labelData.servingsPerContainer > 0
                  ? `${labelData.servingsPerContainer} khẩu phần / bao bì`
                  : 'Chưa quét (chờ tải ảnh/camera)'}
              </p>
            )}
          </div>

          {/* Field 4: Năng lượng (kcal/khẩu phần) */}
          <div className={`p-3 rounded-xl border transition ${
            fieldStatus.caloriesPerServing === 'correct'
              ? 'bg-emerald-50/50 border-emerald-300'
              : fieldStatus.caloriesPerServing === 'edited'
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xs font-bold text-slate-700 uppercase">4. Năng lượng (Calories)</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => markFieldCorrect('caloriesPerServing')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    fieldStatus.caloriesPerServing === 'correct'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" /> Đúng
                </button>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('caloriesPerServing')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    activeEditingField === 'caloriesPerServing'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  }`}
                >
                  <Edit3 className="w-2.5 h-2.5" /> Sửa
                </button>
              </div>
            </div>
            {activeEditingField === 'caloriesPerServing' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={labelData.caloriesPerServing || 0}
                  onChange={(e) =>
                    onChangeLabelData({
                      ...labelData,
                      caloriesPerServing: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-24 text-xs font-bold p-1 bg-white border border-amber-400 rounded"
                />
                <span className="text-xs text-slate-500 font-bold">kcal / phần</span>
              </div>
            ) : (
              <p
                className={`text-xs font-extrabold ${
                  labelData.caloriesPerServing > 0 ? 'text-emerald-700' : 'text-slate-400 font-normal italic'
                }`}
              >
                {labelData.caloriesPerServing > 0
                  ? `${labelData.caloriesPerServing} kcal / khẩu phần`
                  : 'Chưa quét (chờ tải ảnh/camera)'}
              </p>
            )}
          </div>

          {/* Field 5: Lượng đường (g) */}
          <div className={`p-3 rounded-xl border transition ${
            fieldStatus.sugarsPerServing === 'correct'
              ? 'bg-emerald-50/50 border-emerald-300'
              : fieldStatus.sugarsPerServing === 'edited'
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xs font-bold text-slate-700 uppercase">5. Lượng Đường (Sugars)</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => markFieldCorrect('sugarsPerServing')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    fieldStatus.sugarsPerServing === 'correct'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" /> Đúng
                </button>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('sugarsPerServing')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    activeEditingField === 'sugarsPerServing'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  }`}
                >
                  <Edit3 className="w-2.5 h-2.5" /> Sửa
                </button>
              </div>
            </div>
            {activeEditingField === 'sugarsPerServing' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={labelData.sugarsPerServing ?? ''}
                  placeholder="Để trống nếu không có"
                  onChange={(e) =>
                    onChangeLabelData({
                      ...labelData,
                      sugarsPerServing: e.target.value === '' ? null : parseFloat(e.target.value),
                    })
                  }
                  className="w-24 text-xs font-bold p-1 bg-white border border-amber-400 rounded"
                />
                <span className="text-xs text-slate-500 font-bold">g</span>
              </div>
            ) : (
              <p
                className={`text-xs font-extrabold ${
                  labelData.sugarsPerServing !== null && labelData.sugarsPerServing !== undefined
                    ? 'text-slate-900'
                    : 'text-slate-400 font-normal italic'
                }`}
              >
                {labelData.sugarsPerServing !== null && labelData.sugarsPerServing !== undefined
                  ? `${labelData.sugarsPerServing} g`
                  : 'Chưa quét (chờ tải ảnh/camera)'}
              </p>
            )}
          </div>

          {/* Field 6: Lượng muối / Natri (mg hoặc g) */}
          <div className={`p-3 rounded-xl border transition ${
            fieldStatus.sodiumPerServing === 'correct'
              ? 'bg-emerald-50/50 border-emerald-300'
              : fieldStatus.sodiumPerServing === 'edited'
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xs font-bold text-slate-700 uppercase">6. Muối / Natri (Sodium)</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => markFieldCorrect('sodiumPerServing')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    fieldStatus.sodiumPerServing === 'correct'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" /> Đúng
                </button>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('sodiumPerServing')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    activeEditingField === 'sodiumPerServing'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  }`}
                >
                  <Edit3 className="w-2.5 h-2.5" /> Sửa
                </button>
              </div>
            </div>
            {activeEditingField === 'sodiumPerServing' ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={labelData.sodiumPerServing ?? ''}
                  placeholder="Để trống nếu không có"
                  onChange={(e) =>
                    onChangeLabelData({
                      ...labelData,
                      sodiumPerServing: e.target.value === '' ? null : parseFloat(e.target.value),
                    })
                  }
                  className="w-24 text-xs font-bold p-1 bg-white border border-amber-400 rounded"
                />
                <span className="text-xs text-slate-500 font-bold">mg Natri</span>
              </div>
            ) : (
              <p
                className={`text-xs font-extrabold ${
                  labelData.sodiumPerServing !== null && labelData.sodiumPerServing !== undefined
                    ? 'text-slate-900'
                    : 'text-slate-400 font-normal italic'
                }`}
              >
                {labelData.sodiumPerServing !== null && labelData.sodiumPerServing !== undefined
                  ? `${labelData.sodiumPerServing} mg`
                  : 'Chưa quét (chờ tải ảnh/camera)'}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Hạn sử dụng & Thành phần (Wider areas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Field 7: Hạn sử dụng */}
          <div className={`lg:col-span-5 p-3 rounded-xl border transition ${
            fieldStatus.expirationDateText === 'correct'
              ? 'bg-emerald-50/50 border-emerald-300'
              : fieldStatus.expirationDateText === 'edited'
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xs font-bold text-slate-700 uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>7. Hạn sử dụng (NSX / HSD)</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => markFieldCorrect('expirationDateText')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    fieldStatus.expirationDateText === 'correct'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" /> Đúng
                </button>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('expirationDateText')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    activeEditingField === 'expirationDateText'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  }`}
                >
                  <Edit3 className="w-2.5 h-2.5" /> Sửa
                </button>
              </div>
            </div>
            {activeEditingField === 'expirationDateText' ? (
              <input
                type="text"
                value={labelData.expirationDateText}
                onChange={(e) =>
                  onChangeLabelData({ ...labelData, expirationDateText: e.target.value })
                }
                className="w-full text-xs font-semibold p-1.5 bg-white border border-amber-400 rounded"
              />
            ) : (
              <p
                className={`text-xs font-bold ${
                  labelData.expirationDateText
                    ? 'text-slate-900'
                    : 'text-slate-400 font-normal italic'
                }`}
              >
                {labelData.expirationDateText || 'Chưa quét (chờ tải ảnh/camera)'}
              </p>
            )}
          </div>

          {/* Field 8: Thành phần ghi trên bao bì */}
          <div className={`lg:col-span-7 p-3 rounded-xl border transition ${
            fieldStatus.ingredientsText === 'correct'
              ? 'bg-emerald-50/50 border-emerald-300'
              : fieldStatus.ingredientsText === 'edited'
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xs font-bold text-slate-700 uppercase flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>8. Thành phần ghi trên bao bì</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => markFieldCorrect('ingredientsText')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    fieldStatus.ingredientsText === 'correct'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" /> Đúng
                </button>
                <button
                  type="button"
                  onClick={() => toggleFieldEdit('ingredientsText')}
                  className={`px-2 py-0.5 rounded text-3xs font-bold flex items-center gap-0.5 cursor-pointer ${
                    activeEditingField === 'ingredientsText'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  }`}
                >
                  <Edit3 className="w-2.5 h-2.5" /> Sửa
                </button>
              </div>
            </div>
            {activeEditingField === 'ingredientsText' ? (
              <textarea
                rows={2}
                value={labelData.ingredientsText}
                onChange={(e) =>
                  onChangeLabelData({
                    ...labelData,
                    ingredientsText: e.target.value,
                    ingredientList: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full text-xs p-1.5 bg-white border border-amber-400 rounded"
              />
            ) : (
              <p
                className={`text-2xs line-clamp-2 leading-relaxed ${
                  labelData.ingredientsText ? 'text-slate-700' : 'text-slate-400 font-normal italic'
                }`}
              >
                {labelData.ingredientsText || 'Chưa quét (chờ tải ảnh/camera)'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: MANDATORY ALLERGEN SAFETY REMINDER (Mục 7) */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-2xs space-y-0.5 leading-relaxed">
          <p className="font-extrabold text-amber-900 text-xs">
            Cảnh báo bắt buộc về thành phần gây dị ứng (Mục 7)
          </p>
          <p className="text-amber-800">
            • <strong>Học sinh và phụ huynh hãy tự kiểm tra trực tiếp danh sách thành phần trên bao bì gốc.</strong>
          </p>
          <p className="text-amber-800">
            • <strong>Tuyệt đối không khẳng định sản phẩm an toàn hoặc không chứa chất gây dị ứng chỉ vì AI không phát hiện thành phần liên quan.</strong>
          </p>
          <p className="text-amber-800">
            • Nếu ảnh chụp mờ hoặc nhãn thiếu thông tin, cần kiểm tra trực tiếp và hỏi người lớn hoặc chuyên gia y tế khi có tiền sử dị ứng.
          </p>
        </div>
      </div>

      {/* SECTION 4: PRIMARY ACTION BUTTONS */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
        <div className="text-2xs text-slate-500">
          <span>Đã xác nhận dữ liệu chuẩn? Bấm nút bên phải để phân tích 5 góc và tính toán calo:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onAddToDailyLog && (
            <button
              type="button"
              onClick={() => onAddToDailyLog(labelData)}
              className="flex-1 sm:flex-none px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <BookmarkPlus className="w-4 h-4 text-amber-700" />
              <span>+ Thêm vào Nhật ký hôm nay</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAnalyzeAI}
            disabled={isAnalyzing}
            className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI đang phân tích nhãn...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Phân tích nhãn bằng AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Camera Modal */}
      <CameraScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(base64) => {
          onImageSelected(base64, 'image/jpeg', 'Ảnh chụp trực tiếp từ camera');
          resetVerificationStatuses();
        }}
      />
    </div>
  );
};
