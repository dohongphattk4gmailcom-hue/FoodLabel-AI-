import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Smartphone,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Layers,
  Eye,
  Sliders,
  Maximize2,
  HelpCircle,
} from 'lucide-react';
import { SAMPLE_LABEL_IMAGES, SampleLabelImage } from '../data/sampleImages';
import { FoodLabelData } from '../types';
import { CameraScannerModal } from './CameraScannerModal';

interface AiImageScannerProps {
  uploadedImageBase64: string | null;
  uploadedImageMime: string;
  isScanning: boolean;
  scanStepIndex: number;
  scanError: string | null;
  currentLabelData: FoodLabelData;
  onImageSelected: (base64: string, mimeType: string, customText?: string) => void;
  onClearImage: () => void;
  onOpenEditor: () => void;
  onReScan: () => void;
}

const SCAN_STEPS = [
  {
    title: 'Nhận diện quang học OCR',
    desc: 'Phát hiện chữ viết, bảng Nutrition Facts và các vùng nhãn',
    icon: '🔍',
  },
  {
    title: 'Trích xuất khẩu phần & quy cách',
    desc: 'Tách gram/khẩu phần, số phần trong hộp, khối lượng tịnh',
    icon: '🥣',
  },
  {
    title: 'Tách thông số dinh dưỡng',
    desc: 'Đọc Calo, Đường, Chất béo, Đạm, Natri (mg) và đơn vị đo',
    icon: '📊',
  },
  {
    title: 'Kiểm tra hạn dùng (Quy tắc an toàn)',
    desc: 'Quét date dập nổi. Nếu thiếu: Tuyệt đối không phỏng đoán',
    icon: '📅',
  },
  {
    title: 'Đối chiếu 5 góc phân tích',
    desc: 'Đưa vào máy tính quy tắc và hiển thị phép tính chi tiết',
    icon: '💡',
  },
];

export const AiImageScanner: React.FC<AiImageScannerProps> = ({
  uploadedImageBase64,
  uploadedImageMime,
  isScanning,
  scanStepIndex,
  scanError,
  currentLabelData,
  onImageSelected,
  onClearImage,
  onOpenEditor,
  onReScan,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Fast client-side image downscaling & compression to speed up network transfer & AI vision processing
  const optimizeAndPassImage = (rawBase64: string, mime: string) => {
    if (mime.includes('svg') || rawBase64.includes('image/svg+xml')) {
      onImageSelected(rawBase64, mime);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const maxDimension = 1200;
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Clean JPEG compression with crisp text for OCR
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        onImageSelected(optimizedBase64, 'image/jpeg');
      } else {
        onImageSelected(rawBase64, mime);
      }
    };
    img.onerror = () => {
      onImageSelected(rawBase64, mime);
    };
    img.src = rawBase64;
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh (JPG, PNG, WEBP, SVG).');
      return;
    }

    const mime = file.type || 'image/jpeg';
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      optimizeAndPassImage(base64, mime);
    };
    reader.readAsDataURL(file);
  };

  // Support direct clipboard paste (Ctrl + V / Cmd + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSelectSampleImage = (sample: SampleLabelImage) => {
    onImageSelected(sample.dataUrl, sample.mimeType, `Nhãn mẫu: ${sample.name}`);
  };

  return (
    <div className="space-y-4">
      {/* Upload & Scanner Stage */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/70 shadow-lg scale-[1.005]'
            : isScanning
            ? 'border-indigo-400 bg-slate-900 shadow-xl'
            : uploadedImageBase64
            ? 'border-slate-200 bg-slate-50'
            : 'border-dashed border-slate-300 bg-slate-50/60 hover:border-indigo-400 hover:bg-indigo-50/20'
        }`}
      >
        {/* Hidden native input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="food-label-file-input"
        />

        {/* Hidden native camera capture input for direct OS camera fallback */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInputChange}
          className="hidden"
          id="mobile-camera-capture-input"
        />

        {/* Case 1: Image is uploaded and active */}
        {uploadedImageBase64 ? (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Image Preview & Scanner Frame with quick controls below image */}
              <div className="lg:col-span-6 space-y-2.5">
                <div className="relative flex justify-center items-center bg-slate-900 rounded-xl p-3 overflow-hidden min-h-[280px]">
                  <img
                    src={uploadedImageBase64}
                    alt="Ảnh nhãn dán thực phẩm"
                    className={`max-h-[380px] w-auto max-w-full object-contain rounded-lg transition-all duration-500 ${
                      isScanning ? 'opacity-80 scale-[1.02] filter contrast-110' : 'opacity-100 shadow-md'
                    }`}
                  />

                  {/* Laser Scanning Animation when AI is scanning */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between overflow-hidden">
                      {/* Glowing scanning laser line moving up and down */}
                      <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-cyan-500 text-slate-950 font-bold text-2xs rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" />
                          AI OCR Scanning
                        </div>
                      </div>

                      {/* Matrix grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

                      {/* Corner Target Reticles */}
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
                    </div>
                  )}

                  {/* Scanned Badge (when done) */}
                  {!isScanning && (
                    <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-2xs font-bold flex items-center gap-1.5 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Đã quét xong</span>
                    </div>
                  )}
                </div>

                {/* Quick actions directly below image */}
                <div className="flex items-center justify-between gap-2 p-2 bg-slate-100 rounded-lg text-xs">
                  <span className="text-3xs text-slate-600 font-medium px-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Quét lại hoặc đổi ảnh:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-2xs font-semibold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Quét camera mới</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-2xs font-semibold flex items-center gap-1 cursor-pointer transition"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Gửi ảnh khác</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status and Extracted Data Overview Panel */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                {isScanning ? (
                  <div className="space-y-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          AI đang tự động quét thông tin từ ảnh nhãn dán...
                        </h4>
                        <p className="text-xs text-slate-400">
                          Hệ thống đang tự đọc văn bản và bảng thông tin, bạn không cần phải gõ tay.
                        </p>
                      </div>
                    </div>

                    {/* Steps list */}
                    <div className="space-y-2 bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80">
                      {SCAN_STEPS.map((step, idx) => {
                        const isCurrent = idx === scanStepIndex;
                        const isPast = idx < scanStepIndex;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2.5 text-xs p-1.5 rounded-lg transition-all ${
                              isCurrent
                                ? 'bg-indigo-950/80 text-cyan-300 font-semibold border border-cyan-500/40'
                                : isPast
                                ? 'text-emerald-400 opacity-90'
                                : 'text-slate-500 opacity-60'
                            }`}
                          >
                            <span className="text-sm shrink-0">{step.icon}</span>
                            <span className="flex-1 truncate">{step.title}</span>
                            {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            {isCurrent && <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Success notification */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-emerald-900">
                          AI đã quét và trích xuất thành công!
                        </h4>
                        <p className="text-2xs sm:text-xs text-emerald-700 mt-0.5">
                          Tất cả thông tin từ ảnh nhãn dán đã được tự động điền vào 5 góc phân tích và máy tính toán.
                        </p>
                      </div>
                    </div>

                    {/* Detected Highlights Summary Box */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xs font-bold uppercase text-slate-500 tracking-wider">
                          Dữ liệu nhận diện được:
                        </span>
                        <button
                          onClick={onOpenEditor}
                          className="text-2xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Chỉnh sửa thông số</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-3xs text-slate-500 block">Sản phẩm</span>
                          <strong className="text-xs text-slate-900 font-bold truncate block" title={currentLabelData.productName}>
                            {currentLabelData.productName}
                          </strong>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-3xs text-slate-500 block">Khẩu phần</span>
                          <strong className="text-xs text-indigo-700 font-bold block">
                            {currentLabelData.servingSize} {currentLabelData.servingUnit}
                          </strong>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-3xs text-slate-500 block">Số phần / hộp</span>
                          <strong className="text-xs text-slate-900 font-bold block">
                            {currentLabelData.servingsPerContainer} phần ({currentLabelData.netWeight} {currentLabelData.netWeightUnit})
                          </strong>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-3xs text-slate-500 block">Năng lượng</span>
                          <strong className="text-xs text-rose-600 font-bold block">
                            {currentLabelData.caloriesPerServing} kcal / phần
                          </strong>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-3xs text-slate-500 block">Đường & Chất béo</span>
                          <strong className="text-xs text-amber-700 font-bold block">
                            {currentLabelData.sugarsPerServing}g / {currentLabelData.totalFatPerServing}g
                          </strong>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-3xs text-slate-500 block">Hạn sử dụng</span>
                          <strong
                            className={`text-xs font-bold truncate block ${
                              currentLabelData.expirationDateText.includes('Không tìm thấy')
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }`}
                            title={currentLabelData.expirationDateText}
                          >
                            {currentLabelData.expirationDateText.includes('Không tìm thấy')
                              ? '⚠️ Không có date'
                              : currentLabelData.expirationDateText}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => setIsCameraModalOpen(true)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Chụp mới bằng Camera</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tải ảnh khác</span>
                      </button>

                      <button
                        onClick={onReScan}
                        className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Quét lại AI</span>
                      </button>

                      <button
                        onClick={onClearImage}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:underline transition cursor-pointer ml-auto"
                      >
                        Xóa ảnh này
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Case 2: No image yet -> Mobile-first Camera & File Upload Zone */
          <div className="p-5 sm:p-8">
            <div className="max-w-xl mx-auto text-center space-y-4">
              {/* Header Title & Description */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chỉ cần quét và gửi ảnh vào là được</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Quét nhãn thực phẩm bằng Camera hoặc Gửi ảnh
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Hướng camera vào nhãn thực phẩm hoặc gửi ảnh chụp bao bì, AI sẽ tự động bóc tách 5 góc dinh dưỡng, calo thực tế và hạn sử dụng ngay lập tức.
                </p>
              </div>

              {/* Main Dual Call-to-Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* 1. Primary Camera Scanner Button */}
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    <span>Mở Camera quét (Tự chụp)</span>
                  </button>
                  <span className="text-3xs text-emerald-700 font-medium text-center flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Tự động chụp ngay khi hướng vào nhãn</span>
                  </span>
                </div>

                {/* 2. File Upload / Drag & Drop Button */}
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-indigo-400 font-bold text-sm shadow-2xs transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span>Gửi ảnh từ thiết bị</span>
                  </button>
                  <span className="text-3xs text-slate-500 text-center">
                    Kéo thả file ảnh hoặc nhấn <kbd className="px-1 py-0.5 bg-slate-200 rounded text-slate-700 font-mono">Ctrl + V</kbd> để dán
                  </span>
                </div>
              </div>

              {/* Supported Badges */}
              <div className="pt-2 flex flex-wrap justify-center items-center gap-1.5 text-2xs text-slate-500">
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-medium">
                  📸 Bảng Nutrition Facts
                </span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-medium">
                  🏷️ Nhãn phụ tiếng Việt
                </span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-medium">
                  📅 Hạn sử dụng (EXP/HSD)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preset Realistic Sample Images for Immediate 1-Click Testing */}
      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/90">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Hoặc thử nghiệm nhanh tính năng AI quét tự động bằng ảnh nhãn mẫu:</span>
          </div>
          <span className="text-3xs text-slate-400 hidden sm:inline">
            (Bấm vào để AI tự động quét ngay)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_LABEL_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSampleImage(sample)}
              disabled={isScanning}
              className="text-left p-2.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all shadow-2xs group cursor-pointer flex items-center gap-3 disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-md bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={sample.dataUrl}
                  alt={sample.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-3xs px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                    {sample.badge}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5 group-hover:text-indigo-700 transition">
                  {sample.name}
                </h5>
                <p className="text-3xs text-slate-500 truncate mt-0.5">
                  {sample.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Phone Camera Scanner Modal */}
      <CameraScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(base64, mime) => onImageSelected(base64, mime)}
      />
    </div>
  );
};
